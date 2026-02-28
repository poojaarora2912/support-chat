/* global chrome */

const ALLOWED_ORIGINS = ["https://app.intercom.com", "https://admin-paperflite", "https://adminservice.api.paperflite.com"];

function isIntercomTab(url) {
  if (!url || !url.startsWith("http")) return false;
  return ALLOWED_ORIGINS.some(origin => url.startsWith(origin));
}

function getUrlDetails(url) {
  if (!url || !url.startsWith("http")) return null;
  try {
    const u = new URL(url);
    return {
      url,
      origin: u.origin,
      pathname: u.pathname,
      search: u.search,
      searchParams: Object.fromEntries(u.searchParams),
      hash: u.hash,
      timestamp: Date.now(),
    };
  } catch {
    return null;
  }
}

function captureTabUrl(tabId, url) {
  if (!url) return;
  const details = getUrlDetails(url);
  if (!details) return;
  chrome.storage.session.set({ [tabId]: details }).catch((err) => console.error(err));
}

// Enable or disable panel based on whether the tab is Intercom
function updatePanelForTab(tabId, url) {
  const enabled = isIntercomTab(url);

  chrome.sidePanel
    .setOptions({ tabId, enabled, path: "index.html" })
    .catch((err) => console.error("setOptions", err));

  // If disabled, tell the panel to close itself
  if (!enabled) {
    // chrome.runtime.sendMessage({ type: "CLOSE_PANEL" }).catch(() => {
    //   // Panel may not be open — ignore the error
    // });
  }
}

// Open panel on click — only works if panel is enabled for that tab
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((err) => console.error(err));

// When icon is clicked, only open if Intercom tab
chrome.action.onClicked.addListener((tab) => {
  if (!isIntercomTab(tab.url)) return;
  updatePanelForTab(tab.id, tab.url);
  captureTabUrl(tab.id, tab.url);
});

// When switching tabs — enable/disable panel for the new active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then(
    (tab) => {
      updatePanelForTab(tab.id, tab.url);
      if (tab.url) captureTabUrl(tab.id, tab.url);
    },
    (err) => console.error(err)
  );
});

// When tab URL changes — re-evaluate
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url ?? tab.url;
  console.log('onUpdated', url);
  if (url) {
    updatePanelForTab(tabId, url);
    captureTabUrl(tabId, url);
  }
});

// On extension load — set panel state for current tab
chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  if (tab?.url) {
    updatePanelForTab(tab.id, tab.url);
    captureTabUrl(tab.id, tab.url);
  }
});