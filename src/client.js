let previousTarget = null;

function getBgColor(el) {
  const defaultBg = 'rgba(0, 0, 0, 0)';

  while (el.parentNode) {
    const computedBg = window.getComputedStyle(el).backgroundColor;

    el = el.parentNode;

    if (computedBg !== defaultBg) {
      return computedBg;
    }
  }

  // return defaultBg;
  return 'rgb(255, 255, 255)'; // todo: handle rgba
}

function onMouseMove(e) {
  let style = null;
  let fontData = null;
  let backgroundColor = null;

  if (e.target === previousTarget || !(e.target instanceof Element)) {
    return false;
  }

  previousTarget = e.target;
  style = window.getComputedStyle(e.target);
  backgroundColor = getBgColor(e.target);
  fontData = {
    family: style.fontFamily,
    weight: style.fontWeight,
    size: style.fontSize,
    lineHeight: style.lineHeight,
    color: style.color,
    letterSpacing: style.letterSpacing,
    variants: style.fontVariant,
    featureSettings: style.fontFeatureSettings,
    variationSettings: style.fontVariationSettings,
    backgroundColor,
  };

  try {
    chrome.runtime.sendMessage(fontData);
  } catch (e) {
    document.removeEventListener('mousemove', onMouseMove, false);

    throw(e);
  }

  return false;
}

document.addEventListener('mousemove', onMouseMove, false);
