(() => {
  const WA = globalThis.WA ||= {};

  WA.renderStatus = () => {
    const status = document.getElementById('wa-extractor-status');
    if (!status) return;
    const t = WA.t;
    const phones = WA.state.phones;
    const before = status.textContent;
    status.style.color = '#00ff00';
    status.style.wordBreak = 'break-all';
    if (phones.size === 0) {
      status.textContent = `> ${t('statusReady')}\n> ${t('statusCollected')}: 0`;
    } else {
      const lastNum = Array.from(phones.values()).pop().phone;
      status.textContent = `> ${t('statusCollected')}: ${phones.size}\n> ${t('statusLast')}: ${lastNum}`;
    }
    // Flash only when the text really changed, and never restart a flash that is still running
    if (status.textContent !== before) WA.replay(status, 'wa-tick', { restart: false });

    // Nothing to copy yet
    const copyBtn = document.getElementById('wa-ext-btn-copy');
    if (copyBtn) copyBtn.disabled = phones.size === 0;
    // With numbers already collected, Start adds another group to the same list
    const startBtn = document.getElementById('wa-ext-btn-start');
    if (startBtn) startBtn.innerText = t(phones.size > 0 ? 'btnScanNext' : 'btnStart');

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
    WA.setHidden(progress, !state.total);
    if (state.total) bar.style.width = `${Math.min(100, Math.round(state.phones.size / state.total * 100))}%`;
  };

  WA.setPhase = (key) => {
    WA.state.phase = key;
    WA.renderStatusBar();
  };

  // Shows the main or settings view; minimized panels keep only the title bar and the status bar.
  // motion: 'instant' (no animation), 'right' / 'left' (the new view slides in from that side) or
  // 'up' (minimize and restore, the content slides away and back vertically).
  WA.renderMinimized = (motion = 'instant') => {
    const { state, t } = WA;
    const enter = {
      instant: motion === 'instant',
      dx: motion === 'right' ? 12 : motion === 'left' ? -12 : 0,
      dy: motion === 'up' ? 6 : 0
    };
    // Only minimize animates content away; a view switch hides the old view at once so two views never stack
    const leave = { instant: motion !== 'up', dy: 6 };
    const apply = (el, hidden) => WA.setHidden(el, hidden, hidden ? leave : enter);

    apply(document.getElementById('wa-ext-main'), state.minimized || state.view !== 'main');
    apply(document.getElementById('wa-ext-settings'), state.minimized || state.view !== 'settings');
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
    setText('wa-ext-set-format-label', 'setExportFormat');
    setText('wa-ext-set-filter-label', 'setExportCountry');
    setText('wa-ext-set-keep-label', 'setKeepOnReload');
    setText('wa-ext-set-unsaved-label', 'setOnlyUnsaved');
    setText('wa-ext-set-motion-label', 'setMotion');
    setText('wa-ext-set-help', 'btnHelp');
    setText('wa-ext-set-ok', 'btnOk');

    const optionKeys = {
      'wa-ext-set-delimiter': { ';': 'delimiterSemicolon', ',': 'delimiterComma' },
      'wa-ext-set-speed': { slow: 'speedSlow', normal: 'speedNormal', fast: 'speedFast' },
      'wa-ext-set-copy': { lines: 'copyLines', comma: 'copyComma' },
      'wa-ext-set-format': { csv: 'formatCsv', vcf: 'formatVcf', json: 'formatJson' },
      'wa-ext-set-motion': { system: 'motionSystem', on: 'motionOn', off: 'motionOff' }
    };
    for (const [id, keys] of Object.entries(optionKeys)) {
      const select = document.getElementById(id);
      if (!select) continue;
      for (const option of select.options) option.textContent = t(keys[option.value]);
    }

    // Country names depend on the UI language, so the list is rebuilt each time
    const countries = WA.countryOptions();
    const country = document.getElementById('wa-ext-set-country');
    if (country) {
      country.replaceChildren(...countries.map(({ dial, label }) => new Option(label, dial)));
      country.value = settings.defaultDial;
    }
    const filter = document.getElementById('wa-ext-set-filter');
    if (filter) {
      filter.replaceChildren(new Option(t('allCountries'), ''), ...countries.map(({ dial, label }) => new Option(label, dial)));
      filter.value = settings.exportCountry;
    }
    const values = {
      'wa-ext-set-delimiter': settings.delimiter,
      'wa-ext-set-speed': settings.scrollSpeed,
      'wa-ext-set-copy': settings.copyFormat,
      'wa-ext-set-format': settings.exportFormat,
      'wa-ext-set-motion': settings.motion
    };
    for (const [id, value] of Object.entries(values)) {
      const el = document.getElementById(id);
      if (el) el.value = value;
    }
    const checks = { 'wa-ext-set-sound': settings.sound, 'wa-ext-set-keep': settings.keepOnReload, 'wa-ext-set-unsaved': settings.onlyUnsaved };
    for (const [id, value] of Object.entries(checks)) {
      const el = document.getElementById(id);
      if (el) el.checked = value;
    }
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
    // The notice slides in; a new one restarts the slide
    WA.replay(status, 'wa-pop');
  };

  // Re-applies every user-facing text in the current language
  WA.updateUITexts = () => {
    const t = WA.t;
    const state = WA.state;
    const setText = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.innerText = t(key);
    };

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
      if (state.autoScroller || current.includes('Durdur') || current.includes('Stop')) {
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

    // One-time privacy and terms notice until it is dismissed
    setText('wa-ext-notice-text', 'noticeText');
    setText('wa-ext-notice-ok', 'noticeOk');
    const notice = document.getElementById('wa-ext-notice');
    // Instant: this also runs on a language switch, which should not replay the entrance
    WA.setHidden(notice, WA.settings.noticeSeen, { instant: true });

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
