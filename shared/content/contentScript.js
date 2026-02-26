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
    }
  });
}

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
    if (shelf.innerText.toLowerCase().includes("shorts")) {
      shelf.style.display = "none";
    }
  });
}

/* ===============================
   SIDEBAR NAVIGATION
================================ */

function hideShortsNavigation() {
  const navLinks = document.querySelectorAll("ytd-guide-entry-renderer");

  navLinks.forEach((entry) => {
    if (entry.innerText.toLowerCase().includes("shorts")) {
      entry.style.display = "none";
    }
  });
}

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