let isExtensionEnabled = true;
let observer = null;

// Request current state from background
async function initializeState() {
  const response = await browser.runtime.sendMessage({ type: "GET_STATE" });
  isExtensionEnabled = response.isEnabled;
  if (isExtensionEnabled) {
    removeShorts();
    startObserving();
  }
}

// Remove Shorts videos
function removeShorts() {
  if (!isExtensionEnabled) return;

  const videoLinks = document.querySelectorAll("a");

  videoLinks.forEach((link) => {
    if (link.href && link.href.includes("/shorts/")) {
      const container =
        link.closest("ytd-rich-item-renderer") ||
        link.closest("ytd-video-renderer") ||
        link.closest("ytd-grid-video-renderer");

      if (container) {
        container.remove();
      }
    }
  });
}

// Start MutationObserver
function startObserving() {
  if (observer) return;

  observer = new MutationObserver(() => {
    removeShorts();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Stop observing when disabled
function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Listen for toggle updates
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_STATE") {
    isExtensionEnabled = message.value;

    if (isExtensionEnabled) {
      removeShorts();
      startObserving();
    } else {
      stopObserving();
      location.reload(); // Restore removed content cleanly
    }
  }
});

// Initialize
initializeState();
