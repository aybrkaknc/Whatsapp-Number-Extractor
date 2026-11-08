<a id="readme-top"></a>

[![Katkıda Bulunanlar][contributors-shield]][contributors-url]
[![Çatallar][forks-shield]][forks-url]
[![Yıldızlar][stars-shield]][stars-url]
[![Sorunlar][issues-shield]][issues-url]
[![MIT Lisansı][license-shield]][license-url]

<br />
<div align="center">
  <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor">
    <img src="icon/icon-96.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">WhatsApp Number Extractor</h3>

  <p align="center">
    WhatsApp Web grup üyelerinin telefon numaralarını Excel uyumlu CSV dosyasına aktarın.
    <br />
    <a href="https://addons.mozilla.org/tr/firefox/addon/whatsappnumberextractor/"><strong>Firefox Eklentileri'nden indirin</strong></a>
    <br />
    <br />
    <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor/issues/new?labels=bug">Hata Bildir</a>
    &middot;
    <a href="https://github.com/aybrkaknc/Whatsapp-Number-Extractor/issues/new?labels=enhancement">Özellik İste</a>
  </p>
</div>

<details>
  <summary>İçindekiler</summary>
  <ol>
    <li><a href="#proje-hakkında">Proje Hakkında</a></li>
    <li>
      <a href="#başlarken">Başlarken</a>
      <ul>
        <li><a href="#firefox">Firefox</a></li>
        <li><a href="#chrome">Chrome</a></li>
      </ul>
    </li>
    <li><a href="#kullanım">Kullanım</a></li>
    <li><a href="#geliştirme">Geliştirme</a></li>
    <li><a href="#gizlilik">Gizlilik</a></li>
    <li><a href="#katkıda-bulunma">Katkıda Bulunma</a></li>
    <li><a href="#lisans">Lisans</a></li>
    <li><a href="#iletişim">İletişim</a></li>
  </ol>
</details>

<p align="center"><a href="README.md">English</a></p>

## Proje Hakkında

WhatsApp Number Extractor, Firefox ve Chrome için bir eklentidir. WhatsApp Web grubundaki üye listesini okuyup isimleri ve telefon numaralarını CSV dosyası olarak dışa aktarır. Arayüz Windows 98 tarzı bir panel olup Türkçe ve İngilizce dil desteği içerir.

Özellikler:
* "Üyeleri aratın" listesinden tek tıkla toplama
* Büyük gruplar için Otomatik Kaydır
* Excel uyumlu CSV çıktısı (noktalı virgül ayraç, BOM'lu UTF-8, formül enjeksiyonuna karşı koruma)
* Numaraları panoya kopyalama
* Sürüklenebilir panel ve anlık sistem logları
* Türkçe ve İngilizce arayüz

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

### Kullanılan Teknolojiler

* Saf JavaScript (içerik betiği, derleme adımı yok)
* [98.css](https://jdan.github.io/98.css/)
* WebExtensions Manifest V3

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Başlarken

### Firefox

[Firefox Eklentileri](https://addons.mozilla.org/tr/firefox/addon/whatsappnumberextractor/) üzerinden kurun veya elle yükleyin:

1. Depoyu klonlayın
   ```sh
   git clone https://github.com/aybrkaknc/Whatsapp-Number-Extractor.git
   ```
2. Firefox'ta `about:debugging` adresini açın ve **Bu Firefox**'a tıklayın
3. **Geçici Eklenti Yükle...** butonuna tıklayıp `manifest.json` dosyasını seçin

### Chrome

1. Depoyu klonlayın (yukarıya bakın)
2. `chrome://extensions` adresini açın ve **Geliştirici modu**nu açın
3. **Paketlenmemiş öğe yükle**'ye tıklayıp proje klasörünü seçin

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Kullanım

1. [WhatsApp Web](https://web.whatsapp.com)'i açın ve bir grup sohbetine girin
2. Grup başlığına tıklayıp **Üyeleri aratın** modalını açın
3. Sağ alttaki **WA** butonuna tıklayın
4. **Başla**'ya basın
5. (İsteğe bağlı) Tüm listeyi taramak için **Otomatik Kaydır**'a basın
6. CSV'yi indirmek için **Bitir ve İndir**'e, numaraları kopyalamak için **Panoya Kopyala**'ya basın

Tarama sırasında modal kapanırsa tarama durur ve toplanan numaralar korunur. İndirmek için **Bitir ve İndir**'e basın.

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Geliştirme

```sh
npm install
npm start           # Firefox, otomatik yenileme ile
npm run start:chrome
npm run lint
npm run build
```

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Gizlilik

Eklenti hiçbir sunucuya veri göndermez. Ayrıntılar: [PRIVACY.tr.md](PRIVACY.tr.md).

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Katkıda Bulunma

Katkılar memnuniyetle karşılanır. Bir öneriniz varsa depoyu çatallayıp bir pull request açın veya "enhancement" etiketiyle bir sorun açın.

1. Projeyi çatallayın
2. Özellik dalınızı oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add: yeni özellik'`)
4. Dalınızı gönderin (`git push origin feature/YeniOzellik`)
5. Bir Pull Request açın

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## Lisans

MIT Lisansı altında dağıtılmaktadır. Ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

## İletişim

Telegram: [@aybrkaknc](https://t.me/aybrkaknc)

Proje bağlantısı: [https://github.com/aybrkaknc/Whatsapp-Number-Extractor](https://github.com/aybrkaknc/Whatsapp-Number-Extractor)

<p align="right">(<a href="#readme-top">başa dön</a>)</p>

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
