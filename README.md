# WhatsApp Number Extractor

Chrome extension that collects member phone numbers from WhatsApp Web group chats.  
Comes with a Windows 98 themed interface for that retro vibe.

> 🇹🇷 **[Türkçe versiyon aşağıda](#turkce)**

## Features

- **One-click extraction** — Open the "Search participants" modal, hit Start, the extension handles the rest
- **Auto scroll** — No need to manually scroll through long lists
- **CSV export** — Numbers are exported with Country, Name and Phone columns, Excel-compatible
- **Copy to clipboard** — Copy all numbers with one click
- **Bilingual (TR/EN)** — UI and logs switch between Turkish and English on the fly
- **Draggable window** — Grab the title bar and move the window wherever you want
- **System logs** — Developer logs to see what's happening under the hood
- **Windows 98 theme** — Nostalgic UI powered by 98.css

## Installation

1. Clone or download this repo:
   ```
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the downloaded folder

## Usage

1. Open [WhatsApp Web](https://web.whatsapp.com)
2. Navigate to the group you want to extract numbers from
3. Click on the group header and open the **"Search participants"** modal
4. Click the **WA** button (bottom right corner)
5. Hit **Start**
6. Optionally use **Auto Scroll** to scan the entire list
7. Click **Finish & DL** to download the CSV file

## Tech Stack

- **Platform:** Chrome Extension (Manifest V3)
- **Theme:** [98.css](https://jdan.github.io/98.css/) (scoped)
- **Language:** Vanilla JavaScript, CSS
- **CSV format:** Semicolon-delimited, UTF-8 BOM (Turkish Excel compatible)

## Contact

Found a bug or have a suggestion? [@aybrkaknc](https://t.me/aybrkaknc) (Telegram)

## License

MIT

---

<a name="turkce"></a>

# 🇹🇷 Türkçe

WhatsApp Web grup sohbetlerinden üye telefon numaralarını toplayan Chrome eklentisi.  
Windows 98 temalı arayüzüyle retro bir deneyim sunar.

## Özellikler

- **Tek tıkla numara toplama** — "Üyeleri Aratın" modalını aç, Başla'ya bas, gerisini eklenti halleder
- **Otomatik kaydırma** — Uzun listelerde elle kaydırmana gerek yok, eklenti otomatik kaydırıp tüm üyeleri tarıyor
- **CSV dışa aktarma** — Toplanan numaralar Ülke, İsim ve Telefon sütunlarıyla Excel uyumlu CSV olarak indiriliyor
- **Panoya kopyalama** — Numaraları tek tıkla panoya kopyala
- **Çift dil desteği (TR/EN)** — Arayüz ve loglar anlık olarak Türkçe/İngilizce arasında geçiş yapabiliyor
- **Sürüklenebilir pencere** — Başlık çubuğundan tutup pencereyi istediğin yere taşı
- **Sistem logları** — Arka planda neler olduğunu takip edebileceğin geliştirici logları
- **Windows 98 teması** — 98.css kütüphanesi ile nostaljik arayüz

## Kurulum

1. Bu repoyu indir veya klonla:
   ```
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Chrome'da `chrome://extensions` adresine git
3. Sağ üstten **Geliştirici modu**'nu aç
4. **Paketlenmemiş öğe yükle** butonuna tıkla
5. İndirdiğin klasörü seç

## Kullanım

1. [WhatsApp Web](https://web.whatsapp.com)'i aç
2. Numaralarını almak istediğin gruba gir
3. Grup başlığına tıklayıp **"Üyeleri Aratın"** modalını aç
4. Sağ alttaki **WA** butonuna tıkla
5. **Başla** butonuna bas
6. İsteğe bağlı: **Otomatik Kaydır** ile tüm listeyi tara
7. **Bitir ve İndir** ile CSV dosyasını al

## Teknik Detaylar

- **Platform:** Chrome Extension (Manifest V3)
- **Tema:** [98.css](https://jdan.github.io/98.css/) (scoped)
- **Dil:** Vanilla JavaScript, CSS
- **CSV formatı:** Noktalı virgül ayraçlı, UTF-8 BOM destekli (Türkçe Excel uyumlu)

## İletişim

Bir sorun bulursan veya önerin varsa: [@aybrkaknc](https://t.me/aybrkaknc) (Telegram)

## Lisans

MIT
