function RGBToHex(RGB) {
  const RGBParts = RGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  const HexArr = [];

  delete RGBParts[0];

  RGBParts.forEach((value) => {
    let hex = parseInt(value, 10).toString(16);

    if (hex.length === 1) {
      hex = `0${hex}`;
    }

    HexArr.push(hex);
  });

  return `#${HexArr.join('')}`;
}

function isRGB(value) {
  return !!value.match(/^rgb\(/);
}

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
    title: `${fontInfo.fontSize} / ${fontInfo.lineHeight}` +
           ' ' +
           `(${parseInt(fontInfo.lineHeight, 10) / parseInt(fontInfo.fontSize, 10)})`,
  });

  chrome.contextMenus.update(fontanelloColor, {
    title: isRGB(fontInfo.color) ? RGBToHex(fontInfo.color) : fontInfo.color,
  });
});
