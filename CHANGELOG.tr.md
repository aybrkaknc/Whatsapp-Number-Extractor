# Değişiklik Günlüğü

## v1.3.0

### Eklenenler ve Değişenler
- Chrome desteği
- Eklenti adı ve açıklaması Türkçe ve İngilizce
- Üye penceresi kapatılınca tarama durur; toplanan liste korunur ve indirilebilir
- Ülke tespiti arama koduna göre yapılıyor ve "Almanya (+49)" gibi yerelleştirilmiş ülke adıyla gösteriliyor
- Yardım butonu dişli ikonu kullanıyor, Telegram butonu depoyu açan GitHub butonuyla değiştirildi
- Tarama aşamasını ve toplanan / toplam sayısını gösteren durum çubuğu, WhatsApp katılımcı sayısını gösterdiğinde ilerleme çubuğu
- Küçült butonu, Esc ile panel kapatma, simgeli butonlarda ipuçları, azaltılmış hareket desteği
- Dişlinin açtığı, yeni "storage" izniyle saklanan ayarlar penceresi: dil, yerel numaraların ülkesi, CSV ayracı, kaydırma hızı, kopyalama biçimi ve ses
- CSV'de E.164 ve Yönetici sütunları var, dosya adında grup adı geçiyor, dışa aktarmada ülke özeti log'a yazılıyor
- Mağaza metinleri Türkçe ve İngilizce (store/)
- README, gizlilik politikası ve lisans Türkçe ve İngilizce

### Düzeltilenler
- Otomatik Kaydır, indirmeden sonra iki tıklama gerektiriyordu
- Dil değiştirince log saatleri değişiyordu
- CSV değerleri tırnaklanıyor, kaçırılıyor ve formül enjeksiyonuna karşı korunuyor
- Aynı numara farklı biçimlerde görünse de bir kez toplanıyor
- Otomatik Kaydır ekran yüksekliği kadar ilerliyor ve liste sonunda duruyor
- Hatalar tarayıcı uyarısı yerine durum kutusunda gösteriliyor
