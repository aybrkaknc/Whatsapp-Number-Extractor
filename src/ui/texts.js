(() => {
  const WA = globalThis.WA ||= {};

  WA.renderStatus = () => {
    const status = document.getElementById('wa-extractor-status');
    if (!status) return;
    const t = WA.t;
    const phones = WA.state.phones;
    status.style.color = '#00ff00';
    status.style.wordBreak = 'break-all';
    if (phones.size === 0) {
      status.textContent = `> ${t('statusReady')}\n> ${t('statusCollected')}: 0`;
    } else {
      const lastNum = Array.from(phones.values()).pop().phone;
      status.textContent = `> ${t('statusCollected')}: ${phones.size}\n> ${t('statusLast')}: ${lastNum}`;
    }

    // Nothing to copy yet
    const copyBtn = document.getElementById('wa-ext-btn-copy');
    if (copyBtn) copyBtn.disabled = phones.size === 0;

    WA.renderStatusBar();
  };

  // Status bar (phase, collected / total) and the progress bar when the total is known
  WA.renderStatusBar = () => {
    const { state, t } = WA;
    const phase = document.getElementById('wa-ext-sb-phase');
    const count = document.getElementById('wa-ext-sb-count');
    if (phase) phase.textContent = t(state.phase);
    if (count) count.textContent = state.total ? `${state.phones.size} / ${state.total}` : String(state.phones.size);

    const progress = document.getElementById('wa-ext-progress');
    const bar = document.getElementById('wa-ext-progress-bar');
    if (!progress || !bar) return;
    progress.classList.toggle('hide', !state.total);
    if (state.total) bar.style.width = `${Math.min(100, Math.round(state.phones.size / state.total * 100))}%`;
  };

  WA.setPhase = (key) => {
    WA.state.phase = key;
    WA.renderStatusBar();
  };

  // Shows the main or settings view; minimized panels keep only the title bar and the status bar
  WA.renderMinimized = () => {
    const { state, t } = WA;
    const main = document.getElementById('wa-ext-main');
    const settings = document.getElementById('wa-ext-settings');
    if (main) main.classList.toggle('hide', state.minimized || state.view !== 'main');
    if (settings) settings.classList.toggle('hide', state.minimized || state.view !== 'settings');
    if (state.view === 'settings') WA.renderSettings();
    const btn = document.getElementById('wa-ext-btn-minimize');
    if (!btn) return;
    // 98.css draws the minimize / restore icon from the class
    btn.className = state.minimized ? 'restore' : 'minimize';
    const label = t(state.minimized ? 'ariaRestore' : 'ariaMinimize');
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };

  // Fills the settings view with texts in the UI language and the saved values
  WA.renderSettings = () => {
    const { t, settings } = WA;
    const setText = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t(key);
    };
    setText('wa-ext-set-legend', 'settingsTitle');
    setText('wa-ext-set-country-label', 'setDefaultCountry');
    setText('wa-ext-set-delimiter-label', 'setDelimiter');
    setText('wa-ext-set-speed-label', 'setScrollSpeed');
    setText('wa-ext-set-copy-label', 'setCopyFormat');
    setText('wa-ext-set-sound-label', 'setSound');
    setText('wa-ext-set-help', 'btnHelp');
    setText('wa-ext-set-ok', 'btnOk');

    const optionKeys = {
      'wa-ext-set-delimiter': { ';': 'delimiterSemicolon', ',': 'delimiterComma' },
      'wa-ext-set-speed': { slow: 'speedSlow', normal: 'speedNormal', fast: 'speedFast' },
      'wa-ext-set-copy': { lines: 'copyLines', comma: 'copyComma' }
    };
    for (const [id, keys] of Object.entries(optionKeys)) {
      const select = document.getElementById(id);
      if (!select) continue;
      for (const option of select.options) option.textContent = t(keys[option.value]);
    }

    // Country names depend on the UI language, so the list is rebuilt each time
    const country = document.getElementById('wa-ext-set-country');
    if (country) {
      country.replaceChildren(...WA.countryOptions().map(({ dial, label }) => new Option(label, dial)));
      country.value = settings.defaultDial;
    }
    const values = { 'wa-ext-set-delimiter': settings.delimiter, 'wa-ext-set-speed': settings.scrollSpeed, 'wa-ext-set-copy': settings.copyFormat };
    for (const [id, value] of Object.entries(values)) {
      const el = document.getElementById(id);
      if (el) el.value = value;
    }
    const sound = document.getElementById('wa-ext-set-sound');
    if (sound) sound.checked = settings.sound;
  };

  // In-panel replacement for alert(); stays until the next renderStatus().
  // 'warn' is yellow, 'error' is red with a "Critical Error" heading.
  WA.showNotice = (key, level = 'warn') => {
    const status = document.getElementById('wa-extractor-status');
    if (!status) return;
    const t = WA.t;
    status.style.wordBreak = 'normal';
    if (level === 'error') {
      status.style.color = '#f44336';
      status.textContent = `> ${t('errCritical')}\n> ${t(key)}`;
    } else {
      status.style.color = '#ffeb3b';
      status.textContent = `> ${t(key)}`;
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

    [['wa-ext-btn-lang', 'ariaLang'], ['wa-ext-btn-settings', 'ariaSettings'], ['wa-ext-btn-github', 'ariaGithub'], ['wa-ext-btn-close', 'ariaClose']].forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.setAttribute('aria-label', t(key));
      // Tooltip for icon-only buttons
      el.title = t(key);
    });

    WA.renderStatus();
    WA.renderMinimized();

    const logTerm = document.getElementById('wa-extractor-log-terminal');
    if (logTerm) {
      logTerm.textContent = '';
      WA.logHistory.forEach(item => logTerm.appendChild(WA.createLogLine(item)));
      logTerm.scrollTop = logTerm.scrollHeight;
    }
  };
})();
