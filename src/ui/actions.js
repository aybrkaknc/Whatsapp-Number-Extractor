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
      clearInterval(state.autoScrollInterval);
      state.autoScrollInterval = null;
    };

    startBtn.onclick = () => {
      status.style.color = '#00ff00';
      Logger.info('logStartClicked');
      const scrollArea = WA.findActiveScrollContainer();

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

      WA.scanVisibleNumbers(scrollArea);

      if (state.observer) state.observer.disconnect();
      state.observer = new MutationObserver(() => WA.scanVisibleNumbers(scrollArea));
      state.observer.observe(scrollArea, { childList: true, subtree: true });
      Logger.info('logScanStart');

      // Stop scanning when the user closes the modal, but keep the data for download
      if (state.modalCheckInterval) clearInterval(state.modalCheckInterval);
      state.modalCheckInterval = setInterval(() => {
        if (document.body.contains(scrollArea) && scrollArea.offsetHeight !== 0 && scrollArea.offsetWidth !== 0) return;
        Logger.warn('logModalClosed');
        clearInterval(state.modalCheckInterval);
        state.modalCheckInterval = null;
        if (state.observer) state.observer.disconnect();
        if (state.autoScrollInterval) {
          stopAutoScroll();
          autoBtn.innerText = t('btnScrollResume');
        }
      }, 1000);
    };

    autoBtn.onclick = () => {
      Logger.info('logAutoScrollClicked');
      if (state.autoScrollInterval) {
        Logger.info('logAutoScrollPaused');
        stopAutoScroll();
        autoBtn.innerText = t('btnScrollResume');
        return;
      }

      autoBtn.innerText = t('btnScrollStop');
      let lastPos = -1;
      let stuckCount = 0;

      state.autoScrollInterval = setInterval(() => {
        const scrollArea = WA.findActiveScrollContainer(true);
        if (!scrollArea) {
          Logger.warn('errScrollNoList');
          return;
        }

        WA.scanVisibleNumbers(scrollArea);

        if (scrollArea.scrollTop === lastPos) {
          stuckCount++;
          if (stuckCount > 4) {
            Logger.info('logScanDone');
            stopAutoScroll();
            autoBtn.innerText = t('btnScrollDone');
            playDoneSound();
          }
        } else {
          stuckCount = 0;
          lastPos = scrollArea.scrollTop;
          scrollArea.scrollTop += 500;
        }
      }, 800);
    };

    copyBtn.onclick = () => {
      if (state.phones.size === 0) {
        alert(t('alertNoNum'));
        return;
      }
      navigator.clipboard.writeText(Array.from(state.phones.keys()).join('\n')).then(() => {
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
      if (state.modalCheckInterval) {
        clearInterval(state.modalCheckInterval);
        state.modalCheckInterval = null;
      }
      if (state.observer) state.observer.disconnect();
      stopAutoScroll();

      if (state.phones.size > 0) {
        try {
          WA.downloadCsv(state.phones);
          Logger.info('logExportSuccess', state.phones.size);
        } catch (err) {
          Logger.error('errExport', err);
        }
      } else {
        Logger.warn('warnNoNum');
        alert(t('alertNoNum'));
      }

      // Reset the UI for the next run
      Logger.info('logReset');
      const scrollArea = WA.findActiveScrollContainer();
      if (scrollArea) scrollArea.style.border = 'none';

      autoBtn.classList.add('hide');
      copyBtn.classList.add('hide');
      stopBtn.classList.add('hide');
      startBtn.classList.remove('hide');
      autoBtn.innerText = t('btnAutoScroll');

      state.phones.clear();
      status.style.color = '#00ff00';
      WA.renderStatus();
    };
  };
})();
