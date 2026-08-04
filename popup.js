const STORE_KEY = "flagSwitch";
const COOKIE_DAYS = 90;
const NAME_INVALID = /[\s;=,]/;
const VALUE_INVALID = /[\s;,"\\]/;

const el = {
  host: document.getElementById("host"),
  tabs: document.getElementById("tabs"),
  tabSite: document.getElementById("tabSite"),
  tabAll: document.getElementById("tabAll"),
  notice: document.getElementById("notice"),
  status: document.getElementById("status"),
  livebar: document.getElementById("livebar"),
  liveCount: document.getElementById("liveCount"),
  allOff: document.getElementById("allOff"),
  list: document.getElementById("list"),
  form: document.getElementById("form"),
  toggleAdd: document.getElementById("toggleAdd"),
  fName: document.getElementById("fName"),
  fValues: document.getElementById("fValues"),
  fDomain: document.getElementById("fDomain"),
  fCancel: document.getElementById("fCancel"),
  fSave: document.getElementById("fSave"),
  fError: document.getElementById("fError"),
  autoReload: document.getElementById("autoReload"),
  exportBtn: document.getElementById("export"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile"),
  settingsBtn: document.getElementById("settingsBtn"),
  settingsMenu: document.getElementById("settingsMenu")
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

  bind();

  if (!tabUrl || !/^https?:$/.test(tabUrl.protocol)) {
    tabUrl = null;
    el.host.textContent = "no site";
    showNotice("Open a http or https page to set cookies on it. Export and import still work here.");
    el.toggleAdd.disabled = true;
    el.toggleAdd.title = "Open an http or https page to add flags";
    el.tabs.hidden = true;
    return;
  }

  el.host.textContent = tabUrl.host;
  el.host.title = tabUrl.host;
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
  el.fDomain.addEventListener("change", () => {
    el.fDomain.value = normalizeDomain(el.fDomain.value);
  });
  el.settingsBtn.addEventListener("click", () => {
    setSettingsOpen(el.settingsMenu.hidden);
  });
  el.exportBtn.addEventListener("click", () => {
    setSettingsOpen(false);
    exportFlags();
  });
  el.importBtn.addEventListener("click", () => {
    setSettingsOpen(false);
    el.importFile.click();
  });
  el.importFile.addEventListener("change", importFlags);
  el.list.addEventListener("scroll", updateScrollHint);
  el.allOff.addEventListener("click", async () => {
    const liveFlags = [];
    for (const flag of state.flags.filter(matchesSite)) {
      if ((await readValue(flag)) !== null) liveFlags.push(flag);
    }
    await Promise.all(
      liveFlags.map((flag) => chrome.cookies.remove({ url: cookieUrl(flag), name: flag.name }))
    );
    if (state.autoReload) chrome.tabs.reload(tab.id);
    announce(`${liveFlags.length} ${liveFlags.length === 1 ? "override" : "overrides"} removed`);
    render();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".settings")) setSettingsOpen(false);
    if (event.target.closest(".kebab, .actions")) return;
    closeMenus();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const menuOpen = el.list.querySelector(".actions:not([hidden])");
    const settingsOpen = !el.settingsMenu.hidden;
    const formOpen = !el.form.hidden;
    if (!menuOpen && !settingsOpen && !formOpen) return;
    event.preventDefault();
    closeMenus();
    setSettingsOpen(false);
    if (formOpen && !menuOpen && !settingsOpen) closeForm();
  });
}

function setSettingsOpen(open) {
  el.settingsMenu.hidden = !open;
  el.settingsBtn.setAttribute("aria-expanded", String(open));
}

function showNotice(message) {
  el.notice.textContent = message;
  el.notice.hidden = false;
}

function updateScrollHint() {
  const up = el.list.scrollTop > 1;
  const down = el.list.scrollTop + el.list.clientHeight < el.list.scrollHeight - 1;
  el.list.dataset.scroll = up && down ? "both" : up ? "up" : down ? "down" : "none";
}

function afterRender() {
  updateScrollHint();
  updateLivebar();
}

async function updateLivebar() {
  let count = 0;
  for (const flag of state.flags.filter(matchesSite)) {
    if ((await readValue(flag)) !== null) count++;
  }
  el.livebar.hidden = count === 0;
  if (count) el.liveCount.textContent = `${count} live on this site`;
}

