// Added Event Listeners for Content.js and popup.js using onMessage() and onConnect() Listeners
var modifiedDom;
chrome.runtime.onMessage.addListener(function (request) {
  modifiedDom = request.dom + "Trivial Info Appending";
});
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    if (message == "Request Modified Value") {
      port.postMessage(modifiedDom);
    }
  });
});
