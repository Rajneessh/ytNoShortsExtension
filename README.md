# ytNoShortsExtension

Professional Firefox extension to remove YouTube Shorts from recommended sections.

## Architecture

    YouTube Page
    ↑
    Content Script
    ↑
    Message Passing
    ↑
    Background Script
    ↑
    Popup UI

## What manifest.json Controls

    This file defines:
        Extension name
        Version
        Permissions
        Scripts to inject
        When scripts run
        Popup configuration
        Icons

    As Manifest V2 is stable on Firefox as of now, that's why I chose Manifest V2 as I can migrate it to V3 later

    My manifest.json will include:
        Name
        Version
        Description
        manifest_version
        permissions
        content_scripts
        background
        browser_action (for popup)
        icons
