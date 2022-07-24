//Used Port\Long Lived Connection for communicating with background page for fetching results

var port = chrome.runtime.connect({
  name: "Sample Communication",
});
port.postMessage("Request Modified Value");

port.onMessage.addListener(function (msg) {
  console.log("Modified Value recieved is  " + msg);
});
