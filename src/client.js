let previousTarget = null;

function onMouseMove(e) {
  let style = null;
  let fontData = null;

  if (e.target === previousTarget || !(e.target instanceof Element)) {
    return false;
  }

  previousTarget = e.target;
  style = window.getComputedStyle(e.target);
  fontData = {
    family: style.fontFamily,
    weight: style.fontWeight,
    size: style.fontSize,
    lineHeight: style.lineHeight,
    color: style.color,
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
