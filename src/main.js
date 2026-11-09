(() => {
  const WA = globalThis.WA ||= {};

  // Settings first, so the panel opens in the saved language and a kept list can be restored.
  // WhatsApp is a SPA and may remove the panel; re-create it when missing.
  WA.loadSettings().then(() => {
    const restored = WA.restorePhones();
    if (restored > 0) {
      WA.state.phase = 'phaseStopped';
      WA.Logger.info('logRestored', restored);
    }
    setInterval(WA.createUI, 2000);
  });
})();
