// Cross-browser API
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

let isExtensionEnabled = true;
let observer = null;

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

function applyShortsRemoval() {
  if (!isExtensionEnabled) return;

  hideShortsVideos();
  hideShortsShelves();
  hideShortsNavigation();
  hideShortsChips();
}

function hideShortsVideos() {
  const renderers = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer",
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

function hideShortsShelves() {
  const shelves = document.querySelectorAll("ytd-rich-section-renderer");

  shelves.forEach((shelf) => {
    if (shelf.innerText.toLowerCase().includes("shorts")) {
      shelf.style.display = "none";
    }
  });
}

function hideShortsNavigation() {
  const navLinks = document.querySelectorAll("ytd-guide-entry-renderer");

  navLinks.forEach((entry) => {
    if (entry.innerText.toLowerCase().includes("shorts")) {
      entry.style.display = "none";
    }
  });
}

function hideShortsChips() {
  const chips = document.querySelectorAll("yt-chip-cloud-chip-renderer");

  chips.forEach((chip) => {
    if (chip.innerText.toLowerCase().includes("shorts")) {
      chip.style.display = "none";
    }
  });
}

function blockShortsNavigation() {
  if (window.location.pathname.startsWith("/shorts")) {
    window.location.href = "/";
  }
}

function restoreAll() {
  const elements = document.querySelectorAll(
    "ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-section-renderer, ytd-guide-entry-renderer, yt-chip-cloud-chip-renderer",
  );

  elements.forEach((el) => {
    el.style.display = "";
  });
}

function startObserving() {
  if (observer) return;

  let timeout = null;

  observer = new MutationObserver(() => {
    if (timeout) return;

    timeout = setTimeout(() => {
      applyShortsRemoval();
      blockShortsNavigation();
      timeout = null;
    }, 250);
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

extensionAPI.runtime.onMessage.addListener((message) => {
  if (message.type === "SET_STATE") {
    isExtensionEnabled = message.value;

    if (isExtensionEnabled) {
      applyShortsRemoval();
      startObserving();
      blockShortsNavigation();
    } else {
      stopObserving();
      restoreAll();
    }
  }
});

initializeState();
