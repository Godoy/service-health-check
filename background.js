'use strict';

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.create({
      'url': chrome.runtime.getURL("main.html")
  });
});

chrome.storage.sync.set({
  isRunning: false,
  url: "http://localhost",
  refreshInterval: 300
})

chrome.contextMenus.create({
  id: "changeStatus",
  title: "Stop",
  contexts: ["browser_action"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "changeStatus") {
    chrome.storage.sync.get(function(data) {
      if(data.isRunning) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "stop" }, function(response) {
            chrome.contextMenus.update("changeStatus", { title: "Start" })
            chrome.browserAction.disable()
          });
        });
      } else {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "start" }, function(response) {
            chrome.contextMenus.update("changeStatus", { title: "Stop" })
            chrome.browserAction.enable()
          });
        });
      }
    })
  }
});
