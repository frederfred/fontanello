const fontanelloFont = chrome.contextMenus.create({
  title: 'Fontanello font',
  contexts: ['selection'],
});

const fontanelloSize = chrome.contextMenus.create({
  title: 'Fontanello size',
  contexts: ['selection'],
});

const fontanelloColor = chrome.contextMenus.create({
  title: 'Fontanello color',
  contexts: ['selection'],
});

chrome.runtime.onMessage.addListener((fontInfo) => {
  chrome.contextMenus.update(fontanelloFont, {
    title: fontInfo.font,
  });

  chrome.contextMenus.update(fontanelloSize, {
    title: `${fontInfo.fontSize} / ${fontInfo.lineHeight}`,
  });

  chrome.contextMenus.update(fontanelloColor, {
    title: fontInfo.color,
  });
});
