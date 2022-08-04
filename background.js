// Added Event Listeners for Content.js and popup.js using onMessage() and onConnect() Listeners
var selectedText;
var database = null;
let databaseName = "dictionaryDb";
let fstore = "dictionaryTable";
//event listener for content js
chrome.runtime.onMessage.addListener(async function (request, sender) {
  if (request.param != null && request.param != undefined) {
    var respond = request.param;
    switch (respond.method) {
      case "searchWordFromContent":
        var searchText = respond.data.toLowerCase();
        var infos = await getWordMeaning(databaseName, fstore, searchText);
        var param;
        if (infos != null && infos != undefined) {
          infos.english = searchText;
          param = {
            method: "wordMeaningFromBackground",
            data: infos,
          };
          console.log("sending data");
          //send word meaning to content js
          chrome.tabs.sendMessage(sender.tab.id, {
            param: param,
          });
        }

        break;
      default:
        break;
    }
  }
});
//event listener from popup js
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(async function (message) {
    if (message == "Request Modified Value") {
      port.postMessage(selectedText);
    } else if (message.method == "searchWord") {
      console.log(message.data);
      var searchText = message.data.toLowerCase();
      var infos = await getWordMeaning(databaseName, fstore, searchText);
      var param;
      if (infos == null || infos == undefined) {
        infos = {
          english: searchText,
          defination: "Oops, defination not found,try some other word",
        };
      }
      infos.english = searchText;
      param = {
        method: "wordMeaning",
        data: infos,
      };
      //send data back to popup js
      port.postMessage(param);
    }
  });
});

async function getWordMeaning(dname, sname, key) {
  return new Promise(function (resolve) {
    var r = indexedDB.open(dname);
    r.onsuccess = function (e) {
      var idb = r.result;
      let tactn = idb.transaction(sname, "readonly");
      let store = tactn.objectStore(sname);
      let data = store.get(key);
      data.onsuccess = function () {
        resolve(data.result);
      };
      tactn.oncomplete = function () {
        idb.close();
      };
    };
  });
}
//on extension install listener
chrome.runtime.onInstalled.addListener(async function (details) {
  if (details.reason == "install") {
    //call a function to handle a first install
    console.log("install for first time");
    var response = await fetch(chrome.runtime.getURL("assets/dictionary.json"));
    var str = await response.text();
    var data = JSON.parse(str);
    var idb = await importIDB(databaseName, fstore, data);
  } else if (details.reason == "update") {
    //call a function to handle an update
  }
});
//import database with content
function importIDB(dname, sname, wordArray) {
  return new Promise(function (resolve) {
    var idbOpenRequest = indexedDB.open(dname, 1);
    idbOpenRequest.onupgradeneeded = function () {
      console.log("database upgrade");
      database = idbOpenRequest.result;
      var store = database.createObjectStore(sname, { keyPath: "english" });

      // store.createIndex("english", "english", {
      //   unique: true,
      // });
    };
    idbOpenRequest.onsuccess = function () {
      console.log("database open");
      database = idbOpenRequest.result;
      let tactn = database.transaction(sname, "readwrite");
      var store = tactn.objectStore(sname);
      for (var word of wordArray) {
        store.put(word);
      }
      //resolve(database);
    };
    idbOpenRequest.onerror = function (e) {
      console.log(e);
    };
    idbOpenRequest.oncomplete = function () {
      database.close();
    };
  });
}
