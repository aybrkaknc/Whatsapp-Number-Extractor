# Animasyon sistemi

[English](ANIMATIONS.md)

Panelin tüm animasyonları, ortak bir süre, geçiş ve yardımcı kümesini kullanır; böylece hepsi aynı şekilde hareket eder. Tokenlar ve keyframe'ler `src/ui/panel.css` içinde, yardımcılar `src/ui/motion.js` içinde.

## Tokenlar

| Token | Değer | Kullanım |
|---|---|---|
| `--wa-dur-fast` | 100 ms | küçük geri bildirimler: durum kutusu parlaması, yeni log satırı, kademeli giriş |
| `--wa-dur` | 160 ms | pencere, görünüm değişimi, öğelerin girişi ve çıkışı |
| `--wa-dur-slow` | 240 ms | boyut değişimleri: log paneli, ilerleme çubuğu |
| `--wa-ease` | `steps(5, end)` | hareket ve giriş, beş görünür adımda |
| `--wa-ease-fade` | `steps(3, end)` | solma ve parlama |
| `--wa-ease-grow` | `steps(8, end)` | boyut değişimleri |

Adımlı geçişler Windows 98 görünümünü korur: öğeler akmak yerine birkaç görünür adımda hareket eder. Betikler aynı tokenları `WA.motion('--wa-dur')` ile okur, yani bir süre yalnızca tek yerde tanımlıdır.

## Neler animasyonlu

| Nerede | Animasyon | Sınıf / mekanizma |
|---|---|---|
| Panel açılışı | küçük bir taşmayla büyür | `win98-anim` (`win98-appear`) |
| Panel kapanışı | küçülür, sonra gizlenir | `win98-anim-out` (`win98-disappear`) |
| WA butonu | panel gidince geri büyür | `wa-grow` |
| Sürüklenen panel | hafifçe solar | sarmalayıcıda `wa-dragging` |
| Ana ve ayarlar görünümü | yeni görünüm sağdan (ayarlar) veya soldan (ana) kayarak girer, eskisi anında gizlenir | `--wa-dx` ile `wa-enter` |
| Küçült / geri yükle | içerik kayarak gider ve geri gelir | `wa-leave`, `wa-enter` |
| Başla, Otomatik Kaydır, Kopyala, Bitir | yeni grup butonları birbiri ardına girer | gecikmeli `wa-enter` |
| İlk kullanım notu | kapatılınca çıkar | `wa-leave` |
| İlerleme çubuğu | belirir, dolgusu adımlarla büyür | `wa-enter`, `transition: width` |
| Sistem logları paneli | yükseklik, opaklık ve boşlukla açılıp kapanır | `panel.css` içinde `transition` |
| Temizle butonu | log açılmaya başladıktan sonra girer, kapanırken çıkar | gecikmeli `wa-enter`, `wa-leave` |
| Durum kutusu | metni değişince parlar | `wa-tick` |
| Bildirimler (sarı, kırmızı) | kayarak girer | `wa-pop` |
| Yeni log satırları | kayarak girer (dil değişiminde yeniden çizilenler girmez) | `wa-new` |

Bilerek animasyonsuz olanlar: ayarlardaki açılır listeler ve onay kutuları (işletim sistemi çizer) ve Win98 buton basışı (98.css yapar).

## Yardımcılar (`src/ui/motion.js`)

- `WA.setHidden(el, hidden, { instant, dx, dy, delay, enter })` bir öğeyi ortak giriş / çıkış animasyonuyla gösterir veya gizler. `hide` sınıfını elle değiştirmek yerine bunu kullanın.
- `WA.replay(el, cls, { restart })` tek seferlik bir animasyon sınıfını yeniden oynatır. `restart: false` ile süren bir animasyona dokunulmaz.
- `WA.motion(token)` bir süre tokenını CSS'ten milisaniye olarak okur.
- `WA.motionAllowed()` animasyonlar kapalıyken false döner.

Bir grup öğe yer değiştirdiğinde (Başla'dan üç tarama butonuna, ana görünümden ayarlara) çıkanlar `instant: true` ile gizlenir ve yalnızca gelenler animasyonlanır; böylece iki grup hiçbir zaman üst üste binmez.

## Hareketi azalt ve Animasyonlar ayarı

Ayarlarda bir **Animasyonlar** seçeneği var:

- **Sistem ayarını izle** (varsayılan): işletim sistemi hareketin azaltılmasını istiyorsa animasyon yok.
- **Her zaman açık**: sistem azaltma istese bile animasyon oynatır.
- **Kapalı**: hiç animasyon oynatmaz.

Hiç animasyon görünmüyorsa önce sistem ayarına bakın: Windows 11, Ayarlar > Erişilebilirlik > Görsel efektler > Animasyon efektleri. Kapalıysa varsayılan seçenek bilerek animasyon göstermez. Ayar, panel sarmalayıcısında `data-motion` olarak uygulanır. "Animasyon yok" durumlarında `panel.css` tüm süre tokenlarını 0 yapar ve animasyon ile geçişleri kapatır; betikler beklememek için `WA.motionAllowed()` kullanır.

## Animasyon eklemek

1. Süre için bir token, geçiş için bir `--wa-ease*` tokenı kullanın. Doğrudan süre yazmayın.
2. Mevcut sınıfları (`wa-enter`, `wa-leave`, `wa-grow`, `wa-pop`, `wa-tick`) veya `WA.setHidden()` işlevini tercih edin.
3. Yeni bir keyframe kümesine mevcut olanlarla aynı biçimi verin (küçük mesafe, opaklık) ve yukarıdaki tabloya ekleyin.
4. **Animasyonlar: Kapalı** ile durduğunu kontrol edin.

## Gözle kontrol

Animasyonlar kısa olduğu için yavaşlatın: `#wa-98-scope` üzerinde `--wa-dur`, `--wa-dur-fast` ve `--wa-dur-slow` değerlerini birkaç saniyeye getirin, işlemi tetikleyin, sonra `document.getAnimations().forEach(a => { a.pause(); a.currentTime = 800; })` ile kareyi dondurup bakın.
