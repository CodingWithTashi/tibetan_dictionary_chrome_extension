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

chrome.runtime.onInstalled.addListener(async function (details) {
  if (details.reason == "install") {
    //call a function to handle a first install
    console.log("install for first time");
    var response = await fetch(chrome.runtime.getURL("assets/dictionary.json"));
    var str = await response.text();
    var data = JSON.parse(str);
    var idb = await importIDB("dictionary", "fstore", data);
  } else if (details.reason == "update") {
    //call a function to handle an update
  }
});

function importIDB(dname, sname, wordArray) {
  return new Promise(function (resolve) {
    var db = indexedDB.open(dname);
    db.onupgradeneeded = function () {
      var idb = db.result;
      var store = idb.createObjectStore(sname, {
        keyPath: "name",
        autoIncrement: true,
      });
    };
    db.onsuccess = function () {
      var idb = db.result;
      let tactn = idb.transaction(sname, "readwrite");
      var store = tactn.objectStore(sname);
      for (var word of wordArray) {
        store.put(word);
      }
      resolve(idb);
    };
    db.onerror = function (e) {
      console.log(e);
    };
  });
}
