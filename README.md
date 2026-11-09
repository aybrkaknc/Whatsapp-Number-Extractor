<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor">
    <img src="icon/icon-96.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">WhatsApp Number Extractor</h3>

  <p align="center">
    Export the phone numbers of WhatsApp Web group members to an Excel-compatible CSV file.
    <br />
    <a href="https://addons.mozilla.org/en-US/firefox/addon/whatsappnumberextractor/"><strong>Get it on Firefox Add-ons</strong></a>
    <br />
    <br />
    <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor/issues/new?labels=bug">Report Bug</a>
    &middot;
    <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#firefox">Firefox</a></li>
        <li><a href="#chrome">Chrome</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#development">Development</a></li>
    <li><a href="#privacy">Privacy</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<p align="center"><a href="README.tr.md">Türkçe</a></p>

## About The Project

WhatsApp Number Extractor is a Firefox and Chrome extension. It reads the member list of a WhatsApp Web group and exports the names and phone numbers as a CSV file. The interface is a Windows 98 style panel with Turkish and English language support.

Features:
* One-click extraction from the "Search participants" list
* Auto Scroll for large groups
* Excel-compatible CSV export (semicolon separator, UTF-8 with BOM, formula injection protection)
* Copy numbers to the clipboard
* Export as CSV, vCard (.vcf) or JSON, optionally only one country
* Merge several groups into one list (with a Group column)
* Optionally keep the list when the page reloads (cleared when the tab closes)
* Draggable panel and live system logs
* Turkish and English interface
* Settings (gear): country for local numbers, CSV delimiter, scroll speed, copy format and sound, saved in the browser

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* Vanilla JavaScript (content script, no build step)
* [98.css](https://jdan.github.io/98.css/)
* WebExtensions Manifest V3

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

### Firefox

Install from [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/whatsappnumberextractor/), or load it manually:

1. Clone the repository
   ```sh
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Open `about:debugging` in Firefox and click **This Firefox**
3. Click **Load Temporary Add-on...** and select `manifest.json`

### Chrome

1. Clone the repository (see above)
2. Open `chrome://extensions` and turn on **Developer mode**
3. Click **Load unpacked** and select the project folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

1. Open [WhatsApp Web](https://web.whatsapp.com) and enter a group chat
2. Click the group header and open the **Search participants** modal
3. Click the **WA** button in the bottom right corner
4. Press **Start**
5. (Optional) Press **Auto Scroll** to scan the whole list
6. Press **Finish & DL** to download the CSV, or **Copy to Clipboard** to copy the numbers

If the modal is closed during a scan, the scan stops and the collected numbers are kept. Press **Finish & DL** to download them, or open another group and press **Scan another group** to add its members to the same list.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Development

```sh
npm install
npm start           # Firefox with hot reload
npm run start:chrome
npm run lint
npm test
npm run build
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Privacy

The extension sends no data to any server. See [PRIVACY.md](PRIVACY.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- [x] Chrome support
- [x] Turkish and English interface
- [x] CSV formula injection protection
- [ ] Chrome Web Store release
- [ ] Automated tests for the scanning logic

See [CHANGELOG.md](CHANGELOG.md) for release history.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome. If you have a suggestion, fork the repo and open a pull request, or open an issue with the tag "enhancement".

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Telegram: [@aybrkaknc](https://t.me/aybrkaknc)

Project Link: [https://github.com/aybrkaknc/Whatsapp-Number-Extractor](https://github.com/aybrkaknc/Whatsapp-Number-Extractor)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

* [98.css](https://jdan.github.io/98.css/) - Windows 98 style for the panel
* [Best-README-Template](https://github.com/aybrkaknc/Best-README-Template) - README structure
* [Img Shields](https://shields.io) - badges
* [Octicons](https://primer.style/foundations/icons) - GitHub icon (MIT)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/aybrkaknc/Whatsapp-Number-Extractor.svg?style=for-the-badge
[contributors-url]: https://github.com/aybrkaknc/Whatsapp-Number-Extractor/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/aybrkaknc/Whatsapp-Number-Extractor.svg?style=for-the-badge
[forks-url]: https://github.com/aybrkaknc/Whatsapp-Number-Extractor/network/members
[stars-shield]: https://img.shields.io/github/stars/aybrkaknc/Whatsapp-Number-Extractor.svg?style=for-the-badge
[stars-url]: https://github.com/aybrkaknc/Whatsapp-Number-Extractor/stargazers
[issues-shield]: https://img.shields.io/github/issues/aybrkaknc/Whatsapp-Number-Extractor.svg?style=for-the-badge
[issues-url]: https://github.com/aybrkaknc/Whatsapp-Number-Extractor/issues
[license-shield]: https://img.shields.io/github/license/aybrkaknc/Whatsapp-Number-Extractor.svg?style=for-the-badge
[license-url]: https://github.com/aybrkaknc/Whatsapp-Number-Extractor/blob/main/LICENSE
