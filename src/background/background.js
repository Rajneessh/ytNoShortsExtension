// Cross-browser API
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

const DEFAULT_STATE = {
  isEnabled: true
};

// Initialize default state on install
extensionAPI.runtime.onInstalled.addListener(() => {
  extensionAPI.storage.local.get(["isEnabled"], (result) => {
    if (result.isEnabled === undefined) {
      extensionAPI.storage.local.set(DEFAULT_STATE);
    }
  });
});

// Handle messages
extensionAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATE") {
    extensionAPI.storage.local.get(["isEnabled"], (result) => {
      sendResponse(result);
    });
    return true; // Required for async response
  }

  if (message.type === "SET_STATE") {
    extensionAPI.storage.local.set({ isEnabled: message.value }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});