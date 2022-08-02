var positionX;
var positionY;
//Document mouse up event listener
document.addEventListener("mouseup", handlerFunction, false);

// Mouse up event handler function
function handlerFunction(event) {
  // If there is already a share dialog, remove it
  if (document.contains(document.getElementById("share-snippet"))) {
    document.getElementById("share-snippet").remove();
  }

  // Check if any text was selected and text has only one word
  if (
    window.getSelection().toString().trim().length > 0 &&
    window.getSelection().toString().split(" ").length == 1
  ) {
    // Get selected text and encode it
    const selection = encodeURIComponent(
      window.getSelection().toString()
    ).replace(/[!'()*]/g, escape);

    let exactText = window.getSelection().toString();
    var param = {
      method: "searchWordFromContent",
      data: exactText,
    };
    //send text to background js to get the meaning
    chrome.runtime.sendMessage({
      param,
    });

    // Find out how much (if any) user has scrolled
    var scrollTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;

    // Get cursor position
    positionX = event.clientX - 110;
    positionY = event.clientY + 20 + scrollTop;
  }
}

//get the word meaning from background js
chrome.runtime.onMessage.addListener(function (msg) {
  var param = msg.param;
  if (param.method == "wordMeaningFromBackground") {
    var data = param.data;
    var defination = data.defination;
    //var wylie = data.wylie;
    if (positionX != undefined && positionY != undefined) {
      // Append HTML to the body, create the "Tweet Selection" dialog
      document.body.insertAdjacentHTML(
        "beforeend",
        '<div id="share-snippet" style="position: absolute; top: ' +
          positionY +
          "px; left: " +
          positionX +
          'px;"><div class="speech-bubble"><div class="share-inside"><a href="javascript:void(0);" onClick=\'window.open("' +
          "https://www.google.com" +
          '", "", "menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");\'>' +
          defination +
          "</a></div></div></div>"
      );
    }
  }
});
