<<<<<<< HEAD
let isExtensionEnabled = true;

// 1. Initial Load Logic
function initialize() {
  browser.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    isExtensionEnabled = response?.isEnabled ?? true;
    if (isExtensionEnabled) {
      applyShortsRemoval();
      setupObserver();
=======
// Cross-browser API
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

let isExtensionEnabled = true;
let observer = null;

/* ===============================
   INITIALIZATION
================================ */

function initializeState() {
  extensionAPI.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    isExtensionEnabled = response?.isEnabled ?? true;

    if (isExtensionEnabled) {
      applyShortsRemoval();
      startObserving();
      blockShortsNavigation();
>>>>>>> 60db7a029297cdc868717508fb1c4c9ebb5e57f8
    }
  });
}

<<<<<<< HEAD
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
=======
/* ===============================
   CORE ORCHESTRATOR
================================ */

function applyShortsRemoval() {
  if (!isExtensionEnabled) return;

  hideShortsVideos();
  hideShortsShelves();
  hideShortsNavigation();
  hideShortsChips();
}

/* ===============================
   VIDEO DETECTION
================================ */

function hideShortsVideos() {
  const renderers = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer"
  );

  renderers.forEach((renderer) => {
    const link = renderer.querySelector("a#thumbnail");

    if (!link) return;

    const isShort =
      link.href?.includes("/shorts/") ||
      renderer.innerText.toLowerCase().includes("shorts");

    if (isShort) {
      renderer.style.display = "none";
    }
  });
}

/* ===============================
   SHELVES
================================ */

function hideShortsShelves() {
  const shelves = document.querySelectorAll("ytd-rich-section-renderer");

  shelves.forEach((shelf) => {
>>>>>>> 60db7a029297cdc868717508fb1c4c9ebb5e57f8
    if (shelf.innerText.toLowerCase().includes("shorts")) {
      shelf.style.display = "none";
    }
  });
<<<<<<< HEAD

  // 3. Hide Sidebar/Navigation links
  document.querySelectorAll("ytd-guide-entry-renderer").forEach((entry) => {
=======
}

/* ===============================
   SIDEBAR NAVIGATION
================================ */

function hideShortsNavigation() {
  const navLinks = document.querySelectorAll("ytd-guide-entry-renderer");

  navLinks.forEach((entry) => {
>>>>>>> 60db7a029297cdc868717508fb1c4c9ebb5e57f8
    if (entry.innerText.toLowerCase().includes("shorts")) {
      entry.style.display = "none";
    }
  });
}

<<<<<<< HEAD
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
=======
/* ===============================
   FILTER CHIPS (Search/Home)
================================ */

function hideShortsChips() {
  const chips = document.querySelectorAll("yt-chip-cloud-chip-renderer");

  chips.forEach((chip) => {
    if (chip.innerText.toLowerCase().includes("shorts")) {
      chip.style.display = "none";
    }
  });
}

/* ===============================
   BLOCK DIRECT NAVIGATION
================================ */

function blockShortsNavigation() {
  if (window.location.pathname.startsWith("/shorts")) {
    window.location.href = "/";
  }
}

/* ===============================
   RESTORE
================================ */

function restoreAll() {
  const elements = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-section-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer"
  );

  elements.forEach((el) => {
    el.style.display = "";
  });
}

/* ===============================
   OBSERVER
================================ */

/* ===============================
   NAVIGATION ENGINE (MAX PERFORMANCE)
================================ */

let currentUrl = location.href;

function onNavigationChange() {
  if (!isExtensionEnabled) return;

  applyShortsRemoval();
  blockShortsNavigation();
}

/* Detect URL changes (SPA safe) */
function detectUrlChange() {
  setInterval(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      onNavigationChange();
    }
  }, 300);
}

/* Hook into YouTube navigation events */
window.addEventListener("yt-navigate-finish", () => {
  onNavigationChange();
});

/* Override History API (extra safety) */
(function(history) {
  const pushState = history.pushState;
  const replaceState = history.replaceState;

  history.pushState = function () {
    pushState.apply(history, arguments);
    onNavigationChange();
  };

  history.replaceState = function () {
    replaceState.apply(history, arguments);
    onNavigationChange();
  };
})(window.history);

/* ===============================
   START
================================ */

initializeState();
detectUrlChange();
>>>>>>> 60db7a029297cdc868717508fb1c4c9ebb5e57f8
