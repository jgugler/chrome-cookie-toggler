# Flag Switch

A small Chrome extension for switching test cookies on stage. Paste in a cookie name, list the values it accepts, and flip between them from a segmented control.

## Install

1. Unzip the folder somewhere permanent, it stays on disk while the extension is installed.
2. Open `chrome://extensions` and turn on Developer mode.
3. Click "Load unpacked" and pick the `flag-switch` folder.
4. Pin it to the toolbar.

## Use

1. Open the stage page you want to test.
2. Click the icon, then `+`.
3. Cookie name: `checkout-ab`. Values: `a, b`. Domain: leave empty.
4. The flag appears with an `Off | a | b` control. Click a value to set the cookie, click Off to delete it.

Off is neutral, an active variant is accent red, so you can see at a glance whether an override is live on the page you are looking at.

## Behaviour and defaults

- **Scope.** With Domain empty, the cookie is written for the exact host of the current tab, on path `/`. Fill in Domain, for example `.stage.example.com`, if the app reads the cookie across subdomains.
- **Lifetime.** 90 days, so it survives a browser restart. Change `COOKIE_DAYS` in `popup.js` if you want session only behaviour.
- **Secure.** Set automatically when the page is https.
- **Reload on change.** On by default, toggle in the footer.
- **Storage.** Flags live in `chrome.storage.sync`, so they follow your Chrome profile.

## Sharing with the team

Export writes a `flag-switch.json` with the flag list. Anyone with the extension can import it, duplicates by name and domain are skipped. Handy if the devs want to hand over a ready made set instead of a list in a chat message.
