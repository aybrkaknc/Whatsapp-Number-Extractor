# WhatsApp Number Extractor 1.3.0 - Store listing (English)

[Türkçe](listing.tr.md)

## Summary (max 132 characters)
Export phone numbers of WhatsApp Web group members to an Excel-compatible CSV file.

## Description
WhatsApp Number Extractor collects the phone numbers and names of group members shown in WhatsApp Web's "Search participants" list, then exports them as a CSV, vCard or JSON file.

How it works:
1. Open a group on WhatsApp Web and open the "Search participants" list.
2. Click the WA button in the bottom right corner.
3. Press Start, then Auto Scroll to load the full list.
4. Press Finish & DL to save the file, or Copy to Clipboard to copy the numbers.

Features:
- Works in Firefox and Chrome
- Turkish and English interface
- Settings for default country, CSV delimiter, scroll speed, copy format and sound
- CSV, vCard and JSON export, country and unsaved-contacts filters, merging several groups
- E.164, admin and group columns, group name in the file name
- Auto Scroll for large groups, status bar and progress bar
- Excel-compatible CSV (UTF-8 with BOM) with protection against formula injection
- Draggable, minimizable panel and live system logs

Privacy: collected numbers never leave your device. The extension makes no network requests and runs only on web.whatsapp.com. See the privacy policy in the repository.

Use this tool only in line with data protection laws and WhatsApp's terms of service.

## Single purpose (Chrome Web Store)
Export the member list of a WhatsApp Web group that the user has open, to a file on the user's own device.

## Permission justifications (Chrome Web Store)
- **storage:** saves the user's settings (language, default country, CSV delimiter, scroll speed, copy format, sound, export format, one-time notice). Collected numbers are not stored with this permission.
- **Host access to https://web.whatsapp.com/*:** the content script reads the members list and shows the panel only on WhatsApp Web.
- **Remote code:** none. All code ships in the package.

## Data usage disclosure (Chrome Web Store)
- Data handled: names and phone numbers of group members (personally identifiable information), only on the user's device.
- Not sold, not transferred to third parties, not used for purposes unrelated to the single purpose, not used for credit or lending decisions.
- Nothing is sent to the developer or any server.

## What's new in 1.3.0
- Chrome support and a settings window
- vCard and JSON export, country and unsaved-contacts filters, merging several groups
- E.164, admin and group columns; group name in the file name
- Status bar, progress bar, minimize button, tooltips, reduced motion support
- Turkish characters display correctly in Excel
- Scanning stops when the members modal is closed; the collected list is kept
- Many fixes: Auto Scroll after download, log timestamps and colors, duplicate numbers in different formats
