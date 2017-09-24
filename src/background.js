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

const fontWeights = {
  100: '100',
  200: '200',
  300: '300',
  400: '400 (normal)',
  500: '500',
  600: '600',
  700: '700 (bold)',
  800: '800',
  900: '900',
  normal: '400 (normal)',
  bold: '700 (bold)',
};

const fontanelloFont = chrome.contextMenus.create({
  title: 'Fontanello font',
  contexts: ['selection'],
});

const fontanelloSize = chrome.contextMenus.create({
  title: 'Fontanello size',
  contexts: ['selection'],
});

const fontanelloWeight = chrome.contextMenus.create({
  title: 'Fontanello weight',
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

  chrome.contextMenus.update(fontanelloWeight, {
    title: fontWeights[fontInfo.fontWeight],
  });

  chrome.contextMenus.update(fontanelloColor, {
    title: isRGB(fontInfo.color) ? RGBToHex(fontInfo.color) : fontInfo.color,
  });
});
