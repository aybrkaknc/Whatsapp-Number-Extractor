# İyileştirme Planı

[English](ROADMAP.md)

1.3.0 sürümünün kod ve arayüz incelemesine dayanan, 1.3.x ve sonrası için plan. Maddeler yayınlandıkça işaretlenir. Numaralar sabittir, commit ve sorunlar bunlara atıf yapabilir.

## 1. Doğrulanmış hatalar

- [x] **B1** Bitir ve İndir, listeyi sessiz olmayan modda arıyor. Modal kapanmışsa log'a kırmızı "liste alanı bulunamadı" hatası düşüyor. Düzeltme: `src/ui/actions.js` içinde durdurma işleyicisinin sıfırlama bölümünde `findActiveScrollContainer(true)`.
- [x] **B2** `createUI` her çağrıda `document`'e `mousemove` ve `mouseup` dinleyicisi ekliyor, hiç kaldırmıyor. Düzeltme: tek sefer bağlamak veya `AbortController` (`src/ui/window.js`).
- [x] **B3** `alert()` sayfayı kilitliyor ve retro hissi bozuyor. Düzeltme: durum kutusunda satır içi mesajlar (`src/ui/actions.js`).
- [x] **B4** Her bitişte yeni bir `AudioContext` açılıyor ve kapatılmıyor. Düzeltme: kapatmak veya tek bağlam kullanmak (`src/ui/actions.js`).
- [x] **B5** Yalnızca simgeli butonlarda (dişli, GitHub, kapat) tooltip yok. Düzeltme: `updateUITexts` içinde dile göre `title` (`src/ui/texts.js`).
- [x] **B6** Dişli simgesi yardım sayfasını açıyor, oysa ayar çağrıştırıyor. Düzeltme: bkz. F1.
- [x] **B7** `web_accessible_resources` tüm `*.whatsapp.com` için açık, içerik betiği ise yalnızca `web.whatsapp.com` üzerinde çalışıyor. Düzeltme: `https://web.whatsapp.com/*` ile daraltmak (`manifest.json`).

## 2. Kod mantığı ve dayanıklılık

- [x] **L1** Otomatik üretilmiş `.x1n2onr6.x1n2onr6.xupqr0c` sınıf seçicisi yerine yapıya dayalı tespit (`role="dialog"` içindeki `role="listitem"`), hangi seçicinin eşleştiğini log'a yazmak.
- [x] **L2** `MutationObserver` yeniden taramalarını `requestAnimationFrame` ile birleştirmek.
- [x] **L3** Numaraları yalnızca rakamlara göre tekilleştirmek: `+90 532 111 22 33` ve `+905321112233` bir kez sayılsın.
- [x] **L4** Otomatik kaydırma: `clientHeight` kadar adım ve beş kez aynı yerde beklemek yerine `scrollTop + clientHeight >= scrollHeight` kontrolü.
- [x] **L5** 0 ile başlayan yerel numaralar için varsayılan ülke ayarı (şu an her zaman Türkiye).
- [x] **L6** Uyarı ve hata seviyelerini ayırmak, kritik olmayan durumlar durum kutusunu kırmızı yapmasın.
- [x] **L7** Panel yeniden kurulduğunda zamanlayıcıları ve durumu sıfırlamak.
- [x] **L8** Saf fonksiyonlar (`detectCountry`, `csvCell`, isim ayrıştırma) için yerleşik `node:test` ile birim testler (yalnızca istenirse).
- [x] **L9** `feedback` adlarını `help` olarak değiştirmek (`logFeedbackOpen`, `wa-ext-btn-feedback`).

## 3. Görsel ve etkileşim

