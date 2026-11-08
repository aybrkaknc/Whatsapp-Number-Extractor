# WhatsApp Number Extractor

[English](README.md)

WhatsApp Web grup sohbetlerinden üye telefon numaralarını toplayan, Firefox ve Chrome için bir tarayıcı eklentisi.
Windows 98 temalı bir arayüze sahiptir.

## Kurulum

### Firefox Eklentileri (önerilen)
[Firefox Eklentileri'nde WhatsApp Number Extractor](https://addons.mozilla.org/tr/firefox/addon/whatsappnumberextractor/)

### Manuel kurulum - Firefox
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Firefox'ta `about:debugging` adresini açın.
3. **Bu Firefox** sekmesine tıklayın.
4. **Geçici Eklenti Yükle...** butonuna tıklayıp `manifest.json` dosyasını seçin.

### Manuel kurulum - Chrome
1. Depoyu klonlayın (yukarıya bakın).
2. Chrome'da `chrome://extensions` adresini açın.
3. **Geliştirici modu**nu açın.
4. **Paketlenmemiş öğe yükle** butonuna tıklayıp proje klasörünü seçin.

## Özellikler

- **Retro arayüz** - Kapsamlı `98.css` ile Windows 98 teması.
- **Tek tıkla toplama** - "Üyeleri aratın" modalını açıp Başla'ya basın.
- **Otomatik Kaydır** - Uzun üye listelerini otomatik tarar.
- **Excel uyumlu çıktı** - Ülke, İsim ve Telefon sütunlu CSV (`;` ayraçlı, UTF-8). Değerler formül enjeksiyonuna karşı korunur.
- **Sürüklenebilir pencere** - Paneli ekranın istediğiniz yerine taşıyın.
- **Çift dil** - Türkçe ve İngilizce arasında istediğiniz an geçiş yapın.
- **Sistem logları** - Tarama sürecini anlık takip edin.

## Kullanım

1. [WhatsApp Web](https://web.whatsapp.com)'i açın.
2. Bir grup sohbetine girin.
3. Grup başlığına tıklayıp **Üyeleri aratın** modalını açın.
4. Sağ alttaki **WA** butonuna tıklayın.
5. **Başla**'ya basın.
6. (İsteğe bağlı) Tüm listeyi taramak için **Otomatik Kaydır**'ı kullanın.
7. CSV dosyasını kaydetmek için **Bitir ve İndir**'e basın.

Tarama sırasında modal kapanırsa tarama durur ve toplanan numaralar korunur. İndirmek için **Bitir ve İndir**'e basın.

## Geliştirme

```bash
npm install
npm start
npm run start:chrome
npm run lint
npm run build
```

## Gizlilik

Eklenti hiçbir yere veri göndermez. Ayrıntılar: [PRIVACY.tr.md](PRIVACY.tr.md).

Bu aracı yalnızca gizlilik yasalarına ve WhatsApp kullanım koşullarına uygun şekilde kullanın.

## İletişim

Telegram: [@aybrkaknc](https://t.me/aybrkaknc)

## Lisans

[MIT](LICENSE)
