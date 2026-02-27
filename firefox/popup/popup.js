const toggle = document.getElementById("toggleSwitch");
const statusText = document.getElementById("statusText");
const creditText = document.getElementById("creditText");

// Set the credit text with today's date
const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
creditText.textContent = `Built by Rajneesh Rajan on ${today}`;

// Initialize State
browser.runtime.sendMessage({ type: "GET_STATE" }, (response) => {
  const isEnabled = response?.isEnabled ?? true;
  toggle.checked = isEnabled;
  updateUI(isEnabled);
});

// Toggle Listener
toggle.addEventListener("change", () => {
  const isEnabled = toggle.checked;
  browser.runtime.sendMessage({ type: "SET_STATE", value: isEnabled });

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    if (tabs[0]) {
      browser.tabs.sendMessage(tabs[0].id, {
        type: "UPDATE_STATE",
        value: isEnabled,
      });
    }
  });

  updateUI(isEnabled);
});

function updateUI(isEnabled) {
  statusText.textContent = isEnabled
    ? "SHORTS ARE BLOCKED"
    : "SHORTS ARE VISIBLE";
  statusText.style.color = isEnabled
    ? "var(--accent-green)"
    : "var(--accent-red)";

  // Update the extension icon dynamically
  const iconPath = isEnabled
    ? "../assets/icons/icon48.png"
    : "../assets/icons/icon96.png";
  browser.browserAction.setIcon({ path: iconPath });
}
