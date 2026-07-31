const STORE_KEY = "flagSwitch";
const COOKIE_DAYS = 90;

const el = {
  host: document.getElementById("host"),
  tabs: document.getElementById("tabs"),
  tabSite: document.getElementById("tabSite"),
  tabAll: document.getElementById("tabAll"),
  notice: document.getElementById("notice"),
  list: document.getElementById("list"),
  form: document.getElementById("form"),
  toggleAdd: document.getElementById("toggleAdd"),
  fName: document.getElementById("fName"),
  fValues: document.getElementById("fValues"),
  fDomain: document.getElementById("fDomain"),
  fCancel: document.getElementById("fCancel"),
  fError: document.getElementById("fError"),
  autoReload: document.getElementById("autoReload"),
  exportBtn: document.getElementById("export"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile")
};

let state = { flags: [], autoReload: true };
let tab = null;
let tabUrl = null;
let editingId = null;
let showAll = false;

init();

async function init() {
  const stored = await chrome.storage.sync.get(STORE_KEY);
  if (stored[STORE_KEY]) state = { ...state, ...stored[STORE_KEY] };
  el.autoReload.checked = state.autoReload;

  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  try {
    tabUrl = new URL(tab.url);
  } catch {
    tabUrl = null;
  }

  if (!tabUrl || !/^https?:$/.test(tabUrl.protocol)) {
    el.host.textContent = "no site";
    el.notice.textContent = "Open a http or https page to set cookies on it.";
    el.notice.hidden = false;
    el.toggleAdd.disabled = true;
    el.tabs.hidden = true;
    return;
  }

  el.host.textContent = tabUrl.host;
  bind();
  render();
}

function bind() {
  el.tabSite.addEventListener("click", () => setShowAll(false));
  el.tabAll.addEventListener("click", () => setShowAll(true));
  el.toggleAdd.addEventListener("click", () => openForm(null));
  el.fCancel.addEventListener("click", closeForm);
  el.form.addEventListener("submit", saveFlag);
  el.autoReload.addEventListener("change", () => {
    state.autoReload = el.autoReload.checked;
    persist();
  });
  el.exportBtn.addEventListener("click", exportFlags);
  el.importBtn.addEventListener("click", () => el.importFile.click());
  el.importFile.addEventListener("change", importFlags);
  document.addEventListener("click", (event) => {
    if (event.target.closest(".kebab, .actions")) return;
    closeMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = el.list.querySelector(".actions:not([hidden])");
    if (!open) return;
    event.preventDefault();
    closeMenus();
  });
}

function closeMenus() {
  for (const actions of el.list.querySelectorAll(".actions")) actions.hidden = true;
  for (const kebab of el.list.querySelectorAll(".kebab")) kebab.setAttribute("aria-expanded", "false");
}

function persist() {
  return chrome.storage.sync.set({ [STORE_KEY]: state });
}

function setShowAll(value) {
  showAll = value;
  el.tabSite.setAttribute("aria-pressed", String(!showAll));
  el.tabAll.setAttribute("aria-pressed", String(showAll));
  render();
}

function matchesSite(flag) {
  if (!flag.domain) return true;
  const domain = flag.domain.replace(/^\./, "");
  return tabUrl.host === domain || tabUrl.host.endsWith("." + domain);
}

function cookieUrl(flag) {
  const host = flag.domain ? flag.domain.replace(/^\./, "") : tabUrl.host;
  return `${tabUrl.protocol}//${host}/`;
}

async function readValue(flag) {
  const cookie = await chrome.cookies.get({ url: cookieUrl(flag), name: flag.name });
  return cookie ? cookie.value : null;
}

async function applyValue(flag, value) {
  const url = cookieUrl(flag);
  if (value === null) {
    await chrome.cookies.remove({ url, name: flag.name });
  } else {
    await chrome.cookies.set({
      url,
      name: flag.name,
      value,
      path: "/",
      secure: tabUrl.protocol === "https:",
      expirationDate: Math.floor(Date.now() / 1000) + COOKIE_DAYS * 86400,
      ...(flag.domain ? { domain: flag.domain } : {})
    });
  }
  if (state.autoReload) chrome.tabs.reload(tab.id);
  render();
}

async function render() {
  el.list.textContent = "";

  const visible = showAll ? state.flags : state.flags.filter(matchesSite);

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = state.flags.length
      ? `No flags target ${tabUrl.host}. The All tab shows every flag.`
      : "No flags yet. Add the cookie name your devs sent you and the values it accepts.";
    el.list.append(empty);
    return;
  }

  for (const flag of visible) {
    const current = await readValue(flag);
    el.list.append(flagRow(flag, current));
  }
}

