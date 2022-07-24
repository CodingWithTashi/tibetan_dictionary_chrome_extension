//Used sendMessage() API for communicating with background page

var d = document.domain;
chrome.runtime.sendMessage({
  dom: d,
});
