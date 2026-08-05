# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Shop-team members on e-commerce stage environments, devs and non-devs in equal measure.
Developers switch their own test cookies while building features; PMs, QA and
merchandisers check variants using cookie names a dev handed them. The popup must stay
friendly enough for someone who has never opened DevTools and fast enough for someone
who lives there.

## Product Purpose

Flag Switch is a Chrome extension (Manifest V3) that switches a/b test cookies on stage
sites in one click. A flag is a registered cookie name with its accepted values; the
popup renders it as a segmented Off/value control. Success means anyone on the team can
flip a variant and see the page change without touching DevTools, and can tell at a
glance, via the green state and the toolbar badge, whether an override is live on the
site in front of them.

## Positioning

Unlike generic cookie editors, Flag Switch works from a curated flag list: devs hand
over a cookie name and its legal values once, and from then on switching is one click
with no free-text cookie editing, no wrong values, and no hunting through cookie tables.

## Operating Context

- Used on stage/test environments, not production.
- Devs distribute flag definitions to the team; the JSON export/import exists so a
  ready-made set can be shared instead of a list in a chat message.
- Flags live in `chrome.storage.sync`, so they follow the user's Chrome profile.
- The toolbar badge counts overrides live on the current site; the This site / All
  tabs scope the list to the tab's host or show everything grouped by domain.

## Capabilities and Constraints

- Manifest V3. Permissions stay minimal: `cookies` and `storage` plus http/https
  host permissions (no `tabs`). Distributed as an unpacked folder and packaged for
  the Chrome Web Store; future work must keep permissions minimal and
  store-review-friendly.
- No build step, no dependencies, no frameworks: plain HTML, CSS and JS loaded
  directly by Chrome.
- No network calls. The extension talks to `chrome.cookies` and `chrome.storage`
  only; assets like fonts are bundled locally.
- MV3 CSP: no inline scripts or styles; no `innerHTML` with dynamic content.
- Stored data shape (`flagSwitch` key) changes require a migration path, existing
  installs hold data.
- Cookie behavior: path `/`, 90-day lifetime, `secure` on https, Off removes the
  cookie rather than writing an empty value.

## Brand Commitments

- Name: Flag Switch.
- The repo is public: docs and code stay company-neutral, with no internal tool
  names, domains or company references. Examples use `example.com`-style hosts.

## Product Principles

- One click beats DevTools: switching a variant is the whole job, keep it instant.
- State must be glanceable: whether an override is live on the current site is always
  visible without reading, in the popup and on the toolbar icon.
- Nothing leaves the browser: no telemetry, no network, no external services.
- Curated over free-form: flags encode the legal values so users cannot mistype one.
- Respect existing installs: data-shape changes ship with migrations.

## Accessibility & Inclusion

Keyboard operability and visible focus (`:focus-visible`) are established commitments;
the segmented control exposes state via `role="group"` and `aria-pressed`. Future work
preserves both.
