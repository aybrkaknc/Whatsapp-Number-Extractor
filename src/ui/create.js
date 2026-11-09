(() => {
  const WA = globalThis.WA ||= {};

  WA.createUI = () => {
    if (document.getElementById('wa-extractor-main-toggle')) return;
    WA.Logger.info('logInit');

    // WhatsApp may have removed a panel mid-scan; stop timers that point at the old buttons.
    // Collected numbers are kept and still shown in the status box.
    const { state } = WA;
    clearInterval(state.autoScrollInterval);
    clearInterval(state.modalCheckInterval);
    if (state.observer) state.observer.disconnect();
    state.autoScrollInterval = null;
    state.modalCheckInterval = null;
    state.observer = null;
    state.phase = state.phones.size > 0 ? 'phaseStopped' : 'phaseReady';

    const scopeWrapper = document.createElement('div');
    scopeWrapper.id = 'wa-98-scope';
    Object.assign(scopeWrapper.style, {
      position: 'fixed',
      bottom: '15px',
      right: '15px',
      zIndex: '9999999',
      // Clicks pass through the wrapper; panel.css re-enables them on children
      pointerEvents: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      fontFamily: 'Tahoma, "MS Sans Serif", sans-serif'
    });
    // UI_TEMPLATE is static markup; DOMParser avoids an innerHTML assignment
    const doc = new DOMParser().parseFromString(WA.UI_TEMPLATE, 'text/html');
    scopeWrapper.append(...doc.body.childNodes);
    document.body.appendChild(scopeWrapper);

    WA.updateUITexts();
    WA.bindWindow(scopeWrapper);
    WA.bindActions();
  };
})();
