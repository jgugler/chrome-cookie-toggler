const STORE_KEY = "flagSwitch";

chrome.action.setBadgeBackgroundColor({ color: "#178a42" });
chrome.action.setBadgeTextColor({ color: "#ffffff" });

async function getFlags() {
  const stored = await chrome.storage.sync.get(STORE_KEY);
  return stored[STORE_KEY]?.flags ?? [];
}

function cookieUrl(tabUrl, flag) {
  const host = flag.domain ? flag.domain.replace(/^\./, "") : tabUrl.host;
  return `${tabUrl.protocol}//${host}/`;
}

function matchesSite(tabUrl, flag) {
  if (!flag.domain) return true;
  const domain = flag.domain.replace(/^\./, "");
  return tabUrl.host === domain || tabUrl.host.endsWith("." + domain);
}

async function liveCount(tab) {
  let url;
  try {
    url = new URL(tab.url);
  } catch {
    return 0;
  }
  if (!/^https?:$/.test(url.protocol)) return 0;

  const flags = (await getFlags()).filter((flag) => matchesSite(url, flag));
  const cookies = await Promise.all(
    flags.map((flag) =>
      chrome.cookies.get({ url: cookieUrl(url, flag), name: flag.name }).catch(() => null)
    )
  );
  return cookies.filter(Boolean).length;
}

async function updateBadge(tab) {
  if (!tab || tab.id === chrome.tabs.TAB_ID_NONE) return;
  const count = await liveCount(tab);
  await chrome.action
    .setBadgeText({ tabId: tab.id, text: count ? String(count) : "" })
    .catch(() => {});
}

async function updateActiveTabs() {
  const tabs = await chrome.tabs.query({ active: true });
  await Promise.all(tabs.map(updateBadge));
}

chrome.runtime.onInstalled.addListener(updateActiveTabs);
chrome.runtime.onStartup.addListener(updateActiveTabs);

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (tab) updateBadge(tab);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "loading" || changeInfo.url) updateBadge(tab);
});

chrome.cookies.onChanged.addListener(() => updateActiveTabs());

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes[STORE_KEY]) updateActiveTabs();
});
