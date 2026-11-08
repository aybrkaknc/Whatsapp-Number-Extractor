(() => {
  const WA = globalThis.WA ||= {};

  // WhatsApp is a SPA and may remove the panel; re-create it when missing
  setInterval(WA.createUI, 2000);
})();
