const menuItems = {
  family: { contextMenu: null, value: '' },
  size: { contextMenu: null, value: '' },
  weight: { contextMenu: null, value: '' },
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

Object.keys(menuItems).forEach((key) => {
  menuItems[key].contextMenu = chrome.contextMenus.create({
    title: '-',
    contexts: ['selection'],
    onclick: () => {
      copyTextToClipboard(menuItems[key].value);
    },
  });
});

chrome.runtime.onMessage.addListener((fontData) => {
  menuItems.family.value = fontData.family;
  menuItems.size.value = `${fontData.size} / ${fontData.lineHeight} (${round(parseFloat(fontData.lineHeight, 10) / parseFloat(fontData.size, 10), 3)})`;
  menuItems.weight.value = fontWeights[fontData.weight];
  menuItems.color.value = isRGB(fontData.color) ? RGBToHex(fontData.color) : fontData.color;

  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(menuItems[key].contextMenu, { title: menuItems[key].value });
  });
});
