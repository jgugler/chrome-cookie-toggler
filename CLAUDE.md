# CLAUDE.md

## What this is

Flag Switch, a Chrome extension (Manifest V3) for switching a/b test cookies on stage
environments. Devs hand over a cookie name and its accepted values, for example
`checkout-ab` with `a` and `b`. The popup stores that flag and renders a segmented
control so the value can be switched in one click.

Built for shop teams testing feature variants on stage environments. Not published to
the Chrome Web Store, distributed as an unpacked folder.

## Constraints, do not break these

- **No build step and no dependencies.** Plain HTML, CSS and JS, loaded directly by Chrome.
  Do not introduce npm, bundlers, TypeScript or frameworks unless explicitly asked.
- **Manifest V3.** Permissions stay minimal: `cookies`, `storage`, `tabs` plus http and
  https host permissions. Do not add permissions without asking.
- **No network calls.** The extension talks to `chrome.cookies` and `chrome.storage` only.
  Nothing leaves the browser.
- **No inline scripts or styles** in `popup.html`, MV3 CSP forbids them.
- **No `innerHTML` with dynamic content.** The popup builds DOM nodes in `popup.js`.

## Files

| File | Role |
| --- | --- |
| `manifest.json` | MV3 manifest, permissions, action popup, background worker, icons |
| `background.js` | Service worker: keeps the toolbar badge in sync with live overrides |
| `popup.html` | Popup markup: header, add and edit form, flag list, footer |
| `popup.css` | All styles, CSS custom properties, dark theme only |
| `popup.js` | All logic: storage, cookie read and write, rendering, export and import |
| `icons/` | Generated 16, 48 and 128 px PNGs |
| `fonts/` | IBM Plex Sans woff2 (400/500/600) plus its OFL license, loaded via `@font-face` |

## Data model

Flags are stored in `chrome.storage.sync` under the key `flagSwitch`:

```js
{
  autoReload: true,
  flags: [
    { id: "uuid", name: "checkout-ab", values: ["a", "b"], domain: "" }
  ]
}
```

`domain` empty means the cookie is written host only for the current tab. A value like
`.stage.example.com` writes it across subdomains. Any change to this shape needs a migration
path, existing installs already hold data.

## Cookie behaviour and defaults

- Path is always `/`.
- Lifetime is `COOKIE_DAYS` in `popup.js`, currently 90 days, so flags survive a restart.
- `secure` is set when the page is https.
- Off removes the cookie via `chrome.cookies.remove`, it does not write an empty value.
- Remove asks once (the button flips to a filled Remove?), and removing a flag whose
  cookie is live also removes the cookie, so no override outlives its flag.
- On non-http pages the list and add form are unavailable, but Export, Import and the
  reload toggle stay functional.
- After any change the tab reloads if `autoReload` is on.
- The Domain field normalizes pasted URLs via `normalizeDomain` in `popup.js`, on field
  change and again on save: it keeps the hostname, drops protocol, port, path, query and
  casing, preserves a typed leading dot, and leaves input alone that does not parse to a
  plausible hostname.
- The list has two filter tabs. This site (default) shows flags with no domain plus
  flags whose domain matches the tab's host or a parent of it. All shows every flag,
  grouped by domain: the domain-less group is labeled with the current host and sorts
  first, the rest alphabetically. Grouped cards skip their own domain line, the group
  heading carries it. The choice is per popup open, it is not persisted.
- Live flags carry a green LED dot beside the name (with a visually hidden "live" for
  screen readers) plus the green card outline. A live bar between list and footer
  shows "N live on this site" with an All off button that removes every live override
  cookie at once in a single click, no confirmation, overrides are cheap to re-apply.
  It only renders when something is live. Off is a narrow fixed-width segment separated from the values by a hairline
  divider. The empty state offers Add a flag and Import pills inline.
- The toolbar badge shows how many flag cookies are live for the site in the active
  tab. Only flags whose domain matches the tab's host (or a parent of it) count,
  same matching rule as the This site tab. Computed per tab in `background.js` on tab
  switch, navigation, cookie and storage changes. No badge means no override is live
  on the site in front of you.

## Design language

Minimal and disciplined, graphite dark theme only, the popup does not follow the system
scheme. Everything comes from the CSS custom properties at the top of `popup.css`, no
hardcoded colors in rules (the badge colors in `background.js` mirror `--live`).

- All text is IBM Plex Sans (weights 400/500/600), bundled locally in `fonts/` so the
  no-network rule holds, with the system stack as fallback. There is no mono stack,
  identifiers read as regular text.
- Two accent colors with distinct meanings. Blue (`--accent`, `#1d6ae8`) marks
  selection and interface chrome: active filter tab, the + button, Save, the switch,
  and the selected value pill in the segmented control. Green (`--live`, `#52d273`)
  means an override is live on the page in front of you, carried by the LED dot
  beside the flag name, the card outline, the live bar, and the toolbar badge. Do not
  mix the two meanings.
- A selected Off is a muted pill (`--off-pill`, `#4a4f5b`), deliberately a step
  lighter than the hover tint so selection and hover never read the same. The resting
  popup stays quiet; green appears only when something is live.
- Focus is always visible via `:focus-visible`, and it survives re-renders: per-flag
  controls carry a `data-focus-key` that `render()` restores after rebuilding the list.
- State changes are announced through the polite live region `#status` (value set,
  override removed, flag added/saved/removed, import count).
- Segmented control uses `role="group"` with `aria-pressed` per button.

## Testing

There is no test runner. Manual loop:

1. `chrome://extensions`, Developer mode on, Load unpacked, pick this folder.
2. After editing, hit the reload icon on the extension card, then reopen the popup.
   CSS and HTML changes need the popup reopened, `popup.js` changes need the card reload.
3. Check the popup on an https stage page and on a plain http page.
4. Verify against DevTools, Application, Cookies, that name, value, domain and path match.
5. Errors from the popup surface in its own console: right click the popup, Inspect.

Sanity check before handing anything over: `node --check popup.js`.

## Open items

- [ ] Per flag `SameSite`, currently unset, so Chrome treats it as Lax
- [ ] Per flag path, currently hardcoded to `/`
- [ ] Per flag session only lifetime instead of the global 90 days
- [ ] Reorder flags, the list follows insertion order
- [ ] Group flags by team or by project so the popup stays readable past ten or so entries
- [ ] Keyboard shortcut to cycle a flag without opening the popup
