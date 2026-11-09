/*
  WhatsApp Number Extractor
  Collects group member phone numbers and downloads them as CSV.

  All content script files share the WA namespace and are loaded in the
  order listed in manifest.json.
*/

(() => {
  const WA = globalThis.WA ||= {};

  WA.state = {
    // English until the user switches; the choice is then saved (settings.lang)
    lang: 'en',
    phones: new Map(),
    autoScrollInterval: null,
    observer: null,
    modalCheckInterval: null,
    isLogOpen: false,
    documentListeners: null,
    // i18n key shown in the status bar
    phase: 'phaseReady',
    // Participant count read from WhatsApp, null when unknown
    total: null,
    minimized: false,
    // 'main' or 'settings'
    view: 'main'
  };
})();
