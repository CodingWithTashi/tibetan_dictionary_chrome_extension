var positionX;
var positionY;
document.addEventListener("mouseup", handlerFunction, false);

// Mouse up event handler function
function handlerFunction(event) {
  // If there is already a share dialog, remove it
  if (document.contains(document.getElementById("share-snippet"))) {
    document.getElementById("share-snippet").remove();
  }

  // Check if any text was selected
  if (window.getSelection().toString().length > 0) {
    // Get selected text and encode it
    const selection = encodeURIComponent(
      window.getSelection().toString()
    ).replace(/[!'()*]/g, escape);

    let exactText = window.getSelection().toString();
    var param = {
      method: "searchWordFromContent",
      data: exactText,
    };
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

// var menu;
// //get the selected word from document and send to background js
// document.addEventListener("mouseup", (event) => {
//   if (document.querySelector(".menu") != null) {
//     document.querySelector(".menu").remove();
//   }
//   if (
//     window.getSelection().toString().length > 0 &&
//     window.getSelection().toString().split(" ").length == 1
//   ) {
//     //this div will diplay in popup
//     var iDiv = document.createElement("div");
//     iDiv.className = "menu";
//     //iDiv.innerHTML = '<i class="fa fa-copy fa-2x" id="copy-btn"></i>';
//     document.body.appendChild(iDiv);
//     menu = document.querySelector(".menu");
//     var range = window.getSelection().getRangeAt(0);
//     let rect = range.getBoundingClientRect();
//     menu.style.display = "block";
//     var left = Math.round(rect.left) + "px";
//     var top = Math.round(rect.top) + "px";

//     let exactText = window.getSelection().toString();
//     chrome.runtime.sendMessage({
//       selectedText: exactText,
//     });
//   } else {
//     if (menu != undefined) {
//       menu.style.display = "none";
//     }
//   }
// });

// //get the word meaning from background js
// chrome.runtime.onMessage.addListener(function (msg) {
//   if (msg.from == "background") {
//     var wordMeaning = msg.meaning;
//     alert("Meaning: " + wordMeaning);
//     menu.innerHTML = "<i>wordMeaning: " + wordMeaning + "</i>";
//     menu.style.display = "block";
//   }
// });

// var iDiv = document.createElement("template");
// iDiv.innerHTML = '<span id="control-tibeten-dictionary"></span>';
// document.body.appendChild(iDiv);
// var control = document.importNode(
//   document.querySelector("template").content,
//   true
// ).childNodes[0];
// control.addEventListener("pointerdown", oncontroldown, true);
// //

// document.addEventListener("mouseup", (event) => {
//   let selection = document.getSelection(),
//     text = selection.toString();
//   if (text !== "") {
//     let rect = selection.getRangeAt(0).getBoundingClientRect();
//     control.style.top = `calc(${rect.top}px - 48px)`;
//     control.style.left = `calc(${rect.left}px + calc(${rect.width}px / 2) - 40px)`;
//     control["text"] = text;
//     document.body.appendChild(control);
//   }
// });
// //

// function oncontroldown(event) {
//   window.open(`https://twitter.com/intent/tweet?text=${this.text}`);
//   this.remove();
//   document.getSelection().removeAllRanges();
//   event.stopPropagation();
// }
// document.onpointerdown = () => {
//   let control = document.querySelector("#control-tibeten-dictionary");
//   if (control !== null) {
//     control.remove();
//     document.getSelection().removeAllRanges();
//   }
// };
