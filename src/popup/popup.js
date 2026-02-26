// Cross-browser API
const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("statusText");

// Load current state
document.addEventListener("DOMContentLoaded", () => {
  extensionAPI.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
    const isEnabled = response?.isEnabled ?? true;

    toggleSwitch.checked = isEnabled;
    updateStatusText(isEnabled);
  });
});

// Handle toggle change
toggleSwitch.addEventListener("change", () => {
  const newState = toggleSwitch.checked;

  extensionAPI.runtime.sendMessage(
    {
      type: "SET_STATE",
      value: newState
    },
    () => {
      updateStatusText(newState);
    }
  );
});

function updateStatusText(isEnabled) {
  statusText.textContent = isEnabled
    ? "Shorts Removal: ON"
    : "Shorts Removal: OFF";
}