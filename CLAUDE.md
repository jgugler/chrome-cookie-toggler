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
| `popup.css` | All styles, CSS custom properties, light and dark via `prefers-color-scheme` |
| `popup.js` | All logic: storage, cookie read and write, rendering, export and import |
| `icons/` | Generated 16, 48 and 128 px PNGs |

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
- After any change the tab reloads if `autoReload` is on.
- The list has two filter tabs. This site (default) shows flags with no domain plus
  flags whose domain matches the tab's host or a parent of it. All shows every flag.
  The choice is per popup open, it is not persisted.
- The toolbar badge shows how many registered flag cookies exist on the active tab,
  computed per tab in `background.js` on tab switch, navigation, cookie and storage
  changes. No badge means no override is live.

## Design language

Minimal and disciplined. Everything comes from the CSS custom
properties at the top of `popup.css`, no hardcoded colors in rules.

- Cookie names, values and hosts are set in the mono stack, they are identifiers.
- Off reads neutral. An active variant is filled with the coral accent (`--accent`,
  `#ee5a5f` light, `#f2605e` dark), the coral means an override is live on the page in
  front of you. Keep that meaning intact, do not use the accent for anything decorative.
- Focus is always visible via `:focus-visible`.
- Segmented control uses `role="group"` with `aria-pressed` per button.

## Testing

There is no test runner. Manual loop:

1. `chrome://extensions`, Developer mode on, Load unpacked, pick this folder.
2. After editing, hit the reload icon on the extension card, then reopen the popup.
   CSS and HTML changes need the popup reopened, `popup.js` changes need the card reload.
3. Check the popup in light and dark, on an https stage page and on a plain http page.
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
