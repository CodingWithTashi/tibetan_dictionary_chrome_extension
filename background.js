// Added Event Listeners for Content.js and popup.js using onMessage() and onConnect() Listeners
var selectedText;
chrome.runtime.onMessage.addListener(function (request, sender) {
  var text = request.selectedText;
  var textMeaning;
  /*
textMeaning = get Meaning from dictionary
*/
  chrome.tabs.sendMessage(sender.tab.id, {
    from: "background",
    meaning: text,
  });
});
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    if (message == "Request Modified Value") {
      port.postMessage(selectedText);
    }
  });
});
