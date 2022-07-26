//get the selected word from document and send to background js
document.addEventListener("mouseup", (event) => {
  if (
    window.getSelection().toString().length > 0 &&
    window.getSelection().toString().split(" ").length == 1
  ) {
    let exactText = window.getSelection().toString();
    chrome.runtime.sendMessage({
      selectedText: exactText,
    });
  }
});

//get the word meaning from background js
chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.from == "background") {
    var wordMeaning = msg.meaning;
    alert("Meaning: " + wordMeaning);
  }
});
