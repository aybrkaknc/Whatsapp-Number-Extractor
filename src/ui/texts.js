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

  // Minimized panels keep only the title bar and the status bar
  WA.renderMinimized = () => {
    const { state, t } = WA;
    const body = document.querySelector('#wa-extractor-window .window-body');
    if (body) body.classList.toggle('hide', state.minimized);
    const btn = document.getElementById('wa-ext-btn-minimize');
    if (!btn) return;
    // 98.css draws the minimize / restore icon from the class
    btn.className = state.minimized ? 'restore' : 'minimize';
    const label = t(state.minimized ? 'ariaRestore' : 'ariaMinimize');
    btn.setAttribute('aria-label', label);
    btn.title = label;
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

    [['wa-ext-btn-lang', 'ariaLang'], ['wa-ext-btn-help', 'ariaHelp'], ['wa-ext-btn-github', 'ariaGithub'], ['wa-ext-btn-close', 'ariaClose']].forEach(([id, key]) => {
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
