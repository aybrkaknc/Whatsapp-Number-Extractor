# Changelog

## v1.3.0

### Added or Changed
- Chrome support
- English and Turkish extension name and description
- Scanning stops when the members modal is closed; the collected list is kept and can be downloaded
- Country detection by calling code, shown as a localized country name such as "Germany (+49)"
- The help button uses a gear icon and the Telegram button is replaced by a GitHub button that opens the repository
- Status bar with scan phase and collected / total count, progress bar when WhatsApp shows the participant count
- Minimize button, Esc closes the panel, tooltips on icon buttons, reduced motion support
- Settings window behind the gear, saved with the new "storage" permission: language, country for local numbers, CSV delimiter, scroll speed, copy format and sound
- Export as vCard (.vcf) or JSON; filters for export and copy: a country and/or only contacts not saved in your phone
- Merge several groups into one list with "Scan another group", new Group column
- Auto Scroll stays smooth while new rows load: scanning runs when the browser is idle, the status box, log and saved list are updated once per batch instead of per number, and the log keeps its last 300 lines
- Auto Scroll now scrolls the list continuously and eases in, instead of jumping a screen at a time. The speed setting is in list heights per second (slow 0.4, normal 0.7, fast 1.2)
- Auto Scroll now scrolls the list continuously and eases in, instead of jumping a screen at a time. The speed setting is in list heights per second (slow 0.4, normal 0.7, fast 1.2)
- One animation system for the whole panel: shared durations and step easings, views that slide in, minimize, staggered buttons, a progress bar that fills in steps, flashing status box, sliding notices and log lines; new Animations setting (follow the system, always on, off). See docs/ANIMATIONS.md
- Fixed: closing and quickly reopening the panel could hide it again
- The panel now starts in English instead of following the WhatsApp page language; the language you pick is remembered
- One-time notice in the panel about privacy and WhatsApp terms
- Store screenshots, promo tile and README screenshot; CI with tests, lint, build and tagged releases; version sync script
- Optional: keep the collected list across page reloads in the same tab
- CSV has E.164 and Admin columns, the file name includes the group name, and a country summary is logged on export
- Store listings in English and Turkish (store/)
- README, privacy policy and license in English and Turkish

### Fixed
- Auto Scroll needed two clicks after a download
- Turkish characters showed as "TÃ¼rkiye" in Excel; the CSV no longer has a "sep=" line
- Log timestamps changed when switching language
- CSV values are quoted, escaped and protected against formula injection
- The same number in different formats is collected once
- Auto Scroll steps by screen height and stops at the end of the list
- Errors show in the status box instead of browser alerts
