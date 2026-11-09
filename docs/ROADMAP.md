# Improvement Plan

[Türkçe](ROADMAP.tr.md)

Plan for version 1.3.x and later, based on a code and UI review of 1.3.0. Check items off as they ship. IDs are stable so commits and issues can refer to them.

## 1. Verified bugs

- [x] **B1** Finish & DL searches the list in non-silent mode, so a closed modal logs a red "list area not found" error. Fix: `findActiveScrollContainer(true)` in `src/ui/actions.js` (reset block of the stop handler).
- [x] **B2** `createUI` adds `mousemove` and `mouseup` listeners to `document` on every call and never removes them. Fix: bind once or use an `AbortController` (`src/ui/window.js`).
- [x] **B3** `alert()` blocks the page and breaks the retro feel. Fix: inline messages in the status box (`src/ui/actions.js`).
- [x] **B4** A new `AudioContext` is created for every completion and never closed. Fix: close it or reuse one (`src/ui/actions.js`).
- [x] **B5** Icon-only buttons (gear, GitHub, close) have no tooltip. Fix: set `title` per language in `updateUITexts` (`src/ui/texts.js`).
- [ ] **B6** The gear icon opens the help page, which suggests settings. Fix: see F1.
- [x] **B7** `web_accessible_resources` matches all of `*.whatsapp.com`, but the content script only runs on `web.whatsapp.com`. Fix: narrow to `https://web.whatsapp.com/*` (`manifest.json`).

## 2. Code logic and robustness

- [x] **L1** Replace the generated class selector `.x1n2onr6.x1n2onr6.xupqr0c` with structure based detection (`role="dialog"` containing `role="listitem"`), and log which selector matched.
- [x] **L2** Batch the `MutationObserver` rescans with `requestAnimationFrame`.
- [x] **L3** Deduplicate numbers by digits only, so `+90 532 111 22 33` and `+905321112233` count once.
- [x] **L4** Auto scroll: step by `clientHeight` and stop when `scrollTop + clientHeight >= scrollHeight` instead of waiting five stuck ticks.
- [ ] **L5** Add a default country setting for local numbers that start with 0 (currently always Turkey).
- [x] **L6** Separate warning and error levels, so non-critical cases do not turn the status box red.
- [x] **L7** Reset timers and state when the panel is re-created.
- [x] **L8** Pure functions (`detectCountry`, `csvCell`, name parsing) get unit tests with the built-in `node:test` (only when requested).
- [x] **L9** Rename `feedback` identifiers to `help` (`logFeedbackOpen`, `wa-ext-btn-feedback`).

## 3. Visual and interaction

- [x] **V1** Tooltips and keyboard focus outlines for all buttons (see B5).
- [x] **V2** Status bar (98.css `status-bar`): collected / total.
- [x] **V3** Progress bar (98.css `progress-indicator`) from the participant count in the modal title.
- [x] **V4** Minimize button that collapses the panel to its title bar.
- [x] **V5** Disable Copy and Finish while there are no numbers, instead of an alert.
- [ ] **V6** Mute option for the completion sound.
- [x] **V7** Respect `prefers-reduced-motion`.
- [x] **V8** `aria-live="polite"` on the status box, Esc closes the panel.
- [x] **V9** Limit panel width to 90vw on narrow screens.

## 4. Feature ideas

| ID | Feature | Value | Effort |
|---|---|---|---|
| F1 | Real settings window behind the gear: remembered language, default country, CSV delimiter, sound, scroll speed. Help link inside. | High | Medium |
| F2 | E.164 column (`+905321112233`) for CRM and imports. | High | Low |
| F3 | Group name in the file name (`wa_<group>_<date>.csv`). | Medium | Low |
| F4 | vCard (.vcf) and JSON export. | Medium | Medium |
| F5 | Admin column (admin tags are skipped today). | Medium | Low |
| F6 | Merge several groups in one session and drop duplicates. | High | Medium |
| F7 | Filters: only unsaved contacts, selected countries. | Medium | Medium |
| F8 | Country summary before download ("Germany: 12"). | Low | Low |
| F9 | Keep the collected list across a page reload (`sessionStorage` only). | Low | Medium |
| F10 | Copy format choice: one per line or comma separated. | Low | Low |

## 5. Release, security and process

- [ ] **R1** Store risk: Chrome Web Store reviews data collection strictly. State the purpose and that data stays on the device in the listing.
- [ ] **R2** One-time notice in the panel about privacy and WhatsApp terms (informational).
- [ ] **R3** Store assets: 1280x800 screenshots, small promo tile, product screenshot for the README template.
- [ ] **R4** GitHub Actions: `web-ext lint` and `web-ext build`, attach the zip to tagged releases.
- [ ] **R5** One script that keeps `manifest.json` and `package.json` versions in sync.
- [ ] **R6** `.gitattributes` with `* text=auto eol=lf` to stop the LF/CRLF warnings.
- [ ] **R7** Chrome manual test (load unpacked) for every step of the checklist.

## 6. Order of work

1. **Now (low effort):** B1, B5, B7, B4, F2, F3, R6.
2. **Next:** B2, B3, L3, L1, V2, V3, F1.
3. **Later:** F4, F6, F7, R3, R4, L8, R1.

## Not verified

- Appearance inside WhatsApp Web and Firefox (checked only in a local preview).
- Selector durability against the current WhatsApp DOM.
- The `AudioContext` limit differs per browser, so B4 is an estimate.
