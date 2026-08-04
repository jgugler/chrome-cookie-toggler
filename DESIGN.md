---
name: Flag Switch
description: A quiet stage console for flipping a/b test cookies in one click.
colors:
  switch-blue: "#1d6ae8"
  live-green: "#52d273"
  live-green-ink: "#0f1f14"
  graphite-floor: "#17181d"
  console-panel: "#232529"
  channel-track: "#2c2e34"
  hairline: "#3a3d45"
  off-pill: "#4a4f5b"
  signal-white: "#ffffff"
  soft-white: "#e6e9ee"
  error-red: "#f2555a"
  focus-ring: "#7ab0ff"
typography:
  title:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.35
  caption:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.02em"
  icon-glyph:
    fontSize: "16px"
    fontWeight: 400
rounded:
  control: "12px"
  segment: "9px"
  card: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.switch-blue}"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  button-outline:
    textColor: "{colors.signal-white}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  tab-active:
    backgroundColor: "{colors.switch-blue}"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.pill}"
    padding: "5px 14px"
  segment-off-active:
    backgroundColor: "{colors.off-pill}"
    textColor: "{colors.signal-white}"
    padding: "6px 4px"
  segment-live:
    backgroundColor: "{colors.switch-blue}"
    textColor: "{colors.signal-white}"
    padding: "6px 4px"
  card-flag:
    backgroundColor: "{colors.console-panel}"
    rounded: "{rounded.card}"
    padding: "12px"
  input-field:
    backgroundColor: "{colors.channel-track}"
    textColor: "{colors.signal-white}"
    rounded: "{rounded.control}"
    padding: "8px 10px"
---

# Design System: Flag Switch

## Overview

**Creative North Star: "The Stage Console"**

Flag Switch is a backstage mixing desk for a shop's stage environment: a quiet graphite
surface, one labeled channel per flag, and a green channel light whenever a signal is
live on the page in front of you. The mood is calm, technical, precise — a pro tool
that earns trust through economy — and then friendly on top of it: everything you can
press is a soft, fully rounded pill, so the console never intimidates the PM or
merchandiser who was just handed a cookie name.

The popup is dark only. It does not follow the system scheme; the console looks the
same in every dressing room. Color is never decoration — it is signal. Blue says "this
is the interface talking" (selection, actions, settings); green says "the page you are
looking at is running an override right now."

**Key Characteristics:**
- Graphite dark theme only, cards floating on a near-black floor
- Two-voice color system: interactive blue, live-signal green
- Every pressable surface is a pill; every card is softly rounded (16px)
- Tactile, springy controls: tint on hover, compress on press
- One typeface (IBM Plex Sans) at four sizes; hierarchy by weight and brightness

## Colors

A near-black graphite ramp carries the whole surface; two saturated voices sit on top
of it with strictly separated jobs.

