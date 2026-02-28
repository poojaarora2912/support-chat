/* global chrome */

const ALLOWED_ORIGINS = ["https://app.intercom.com", "https://admin-paperflite", "https://adminservice.api.paperflite.com", "http://localhost:5173/"];

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

function notifyPanelActivatedTab(tabId, url) {
  const details = getUrlDetails(url);
  if (!details) return;
  chrome.runtime.sendMessage({
    type: "ACTIVATED_TAB",
    payload: { tabId, url, ...details },
  }).catch(() => {});
}

// Enable or disable panel based on whether the tab is Intercom
function updatePanelForTab(tabId, url) {
  const enabled = isIntercomTab(url);
  // console.log('updatePanelForTab', tabId, url, enabled);

  chrome.sidePanel
    .setOptions({ tabId, enabled, path: "index.html" })
    .catch((err) => console.error("setOptions", err));

  // If disabled, tell the panel to close itself
  if (tabId && url && !enabled) {
    chrome.runtime.sendMessage({ type: "CLOSE_PANEL" }).catch(() => {
    //   // Panel may not be open — ignore the error
    });
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
  notifyPanelActivatedTab(tab.id, tab.url);
});

// When switching tabs — enable/disable panel and notify panel of activated tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId).then(
    (tab) => {
      updatePanelForTab(tab.id, tab.url);
      if (tab.url) {
        captureTabUrl(tab.id, tab.url);
        console.log('onActivated', tab.url)
        notifyPanelActivatedTab(tab.id, tab.url);
      }
    },
    (err) => console.error(err)
  );
});

// When tab URL changes — re-evaluate and notify panel
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = changeInfo.url ?? tab.url;
  if (url) {
    updatePanelForTab(tabId, url);
    captureTabUrl(tabId, url);
    notifyPanelActivatedTab(tabId, url);
  }
});

// On extension load — set panel state and notify panel of current tab
chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  if (tab?.url) {
    updatePanelForTab(tab.id, tab.url);
    captureTabUrl(tab.id, tab.url);
    notifyPanelActivatedTab(tab.id, tab.url);
  }
});