//Used Port\Long Lived Connection for communicating with background page for fetching results

var port = chrome.runtime.connect({
  name: "Sample Communication",
});
port.postMessage("Request Modified Value");

port.onMessage.addListener(function (msg) {
  if (msg != null && msg.method != undefined) {
    switch (msg.method) {
      case "wordMeaning":
        document.getElementById("dictionary_word_defination").innerHTML =
          msg.data.defination;
        document.getElementById("dictionary_word_wylie").innerHTML =
          msg.data.wylie;
        document.getElementById("defination_div").style.display = "block";

        break;
      default:
        break;
    }
  }
});

//
document
  .getElementById("search_word_input_btn")
  .addEventListener("click", getWordMeaning);

function getWordMeaning() {
  var enterText = document.getElementById("search_word_input").value;
  if (enterText) {
    let firstWord = enterText.split(" ")[0];
    var data = {
      method: "searchWord",
      data: firstWord,
    };
    port.postMessage(data);
  }
}