function flagRow(flag, current) {
  const wrap = document.createElement("section");
  wrap.className = "flag";

  const head = document.createElement("div");
  head.className = "flag-head";

  const name = document.createElement("span");
  name.className = "flag-name";
  name.textContent = flag.name;
  head.append(name);

  if (flag.domain) {
    const scope = document.createElement("span");
    scope.className = "flag-scope";
    scope.textContent = flag.domain;
    head.append(scope);
  }

  const seg = document.createElement("div");
  seg.className = "seg";
  seg.setAttribute("role", "group");
  seg.setAttribute("aria-label", flag.name);

  seg.append(segButton("Off", current === null, false, () => applyValue(flag, null)));
  for (const value of flag.values) {
    seg.append(segButton(value, current === value, true, () => applyValue(flag, value)));
  }

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.id = `actions-${flag.id}`;
  actions.hidden = true;
  actions.append(
    textButton("Edit", () => openForm(flag.id)),
    textButton("Remove", async () => {
      state.flags = state.flags.filter((f) => f.id !== flag.id);
      await persist();
      render();
    })
  );

  const menu = document.createElement("button");
  menu.type = "button";
  menu.className = "ghost kebab";
  menu.textContent = "⋮";
  menu.title = "More actions";
  menu.setAttribute("aria-label", `More actions for ${flag.name}`);
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-controls", actions.id);
  menu.addEventListener("click", () => {
    const open = actions.hidden;
    closeMenus();
    actions.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
  });

  const controls = document.createElement("div");
  controls.className = "flag-controls";
  controls.append(seg, menu);

  wrap.append(head, controls, actions);
  return wrap;
}

function segButton(label, active, live, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.title = label;
  button.setAttribute("aria-pressed", String(active));
  if (live) button.classList.add("live");
  button.addEventListener("click", onClick);
  return button;
}

function textButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "ghost text";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function openForm(id) {
  editingId = id;
  const flag = state.flags.find((f) => f.id === id);
  el.fName.value = flag ? flag.name : "";
  el.fValues.value = flag ? flag.values.join(", ") : "";
  el.fDomain.value = flag ? flag.domain : "";
  el.fError.hidden = true;
  el.form.hidden = false;
  el.fName.focus();
}

function closeForm() {
  editingId = null;
  el.form.hidden = true;
  el.fError.hidden = true;
}

async function saveFlag(event) {
  event.preventDefault();

  const name = el.fName.value.trim();
  const values = el.fValues.value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const domain = el.fDomain.value.trim();

  if (!name) return fail("Add the cookie name.");
  if (/[\s;=,]/.test(name)) return fail("A cookie name cannot contain spaces, semicolons, commas or equals signs.");
  if (!values.length) return fail("Add at least one value, separated by commas.");
  if (state.flags.some((f) => f.name === name && f.domain === domain && f.id !== editingId)) {
    return fail("That cookie is already in the list.");
  }

  if (editingId) {
    state.flags = state.flags.map((f) => (f.id === editingId ? { ...f, name, values, domain } : f));
  } else {
    state.flags.push({ id: crypto.randomUUID(), name, values, domain });
  }

  await persist();
  closeForm();
  render();
}

function fail(message) {
  el.fError.textContent = message;
  el.fError.hidden = false;
}

function exportFlags() {
  const blob = new Blob([JSON.stringify(state.flags, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "flag-switch.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

async function importFlags(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const incoming = JSON.parse(await file.text());
    if (!Array.isArray(incoming)) throw new Error("shape");
    const clean = incoming
      .filter((f) => f && typeof f.name === "string" && Array.isArray(f.values))
      .map((f) => ({
        id: crypto.randomUUID(),
        name: f.name,
        values: f.values.map(String),
        domain: typeof f.domain === "string" ? f.domain : ""
      }));
    const existing = new Set(state.flags.map((f) => `${f.name}|${f.domain}`));
    state.flags.push(...clean.filter((f) => !existing.has(`${f.name}|${f.domain}`)));
    await persist();
    render();
  } catch {
    el.notice.textContent = "That file is not a Flag Switch export. Expected a JSON array of flags.";
    el.notice.hidden = false;
  }
  event.target.value = "";
}
