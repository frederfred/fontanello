let previousTarget = null;

document.addEventListener('mousemove', (e) => {
  let style = null;
  let fontData = null;

  if (e.target === previousTarget || !(e.target instanceof Element)) {
    return false;
  }

  previousTarget = e.target;
  style = window.getComputedStyle(e.target);
  fontData = {
    font: style.fontFamily,
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    color: style.color,
  };

  chrome.runtime.sendMessage(fontData);

  return false;
}, false);
