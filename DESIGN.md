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
  signal-white: "#ffffff"
  soft-white: "#e6e9ee"
  error-red: "#f2555a"
  focus-ring: "#7ab0ff"
typography:
  title:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  label:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  caption:
    fontFamily: "IBM Plex Sans, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "11px"
    fontWeight: 400
rounded:
  control: "12px"
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
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.signal-white}"
    padding: "6px 4px"
  segment-live:
    backgroundColor: "{colors.live-green}"
    textColor: "{colors.live-green-ink}"
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
  Save, and the settings switch. Blue marks interface chrome — never what the page is
  doing. Deep enough that white 12px labels pass WCAG AA (4.9:1).

### Secondary
- **Live Green** (#52d273): the live-override signal. The active value pill, the
  outline around a card whose cookie is set, and the toolbar badge. Text on green is
  **Deep Stage Green** (#0f1f14), not white.
- **Error Red** (#f2555a): form validation text only.

### Neutral
- **Graphite Floor** (#17181d): the popup background.
- **Console Panel** (#232529): cards, the add/edit form, notices.
- **Channel Track** (#2c2e34): segmented-control tracks, inputs, the switch track.
- **Hairline** (#3a3d45): outlined pill borders.
- **Signal White** (#ffffff): flag names, button labels, the switch knob.
- **Soft White** (#e6e9ee): everything secondary — hosts, domains, values, labels.
- **Focus Ring** (#7ab0ff): the `:focus-visible` outline.

### Named Rules
**The Two Voices Rule.** Blue speaks for the interface; green speaks for the page.
Never swap them, and never use green decoratively — no badge, pill, or outline is
green unless an override cookie is actually set.

**The Quiet Console Rule.** At rest, nothing saturated is on screen except what is
live. A selected Off is a muted Hairline pill (white on #3a3d45), so a wall of
inactive flags whispers and the one green channel light carries the room.

## Typography

**UI Font:** IBM Plex Sans (400/500/600 woff2, bundled locally in `fonts/`;
system-ui fallback)

**Character:** One engineered voice for everything — Plex's instrument-grade
letterforms fit a console that is literally about flipping switches. Identifiers —
cookie names, hosts, values — read as regular text, not code; there is deliberately
no mono stack. Hierarchy comes from weight and brightness, not from changing faces.

### Hierarchy
- **Title** (600, 13px, -0.01em): flag names, the strongest text on a card.
- **Body** (400, 14px): the base size on `body`; empty states and notices at 13px.
- **Label** (500, 12px): buttons, tabs, segmented values, form inputs and labels.
- **Caption** (400, 11px): domain scopes and group headings; the quietest layer.

### Named Rules
**The No-Code-Voice Rule.** Nothing in the popup is set in a monospace face. A cookie
name is a label, not a code sample.

## Layout

A single 336px-wide column. Cards span the popup minus a 12px gutter on each side and
stack with a 10px gap; the flag list scrolls inside a 400px max height while header,
tabs, and footer stay put. Inside a card: 12px padding, a 10px gap between the name
block and the control row, a 3px gap between name and domain. The segmented control
takes the full row width minus a fixed 26px kebab; segments share the width equally
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
- **Hover lift** (`box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5)`): appears on Save and
  the + button while hovered.
- **Knob shadow** (`box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5)`): seats the switch knob
  on its track.

### Named Rules
**The Flat-At-Rest Rule.** No surface carries a shadow at rest. If an element casts a
shadow, the user's pointer is on it.

## Shapes

Two radii and a circle. Containers — cards, the form, notices — use a soft 16px
corner. Control internals — segmented tracks, inputs — use 12px, with segments at
`calc(12px - 3px)` so the inner pill nests the 3px track padding optically evenly.
Everything action-shaped is a full pill (999px): buttons, tabs, the switch, the +
circle. A live card's green outline is a 1px border on the 16px shape; cards reserve
a transparent 1px border at rest so the outline never shifts layout.

## Components

### Segmented Control (signature)
- **Structure:** a `channel-track` (#2c2e34) strip, 3px padding, 12px radius; one
  button per value plus Off, equal widths, `role="group"` with `aria-pressed`.
- **Off selected:** muted Hairline fill, white label — quiet interface state.
- **Value selected:** Live Green fill, Deep Stage Green label — page state.
- **Idle segments:** transparent with Soft White text; hover tints the segment with
  `rgba(255, 255, 255, 0.07)` and brightens the label to white.
- **Selected hover:** `filter: brightness(1.08)` — still pressable, never inert.

### Buttons
- **Shape:** full pill (999px) in every variant.
- **Primary** (Save): Switch Blue fill, white 12px/500 label, 8px 16px padding;
  hover brightens (1.08) and lifts; active dims (0.95).
- **Outline** (Edit, Remove, Export, Import, Cancel): transparent with a Hairline
  border and white label; hover tints the fill and sharpens the border to Soft White.
- **Icon buttons:** the + is a 28px Switch Blue circle; the kebab (⋮) is a quiet
  ghost that gains the hover tint. Every button compresses to `scale(0.97)` on press
  with a 60ms return — the springy, tactile feel is part of the identity.

### Tabs (This site / All)
- Outlined pills identical to outline buttons at rest; the active tab fills Switch
  Blue with a matching border. Selection is `aria-pressed`, not layout change.

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
- **Do** keep The Two Voices Rule and The Quiet Console Rule: blue for interface
  chrome, muted pills for resting selection, green only when an override cookie is
  genuinely live (pill, card outline, toolbar badge).
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
