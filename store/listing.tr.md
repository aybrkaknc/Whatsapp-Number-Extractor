# WhatsApp Number Extractor 1.3.0 - Mağaza açıklaması (Türkçe)

[English](listing.en.md)

## Özet (en fazla 132 karakter)
WhatsApp Web grup üyelerinin telefon numaralarını Excel uyumlu CSV dosyasına aktarın.

## Açıklama
WhatsApp Number Extractor, WhatsApp Web'deki "Üyeleri aratın" listesinde görünen grup üyelerinin telefon numaralarını ve isimlerini toplayıp CSV, vCard veya JSON dosyası olarak dışa aktarır.

Nasıl çalışır:
1. WhatsApp Web'de bir grubu açıp "Üyeleri aratın" listesini açın.
2. Sağ alttaki WA butonuna tıklayın.
3. Başla'ya, ardından tüm listeyi yüklemek için Otomatik Kaydır'a basın.
4. Dosyayı kaydetmek için Bitir ve İndir'e, numaraları kopyalamak için Panoya Kopyala'ya basın.

Özellikler:
- Firefox ve Chrome'da çalışır
- Türkçe ve İngilizce arayüz
- Varsayılan ülke, CSV ayracı, kaydırma hızı, kopyalama biçimi ve ses ayarları
- CSV, vCard ve JSON dışa aktarma, ülke ve rehberde kayıtlı olmayanlar filtreleri, birden fazla grubu birleştirme
- E.164, yönetici ve grup sütunları, dosya adında grup adı
- Büyük gruplar için Otomatik Kaydır, durum çubuğu ve ilerleme çubuğu
- Formül enjeksiyonuna karşı korumalı, Excel uyumlu CSV (BOM'lu UTF-8)
- Sürüklenebilir, küçültülebilir panel ve anlık sistem logları

Gizlilik: Toplanan numaralar cihazınızdan çıkmaz. Eklenti ağ isteği yapmaz ve yalnızca web.whatsapp.com üzerinde çalışır. Ayrıntılar için depodaki gizlilik politikasına bakın.

Bu aracı yalnızca kişisel verilerin korunması yasalarına ve WhatsApp kullanım koşullarına uygun kullanın.

## Tek amaç (Chrome Web Store)
Kullanıcının açık olan WhatsApp Web grubunun üye listesini, kullanıcının kendi cihazındaki bir dosyaya aktarmak.

## İzin gerekçeleri (Chrome Web Store)
- **storage:** Kullanıcının ayarlarını saklar (dil, varsayılan ülke, CSV ayracı, kaydırma hızı, kopyalama biçimi, ses, dışa aktarma biçimi, tek seferlik bilgi notu). Toplanan numaralar bu izinle saklanmaz.
- **https://web.whatsapp.com/* erişimi:** İçerik betiği üye listesini okur ve paneli yalnızca WhatsApp Web'de gösterir.
- **Uzak kod:** Yok. Tüm kod paketin içindedir.

## Veri kullanımı beyanı (Chrome Web Store)
- İşlenen veri: grup üyelerinin isimleri ve telefon numaraları (kişisel olarak tanımlayıcı bilgi), yalnızca kullanıcının cihazında.
- Satılmaz, üçüncü taraflara aktarılmaz, tek amaç dışında kullanılmaz, kredi veya borç kararları için kullanılmaz.
- Geliştiriciye veya herhangi bir sunucuya hiçbir şey gönderilmez.

## 1.3.0 sürümündeki yenilikler
- Chrome desteği ve ayarlar penceresi
- vCard ve JSON dışa aktarma, ülke ve rehberde kayıtlı olmayanlar filtreleri, birden fazla grubu birleştirme
- E.164, yönetici ve grup sütunları; dosya adında grup adı
- Durum çubuğu, ilerleme çubuğu, küçült butonu, ipuçları, azaltılmış hareket desteği
- Türkçe karakterler Excel'de doğru görünüyor
- Üye penceresi kapatılınca tarama durur; toplanan liste korunur
- Birçok düzeltme: indirmeden sonra Otomatik Kaydır, log saatleri ve renkleri, farklı biçimlerdeki aynı numaralar
