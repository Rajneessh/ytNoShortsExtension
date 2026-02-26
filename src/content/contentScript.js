// Cross-browser API
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

let isExtensionEnabled = true;
let observer = null;

// Initialize state
function initializeState() {
  extensionAPI.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    isExtensionEnabled = response?.isEnabled ?? true;

    if (isExtensionEnabled) {
      hideShorts();
      startObserving();
    }
  });
}

// Hide Shorts videos
function hideShorts() {
  if (!isExtensionEnabled) return;

  const videoRenderers = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer",
  );

  videoRenderers.forEach((renderer) => {
    const link = renderer.querySelector("a#thumbnail");

    if (link && link.href && link.href.includes("/shorts/")) {
      renderer.style.display = "none";
    }
  });

  // Hide Shorts shelves
  const shelves = document.querySelectorAll("ytd-rich-section-renderer");

  shelves.forEach((shelf) => {
    const title = shelf.innerText;
    if (title && title.toLowerCase().includes("shorts")) {
      shelf.style.display = "none";
    }
  });
}

// Restore hidden elements
function restoreShorts() {
  const allElements = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-section-renderer",
  );

  allElements.forEach((element) => {
    element.style.display = "";
  });
}

// Start observing DOM changes
function startObserving() {
  if (observer) return;

  let timeout = null;

  observer = new MutationObserver(() => {
    if (timeout) return;

    timeout = setTimeout(() => {
      hideShorts();
      timeout = null;
    }, 300);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Stop observing
function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

// Listen for toggle updates
extensionAPI.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_STATE") {
    isExtensionEnabled = message.value;

    if (isExtensionEnabled) {
      hideShorts();
      startObserving();
    } else {
      stopObserving();
      restoreShorts();
    }
  }
});

// Initialize
initializeState();