- [x] **V1** Tüm butonlar için tooltip ve klavye odak çerçevesi (bkz. B5).
- [x] **V2** Durum çubuğu (98.css `status-bar`): toplanan / toplam.
- [x] **V3** İlerleme çubuğu (98.css `progress-indicator`), modal başlığındaki katılımcı sayısından.
- [x] **V4** Paneli başlık çubuğuna indiren küçült butonu.
- [x] **V5** Numara yokken Kopyala ve Bitir'i pasif yapmak, `alert` yerine.
- [x] **V6** Bitiş sesi için kapatma seçeneği.
- [x] **V7** `prefers-reduced-motion` ayarına uymak.
- [x] **V8** Durum kutusunda `aria-live="polite"`, Esc ile paneli kapatmak.
- [x] **V9** Dar ekranlarda panel genişliğini 90vw ile sınırlamak.

## 4. Özellik önerileri

| Kod | Özellik | Değer | Emek | Durum |
|---|---|---|---|---|
| F1 | Dişlinin açtığı gerçek ayarlar penceresi: kalıcı dil, varsayılan ülke, CSV ayracı, ses, kaydırma hızı. İçinde yardım bağlantısı. | Yüksek | Orta | Yapıldı |
| F2 | CRM ve içe aktarma için E.164 sütunu (`+905321112233`). | Yüksek | Düşük | Yapıldı |
| F3 | Dosya adında grup adı (`wa_<grup>_<tarih>.csv`). | Orta | Düşük | Yapıldı |
| F4 | vCard (.vcf) ve JSON dışa aktarma. | Orta | Orta | Yapıldı |
| F5 | Yönetici sütunu (admin etiketi şu an yalnızca atlanıyor). | Orta | Düşük | Yapıldı |
| F6 | Aynı oturumda birden fazla grubu birleştirip mükerrerleri atmak. | Yüksek | Orta | Yapıldı |
| F7 | Filtreler: yalnızca rehberde kayıtlı olmayanlar, seçili ülkeler. | Orta | Orta | Kısmen (yalnızca ülke) |
| F8 | İndirmeden önce ülke özeti ("Almanya: 12"). | Düşük | Düşük | Yapıldı |
| F9 | Sayfa yenilenince toplanan listeyi korumak (yalnızca `sessionStorage`). | Düşük | Orta | Yapıldı |
| F10 | Kopyalama biçimi seçimi: satır satır veya virgülle ayrılmış. | Düşük | Düşük | Yapıldı |

## 5. Yayın, güvenlik ve süreç

- [x] **R1** Mağaza riski: Chrome Web Store veri toplamayı sıkı inceler. Listede amacı ve verinin cihazda kaldığını açıkça yazmak.
- [x] **R2** Panelde bir kez gösterilen gizlilik ve WhatsApp şartları bilgi notu (bilgilendirme amaçlı).
- [x] **R3** Mağaza görselleri: 1280x800 ekran görüntüleri, küçük tanıtım kutusu, README şablonu için ürün ekran görüntüsü.
- [x] **R4** GitHub Actions: `web-ext lint` ve `web-ext build`, etiketli sürümlere zip eklemek.
- [x] **R5** `manifest.json` ve `package.json` sürümlerini senkron tutan tek betik.
- [x] **R6** LF/CRLF uyarılarını bitirmek için `* text=auto eol=lf` içeren `.gitattributes`.
- [ ] **R7** Kontrol listesindeki her adım için Chrome'da elle test (paketlenmemiş öğe yükle).

## 6. Çalışma sırası

1. **Hemen (az emek):** B1, B5, B7, B4, F2, F3, R6.
2. **Sonra:** B2, B3, L3, L1, V2, V3, F1.
3. **İleride:** F4, F6, F7, R3, R4, L8, R1.

## Doğrulanmadı

- WhatsApp Web ve Firefox içindeki görünüm (yalnızca yerel önizlemede bakıldı).
- Seçici dayanıklılığı, WhatsApp'ın güncel DOM'una karşı.
- `AudioContext` sınırı tarayıcıya göre değişir, bu yüzden B4 bir tahmindir.
