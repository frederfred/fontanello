const menuItems = {
  family: { value: '', defaultValue: 'Please', onclick: copy },
  weight: { value: '', defaultValue: 'reload', onclick: copy },
  size: { value: '', defaultValue: 'the', onclick: copy },
  color: { value: '', defaultValue: 'page', onclick: copy },
  letterSpacing: { value: '', defaultValue: '(•‿•)', onclick: copy },
  variants: { value: '', defaultValue: '(•‿•)', onclick: copy },
  featureSettings: { value: '', defaultValue: '(•‿•)', onclick: copy },
  variationSettings: { value: '', defaultValue: '(•‿•)', onclick: copy },
  contrast: { value: '', defaultValue: '(•‿•)', onclick: () => chrome.windows.create({ url: 'https://contrastchecker.online' }) },
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
  [
    'contrast',
  ],
];
const copyTextToClipboardPermissions = ['offscreen', 'clipboardWrite'];

async function copyTextToClipboard(text) {
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [chrome.offscreen.Reason.CLIPBOARD],
    justification: 'Write text to the clipboard.',
  });

  chrome.runtime.sendMessage({
    type: 'copy-data-to-clipboard',
    target: 'offscreen-doc',
    data: text,
  });
}

function firstFontFamily(fontFamily) {
  const quotes = /"/g;

  return fontFamily.split(',')[0].replace(quotes, '');
}

function resetContextMenus() {
  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(key, {
      title: menuItems[key].defaultValue,
      enabled: false,
    });
  });
}

function RGBParts(RGB) {
  const parts = RGB.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

  parts.shift();

  return parts.map(v => parseInt(v, 10));
}

function RGBToHex(RGB) {
  const parts = RGBParts(RGB);
  const HexArr = [];

  parts.forEach((value) => {
    let hex = value.toString(16);

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

function luminanace(r, g, b) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function meetWCAG(ratio, size) {
  const result = {};
  const largeSize = 18;
  const ratios = {
    small: {
      aa: 4.5,
      aaa: 7,
    },
    large: {
      aa: 3,
      aaa: 4.5,
    },
  };

  if (parseInt(size, 10) < largeSize) { // small
    result.aa = ratio >= ratios.small.aa;
    result.aaa = ratio >= ratios.small.aaa;
  } else { // large
    result.aa = ratio >= ratios.large.aa;
    result.aaa = ratio >= ratios.large.aaa;
  }

  return result;
}

function contrast(rgb1, rgb2) {
  const result = (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05) / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);

  return result < 1 ? 1 / result : result;
}

function contrastMessage(color1, color2, size) {
  if (!isRGB(color1) || !isRGB(color2)) {
    return ' –';
  }

  const ratio = contrast(RGBParts(color1), RGBParts(color2));
  const WCAGResult = meetWCAG(ratio, size);
  let message = round(ratio, 2);

  if (WCAGResult.aaa) {
    message += ' (AAA)';
  } else if (WCAGResult.aa) {
    message += ' (AA)';
  } else {
    message += ' (fail)';
  }

  return message;
}

function copy(item) {
  const value = item.value.replace(/^.+: /, '');

  chrome.permissions.contains({
    permissions: copyTextToClipboardPermissions,
  }, (result) => {
    if (result) { // The extension has the permissions.
      copyTextToClipboard(value);
    } else {
      chrome.permissions.request({
        permissions: copyTextToClipboardPermissions,
      }, (granted) => {
        if (granted) {
          copyTextToClipboard(value);
        } else {
          // The user didn't grant the permissions. Do nothing.
        }
      });
    }
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

chrome.runtime.onInstalled.addListener(() => {
  menuSections.forEach((items, i) => {
    if (i !== 0) {
      chrome.contextMenus.create({
        id: `separator${i}`,
        type: 'separator',
        contexts: ['all'],
      });
    }

    items.forEach((key) => {
      chrome.contextMenus.create({
        id: key,
        title: menuItems[key].defaultValue,
        contexts: ['all'],
      });
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  menuItems[info.menuItemId].onclick(menuItems[info.menuItemId]);
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
  menuItems.contrast.value = `contrast ratio: ${contrastMessage(fontData.color, fontData.backgroundColor, fontData.size)}`;

  Object.keys(menuItems).forEach((key) => {
    chrome.contextMenus.update(key, {
      title: menuItems[key].value,
      enabled: true,
    });
  });
});

chrome.tabs.onActivated.addListener(() => resetContextMenus());
chrome.windows.onFocusChanged.addListener(() => resetContextMenus());
