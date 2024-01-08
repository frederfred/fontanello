chrome.runtime.onMessage.addListener(handleMessages);

const textEl = document.getElementById('textarea');

async function handleMessages(message) {
  // Return early if this message isn't meant for the offscreen document.
  if (message.target !== 'offscreen-doc') {
    return;
  }

  // Dispatch the message to an appropriate handler.
  switch (message.type) {
    case 'copy-data-to-clipboard':
      handleClipboardWrite(message.data);
      break;
    default:
      console.warn(`Unexpected message type received: '${message.type}'.`);
  }
}

async function handleClipboardWrite(data) {
  try {
    if (typeof data !== 'string') {
      throw new TypeError(
        `Value provided must be a 'string', got '${typeof data}'.`
      );
    }

    textEl.value = data;
    textEl.select();
    document.execCommand('copy');
  } finally {
    // Job's done! Close the offscreen document.
    window.close();
  }
}
