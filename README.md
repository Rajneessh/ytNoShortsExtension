# 🎥 YouTube Shorts Remover Pro (v1.6.0)

A high-performance browser extension designed to scrub YouTube Shorts from your digital life. Unlike basic CSS-hiding extensions, this version uses active DOM monitoring to ensure Shorts never flicker into view, even during infinite scrolling.

## 🚀 The Mission
YouTube's Single Page Application (SPA) architecture makes it difficult to block content effectively. This project was built to solve the "Shorts distraction" by targeting the underlying data structures YouTube uses to inject vertical content into your horizontal feed.

## ✨ Key Features
* **Real-time Interception**: Uses `MutationObserver` to watch for new DOM nodes, killing Shorts before the browser even renders them.
* **Navigation Guard**: Detects if a user navigates to `/shorts/` via a link or direct URL and instantly redirects to the Home feed.
* **UI/UX Refinement**: A custom-built dashboard that matches the YouTube "Dark Mode" aesthetic perfectly.
* **State Persistence**: Uses `browser.storage.local` to remember your preferences across browser sessions.

## 🛠 Project Structure
Based on the **v1.6.0** stable release architecture:
```text
firefox/
├── assets/
│   └── icons/        # State-dependent icons (Green/Red)
├── background/
│   └── background.js # Handles storage and icon state logic
├── content/
│   └── contentScript.js # The "Cleaner" engine and MutationObserver
└── popup/
    ├── popup.html    # Modern glassmorphism interface
    ├── popup.css     # Dark-theme optimized styles
    └── popup.js      # Dynamic credit & toggle logic