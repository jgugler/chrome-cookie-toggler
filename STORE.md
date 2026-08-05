# Chrome Web Store submission notes

Everything the Developer Dashboard asks for, ready to paste. The package itself is
built with the zip command in the README ("Publish" section).

## Listing

- **Name:** Flag Switch
- **Summary** (from the manifest, 86/132 chars): Set test cookies on the current site
  and switch their values from a segmented control.
- **Category:** Developer Tools
- **Language:** English

**Description:**

> Flag Switch is for teams that test feature variants on stage environments with
> a/b test cookies.
>
> A developer registers a flag once: the cookie name and the values it accepts.
> From then on, switching is one click on a segmented Off/value control — no
> DevTools, no typing cookie values by hand, no wrong values.
>
> - Green means live: a LED dot, a card outline and a toolbar badge show at a
>   glance whether an override is active on the site in front of you.
> - The badge counts the overrides live on the current site.
> - "All off" removes every override on the site in one click.
> - Flags can be scoped to a host or a whole domain, exported as JSON and
>   imported by teammates.
> - The page reloads automatically after a change (can be turned off).
>
> Flag Switch talks only to Chrome's cookie and storage APIs. Nothing leaves
> your browser: no tracking, no analytics, no network requests.

**Screenshots:** 1280×800 or 640×400 PNG. Suggested shots: the popup with one live
flag (badge visible), the All tab with domain groups, the add form.

## Single purpose

> Flag Switch sets, switches and removes developer-defined test cookies (feature
> flags) on the website in the active tab, and shows whether such an override is
> currently active.

## Permission justifications

- **cookies** — the core function: reading, setting and removing the a/b test
  cookies the user has registered as flags. Cookies are only ever read or written
  by name, for flags the user created.
- **storage** — stores the user's flag list (cookie name, accepted values,
  optional domain) in `chrome.storage.sync` so it follows their Chrome profile.
- **Host permissions (http/https)** — the user chooses which site to set a test
  cookie on simply by having it open; stage environments live on arbitrary
  customer-specific domains, so the extension cannot enumerate them in advance.
  Host access is used exclusively for the cookies API and to read the active
  tab's URL to scope the flag list and the badge. No page content is read,
  no scripts are injected.
- **Remote code:** none. All code ships in the package; the extension makes no
  network requests of any kind (the font is bundled).

## Privacy / data usage declaration

- Collects **no** user data: no personally identifiable information, no
  health/financial/authentication/communication data, no location, no web
  history, no user activity, no website content.
- Nothing is transmitted anywhere; there is no server. All state lives in
  `chrome.storage.sync` under the user's own Chrome profile.
- Privacy policy URL: https://github.com/jgugler/flag-switch#privacy

## Pre-flight checklist

- [x] Manifest V3, no remote code, no inline scripts
- [x] Permissions minimal: `cookies`, `storage` + host permissions (no `tabs`)
- [x] 16/48/128 px icons in the package, 128 required by the store
- [x] Bundled font ships with its OFL license (`fonts/LICENSE.txt`)
- [x] No console output, no eval, no innerHTML with dynamic content
- [ ] Test the zip via chrome://extensions → "Load unpacked" on the unzipped folder
      once more after packing
- [ ] Screenshots taken (1280×800), listing text pasted, justifications pasted
- [ ] Developer account has 2FA and the one-time $5 registration fee paid
