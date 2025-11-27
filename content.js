

const STYLE_ID = 'simple-dark-mode-extension-style';

function enableDarkMode() {
    if (document.getElementById(STYLE_ID)) return; // Already enabled

    const css = `
        html {
            filter: invert(1) hue-rotate(180deg) !important;
            transition: filter 0.3s ease !important;
        }
        /* Re-invert media so images don't look like negatives */
        img, video, picture, canvas, iframe, embed, object {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        /* Specific fix for some background images if needed, though generic filter is usually enough */
    `;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
    
    // Save state to storage
    chrome.storage.local.set({ [window.location.hostname]: true });
}

function disableDarkMode() {
    const style = document.getElementById(STYLE_ID);
    if (style) {
        style.remove();
    }
    
    // Remove state from storage
    chrome.storage.local.remove(window.location.hostname);
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleDarkMode") {
        if (request.enable) {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    } else if (request.action === "checkStatus") {
        sendResponse({ isDark: !!document.getElementById(STYLE_ID) });
    }
});

// Auto-load on refresh if it was previously enabled
chrome.storage.local.get([window.location.hostname], (result) => {
    if (result[window.location.hostname]) {
        enableDarkMode();
    }
});