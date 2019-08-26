const menuItems = {
  family: { contextMenu: null, value: '', defaultValue: 'Please' },
  weight: { contextMenu: null, value: '', defaultValue: 'reload' },
  size: { contextMenu: null, value: '', defaultValue: 'the' },
  color: { contextMenu: null, value: '', defaultValue: 'page' },
  letterSpacing: { contextMenu: null, value: '', defaultValue: '(•‿•)' },
  variants: { contextMenu: null, value: '', defaultValue: '(•‿•)' },
  featureSettings: { contextMenu: null, value: '', defaultValue: '(•‿•)' },
  variationSettings: { contextMenu: null, value: '', defaultValue: '(•‿•)' },
};
const menuSections = [
  [
    'family',
    'weight',
    'size',
    'color',
  ],
  [
    'letterSpacing',
    'variants',
    'featureSettings',
    'variationSettings',
  ],
];

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

function fontSizeAndLineHeight(size, lineHeight) {
  const part1 = `${size} / ${lineHeight}`;
  const part2 = unitlessLineHeight(size, lineHeight);

  return `${part1}${part2 ? ` (${part2})` : ''}`;
}

function resetContextMenus() {
  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(menuItems[key].contextMenu, {
      title: menuItems[key].defaultValue,
      enabled: false,
    });
  });
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

menuSections.forEach((items, i) => {
  if (i !== 0) {
    chrome.contextMenus.create({
      type: 'separator',
      contexts: ['all'],
    });
  }

  items.forEach((key) => {
    menuItems[key].contextMenu = chrome.contextMenus.create({
      title: menuItems[key].defaultValue,
      contexts: ['all'],
      onclick: () => {
        const value = menuItems[key].value.replace(/^.+: /, '');

        copyTextToClipboard(value);
      },
    });
  });
});

chrome.runtime.onMessage.addListener((fontData) => {
  menuItems.family.value = firstFontFamily(fontData.family);
  menuItems.weight.value = fontWeights[fontData.weight];
  menuItems.size.value = fontSizeAndLineHeight(fontData.size, fontData.lineHeight);
  menuItems.color.value = isRGB(fontData.color) ? RGBToHex(fontData.color) : fontData.color;
  menuItems.letterSpacing.value = `letter-spacing: ${fontData.letterSpacing}`;
  menuItems.featureSettings.value = `features: ${fontData.featureSettings}`;
  menuItems.variants.value = `variants: ${fontData.variants}`;
  menuItems.variationSettings.value = `variables: ${fontData.variationSettings}`;

  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(menuItems[key].contextMenu, {
      title: menuItems[key].value,
      enabled: true,
    });
  });
});

chrome.tabs.onActivated.addListener(() => resetContextMenus());
chrome.windows.onFocusChanged.addListener(() => resetContextMenus());
