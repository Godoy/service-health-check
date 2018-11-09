// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let runningInterval;

function printResult(result) {
  $("#result").html("")
  let box = $("<div></div>")
    .text("Service")
    .css('background-color', 'red')

  let mainBox = box.clone()
  if(result.mainStatus) {
    mainBox.css('background-color', 'green')
  }
  $("#result").append(mainBox)
  $("#result").append("<div id='dependencies'></div>")
  for(const dependency of result.dependencies) {
    let dependencyBox = box.clone()
      .text(dependency.name)
      .css('background-color', 'red')

    if(dependency.status) {
      dependencyBox.css('background-color', 'green')
    }

    $("#dependencies").append(dependencyBox)
  }
}

function start() {
  chrome.storage.sync.get(function(data) {
    console.log(data)

    const url = data.url
    const headers = data.headers
    const refreshInterval = data.refreshInterval

    if (url) {
      console.log("Running")

      const userAction = async () => {
        let results = { mainStatus: false, dependencies: [] }

        let requestHeaders = {}
        if(headers)
        for(const headerItem of headers) {
          requestHeaders[headerItem.key] = headerItem.value
        }

        const settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "GET",
          "headers": requestHeaders
        }
        $.ajax(settings).done(function (response) {
          console.log(response);
          results.mainStatus = true

          for(let dependencyKey in response) {
            results.dependencies.push({
              'name': dependencyKey,
              'status': response[dependencyKey]
            })
          }
        })
        .fail(function() {
          results.mainStatus = false
        })
        .always(function() {
          console.log("always", results)
          printResult(results)
        });
      }

      userAction()
      runningInterval = setInterval(userAction, parseInt(refreshInterval)*1000)
    }
  });
}


function stop() {
  console.log("Stopped")
  clearInterval(runningInterval)
}


chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.action == "stop") {
      stop()
    }
    else if (request.action == "start") {
      start()
    }
  }
);

chrome.storage.sync.get(function(data) {
  $("#result").html("Loading...")
  if(data.isRunning) {
    start()
  } else {
    $("#result").html("<h3>Please configure and start by right-clicking the addon icon.</h3>")
  }
})
