# WhatsApp Number Extractor

[Türkçe](README.tr.md)

A browser extension for Firefox and Chrome that collects member phone numbers from WhatsApp Web group chats.
It has a Windows 98 themed interface.

## Installation

### Firefox Add-ons (recommended)
[WhatsApp Number Extractor on Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/whatsappnumberextractor/)

### Manual installation - Firefox
1. Clone the repository:
   ```bash
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Open `about:debugging` in Firefox.
3. Click **This Firefox**.
4. Click **Load Temporary Add-on...** and select `manifest.json`.

### Manual installation - Chrome
1. Clone the repository (see above).
2. Open `chrome://extensions` in Chrome.
3. Turn on **Developer mode**.
4. Click **Load unpacked** and select the project folder.

## Features

- **Retro UI** - Windows 98 theme powered by scoped `98.css`.
- **One-click extraction** - Open the "Search participants" modal and press Start.
- **Auto Scroll** - Scans long member lists automatically.
- **Excel-compatible export** - CSV with Country, Name and Phone columns (`;` delimiter, UTF-8). Values are escaped against formula injection.
- **Draggable window** - Move the panel anywhere on the screen.
- **Bilingual** - Switch between Turkish and English at any time.
- **System logs** - Follow the extraction process in real time.

## Usage

1. Open [WhatsApp Web](https://web.whatsapp.com).
2. Enter a group chat.
3. Click the group header and open the **Search participants** modal.
4. Click the **WA** button in the bottom right corner.
5. Press **Start**.
6. (Optional) Use **Auto Scroll** to scan the whole list.
7. Press **Finish & DL** to save the CSV file.

If the modal is closed during a scan, the scan stops and the collected numbers are kept. Press **Finish & DL** to download them.

## Development

```bash
npm install
npm start
npm run start:chrome
npm run lint
npm run build
```

## Privacy

The extension sends no data anywhere. See [PRIVACY.md](PRIVACY.md).

Use this tool only in line with privacy laws and WhatsApp's terms of service.

## Contact

Telegram: [@aybrkaknc](https://t.me/aybrkaknc)

## License

[MIT](LICENSE)
