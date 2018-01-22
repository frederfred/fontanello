const menuItems = {
  family: { contextMenu: null, value: '' },
  weight: { contextMenu: null, value: '' },
  size: { contextMenu: null, value: '' },
  color: { contextMenu: null, value: '' },
};

function copyTextToClipboard(text) {
  const textarea = document.createElement('textarea');

  textarea.value = text;

  document.body.appendChild(textarea);

  textarea.select();

  document.execCommand('copy');

  document.body.removeChild(textarea);
}

function firstFontFamily(fontFamily) {
  const quotes = /"/g;

  return fontFamily.split(',')[0].replace(quotes, '');
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

function unitlessLineHeight(size, lineHeight) {
  return round(parseFloat(lineHeight, 10) / parseFloat(size, 10), 3);
}

const fontWeights = {
  100: '100 (thin)',
  200: '200 (extra light)',
  300: '300 (light)',
  400: '400 (normal)',
  500: '500 (medium)',
  600: '600 (semi bold)',
  700: '700 (bold)',
  800: '800 (extra bold)',
  900: '900 (black)',
  normal: '400 (normal)',
  bold: '700 (bold)',
};

Object.keys(menuItems).forEach((key) => {
  menuItems[key].contextMenu = chrome.contextMenus.create({
    title: '-',
    contexts: ['all'],
    onclick: () => {
      copyTextToClipboard(menuItems[key].value);
    },
  });
});

chrome.runtime.onMessage.addListener((fontData) => {
  menuItems.family.value = firstFontFamily(fontData.family);
  menuItems.weight.value = fontWeights[fontData.weight];
  menuItems.size.value = `${fontData.size} / ${fontData.lineHeight} (${unitlessLineHeight(fontData.size, fontData.lineHeight)})`;
  menuItems.color.value = isRGB(fontData.color) ? RGBToHex(fontData.color) : fontData.color;

  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(menuItems[key].contextMenu, { title: menuItems[key].value });
  });
});
