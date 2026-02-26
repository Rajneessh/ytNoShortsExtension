const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("statusText");

// Load current state
document.addEventListener("DOMContentLoaded", async () => {
  const response = await browser.runtime.sendMessage({ type: "GET_STATE" });

  const isEnabled = response.isEnabled;

  toggleSwitch.checked = isEnabled;
  updateStatusText(isEnabled);
});

// Handle toggle change
toggleSwitch.addEventListener("change", async () => {
  const newState = toggleSwitch.checked;

  await browser.runtime.sendMessage({
    type: "SET_STATE",
    value: newState
  });

  updateStatusText(newState);
});

function updateStatusText(isEnabled) {
  statusText.textContent = isEnabled
    ? "Shorts Removal: ON"
    : "Shorts Removal: OFF";
}