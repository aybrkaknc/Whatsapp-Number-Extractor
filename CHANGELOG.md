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
- Export as vCard (.vcf) or JSON, country filter for export and copy
- Merge several groups into one list with "Scan another group", new Group column
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
