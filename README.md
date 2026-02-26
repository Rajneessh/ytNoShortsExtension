# ytNoShortsExtension

ytNoShortsExtension is a high-performance, cross-browser browser extension that aggressively removes YouTube Shorts from every visible area of the platform.

This project started as a simple DOM manipulation experiment and evolved into a modular, dual-manifest, performance-optimized extension architecture supporting both Firefox (Manifest V2) and Chrome (Manifest V3).

The goal of this project is simple:
Give users full control over whether YouTube Shorts appear in their browsing experience.

---

# Why This Exists

YouTube heavily promotes Shorts across:

- Homepage recommendations
- Search results
- Subscriptions feed
- Channel pages
- Sidebar navigation
- Filter chips
- Dedicated `/shorts/` URLs

There is no official way to disable Shorts globally.

ytNoShortsExtension provides a toggle-controlled suppression engine that removes Shorts entirely when enabled.

---

# What The Extension Does

When Aggressive Mode is enabled, the extension:

- Removes Shorts from homepage recommendations
- Removes Shorts from search results
- Removes Shorts from subscriptions page
- Removes Shorts shelves and sections
- Removes Shorts navigation tab in the sidebar
- Removes Shorts filter chips
- Removes Shorts content from channel pages
- Blocks direct `/shorts/` URLs and redirects away

When disabled:

- Everything returns instantly without page reload

State persists using browser storage.

---

# How It Works

This extension is designed specifically for YouTube’s SPA (Single Page Application) behavior.

Instead of constantly watching the entire DOM with heavy MutationObservers, the extension:

1. Hooks into YouTube’s navigation events.
2. Detects URL changes.
3. Intercepts History API (`pushState`, `replaceState`).
4. Runs selective DOM scans only when navigation changes occur.
5. Applies Shorts suppression only when needed.

This avoids expensive subtree-wide DOM observation and significantly reduces CPU overhead.

---

# Architecture Overview

The project uses a dual-build structure to support both Firefox and Chrome without duplicating logic.
ytNoShortsExtension/
│
├── shared/ # Shared logic (background, content, popup)
├── firefox/ # Firefox Manifest V2 build
├── chrome/ # Chrome Manifest V3 build
└── assets/ # Icons and static resources
All logic lives inside `shared/`.

Two separate manifest files exist because:

- Firefox supports Manifest V2 background scripts.
- Chrome requires Manifest V3 service workers.
- Messaging behavior differs slightly between browsers.

To unify behavior across browsers, the extension uses a safe wrapper: const extensionAPI = typeof browser !== "undefined" ? browser : chrome;

This prevents code duplication and keeps the architecture maintainable.

---

# Technical Stack

- Vanilla JavaScript
- WebExtensions API
- Firefox Manifest V2
- Chrome Manifest V3
- SPA navigation event detection
- History API interception
- Persistent state via browser storage

No frameworks.
No third-party dependencies.
No build tools required.

---

# Development Evolution

### Phase 1 – Basic Removal

The initial version scanned for links containing `/shorts/` and removed elements using a global MutationObserver.  
This worked but was inefficient.

### Phase 2 – Modular Suppression Engine

Logic was split into:

- Video detection
- Shelf detection
- Sidebar detection
- Chip detection
- Navigation blocking

This improved maintainability and readability.

### Phase 3 – Aggressive Mode Expansion

Shorts suppression expanded to cover:

- Sidebar navigation entries
- Filter chips
- Channel pages
- Subscriptions feed
- Direct route blocking

This created a universal Shorts suppression layer.

### Phase 4 – Performance Optimization

The heavy MutationObserver was removed.
Replaced with:

- `yt-navigate-finish` listener
- URL change detection
- History API interception
- Selective scanning

This significantly reduced DOM overhead.

### Phase 5 – Cross-Browser Migration

The project was upgraded to support:

- Firefox (Manifest V2)
- Chrome (Manifest V3)

A dual-manifest architecture was introduced while keeping shared logic centralized.

---

# Installation

Firefox:

1. Open `about:debugging`
2. Click “This Firefox”
3. Click “Load Temporary Add-on”
4. Select `firefox/manifest.json`

Chrome:

1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click “Load Unpacked”
4. Select the `chrome/` folder

---

# Version History

v1.0.0  
Basic Shorts removal using MutationObserver.

v1.3.0  
Aggressive suppression mode introduced.

v1.4.0  
Navigation-driven performance engine implemented.

v1.5.0  
Dual-manifest cross-browser architecture with production-level structure.

---

# Engineering Focus

This project emphasizes:

- Performance-aware design
- SPA-aware navigation handling
- Clean modular architecture
- Cross-browser compatibility
- Maintainable code structure
- Production-grade extension patterns

---

# Future Improvements

- Balanced filtering mode
- Custom keyword filtering
- Per-page configuration
- Store publishing
- Automated testing
- Optional minimal performance mode

---
