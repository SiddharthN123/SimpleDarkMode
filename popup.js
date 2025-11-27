document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('darkToggle');
    const statusText = document.getElementById('statusText');

    // 1. Check the current tab's status when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab.url.startsWith('chrome://')) {
            statusText.textContent = "Not available on system pages";
            toggle.disabled = true;
            return;
        }

        // Send a message to content script to ask "Are you dark?"
        chrome.tabs.sendMessage(activeTab.id, { action: "checkStatus" }, (response) => {
            if (chrome.runtime.lastError) {
                // Content script might not be loaded yet
                statusText.textContent = "Refresh page to enable";
                return;
            }
            if (response && response.isDark) {
                toggle.checked = true;
                statusText.textContent = "On";
            } else {
                toggle.checked = false;
                statusText.textContent = "Off";
            }
        });
    });

    // 2. Handle the toggle switch
    toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        statusText.textContent = isDark ? "On" : "Off";

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, { 
                action: "toggleDarkMode", 
                enable: isDark 
            });
        });
    });
});