
var fontanelloFont = chrome.contextMenus.create({
  "id": "fontanelloFont",
  "title" : "Fontanello font",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : function(e) { e.preventDefault(); }
});

var fontanelloSize = chrome.contextMenus.create({
  "id": "fontanelloSize",
  "title" : "Fontanello size",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : function(e) { e.preventDefault(); }
});

var fontanelloColor = chrome.contextMenus.create({
  "id": "fontanelloColor",
  "title" : "Fontanello color",
  "type" : "normal",
  "contexts" : ["selection"],
  "onclick" : function(e) { e.preventDefault(); }
});

chrome.runtime.onMessage.addListener(function(fontInfo, sender, sendResponse) {
  chrome.contextMenus.update(fontanelloFont, {
    "title": fontInfo.font
  });
  chrome.contextMenus.update(fontanelloSize, {
    "title": fontInfo.fontSize + " / " + fontInfo.lineHeight
  });
  chrome.contextMenus.update(fontanelloColor, {
    "title": fontInfo.color
  });
});
