// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// chrome.runtime.onStartup.addListener(function() {
//   chrome.app.window.create('options.html', {
//     singleton: true,
//     id: "ChromeApps-Sample-Document-Scan",
//     bounds: {
//      'width': 480,
//      'height': 640
//     }
//   });
// });

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.create({
      'url': chrome.runtime.getURL("main.html")
  });
});

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});

