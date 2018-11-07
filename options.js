// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let saveButton = document.getElementById('save');


chrome.storage.sync.get(function(data) {
  let input = document.getElementById('url')
  input.value = data.url
  console.log(data)

  if(data.headers) {
    for(const [index, header] of data.headers.entries()) {
      document.getElementsByName('headerKey')[index].value = header.key
      document.getElementsByName('headerValue')[index].value = header.value
    }
  }
})

saveButton.addEventListener('click', function() {
  let url = document.getElementById('url')
  let refreshTime = document.getElementById('refreshTime')
  let headerKeys = document.getElementsByName('headerKey')
  let headerValues = document.getElementsByName('headerValue')

  var headers = []
  for(const [index, headerKeyInput] of headerKeys.entries()) {
    const headerKey = headerKeyInput.value
    const headerValue = headerValues[index].value

    headers.push({ key: headerKey, value: headerValue })
    console.log(headerKey)
    console.log(headerValue)
  }


  chrome.storage.sync.set({
    url: url.value,
    refreshTime: refreshTime.value,
    headers: headers
  }, function() {
    alert('Saved!');
  })
});

// let page = document.getElementById('buttonDiv');
// const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];

// function constructOptions(kButtonColors) {
//   for (let item of kButtonColors) {
//     let button = document.createElement('button');
//     button.style.backgroundColor = item;
//     button.addEventListener('click', function() {
//       chrome.storage.sync.set({color: item}, function() {
//         console.log('color is ' + item);
//       })
//     });
//     page.appendChild(button);
//   }
// }
// constructOptions(kButtonColors);
