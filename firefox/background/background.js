function updateIcon(isEnabled) {
  const iconPath = isEnabled ? "assets/icons/icon48.png" : "assets/icons/icon96.png";
  browser.browserAction.setIcon({ path: iconPath });
}

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("isEnabled").then((result) => {
    const isEnabled = result.isEnabled ?? true;
    if (result.isEnabled === undefined) {
      browser.storage.local.set({ isEnabled: true });
    }
    updateIcon(isEnabled);
  });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_STATE") {
    browser.storage.local.get("isEnabled").then((res) => {
      sendResponse({ isEnabled: res.isEnabled });
    });
    return true; 
  }

  if (message.type === "SET_STATE") {
    browser.storage.local.set({ isEnabled: message.value });
    updateIcon(message.value); // Update icon when state changes
  }
});