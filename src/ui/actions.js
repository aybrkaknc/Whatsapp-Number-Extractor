(() => {
  const WA = globalThis.WA ||= {};

  const playDoneSound = () => {
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
      // Browsers limit open audio contexts, so close this one when the beep ends
      osc.onended = () => ctx.close();
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  };

  // Start, Auto Scroll, Copy and Finish & DL buttons
  WA.bindActions = () => {
    const { Logger, t, state } = WA;
    const startBtn = document.getElementById('wa-ext-btn-start');
    const autoBtn = document.getElementById('wa-ext-btn-auto');
    const copyBtn = document.getElementById('wa-ext-btn-copy');
    const stopBtn = document.getElementById('wa-ext-btn-stop');
    const status = document.getElementById('wa-extractor-status');

    const stopAutoScroll = () => {
      if (state.autoScroller) state.autoScroller.stop();
      state.autoScroller = null;
    };

    // Auto Scroll, Copy and Finish & DL enter in a short row, one step after the other
    const showScanButtons = () => {
      const step = WA.motion('--wa-dur-fast') / 2;
      [autoBtn, copyBtn, stopBtn].forEach((btn, i) => WA.setHidden(btn, false, { delay: i * step }));
    };

    startBtn.onclick = () => {
      status.style.color = '#00ff00';
      Logger.info('logStartClicked');
      const scrollArea = WA.findActiveScrollContainer();

      if (!scrollArea) {
        Logger.error('errNoList');
        WA.showNotice('alertNoList');
        return;
      }

      scrollArea.style.border = '2px dashed #25D366';

      // The old button hides at once, the new group enters one button after the other
      WA.setHidden(startBtn, true, { instant: true });
      showScanButtons();

      autoBtn.innerText = t('btnAutoScroll');
      // A merged list spans several groups, so one group's participant count is no longer a total
      state.total = state.phones.size > 0 ? null : WA.findParticipantTotal();
      WA.setPhase('phaseScanning');
      WA.scanVisibleNumbers(scrollArea);

      // A scroll fires many DOM mutations; they share one scan that runs when the browser is idle
      if (state.observer) state.observer.disconnect();
      state.observer = new MutationObserver(() => WA.scheduleScan(scrollArea));
      state.observer.observe(scrollArea, { childList: true, subtree: true });
      Logger.info('logScanStart');

      // Stop scanning when the user closes the modal, but keep the data for download
      if (state.modalCheckInterval) clearInterval(state.modalCheckInterval);
      state.modalCheckInterval = setInterval(() => {
        if (document.body.contains(scrollArea) && scrollArea.offsetHeight !== 0 && scrollArea.offsetWidth !== 0) return;
        WA.flushScan();
        Logger.warn('logModalClosed');
        clearInterval(state.modalCheckInterval);
        state.modalCheckInterval = null;
        if (state.observer) state.observer.disconnect();
        if (state.autoScroller) {
          stopAutoScroll();
          autoBtn.innerText = t('btnScrollResume');
        }
        // Another group can be opened and scanned into the same list
        WA.setHidden(autoBtn, true, { instant: true });
        WA.setHidden(startBtn, false);
        WA.setPhase('phaseStopped');
        WA.renderStatus();
      }, 1000);
    };

    autoBtn.onclick = () => {
      Logger.info('logAutoScrollClicked');
      if (state.autoScroller) {
        Logger.info('logAutoScrollPaused');
        stopAutoScroll();
        autoBtn.innerText = t('btnScrollResume');
        WA.setPhase('phasePaused');
        return;
      }

      autoBtn.innerText = t('btnScrollStop');
      WA.setPhase('phaseScrolling');

      // The list is scrolled continuously (src/autoscroll.js); these callbacks only report back
      let lostLogged = false;
      state.autoScroller = WA.startAutoScroll({
        getArea: () => WA.findActiveScrollContainer(true),
        scan: (area) => WA.scheduleScan(area),
        onLost: () => {
          // Logged once per loss, not on every look
          if (lostLogged) return;
          lostLogged = true;
          Logger.warn('errScrollNoList');
        },
        onDone: () => {
          WA.flushScan();
          Logger.info('logScanDone');
          state.autoScroller = null;
          autoBtn.innerText = t('btnScrollDone');
          WA.setPhase('phaseDone');
          if (WA.settings.sound) playDoneSound();
        }
      });
    };

    copyBtn.onclick = () => {
      if (state.phones.size === 0) {
        WA.showNotice('alertNoNum');
        return;
      }
      const phones = WA.filterPhones(state.phones);
      if (phones.size === 0) {
        WA.showNotice('warnFilterEmpty');
        return;
      }
      const separator = WA.settings.copyFormat === 'comma' ? ', ' : '\n';
      navigator.clipboard.writeText(Array.from(phones.values(), p => p.phone).join(separator)).then(() => {
        const oldText = copyBtn.innerText;
        copyBtn.innerText = t('alertCopied');
        setTimeout(() => copyBtn.innerText = oldText, 2000);
        Logger.info('logCopied');
      }).catch(err => {
        Logger.error('errCopy', err);
        WA.showNotice('errCopy', 'error');
      });
    };

    stopBtn.onclick = () => {
      Logger.info('logStopClicked');
      if (state.modalCheckInterval) {
        clearInterval(state.modalCheckInterval);
        state.modalCheckInterval = null;
      }
      if (state.observer) state.observer.disconnect();
      stopAutoScroll();
      // A scan that is still waiting must finish before the list is read
      WA.flushScan();

      const isEmpty = state.phones.size === 0;
      const phones = WA.filterPhones(state.phones);

      // Nothing matches the country filter: keep the list so the filter can be changed
      if (!isEmpty && phones.size === 0) {
        WA.setPhase('phaseStopped');
        WA.showNotice('warnFilterEmpty');
        return;
      }

      let exportFailed = false;
      if (!isEmpty) {
        try {
          Logger.info('logCountrySummary', WA.countrySummary(phones));
          if (phones.size !== state.phones.size) Logger.info('logFiltered', phones.size, state.phones.size);
          WA.downloadExport(phones);
          Logger.info('logExportSuccess', phones.size);
        } catch (err) {
          Logger.error('errExport', err);
          exportFailed = true;
        }
      } else {
        Logger.warn('warnNoNum');
      }

      // Keep the numbers if the download failed, so the user can retry
      if (exportFailed) {
        WA.setPhase('phaseStopped');
        WA.showNotice('errExport', 'error');
        return;
      }

      // Reset the UI for the next run; the modal may already be closed, so search silently
      Logger.info('logReset');
      const scrollArea = WA.findActiveScrollContainer(true);
      if (scrollArea) scrollArea.style.border = 'none';

      [autoBtn, copyBtn, stopBtn].forEach(btn => WA.setHidden(btn, true, { instant: true }));
      WA.setHidden(startBtn, false);
      autoBtn.innerText = t('btnAutoScroll');

      state.phones.clear();
      state.total = null;
      state.phase = 'phaseReady';
      WA.savePhones();
      WA.renderStatus();
      // Shown after the reset so renderStatus() does not overwrite it
      if (isEmpty) WA.showNotice('alertNoNum');
    };
  };
})();
