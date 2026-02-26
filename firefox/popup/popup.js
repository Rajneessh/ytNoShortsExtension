function updateStatusText(isEnabled) {
  statusText.textContent = isEnabled
    ? "Aggressive Mode Active"
    : "Shorts Visible";

  const dot = document.getElementById("statusDot");
  dot.style.backgroundColor = isEnabled ? "#00ff66" : "#ff0000";
}