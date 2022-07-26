// Added Event Listeners for Content.js and popup.js using onMessage() and onConnect() Listeners
var selectedText;
var database = null;
chrome.runtime.onMessage.addListener(function (request, sender) {
  var text = request.selectedText;
  var textMeaning;
  /*
textMeaning = get Meaning from dictionary
*/
  textMeaning = getWordMeaningFromDictionary(text);
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
    var idbOpenRequest = indexedDB.open(dname, 1);
    idbOpenRequest.onupgradeneeded = function () {
      database = idbOpenRequest.result;
      var store = database.createObjectStore(sname, {
        autoIncrement: true,
      });
      // store.createIndex("english", "english", {
      //   unique: true,
      // });
    };
    idbOpenRequest.onsuccess = function () {
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

function getWordMeaningFromDictionary(keyword) {
  console.log("called getWordMeaningFromDictionary");

  try {
    let transaction = database.transaction("fstore", "readonly");
    let store = transaction.objectStore("fstore");
    const request = store.openCursor();
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        if (cursor.value.english.toLowerCase() == keyword) {
          console.log(cursor.value);
        } else {
          cursor.continue();
        }
      }
    };
    // const index = store.index("english");

    // // query by indexes
    // let query = index.get(keyword);

    // // return the result object on success
    // query.onsuccess = (event) => {
    //   console.log("daaya");
    //   console.log(event); // result objects
    // };

    // query.onerror = (event) => {
    //   console.log(event.target.errorCode);
    // };

    // close the database connection
    // transaction.oncomplete = function () {
    //   database.close();
    // };
  } catch (e) {
    console.log("addDataFunction table or data null error");
    console.log(e);
  }

  return keyword;
}