### Primary
- **Switch Blue** (#1d6ae8): the interactive accent. Active filter tab, the + button,
  Save, the settings switch, and the selected value pill in the segmented control.
  Blue marks what is selected. Deep enough that white 12px labels pass WCAG AA
  (4.9:1).

### Secondary
- **Live Green** (#52d273): the live-override signal, carried by the LED dot beside a
  live flag's name, the outline around its card, the live bar's border and count, and
  the toolbar badge. **Deep Stage Green** (#0f1f14) remains its ink where green ever
  carries text on a green fill (the badge).
- **Error Red** (#f2555a): form validation text only.

### Neutral
- **Graphite Floor** (#17181d): the popup background.
- **Console Panel** (#232529): cards, the add/edit form, notices.
- **Channel Track** (#2c2e34): segmented-control tracks, inputs, the switch track.
- **Hairline** (#3a3d45): outlined pill borders.
- **Off Pill** (#4a4f5b): the selected Off segment — one step lighter than the hover
  tint so selection and hover never read the same.
- **Signal White** (#ffffff): flag names, button labels, the switch knob.
- **Soft White** (#e6e9ee): everything secondary — hosts, domains, values, labels.
- **Focus Ring** (#7ab0ff): the `:focus-visible` outline.

### Named Rules
**The Two Voices Rule.** Blue speaks for the interface — every selection, including
the selected value pill. Green speaks for the page: the LED dot, the card outline,
the live bar, the badge. Never swap them, and never use green decoratively — nothing
is green unless an override cookie is actually set.

**The Quiet Console Rule.** At rest, nothing saturated is on screen except what is
live. A selected Off is a muted Off Pill (white on #4a4f5b), so a wall of inactive
flags whispers and the one green-outlined channel carries the room.

## Typography

**UI Font:** IBM Plex Sans (400/500/600 woff2, bundled locally in `fonts/`;
system-ui fallback)

**Character:** One engineered voice for everything — Plex's instrument-grade
letterforms fit a console that is literally about flipping switches. Identifiers —
cookie names, hosts, values — read as regular text, not code; there is deliberately
no mono stack. Hierarchy comes from weight and brightness, not from changing faces.

### Hierarchy
- **Title** (600, 13px, lh 1.3): flag names, the strongest text on a card; neutral
  tracking — never negative on the dark surface.
- **Body** (400, 13px, lh 1.45): the base on `body`; empty states and notices
  inherit it. 13px is the deliberate dense-popup base, below the ordinary 16px web
  floor because the surface is a 336px tool, not prose.
- **Label** (500, 12px, lh 1.35): buttons, tabs, segmented values, form inputs and
  labels. The live-bar count sets `tabular-nums` so a changing count never jitters.
- **Caption** (400, 11px, +0.02em): group headings and the Current site label; the
  quietest, smallest layer gets a touch of open tracking to stay legible on graphite.
- **Icon glyph** (400, 16px): text-drawn icon characters only — the + in its circle
  (with the ⋮ kebab at 14px inside the same role); never running text.

### Empty State
- "No flags yet. Add the cookie name your devs sent you, or import their file."
  followed by inline **Add a flag** and **Import** outline pills (add first), so the
  first action never hides in a corner glyph.

### Named Rules
**The No-Code-Voice Rule.** Nothing in the popup is set in a monospace face. A cookie
name is a label, not a code sample.

## Layout

A single 336px-wide column. The header carries a "Current site" caption over the
host (12px/500 Signal White, ellipsized with a title fallback), so the context is
labeled, not implied. Cards span the popup minus a 12px gutter on each side and
stack with a 10px gap; the flag list scrolls inside a 400px max height while header,
tabs, and footer stay put. Cards show no domain line — This site implies it, the All
tab's group headings carry it, ordered by relevance: "Follows the current site"
first, then site-matching domains, then foreign ones. Opening the add form resets the
list's scroll so no card sits clipped beneath it. Inside a card: 12px padding, a 10px
gap between the name block and the control row. The kebab sits in the card head on the name's line;
the segmented control takes the full card width and its value segments share it
equally
and wrap long values (`overflow-wrap: anywhere`) rather than truncating. Base rhythm
steps are 4 / 8 / 12 / 16px. The list wears scroll shadows (surface-covered radial
gradients with `background-attachment: local`) so a clipped card is perceivable, and
caps at 220px while the add form is open so header, form and footer share the popup
without the frame itself scrolling.

## Elevation & Depth

Flat at rest. Depth is conveyed by the graphite ramp itself — floor, panel, track are
three lightness steps of the same near-black — plus a hairline border where a shape
needs an edge on the panel. Shadows exist only as a response to state.

### Shadow Vocabulary
- **Hover lift** (`box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5)`): appears on primary
  buttons while hovered.
- **Menu float** (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5)`): under the open
  settings menu only.
- **Knob shadow** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5)`): seats the switch knob
  on its track.

### Named Rules
**The Flat-At-Rest Rule.** No surface carries a shadow at rest. If an element casts a
shadow, the user's pointer is on it or they just opened it.

## Shapes

Two radii and a circle. Containers — cards, the form, notices — use a soft 16px
corner. Control internals — segmented tracks, inputs, the settings menu — use 12px.
Nested shapes subtract their container's padding from its radius: segments sit on the
9px `--radius-segment` token (`calc(var(--radius) - 3px)` inside the 3px track) and
settings-menu items on the 6px `--radius-menu-item` token (`calc(var(--radius) - 6px)`
inside the 6px-padded menu), so inner corners nest optically evenly.
Everything action-shaped is a full pill (999px): buttons, tabs, the switch, the +
circle. A live card's green outline is a 1px border on the 16px shape; cards reserve
a transparent 1px border at rest so the outline never shifts layout.

## Components

### Segmented Control (signature)
- **Structure:** a `channel-track` (#2c2e34) strip, 3px padding, 12px radius; one
  button per value plus Off, equal widths, `role="group"` with `aria-pressed`.
- **Off selected:** muted Off Pill fill, white label — quiet interface state.
- **Off placement:** Off is a narrow fixed-width segment (content-sized, 14px side
  padding) separated from the values by a 1px Hairline divider — an exit beside the
  choices, not a peer of them. Values share the remaining width equally.
- **Value selected:** Switch Blue fill, white label; the page state itself shows as
  the card's Live Green outline and LED.
- **Idle segments:** transparent with Soft White text; hover tints the segment with
  `rgba(255, 255, 255, 0.07)` and brightens the label to white.
- **Selected hover:** `filter: brightness(1.08)` — still pressable, never inert.

### Buttons
- **Shape:** full pill (999px) in every variant.
- **Primary** (Save): Switch Blue fill, white 12px/500 label, 8px 16px padding;
  hover brightens (1.08) and lifts; active dims (0.95).
- **Outline** (Edit, Remove, Export, Import, Cancel): transparent with a Hairline
  border and white label; hover tints the fill and sharpens the border to Soft White.
- **Add flag:** the primary pill lives in the header — the one filled call to action
  on a resting popup.
- **Icon buttons:** the kebab (⋮ text glyph) and the footer's settings gear (authored
  inline SVG, stroke `currentColor`) are quiet 28px ghosts that gain the hover tint.
  Every button compresses to `scale(0.97)` on press with a 60ms return — the springy,
  tactile feel is part of the identity.

### Tabs (This site / All)
- Outlined pills identical to outline buttons at rest; the active tab fills Switch
  Blue with a matching border. Selection is `aria-pressed`, not layout change.

### Settings Menu
- The gear in the footer discloses a small floating menu (Console Panel fill,
  Hairline border, 12px radius, `0 4px 12px` shadow) anchored above it, holding
  Export and Import as quiet left-aligned items. Click-away and Escape close it;
  state is carried by `aria-expanded`/`aria-controls`.

### Live Bar
- A green-outlined pill-shaped strip between list and footer, present only when at
  least one override is live on the site: "N live on this site" in Live Green at
  12px/500, with an **All off** outline pill on the right (error-red text). One click
  removes every live override cookie at once — no confirmation; unlike Remove, this
  destroys no definitions, and re-applying an override costs one click.

### LED (channel light)
- A 6px Live Green dot before a live flag's name, `aria-hidden`, paired with a
  visually hidden " live" suffix in the name for screen readers. The dot never
  appears without a set cookie.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** Console Panel on the Graphite Floor.
- **Border:** 1px transparent at rest; 1px Live Green when the flag's cookie is set.
- **Shadow Strategy:** none (see The Flat-At-Rest Rule).
- **Internal Padding:** 12px; editing swaps the card's content for the form in place.

### Inputs / Fields
- **Style:** Channel Track fill, no visible border (1px transparent), 12px radius,
  8px 10px padding, white text at 13px.
- **Focus:** the global 2px Focus Ring outline, offset 1px.
- **Error:** message line below in Error Red at 12px; fields themselves stay calm.

### Switch (Reload on change)
- 34×20px pill track in Channel Track; 14px Signal White knob with the knob shadow.
- Checked: track fills Switch Blue, knob slides 14px. 150ms ease on both.

## Do's and Don'ts

### Do:
- **Do** route every color through the CSS custom properties at the top of
  `popup.css`; the only hardcoded mirror allowed is the badge pair in `background.js`.
- **Do** keep The Two Voices Rule and The Quiet Console Rule: blue for selection and
  interface chrome, muted pills for a selected Off, green only when an override
  cookie is genuinely live (card outline, toolbar badge).
- **Do** give every new control the pill treatment, the hover tint
  (`rgba(255, 255, 255, 0.07)`), and the `scale(0.97)` press.
- **Do** keep `aria-pressed` on stateful buttons, the visible `:focus-visible`
  outline on everything, focus restoration across list re-renders (`data-focus-key`),
  and a polite live-region announcement for every state change.

### Don't:
- **Don't** introduce a light theme or follow `prefers-color-scheme`; the console is
  dark only.
- **Don't** use a monospace face anywhere — identifiers read as labels.
- **Don't** add shadows to resting surfaces or decorative uses of Live Green.
- **Don't** truncate values in the segmented control; wrap them.
- **Don't** widen the popup beyond 336px or move the flag list's scroll boundary.