function closeMenus() {
  for (const actions of el.list.querySelectorAll(".actions")) actions.hidden = true;
  for (const kebab of el.list.querySelectorAll(".kebab")) kebab.setAttribute("aria-expanded", "false");
  for (const confirm of el.list.querySelectorAll(".danger.confirm")) {
    confirm.classList.remove("confirm");
    confirm.textContent = "Remove";
  }
}

function persist() {
  return chrome.storage.sync.set({ [STORE_KEY]: state });
}

function announce(message) {
  el.status.textContent = "";
  setTimeout(() => {
    el.status.textContent = message;
  }, 30);
}

function setShowAll(value) {
  showAll = value;
  el.tabSite.setAttribute("aria-pressed", String(!showAll));
  el.tabAll.setAttribute("aria-pressed", String(showAll));
  render();
}

function normalizeDomain(raw) {
  let value = raw.trim().toLowerCase();
  if (!value) return "";
  const leadingDot = value.startsWith(".");
  if (leadingDot) value = value.replace(/^\.+/, "");
  try {
    const url = new URL(value.includes("://") ? value : `https://${value}`);
    value = url.hostname.replace(/\.$/, "");
  } catch {
    return raw.trim();
  }
  if (!value || !/^[a-z0-9.-]+$/.test(value)) return raw.trim();
  return leadingDot ? `.${value}` : value;
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
  try {
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
    if ((await readValue(flag)) !== value) throw new Error("not applied");
  } catch {
    const trouble =
      value === null
        ? `Couldn't remove ${flag.name} on this site.`
        : `Couldn't set ${flag.name} to ${value} on this site. Check the value and the domain.`;
    showNotice(trouble);
    announce(trouble);
    render();
    return;
  }
  el.notice.hidden = true;
  if (state.autoReload) chrome.tabs.reload(tab.id);
  announce(value === null ? `${flag.name} override removed` : `${flag.name} set to ${value}`);
  render();
}

async function render() {
  if (!tabUrl) return;
  if (el.list.contains(el.form)) closeForm();
  const active = document.activeElement;
  const focusKey = active && active.dataset ? active.dataset.focusKey : null;
  const activeCard = active && active.closest ? active.closest(".flag") : null;
  const cardIndex = activeCard ? [...el.list.querySelectorAll(".flag")].indexOf(activeCard) : -1;
  el.list.textContent = "";

  const visible = showAll ? state.flags : state.flags.filter(matchesSite);

  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = state.flags.length
      ? `No flags target ${tabUrl.host}. The All tab shows every flag.`
      : "No flags yet. Add the cookie name your devs sent you, or import their file.";
    el.list.append(empty);
    if (!state.flags.length) {
      const starters = document.createElement("div");
      starters.className = "empty-actions";
      starters.append(
        textButton("Add a flag", () => openForm(null)),
        textButton("Import", () => el.importFile.click())
      );
      el.list.append(starters);
    }
    restoreFocus(focusKey, cardIndex);
    afterRender();
    return;
  }

  if (!showAll) {
    for (const flag of visible) {
      const current = await readValue(flag);
      el.list.append(flagRow(flag, current));
    }
    restoreFocus(focusKey, cardIndex);
    afterRender();
    return;
  }

  const groups = new Map();
  for (const flag of visible) {
    const key = flag.domain || "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(flag);
  }
  const rank = (key) => {
    if (key === "") return 0;
    return matchesSite({ domain: key }) ? 1 : 2;
  };
  const keys = [...groups.keys()].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

  for (const key of keys) {
    const heading = document.createElement("h2");
    heading.className = "group";
    heading.textContent = key || "Follows the current site";
    el.list.append(heading);
    for (const flag of groups.get(key)) {
      const current = await readValue(flag);
      el.list.append(flagRow(flag, current));
    }
  }
  restoreFocus(focusKey, cardIndex);
  afterRender();
}

function restoreFocus(focusKey, cardIndex) {
  if (focusKey) {
    const target = el.list.querySelector(`[data-focus-key="${CSS.escape(focusKey)}"]`);
    if (target) {
      focusSegment(target);
      return;
    }
  }
  if (cardIndex < 0) return;
  const cards = el.list.querySelectorAll(".flag");
  if (cards.length) {
    const card = cards[Math.min(cardIndex, cards.length - 1)];
    const fallback = card.querySelector(".kebab");
    if (fallback) fallback.focus();
    return;
  }
  const starter = el.list.querySelector(".empty-actions button");
  if (starter) starter.focus();
}

