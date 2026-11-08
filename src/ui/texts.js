(() => {
  const WA = globalThis.WA ||= {};

  WA.renderStatus = () => {
    const status = document.getElementById('wa-extractor-status');
    if (!status) return;
    const t = WA.t;
    const phones = WA.state.phones;
    if (phones.size === 0) {
      status.textContent = `> ${t('statusReady')}\n> ${t('statusCollected')}: 0`;
    } else {
      const lastNum = Array.from(phones.keys()).pop();
      status.textContent = `> ${t('statusCollected')}: ${phones.size}\n> ${t('statusLast')}: ${lastNum}`;
    }
  };

  // Re-applies every user-facing text in the current language
  WA.updateUITexts = () => {
    const t = WA.t;
    const state = WA.state;
    const setText = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.innerText = t(key);
    };

    setText('wa-ext-btn-start', 'btnStart');
    setText('wa-ext-btn-stop', 'btnStop');
    setText('wa-ext-btn-copy', 'btnCopy');
    setText('wa-ext-btn-log', state.isLogOpen ? 'btnSysLogsClose' : 'btnSysLogs');
    setText('wa-extractor-log-clear', 'logClear');
    setText('wa-ext-label-actions', 'labelActions');
    setText('wa-ext-label-status', 'labelStatus');

    // Keep the auto scroll button in the same state, only translate it
    const autoBtn = document.getElementById('wa-ext-btn-auto');
    if (autoBtn) {
      const current = autoBtn.innerText;
      if (state.autoScrollInterval || current.includes('Durdur') || current.includes('Stop')) {
        autoBtn.innerText = t('btnScrollStop');
      } else if (current.includes('Devam') || current.includes('Resume')) {
        autoBtn.innerText = t('btnScrollResume');
      } else if (current.includes('Bitti') || current.includes('Done')) {
        autoBtn.innerText = t('btnScrollDone');
      } else {
        autoBtn.innerText = t('btnAutoScroll');
      }
    }

    const langBtn = document.getElementById('wa-ext-btn-lang');
    if (langBtn) langBtn.innerText = state.lang.toUpperCase();

    [['wa-ext-btn-lang', 'ariaLang'], ['wa-ext-btn-feedback', 'ariaHelp'], ['wa-ext-btn-telegram', 'ariaTelegram'], ['wa-ext-btn-close', 'ariaClose']].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.setAttribute('aria-label', t(key));
    });

    const status = document.getElementById('wa-extractor-status');
    if (status) status.style.color = '#00ff00';
    WA.renderStatus();

    const logTerm = document.getElementById('wa-extractor-log-terminal');
    if (logTerm) {
      logTerm.textContent = '';
      WA.logHistory.forEach(item => logTerm.appendChild(WA.createLogLine(item)));
      logTerm.scrollTop = logTerm.scrollHeight;
    }
  };
})();
