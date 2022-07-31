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
