(() => {
  const WA = globalThis.WA ||= {};

  // Settings first, so the panel opens in the saved language.
  // WhatsApp is a SPA and may remove the panel; re-create it when missing.
  WA.loadSettings().then(() => setInterval(WA.createUI, 2000));
})();
