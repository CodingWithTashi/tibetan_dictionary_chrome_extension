var positionX;
var positionY;
var url = "https://play.google.com/store/apps/dev?id=5910382695653514663";
//Document mouse up event listener
document.addEventListener("mouseup", handlerFunction, false);

// Mouse up event handler function
function handlerFunction(event) {
  // If there is already a share dialog, remove it
  if (document.contains(document.getElementById("share-snippet"))) {
    document.getElementById("share-snippet").remove();
  }
  var selectedText = "";
  // Check if any text was selected and text has only one word
  selectedText = window.getSelection().toString().trim();
  if (isSelectionDataValid(selectedText) == true) {
    var param = {
      method: "searchWordFromContent",
      data: selectedText,
    };
    //send text to background js to get the meaning
    chrome.runtime?.sendMessage({
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
function isSelectionDataValid(selectedText) {
  if (selectedText.length > 0) {
    if (selectedText.split(" ").length < 3) {
      return true;
    }
  }
  return false;
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
      var htmlContent = `
      <div id="share-snippet" style="position: absolute; top: ${positionY}px; left: ${positionX}px;">
        <div class="speech-bubble">
          <div class="share-inside">
            <p style="font-family: 'Noto Serif Tibetan';font-size: 1.5rem;" class="defination">${defination}</p>
            <p>${data.wylie}</p>
            <div style="display: inline-block; text-align: right; width: 100%">
            </div>
          </div>
        </div>
      </div>

        `;
      //<a href="${url}" > More..</a>
      document.body.insertAdjacentHTML("beforeend", htmlContent);
    }
  }
});
