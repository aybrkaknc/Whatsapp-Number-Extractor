# WhatsApp Number Extractor 1.3.0 - Store listing (English)

## Summary (max 132 characters)
Export phone numbers of WhatsApp Web group members to an Excel-compatible CSV file.

## Description
WhatsApp Number Extractor collects the phone numbers and names of group members shown in WhatsApp Web's "Search participants" list, then exports them as a CSV file.

How it works:
1. Open a group on WhatsApp Web and open the "Search participants" list.
2. Click the WA button in the bottom right corner.
3. Press Start, then Auto Scroll to load the full list.
4. Press Finish & DL to save the CSV, or Copy to Clipboard to copy the numbers.

Features:
- Works in Firefox and Chrome
- Turkish and English interface
- Auto Scroll for large groups
- Excel-compatible CSV (semicolon separator, UTF-8 with BOM)
- Protection against spreadsheet formula injection in exported values
- Draggable panel and live system logs

Privacy: the extension sends no data to any server. Everything runs in your browser on web.whatsapp.com only. See the privacy policy in the repository.

Use this tool only in line with privacy laws and WhatsApp's terms of service.

## What's new in 1.3.0
- Chrome support
- English and Turkish extension name and description
- Scanning stops when the members modal is closed; the collected list is kept and can still be downloaded
- Fixed: Auto Scroll needed two clicks after a download
- Fixed: log timestamps changed when switching language
- CSV values are quoted and protected against formula injection
- Help pages updated to match the interface
