'use strict';

let saveButton = document.getElementById('save');


chrome.storage.sync.get(function(data) {
  document.getElementById('url').value = data.url
  document.getElementById('refreshInterval').value = data.refreshInterval

  if(data.headers) {
    for(const [index, header] of data.headers.entries()) {
      document.getElementsByName('headerKey')[index].value = header.key
      document.getElementsByName('headerValue')[index].value = header.value
    }
  }
})

saveButton.addEventListener('click', function() {
  let url = document.getElementById('url')
  let refreshInterval = document.getElementById('refreshInterval')
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
    refreshInterval: refreshInterval.value,
    headers: headers
  }, function() {
    document.getElementById('saveStatus').innerHTML = 'Saved!';
  })
});
