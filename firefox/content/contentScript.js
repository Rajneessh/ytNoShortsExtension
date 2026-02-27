let isExtensionEnabled = true;

// 1. Initial Load Logic
function initialize() {
  browser.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    isExtensionEnabled = response?.isEnabled ?? true;
    if (isExtensionEnabled) {
      applyShortsRemoval();
      setupObserver();
    }
  });
}

// 2. The Core "Hider" Function
function applyShortsRemoval() {
  if (!isExtensionEnabled) return;

  // Block direct access if the user lands on a /shorts/ URL
  if (window.location.pathname.startsWith("/shorts/")) {
    window.location.href = "/";
    return;
  }

  // 1. Hide Shorts in the Home Grid / Search Results
  const videoSelectors = "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer";
  document.querySelectorAll(videoSelectors).forEach((el) => {
    const hasShortsLink = el.querySelector('a[href*="/shorts/"]');
    const hasShortsText = el.innerText.toLowerCase().includes("shorts");
    
    if (hasShortsLink || hasShortsText) {
      el.style.display = "none";
    }
  });

  // 2. Hide the dedicated "Shorts" Shelves (The horizontal rows)
  const shelfSelectors = "ytd-rich-section-renderer, ytd-reel-shelf-renderer";
  document.querySelectorAll(shelfSelectors).forEach((shelf) => {
    if (shelf.innerText.toLowerCase().includes("shorts")) {
      shelf.style.display = "none";
    }
  });

  // 3. Hide Sidebar/Navigation links
  document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
    if (entry.innerText.toLowerCase().includes("shorts")) {
      entry.style.display = "none";
    }
  });
}

// 3. The Observer (Critical for YouTube)
function setupObserver() {
  const observer = new MutationObserver(() => {
    applyShortsRemoval();
  });

  // Watch the entire body for structural changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Listen for toggle updates from the popup
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "UPDATE_STATE") {
    isExtensionEnabled = message.value;
    if (isExtensionEnabled) {
      location.reload(); // Refresh to clean the feed
    } else {
      location.reload(); // Refresh to bring Shorts back
    }
  }
});

initialize();