const menuItems = {};

function copyTextToClipboard(text) {
  const textarea = document.createElement('textarea');

  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand('copy');

  document.body.removeChild(textarea);
}

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

function round(num, decimals) {
  return +num.toFixed(decimals);
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
  onclick: () => {
    copyTextToClipboard(menuItems.font);
  },
});

const fontanelloSize = chrome.contextMenus.create({
  title: 'Fontanello size',
  contexts: ['selection'],
  onclick: () => {
    copyTextToClipboard(menuItems.size);
  },
});

const fontanelloWeight = chrome.contextMenus.create({
  title: 'Fontanello weight',
  contexts: ['selection'],
  onclick: () => {
    copyTextToClipboard(menuItems.weight);
  },
});

const fontanelloColor = chrome.contextMenus.create({
  title: 'Fontanello color',
  contexts: ['selection'],
  onclick: () => {
    copyTextToClipboard(menuItems.color);
  },
});

chrome.runtime.onMessage.addListener((fontInfo) => {
  menuItems.font = fontInfo.font;
  menuItems.size = `${fontInfo.fontSize} / ${fontInfo.lineHeight} (${round(parseFloat(fontInfo.lineHeight, 10) / parseFloat(fontInfo.fontSize, 10), 3)})`;
  menuItems.weight = fontWeights[fontInfo.fontWeight];
  menuItems.color = isRGB(fontInfo.color) ? RGBToHex(fontInfo.color) : fontInfo.color;

  chrome.contextMenus.update(fontanelloFont, { title: menuItems.font });
  chrome.contextMenus.update(fontanelloSize, { title: menuItems.size });
  chrome.contextMenus.update(fontanelloWeight, { title: menuItems.weight });
  chrome.contextMenus.update(fontanelloColor, { title: menuItems.color });
});
