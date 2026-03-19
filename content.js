/*
  WhatsApp Number Extractor
  Grup üyelerinin numaralarını toplar ve CSV olarak indirir.
*/

(function () {
  // --- ÇOKLU DİL SÖZLÜĞÜ (i18n) ---
  const i18n = {
    tr: {
      btnStart: 'Başla',
      btnAutoScroll: 'Otomatik Kaydır',
      btnStop: 'Bitir ve İndir',
      btnSysLogs: 'Sistem Logları',
      btnSysLogsClose: 'Logları Kapat',
      btnLang: 'TR',
      statusReady: 'Hazır',
      statusCollected: 'Toplanan',
      statusLast: 'Son',
      logHeader: 'Geliştirici Günlüğü',
      logClear: 'Temizle',
      alertNoList: 'Kaydırılabilir liste bulunamadı. Lütfen "Üyeleri Aratın" modalını açın. Eğer yapamıyorsanız Logları gösterip hataya bakınız.',
      alertNoNum: 'Hiç numara toplanmadı.',
      btnScrollStop: 'Durdur',
      btnScrollDone: 'Kaydırma Bitti',
      btnScrollResume: 'Kaydır (Devam)',
      btnCopy: 'Panoya Kopyala',
      alertCopied: 'Kopyalandı!',
      csvHeaders: 'Ülke;İsim/Soyisim;Telefon No',
      errCritical: 'Kritik Hata',
      labelActions: 'Eylemler',
      labelStatus: 'Durum Bilgisi',
      logInit: 'UI Elemanları Sayfaya Enjekte Ediliyor...',
      logLangChanged: 'Dil değiştirildi: {0}',
      logFeedbackOpen: 'Geri bildirim penceresi açılıyor...',
      logClearSuccess: 'Log kayıtları temizlendi.',
      logStartClicked: '--- BAŞLAT BUTONUNA TIKLANDI ---',
      logAutoScrollClicked: '--- OTOMATİK KAYDIR BUTONUNA TIKLANDI ---',
      logScanStart: 'Canlı Tarama başlatıldı.',
      logModalClosed: 'Modal kapatıldı! İşlem sonlandırılıyor...',
      logScanDone: 'Liste sonuna ulaşıldı veya sıkışma var. Kaydırma bitti.',
      logAutoScrollPaused: 'Otomatik kaydırma duraklatıldı.',
      logCopied: 'Numaralar panoya kopyalandı.',
      logExportSuccess: 'BAŞARILI: {0} numara CSV olarak indirildi.',
      logReset: 'Eklenti başa sarılıyor...',
      errNoList: 'Başlatma iptal edildi: Liste bulunamadı.',
      errScrollNoList: 'Kaydırma sırasında liste kayboldu!',
      errExport: 'İndirme işleminde kritik hata!',
      errCopy: 'Kopyalama sırasında hata',
      warnNoNum: 'Uyarı: İndirilecek numara bulunamadı.',
      logSearching: 'Kaydırılabilir alan aranıyor...',
      logModernModal: 'Modern arama modalı yapısı bulundu.',
      logGeneralModal: 'Genel Modal tespit edildi, liste aranıyor.',
      logListFound: 'Modal içerisinde liste başarıyla bulundu.',
      logFallbackSearch: 'Modal bulundu ama içinde listitem bulunamadı. Fallback deneniyor.',
      logFallbackFound: 'Fallback yöntemiyle kaydırılabilir alan bulundu.',
      logNoModal: 'Ekranda modal tespit edilemedi.',
      errNoListArea: 'Ekranda hiçbir geçerli liste alanı tespit edilemedi!',
      logScanSuccess: 'Tarama başarılı: {0} yeni numara eklendi. Toplam: {1}',
      errScanFail: 'Tarama sırasında beklenmeyen bir hata oluştu.',
      logStopClicked: '--- BİTİR VE İNDİR BUTONUNA TIKLANDI ---'
    },
    en: {
      btnStart: 'Start',
      btnAutoScroll: 'Auto Scroll',
      btnStop: 'Finish & DL',
      btnSysLogs: 'System Logs',
      btnSysLogsClose: 'Close Logs',
      btnLang: 'EN',
      statusReady: 'Ready',
      statusCollected: 'Collected',
      statusLast: 'Last',
      logHeader: 'Developer Logs',
      logClear: 'Clear',
      alertNoList: 'Scrollable list not found. Please open "Search participants" modal or check logs.',
      alertNoNum: 'No numbers collected.',
      btnScrollStop: 'Stop',
      btnScrollDone: 'Scan Done',
      btnScrollResume: 'Scroll (Resume)',
      btnCopy: 'Copy to Clipboard',
      alertCopied: 'Copied!',
      csvHeaders: 'Country;Name/Surname;Phone Number',
      errCritical: 'Critical Error',
      labelActions: 'Actions',
      labelStatus: 'Status Info',
      logInit: 'UI Elements Injected Into Page...',
      logLangChanged: 'Language changed: {0}',
      logFeedbackOpen: 'Opening feedback window...',
      logClearSuccess: 'Logs cleared.',
      logStartClicked: '--- START BUTTON CLICKED ---',
      logAutoScrollClicked: '--- AUTO SCROLL CLICKED ---',
      logScanStart: 'Live Scan started.',
      logModalClosed: 'Modal closed! Finishing process...',
      logScanDone: 'End of list reached or stuck. Scroll done.',
      logAutoScrollPaused: 'Auto scroll paused by user.',
      logCopied: 'Numbers copied to clipboard.',
      logExportSuccess: 'SUCCESS: {0} numbers exported as CSV.',
      logReset: 'Resetting extension...',
      errNoList: 'Start cancelled: List not found.',
      errScrollNoList: 'List lost during scroll!',
      errExport: 'Critical error during export!',
      errCopy: 'Error during copy',
      warnNoNum: 'Warning: No numbers found to export.',
      logSearching: 'Searching for scrollable area...',
      logModernModal: 'Modern search modal found.',
      logGeneralModal: 'General Modal detected, searching list.',
      logListFound: 'List found inside modal.',
      logFallbackSearch: 'Modal found but no listitem. Trying fallback.',
      logFallbackFound: 'Scrollable area found via fallback.',
      logNoModal: 'No modal detected on screen.',
      errNoListArea: 'No valid list area detected on screen!',
      logScanSuccess: 'Scan success: {0} new numbers added. Total: {1}',
      errScanFail: 'Unexpected error during scan.',
      logStopClicked: '--- FINISH & DOWNLOAD CLICKED ---'
    }
  };

  // WhatsApp'ın dil ayracı üzerinden başlangıç dilini otomatik seç
  let currentLang = (document.documentElement.lang && document.documentElement.lang.startsWith('tr')) ? 'tr' : 'en';

  const t = (key, ...args) => {
    let text = i18n[currentLang][key] || key;
    args.forEach((val, i) => { text = text.replace(`{${i}}`, val); });
    return text;
  };

  // --- LOG SİSTEMİ VERİ DEPOSU ---
  const logHistory = [];

  const Logger = {
    prefix: '[WA-Extractor]',
    _appendUI: (type, key, params = [], rawErr = '') => {
      const time = new Date().toLocaleTimeString(currentLang === 'tr' ? 'tr-TR' : 'en-US');
      let color = '#ccc';
      let icon = 'ℹ️';
      if (type === 'WARN') { color = '#ffeb3b'; icon = '⚠️'; }
      if (type === 'ERROR') { color = '#f44336'; icon = '❌'; }
      if (type === 'INFO') { color = '#4caf50'; icon = '▶️'; }

      const msg = t(key, ...params);
      const logText = `[${time}] ${icon} ${msg} ${rawErr ? String(rawErr) : ''}`;
      
      const newEntry = { type, key, params, rawErr, color, icon, time };
      logHistory.push(newEntry);

      const panel = document.getElementById('wa-extractor-log-terminal');
      if (panel) {
        const line = document.createElement('div');
        line.className = 'log-line';
        line.style.color = color;
        line.style.marginBottom = '6px';
        line.style.wordBreak = 'break-word';
        line.innerText = logText;
        panel.appendChild(line);
        panel.scrollTop = panel.scrollHeight;
      }
    },
    info: (key, ...params) => {
      console.log(`${Logger.prefix} [INFO]`, key, params);
      Logger._appendUI('INFO', key, params);
    },
    warn: (key, ...params) => {
      console.warn(`${Logger.prefix} [WARN]`, key, params);
      Logger._appendUI('WARN', key, params);
    },
    error: (key, rawErr = '', ...params) => {
      console.error(`${Logger.prefix} [ERROR]`, key, rawErr, params);
      Logger._appendUI('ERROR', key, params, rawErr);
      
      const statusBox = document.getElementById('wa-extractor-status');
      if (statusBox) {
        statusBox.textContent = `> ${t('errCritical')}\n> ${t(key, ...params)}`;
        statusBox.style.color = '#f44336';
      }
    }
  };

  const BTN_STYLE = {
    padding: '6px 12px',
    fontSize: '12px',
    color: 'black',
    backgroundColor: '#c0c0c0',
    border: '2px solid',
    borderColor: '#ffffff #808080 #808080 #ffffff',
    borderRadius: '0',
    cursor: 'pointer',
    textAlign: 'center',
    fontWeight: 'normal',
    width: '100%',
    fontFamily: 'Tahoma, "MS Sans Serif", sans-serif',
    boxShadow: 'none'
  };

  let collectedPhones = new Map();
  let autoScrollInterval = null;
  let observer = null;
  let modalCheckInterval = null;
  let isLogOpen = false;

  function playDoneSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
  }

  function findActiveScrollContainer(silent = false) {
    if (!silent) Logger.info('logSearching');
    
    // UI Dilinden Bağımsız Çift Seçicili "Zırhlı Yöntem"
    const ariaLabels = ['Üyeleri aratın', 'Search participants'];
    let modernModal = null;
    let modal = null;

    // 1. WhatsApp Modern Modal
    for (const label of ariaLabels) {
      if (!modernModal) {
        modernModal = document.querySelector(`div[aria-label="${label}"] .x1n2onr6.x1n2onr6.xupqr0c`);
      }
      if (!modal) {
        modal = document.querySelector(`div[aria-label="${label}"]`);
      }
    }

    if (modernModal) {
      if (!silent) Logger.info('logModernModal');
      return modernModal;
    }
    
    // 2. Genel Modal Arayışı
    if (!modal) {
      modal = document.querySelector('div[role="dialog"]');
    }
    
    if (modal) {
      if (!silent) Logger.info('logGeneralModal');
      const listItem = modal.querySelector('div[role="listitem"]');
      
      if (listItem) {
        let parent = listItem.parentElement;
        while (parent && parent !== modal) {
          if (parent.scrollHeight > parent.clientHeight + 10) {
            if (!silent) Logger.info('logListFound');
            return parent;
          }
          parent = parent.parentElement;
        }
      }

      if (!silent) Logger.warn('logFallbackSearch');
      const allDivs = Array.from(modal.querySelectorAll('div'));
      const fallbackScrollable = allDivs.find(div => div.scrollHeight > div.clientHeight + 20);
      if (fallbackScrollable) {
         if (!silent) Logger.info('logFallbackFound');
         return fallbackScrollable;
      }
    } else {
      if (!silent) Logger.info('logNoModal');
    }

    if (!silent) Logger.error('errNoListArea');
    return null;
  }

  function scanVisibleNumbers(container) {
    if (!container) return;
    
    try {
      const spans = container.querySelectorAll('span[dir="auto"]');
      let newFound = 0;
      
      spans.forEach(span => {
        const text = span.textContent.trim();
        if (/^\+?\d[\d\s\-()]{7,}$/.test(text) && !collectedPhones.has(text)) {
          
          let name = 'Bilinmiyor';
          const row = span.closest('div[role="listitem"]') || span.parentElement.closest('div[style*="height"]') || span.closest('div');
          if (row) {
             const allTexts = row.querySelectorAll('span[dir="auto"], span[title]');
             for (let el of allTexts) {
                const t = el.textContent.trim();
                // Admin gibi tagleri veya numaranın ta kendisini isim olarak atamaktan kaçın
                if (t && t !== text && !/^\+?\d[\d\s\-()]{7,}$/.test(t) && !['Admin', 'Grup yöneticisi', 'Group admin'].includes(t)) {
                   if (t.startsWith('~')) {
                      name = t.substring(1).trim();
                      break;
                   } else if (name === 'Bilinmiyor' && t.length > 1) { // Normal profil ismi (rehbere kayıtlı olabilir vs)
                      name = t;
                   }
                }
             }
          }
          // İsim içerisindeki virgüller CSV formatını bozmasın diye siliyoruz
          name = name.replace(/,/g, '');

          let country = text.split(' ')[0];
          if (!country.includes('+')) {
             if (text.startsWith('0')) country = 'TR'; // Bölgesel format 05... ise
             else country = 'Bilinmiyor';
          }
          
          collectedPhones.set(text, { country, name, phone: text });
          newFound++;
          const status = document.getElementById('wa-extractor-status');
          if (status) {
            status.textContent = `> ${t('statusCollected')}: ${collectedPhones.size}\n> ${t('statusLast')}: ${text}`;
          }
        }
      });
      
      if (newFound > 0) {
        Logger.info('logScanSuccess', newFound, collectedPhones.size);
      }
    } catch (err) {
      Logger.error('errScanFail', err);
    }
  }

  // Arayüz metinlerini dilden çekerek güncelleyen fonksiyon
  function updateUITexts() {
    const startBtn = document.getElementById('wa-ext-btn-start');
    if(startBtn) startBtn.innerText = t('btnStart');

    const autoBtn = document.getElementById('wa-ext-btn-auto');
    if (autoBtn) {
      if (autoScrollInterval) {
        autoBtn.innerText = t('btnScrollStop');
      } else if (autoBtn.innerText.includes('Durdur') || autoBtn.innerText.includes('Stop')) { 
        autoBtn.innerText = t('btnScrollStop');
      } else if (autoBtn.innerText.includes('Devam') || autoBtn.innerText.includes('Resume')) {
        autoBtn.innerText = t('btnScrollResume');
      } else if (autoBtn.innerText.includes('Bitti') || autoBtn.innerText.includes('Done')) {
        autoBtn.innerText = t('btnScrollDone');
      } else {
        autoBtn.innerText = t('btnAutoScroll');
      }
    }

    const stopBtn = document.getElementById('wa-ext-btn-stop');
    if(stopBtn) stopBtn.innerText = t('btnStop');

    const copyBtn = document.getElementById('wa-ext-btn-copy');
    if(copyBtn) copyBtn.innerText = t('btnCopy');

    const toggleLogBtn = document.getElementById('wa-ext-btn-log');
    if(toggleLogBtn) {
      toggleLogBtn.innerText = isLogOpen ? t('btnSysLogsClose') : t('btnSysLogs');
    }
    const langBtn = document.getElementById('wa-ext-btn-lang');
    if(langBtn) langBtn.innerText = currentLang.toUpperCase();
    const statusObj = document.getElementById('wa-extractor-status');
    if(statusObj) {
      statusObj.style.color = '#00ff00';
      const numCount = collectedPhones ? collectedPhones.size : 0;
      if (numCount === 0) {
        statusObj.textContent = `> ${t('statusReady')}\n> ${t('statusCollected')}: 0`;
      } else {
        const lastNum = Array.from(collectedPhones.keys()).pop();
        statusObj.textContent = `> ${t('statusCollected')}: ${numCount}\n> ${t('statusLast')}: ${lastNum}`;
      }
    }
    
    const logHeader = document.getElementById('wa-extractor-log-header');
    if(logHeader) logHeader.firstChild.textContent = t('logHeader');

    const clearLogBtn = document.getElementById('wa-extractor-log-clear');
    if(clearLogBtn) clearLogBtn.innerText = t('logClear');

    const labelActions = document.getElementById('wa-ext-label-actions');
    if(labelActions) labelActions.innerText = t('labelActions');

    const labelStatus = document.getElementById('wa-ext-label-status');
    if(labelStatus) labelStatus.innerText = t('labelStatus');

    // Mevcut logları yeni dile göre güncelle
    const logTerm = document.getElementById('wa-extractor-log-terminal');
    if (logTerm) {
      logTerm.textContent = '';
      logHistory.forEach(item => {
        const timeStr = new Date().toLocaleTimeString(currentLang === 'tr' ? 'tr-TR' : 'en-US');
        const msg = t(item.key, ...item.params);
        const line = document.createElement('div');
        line.style.color = item.color;
        line.style.marginBottom = '6px';
        line.style.wordBreak = 'break-word';
        line.innerText = `[${timeStr}] ${item.icon} ${msg} ${item.rawErr ? String(item.rawErr) : ''}`;
        logTerm.appendChild(line);
      });
      logTerm.scrollTop = logTerm.scrollHeight;
    }
  }

  function createUI() {
    if (document.getElementById('wa-extractor-main-toggle')) return;
    Logger.info('logInit');

    // CSS HOVER VE STİL DESTEĞİ
    const scopeWrapper = document.createElement('div');
    scopeWrapper.id = 'wa-98-scope';
    Object.assign(scopeWrapper.style, {
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      zIndex: '9999999',
      pointerEvents: 'none', // İç nesnelere tıklama izni verip Wrapper'a vermiyoruz
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontFamily: 'Tahoma, "MS Sans Serif", sans-serif'
    });

    scopeWrapper.innerHTML = `
      <style>
        #wa-98-scope * { 
          pointer-events: auto; 
          font-family: Tahoma, "Microsoft Sans Serif", sans-serif !important; 
          color: #000 !important;
        }
        #wa-98-scope .window {
          background-color: #c0c0c0 !important;
        }
        #wa-98-scope .title-bar {
          background: linear-gradient(90deg, #000080, #1084d0) !important;
        }
        #wa-98-scope .title-bar-text {
          color: #fff !important;
        }
        #wa-98-scope #wa-extractor-status,
        #wa-98-scope #wa-extractor-log-terminal {
          color: #00ff00 !important;
          background-color: #000 !important;
        }
        #wa-98-scope #wa-extractor-status .log-line,
        #wa-98-scope #wa-extractor-log-terminal .log-line {
          color: inherit !important;
        }
        #wa-extractor-log-terminal, #wa-extractor-status {
          font-family: 'Fixedsys', 'Courier New', monospace !important;
          font-size: 14px !important;
          white-space: pre-wrap !important;
        }
        #wa-98-scope .hide { display: none !important; }
        .wa-ext-col { 
          display: flex; 
          flex-direction: column; 
          gap: 5px; 
          padding: 10px 6px 6px 6px !important; 
          margin: 0 !important;
        }
        .wa-ext-col button, #wa-ext-btn-log, #wa-extractor-log-clear { 
          width: 100% !important; 
          box-sizing: border-box !important; 
          display: block !important; 
        }
        #wa-ext-label-status { padding-left: 2px; }
        .title-bar-controls button { 
          min-width: 40px !important; 
          height: 20px !important; 
          padding: 0 5px !important; 
          font-size: 11px !important; 
          margin-left: 3px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          background-position: center !important;
        }
        #wa-ext-btn-feedback { background-image: none !important; }
        #wa-ext-btn-telegram { 
          background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWklEQVR4nM1RMRIAIAjCrv9/uaaGDKnOhpgKESkBjbapoxw0SxNlkIKfHqZIJ7CDFFJXL4ZQw+gJzQmjOzXYNU86ShLe1wcsswUDHqzRG7AfB+FsOQgxG/AROsu2ExI+hlmGAAAAAElFTkSuQmCC') !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-size: 14px 14px !important;
        }
        #wa-extractor-window .title-bar { cursor: move; }
        #wa-extractor-window .title-bar button { cursor: pointer; }
        
        #wa-extractor-log-terminal {
          transition: max-height 0.2s steps(6), opacity 0.2s steps(2), margin-top 0.2s steps(6);
          max-height: 0;
          opacity: 0;
          margin-top: 0 !important;
          overflow: hidden;
        }
        #wa-extractor-log-clear {
          transition: opacity 0.2s steps(2);
          opacity: 0;
        }
        @keyframes win98-appear {
          0% { transform: scale(0.95); opacity: 0; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes win98-disappear {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.02); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0; }
        }
        .win98-anim {
          animation: win98-appear 0.15s steps(4) forwards;
        }
        .win98-anim-out {
          animation: win98-disappear 0.15s steps(4) forwards;
        }
      </style>

      <div id="wa-extractor-window" class="window hide" style="width: 280px; margin-bottom: 5px;">
        <div class="title-bar">
          <div class="title-bar-text">WA Extractor</div>
          <div class="title-bar-controls">
            <button id="wa-ext-btn-lang" aria-label="Language">EN</button>
            <button id="wa-ext-btn-feedback" aria-label="Help">?</button>
            <button id="wa-ext-btn-telegram" aria-label="Feedback"></button>
            <button id="wa-ext-btn-close" aria-label="Close"></button>
          </div>
        </div>
        
        <div class="window-body">
          <fieldset class="wa-ext-col">
            <legend id="wa-ext-label-actions">Actions</legend>
            <button id="wa-ext-btn-start">Start</button>
            <button id="wa-ext-btn-auto" class="hide">Auto Scroll</button>
            <button id="wa-ext-btn-copy" class="hide">Copy</button>
            <button id="wa-ext-btn-stop" class="hide">Stop</button>
          </fieldset>

          <div class="field-row-stacked" style="margin-top: 8px;">
            <label id="wa-ext-label-status">Status Info</label>
            <div id="wa-extractor-status" class="sunken-panel" style="padding: 10px; min-height: 70px; word-break: break-all; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 14px; background: black; color: #00ff00; line-height: 1.5;"></div>
          </div>

          <div style="margin-top: 8px;">
            <button id="wa-ext-btn-log" style="width: 100%;">System Logs</button>
          </div>

          <div id="wa-extractor-log-terminal" class="sunken-panel" style="padding: 6px; overflow-y: auto; background: black; color: #00ff00; font-family: 'Fixedsys', 'Courier New', monospace; font-size: 12px;"></div>
          
          <button id="wa-extractor-log-clear" class="hide" style="width: 100%; margin-top: 4px;">Clear Logs</button>
        </div>
      </div>
      
      <button id="wa-extractor-main-toggle" style="width: 55px; height: 34px; font-weight: bold; font-size: 13px;">WA</button>
    `;
    
    document.body.appendChild(scopeWrapper);

    // Değişken Taramaları (Events İçin)
    const mainToggleBtn = document.getElementById('wa-extractor-main-toggle');
    const bottomWrapper = document.getElementById('wa-extractor-window');
    const startBtn = document.getElementById('wa-ext-btn-start');
    const autoBtn = document.getElementById('wa-ext-btn-auto');
    const copyBtn = document.getElementById('wa-ext-btn-copy');
    const stopBtn = document.getElementById('wa-ext-btn-stop');
    const langBtn = document.getElementById('wa-ext-btn-lang');
    const feedbackBtn = document.getElementById('wa-ext-btn-feedback');
    const telegramBtn = document.getElementById('wa-ext-btn-telegram');
    const closeBtn = document.getElementById('wa-ext-btn-close');
    const status = document.getElementById('wa-extractor-status');
    const toggleLogBtn = document.getElementById('wa-ext-btn-log');
    const logContainer = document.getElementById('wa-extractor-log-terminal');
    const clearLogBtn = document.getElementById('wa-extractor-log-clear');
    const logContent = logContainer; // Log kayıtları doğrudan containere düşecek

    // UI metinlerini güvenli yoldan (textContent/innerText) yerleştiriyoruz
    updateUITexts();

    // Önceden birikmiş logları UI'a bas
    logHistory.forEach(item => {
      const msg = t(item.key, ...item.params);
      const line = document.createElement('div');
      line.style.color = item.color;
      line.style.marginBottom = '6px';
      line.style.wordBreak = 'break-word';
      line.innerText = `[${item.time}] ${item.icon} ${msg} ${item.rawErr ? String(item.rawErr) : ''}`;
      logContent.appendChild(line);
    });

    // Event Dinleyicileri
    langBtn.onclick = () => {
      currentLang = currentLang === 'tr' ? 'en' : 'tr';
      Logger.info('logLangChanged', currentLang);
      updateUITexts(); // Arayüzü yeni dile uyarla
    };

    feedbackBtn.onclick = () => {
      Logger.info('logFeedbackOpen');
      const helpFile = currentLang === 'tr' ? 'help-tr.html' : 'help-en.html';
      const helpUrl = browser.runtime.getURL(helpFile);
      window.open(helpUrl, '_blank');
    };

    telegramBtn.onclick = () => {
      window.open('https://t.me/aybrkaknc', '_blank');
    };

    // --- SÜRÜKLEME (DRAG) MEKANIĞI ---
    const titleBar = bottomWrapper.querySelector('.title-bar');
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
      // Butonlara tıklandığında sürükleme başlatma
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      dragOffsetX = e.clientX - scopeWrapper.getBoundingClientRect().left;
      dragOffsetY = e.clientY - scopeWrapper.getBoundingClientRect().top;
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      let newX = e.clientX - dragOffsetX;
      let newY = e.clientY - dragOffsetY;

      // Ekran sınırlarının dışına çıkmayı önle
      const maxX = window.innerWidth - scopeWrapper.offsetWidth;
      const maxY = window.innerHeight - scopeWrapper.offsetHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // bottom/right konumlandırmasını geçersiz kılıp top/left kullan
      scopeWrapper.style.bottom = 'auto';
      scopeWrapper.style.right = 'auto';
      scopeWrapper.style.left = newX + 'px';
      scopeWrapper.style.top = newY + 'px';
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });

    let isUIVisible = false;
    
    const toggleWindow = () => {
      isUIVisible = !isUIVisible;
      if (isUIVisible) {
        bottomWrapper.classList.remove('hide');
        bottomWrapper.classList.add('win98-anim');
        mainToggleBtn.classList.add('hide'); // Ana pencere açılınca butonu gizle
        setTimeout(() => bottomWrapper.classList.remove('win98-anim'), 200);
      } else {
        bottomWrapper.classList.add('win98-anim-out');
        // Animasyonun bitmesini (150ms) bekle, sonra gizle ve konumu sıfırla
        setTimeout(() => {
          bottomWrapper.classList.add('hide');
          bottomWrapper.classList.remove('win98-anim-out');
          // Konumu başlangıç noktasına (sağ alt köşe) sıfırla
          scopeWrapper.style.top = 'auto';
          scopeWrapper.style.left = 'auto';
          scopeWrapper.style.bottom = '15px';
          scopeWrapper.style.right = '15px';
          mainToggleBtn.classList.remove('hide');
        }, 150);
      }
    };
    
    mainToggleBtn.onclick = toggleWindow;
    closeBtn.onclick = toggleWindow;


    toggleLogBtn.onclick = () => {
      isLogOpen = !isLogOpen;
      if (isLogOpen) {
        logContainer.style.maxHeight = '120px';
        logContainer.style.opacity = '1';
        logContainer.style.marginTop = '6px';
        clearLogBtn.classList.remove('hide');
        clearLogBtn.style.opacity = '1';
        toggleLogBtn.innerText = t('btnSysLogsClose');
        setTimeout(() => logContent.scrollTop = logContent.scrollHeight, 150);
      } else {
        logContainer.style.maxHeight = '0';
        logContainer.style.opacity = '0';
        logContainer.style.marginTop = '0';
        clearLogBtn.style.opacity = '0';
        setTimeout(() => {
          if(!isLogOpen) clearLogBtn.classList.add('hide');
        }, 300);
        toggleLogBtn.innerText = t('btnSysLogs');
      }
    };

    clearLogBtn.onclick = () => {
      logContainer.innerHTML = '';
      logHistory.length = 0;
      Logger.info('logClearSuccess');
    };

    startBtn.onclick = () => {
      const status = document.getElementById('wa-extractor-status');
      if (status) status.style.color = '#00ff00';
      Logger.info('logStartClicked');
      const scrollArea = findActiveScrollContainer();

      if (!scrollArea) {
        Logger.error('errNoList');
        alert(t('alertNoList'));
        return;
      }

      scrollArea.style.border = '2px dashed #25D366';

      startBtn.classList.add('hide');
      autoBtn.classList.remove('hide');
      copyBtn.classList.remove('hide');
      stopBtn.classList.remove('hide');

      scanVisibleNumbers(scrollArea);

      if (observer) observer.disconnect();
      observer = new MutationObserver(() => scanVisibleNumbers(scrollArea));
      observer.observe(scrollArea, { childList: true, subtree: true });
      Logger.info('logScanStart');

      // Modalın kullanıcı tarafından kapatılıp kapatılmadığını kontrol et
      if (modalCheckInterval) clearInterval(modalCheckInterval);
      modalCheckInterval = setInterval(() => {
        // Modal DOM'dan silinmişse veya gizlenmişse (React dom mount/unmount)
        if (!document.body.contains(scrollArea) || scrollArea.offsetHeight === 0 || scrollArea.offsetWidth === 0) {
          Logger.warn('logModalClosed');
          stopBtn.click();
        }
      }, 1000);
    };

    autoBtn.onclick = () => {
      Logger.info('logAutoScrollClicked');
      if (!autoScrollInterval) {
        autoBtn.innerText = t('btnScrollStop');
        let lastPos = -1;
        let stuckCount = 0;

        autoScrollInterval = setInterval(() => {
          const scrollArea = findActiveScrollContainer();
          if (!scrollArea) {
            Logger.warn('errScrollNoList');
            return;
          }

          scanVisibleNumbers(scrollArea);

          if (scrollArea.scrollTop === lastPos) {
            stuckCount++;
            if (stuckCount > 4) {
              Logger.info('logScanDone');
              clearInterval(autoScrollInterval);
              autoScrollInterval = null;
              autoBtn.innerText = t('btnScrollDone');
              playDoneSound();
            }
          } else {
            stuckCount = 0;
            lastPos = scrollArea.scrollTop;
            scrollArea.scrollTop += 500;
          }
        }, 800);
      } else {
        Logger.info('logAutoScrollPaused');
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
        autoBtn.innerText = t('btnScrollResume');
      }
    };

    copyBtn.onclick = () => {
      if (collectedPhones.size === 0) {
        alert(t('alertNoNum'));
        return;
      }
      const textToCopy = Array.from(collectedPhones.keys()).join('\n');
      navigator.clipboard.writeText(textToCopy).then(() => {
        const oldText = copyBtn.innerText;
        copyBtn.innerText = t('alertCopied');
        setTimeout(() => copyBtn.innerText = oldText, 2000);
        Logger.info('logCopied');
      }).catch(err => {
        Logger.error('errCopy', err);
      });
    };

    stopBtn.onclick = () => {
      Logger.info('logStopClicked');
      if (modalCheckInterval) {
        clearInterval(modalCheckInterval);
        modalCheckInterval = null;
      }
      if (observer) observer.disconnect();
      if (autoScrollInterval) clearInterval(autoScrollInterval);

      if (collectedPhones.size > 0) {
        try {
          // sep=; satırı Excel'in ayıracı otomatik tanımasını sağlar
          const csvRows = ['sep=;', t('csvHeaders')];
          for (const [key, data] of collectedPhones.entries()) {
             csvRows.push(`${data.country};"${data.name}";${data.phone}`);
          }
          const content = csvRows.join('\n');
          // UTF-8 BOM ekliyoruz ki Excel Türkçe karakterleri doğru okusun
          const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `wa_list_${new Date().getTime()}.csv`;
          a.click();
          Logger.info('logExportSuccess', collectedPhones.size);
        } catch (err) {
          Logger.error('errExport', err);
        }
      } else {
        Logger.warn('warnNoNum');
        alert(t('alertNoNum'));
      }

      // UI Reset
      Logger.info('logReset');
      const scrollArea = findActiveScrollContainer();
      if (scrollArea) scrollArea.style.border = 'none';
      
      autoBtn.classList.add('hide');
      copyBtn.classList.add('hide');
      stopBtn.classList.add('hide');
      startBtn.classList.remove('hide');
      autoBtn.innerText = t('btnAutoScroll');
      
      collectedPhones.clear();
      status.style.color = '#00ff00';
      status.textContent = `> ${t('statusReady')}\n> ${t('statusCollected')}: 0`;
    };
  }

  // SPA Geçişlerinde UI kontrolü
  setInterval(createUI, 2000);
})();
