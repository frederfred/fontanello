document.addEventListener("selectionchange", function(e) {
  var sel = window.getSelection();
  var style = window.getComputedStyle(sel.focusNode.parentElement);
  var selectionInfo = {
    font: style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    color: style.color
  }
  chrome.runtime.sendMessage(selectionInfo);
}, false);
