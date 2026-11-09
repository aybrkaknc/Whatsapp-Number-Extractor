(() => {
  const WA = globalThis.WA ||= {};

  // Title bar buttons, dragging, show/hide and the log panel
  WA.bindWindow = (scopeWrapper) => {
    const { Logger, t, state } = WA;
    const mainToggleBtn = document.getElementById('wa-extractor-main-toggle');
    const panel = document.getElementById('wa-extractor-window');
    const toggleLogBtn = document.getElementById('wa-ext-btn-log');
    const logContainer = document.getElementById('wa-extractor-log-terminal');
    const clearLogBtn = document.getElementById('wa-extractor-log-clear');

    document.getElementById('wa-ext-btn-lang').onclick = () => {
      state.lang = state.lang === 'tr' ? 'en' : 'tr';
      WA.saveSettings({ lang: state.lang });
      Logger.info('logLangChanged', state.lang);
      WA.updateUITexts();
    };

    // Gear: switch between the main view and the settings view
    document.getElementById('wa-ext-btn-settings').onclick = () => {
      state.view = state.view === 'settings' ? 'main' : 'settings';
      state.minimized = false;
      WA.renderMinimized();
    };
    document.getElementById('wa-ext-set-ok').onclick = () => {
      state.view = 'main';
      WA.renderMinimized();
    };

    document.getElementById('wa-ext-set-help').onclick = () => {
      Logger.info('logHelpOpen');
      const helpFile = state.lang === 'tr' ? 'help-tr.html' : 'help-en.html';
      window.open((globalThis.browser || chrome).runtime.getURL(helpFile), '_blank');
    };

    // Settings are saved as soon as a field changes
    const bindSetting = (id, key, read, after) => {
      document.getElementById(id).onchange = (e) => {
        WA.saveSettings({ [key]: read(e.target) });
        Logger.info('logSettingsSaved');
        if (after) after();
      };
    };
    bindSetting('wa-ext-set-country', 'defaultDial', el => el.value);
    bindSetting('wa-ext-set-delimiter', 'delimiter', el => el.value);
    bindSetting('wa-ext-set-speed', 'scrollSpeed', el => el.value);
    bindSetting('wa-ext-set-copy', 'copyFormat', el => el.value);
    bindSetting('wa-ext-set-sound', 'sound', el => el.checked);
    bindSetting('wa-ext-set-format', 'exportFormat', el => el.value);
    bindSetting('wa-ext-set-filter', 'exportCountry', el => el.value);
    // Turning it off removes the kept list from the tab right away
    bindSetting('wa-ext-set-keep', 'keepOnReload', el => el.checked, WA.savePhones);

    document.getElementById('wa-ext-btn-github').onclick = () => {
      window.open('https://github.com/aybrkaknc/Whatsapp-Number-Extractor', '_blank');
    };

    // Dragging
    const titleBar = panel.querySelector('.title-bar');
    let isDragging = false;
    let dragOffsetX = 0;
    let dragOffsetY = 0;

    titleBar.addEventListener('mousedown', (e) => {
      if (e.target.tagName === 'BUTTON') return;
      isDragging = true;
      dragOffsetX = e.clientX - scopeWrapper.getBoundingClientRect().left;
      dragOffsetY = e.clientY - scopeWrapper.getBoundingClientRect().top;
      e.preventDefault();
    });

    // WhatsApp may remove the panel and createUI re-binds; drop the previous document listeners first
    if (state.documentListeners) state.documentListeners.abort();
    state.documentListeners = new AbortController();
    const { signal } = state.documentListeners;

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      // Keep the panel inside the viewport
      const maxX = window.innerWidth - scopeWrapper.offsetWidth;
      const maxY = window.innerHeight - scopeWrapper.offsetHeight;
      const newX = Math.max(0, Math.min(e.clientX - dragOffsetX, maxX));
      const newY = Math.max(0, Math.min(e.clientY - dragOffsetY, maxY));

      // Switch from bottom/right anchoring to top/left
      scopeWrapper.style.bottom = 'auto';
      scopeWrapper.style.right = 'auto';
      scopeWrapper.style.left = newX + 'px';
      scopeWrapper.style.top = newY + 'px';
    }, { signal });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    }, { signal });

    // Show / hide
    let isVisible = false;
    const toggleWindow = () => {
      isVisible = !isVisible;
      if (isVisible) {
        panel.classList.remove('hide');
        panel.classList.add('win98-anim');
        mainToggleBtn.classList.add('hide');
        setTimeout(() => panel.classList.remove('win98-anim'), 200);
      } else {
        panel.classList.add('win98-anim-out');
        // Wait for the 150ms animation, then hide and reset to the bottom right corner
        setTimeout(() => {
          panel.classList.add('hide');
          panel.classList.remove('win98-anim-out');
          scopeWrapper.style.top = 'auto';
          scopeWrapper.style.left = 'auto';
          scopeWrapper.style.bottom = '15px';
          scopeWrapper.style.right = '15px';
          mainToggleBtn.classList.remove('hide');
        }, 150);
      }
    };

    mainToggleBtn.onclick = toggleWindow;
    document.getElementById('wa-ext-btn-close').onclick = toggleWindow;

    // Esc closes the panel only while focus is inside it, so WhatsApp's own Esc handling is untouched
    panel.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !isVisible) return;
      e.stopPropagation();
      toggleWindow();
      mainToggleBtn.focus();
    });

    document.getElementById('wa-ext-btn-minimize').onclick = () => {
      state.minimized = !state.minimized;
      WA.renderMinimized();
    };

    // Log panel
    toggleLogBtn.onclick = () => {
      state.isLogOpen = !state.isLogOpen;
      if (state.isLogOpen) {
        logContainer.style.maxHeight = '120px';
        logContainer.style.opacity = '1';
        logContainer.style.marginTop = '6px';
        clearLogBtn.classList.remove('hide');
        clearLogBtn.style.opacity = '1';
        toggleLogBtn.innerText = t('btnSysLogsClose');
        setTimeout(() => logContainer.scrollTop = logContainer.scrollHeight, 150);
      } else {
        logContainer.style.maxHeight = '0';
        logContainer.style.opacity = '0';
        logContainer.style.marginTop = '0';
        clearLogBtn.style.opacity = '0';
        setTimeout(() => {
          if (!state.isLogOpen) clearLogBtn.classList.add('hide');
        }, 300);
        toggleLogBtn.innerText = t('btnSysLogs');
      }
    };

    clearLogBtn.onclick = () => {
      logContainer.innerHTML = '';
      WA.logHistory.length = 0;
      Logger.info('logClearSuccess');
    };
  };
})();
