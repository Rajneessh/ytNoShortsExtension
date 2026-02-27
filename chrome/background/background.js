const DEFAULT_STATE = {
  isEnabled: true
};

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get("isEnabled").then((result) => {
    if (result.isEnabled === undefined) {
      browser.storage.local.set(DEFAULT_STATE);
    }
  });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.type === "GET_STATE") {
    return browser.storage.local.get("isEnabled");
  }

  if (message.type === "SET_STATE") {
    return browser.storage.local.set({
      isEnabled: message.value
    });
  }
});