function focusSegment(target) {
  const seg = target.closest(".seg");
  if (seg) {
    for (const button of seg.querySelectorAll("button")) button.tabIndex = -1;
    target.tabIndex = 0;
  }
  target.focus();
}

function flagRow(flag, current) {
  const wrap = document.createElement("section");
  wrap.className = "flag";
  wrap.dataset.id = flag.id;
  if (current !== null) wrap.classList.add("live");

  const head = document.createElement("div");
  head.className = "flag-head";

  const idWrap = document.createElement("div");
  idWrap.className = "flag-id";

  const name = document.createElement("span");
  name.className = "flag-name";
  name.textContent = flag.name;
  if (current !== null) {
    const led = document.createElement("span");
    led.className = "led";
    led.setAttribute("aria-hidden", "true");
    name.prepend(led);
    const srLive = document.createElement("span");
    srLive.className = "sr-only";
    srLive.textContent = " live";
    name.append(srLive);
  }
  idWrap.append(name);

  head.append(idWrap);

  const seg = document.createElement("div");
  seg.className = "seg";
  seg.setAttribute("role", "group");
  seg.setAttribute("aria-label", flag.name);

  const offBtn = segButton("Off", current === null, false, () => applyValue(flag, null));
  offBtn.classList.add("off");
  offBtn.dataset.focusKey = `${flag.id}|off`;
  seg.append(offBtn);
  for (const value of flag.values) {
    const valueBtn = segButton(value, current === value, true, () => applyValue(flag, value));
    valueBtn.dataset.focusKey = `${flag.id}|v|${value}`;
    seg.append(valueBtn);
  }

  const segButtons = [...seg.querySelectorAll("button")];
  const pressed = segButtons.findIndex((b) => b.getAttribute("aria-pressed") === "true");
  const roving = pressed === -1 ? 0 : pressed;
  segButtons.forEach((button, index) => {
    button.tabIndex = index === roving ? 0 : -1;
  });
  seg.addEventListener("keydown", onSegKeydown);

  const removeBtn = textButton("Remove", async () => {
    if (!removeBtn.classList.contains("confirm")) {
      removeBtn.classList.add("confirm");
      removeBtn.textContent = "Remove?";
      return;
    }
    state.flags = state.flags.filter((f) => f.id !== flag.id);
    await persist();
    if (current !== null) {
      await applyValue(flag, null);
    } else {
      render();
    }
    announce(`${flag.name} removed`);
  });
  removeBtn.classList.add("danger");
  removeBtn.dataset.focusKey = `${flag.id}|remove`;

  const actions = document.createElement("div");
  actions.className = "actions";
  actions.id = `actions-${flag.id}`;
  actions.hidden = true;
  const editBtn = textButton("Edit", () => openForm(flag.id));
  editBtn.dataset.focusKey = `${flag.id}|edit`;
  actions.append(editBtn, removeBtn);

  const menu = document.createElement("button");
  menu.type = "button";
  menu.className = "ghost kebab";
  menu.append(kebabIcon());
  menu.title = "More actions";
  menu.setAttribute("aria-label", `More actions for ${flag.name}`);
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-controls", actions.id);
  menu.dataset.focusKey = `${flag.id}|kebab`;
  menu.addEventListener("click", () => {
    const open = actions.hidden;
    closeMenus();
    actions.hidden = !open;
    menu.setAttribute("aria-expanded", String(open));
  });

  head.append(menu);

  wrap.append(head, seg, actions);
  return wrap;
}

function segButton(label, active, live, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(active));
  if (live) button.classList.add("live");
  button.addEventListener("click", onClick);
  return button;
}

function onSegKeydown(event) {
  const moves = { ArrowLeft: -1, ArrowRight: 1, Home: "first", End: "last" };
  if (!(event.key in moves)) return;
  const buttons = [...event.currentTarget.querySelectorAll("button")];
  const from = buttons.indexOf(document.activeElement);
  if (from === -1) return;
  event.preventDefault();
  const move = moves[event.key];
  let to;
  if (move === "first") to = 0;
  else if (move === "last") to = buttons.length - 1;
  else to = (from + move + buttons.length) % buttons.length;
  for (const button of buttons) button.tabIndex = -1;
  buttons[to].tabIndex = 0;
  buttons[to].focus();
}

function kebabIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("viewBox", "0 0 14 14");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("aria-hidden", "true");
  for (const cy of [2.5, 7, 11.5]) {
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", "7");
    dot.setAttribute("cy", String(cy));
    dot.setAttribute("r", "1.4");
    svg.append(dot);
  }
  return svg;
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
  closeForm();
  closeMenus();
  editingId = id;
  const flag = state.flags.find((f) => f.id === id);
  el.fName.value = flag ? flag.name : "";
  el.fValues.value = flag ? flag.values.join(", ") : "";
  el.fDomain.value = flag ? flag.domain : "";
  el.fSave.textContent = flag ? "Save changes" : "Add flag";
  clearFieldErrors();

  if (flag) {
    const card = el.list.querySelector(`.flag[data-id="${flag.id}"]`);
    if (card) {
      card.classList.add("editing");
      card.append(el.form);
    }
  }

  el.fError.hidden = true;
  el.form.hidden = false;
  const atTop = !el.list.contains(el.form);
  document.body.classList.toggle("form-open", atTop);
  if (atTop) el.list.scrollTop = 0;
  updateScrollHint();
  el.fName.focus();
}

function closeForm() {
  editingId = null;
  el.form.hidden = true;
  el.fError.hidden = true;
  clearFieldErrors();
  document.body.classList.remove("form-open");
  const editing = el.list.querySelector(".flag.editing");
  if (editing) editing.classList.remove("editing");
  if (el.list.contains(el.form)) el.list.before(el.form);
  updateScrollHint();
}

function clearFieldErrors() {
  for (const field of [el.fName, el.fValues, el.fDomain]) {
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  }
}

async function saveFlag(event) {
  event.preventDefault();

  const name = el.fName.value.trim();
  const values = el.fValues.value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const domain = normalizeDomain(el.fDomain.value);

  if (!name) return fail("Add the cookie name.", el.fName);
  if (NAME_INVALID.test(name)) {
    return fail("A cookie name cannot contain spaces, semicolons, commas or equals signs.", el.fName);
  }
  if (!values.length) return fail("Add at least one value, separated by commas.", el.fValues);
  const badValue = values.find((v) => VALUE_INVALID.test(v));
  if (badValue) {
    return fail(`"${badValue}" cannot be a cookie value: no spaces, semicolons, quotes or backslashes.`, el.fValues);
  }
  if (state.flags.some((f) => f.name === name && f.domain === domain && f.id !== editingId)) {
    return fail("That cookie is already in the list.", el.fName);
  }
  if (state.flags.some((f) => f.name === name && f.id !== editingId && sameCookieTarget(f.domain, domain))) {
    return fail(`Another flag already writes ${name} on this site. Edit that one instead.`, el.fDomain);
  }

  const wasEdit = Boolean(editingId);
  if (editingId) {
    state.flags = state.flags.map((f) => (f.id === editingId ? { ...f, name, values, domain } : f));
  } else {
    state.flags.push({ id: crypto.randomUUID(), name, values, domain });
  }

  await persist();
  closeForm();
  announce(wasEdit ? `${name} saved` : `${name} added`);
  render();
}

function sameCookieTarget(a, b) {
  const host = (domain) => (domain ? domain.replace(/^\./, "") : tabUrl.host);
  return host(a) === host(b);
}

function fail(message, field) {
  clearFieldErrors();
  el.fError.textContent = message;
  el.fError.hidden = false;
  if (!field) return;
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", "fError");
  field.focus();
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
        name: f.name.trim(),
        values: f.values
          .filter((v) => typeof v === "string" || typeof v === "number")
          .map((v) => String(v).trim())
          .filter((v) => v && !VALUE_INVALID.test(v)),
        domain: typeof f.domain === "string" ? normalizeDomain(f.domain) : ""
      }))
      .filter((f) => f.name && !NAME_INVALID.test(f.name) && f.values.length);
    const existing = new Set(state.flags.map((f) => `${f.name}|${f.domain}`));
    const fresh = clean.filter((f) => !existing.has(`${f.name}|${f.domain}`));
    state.flags.push(...fresh);
    await persist();
    const skipped = incoming.length - fresh.length;
    announce(
      skipped > 0
        ? `${fresh.length} imported, ${skipped} skipped`
        : `${fresh.length} ${fresh.length === 1 ? "flag" : "flags"} imported`
    );
    render();
  } catch {
    showNotice("That file is not a Flag Switch export. Expected a JSON array of flags.");
  }
  event.target.value = "";
}
