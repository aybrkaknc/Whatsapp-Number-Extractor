(() => {
  const WA = globalThis.WA ||= {};

  const STORAGE_KEY = 'settings';
  const DEFAULTS = {
    // null: not chosen yet, the panel starts in English
    lang: null,
    // Calling code used for local numbers that start with 0
    defaultDial: '90',
    delimiter: ';',
    sound: true,
    scrollSpeed: 'normal',
    copyFormat: 'lines',
    // 'csv', 'vcf' or 'json'
    exportFormat: 'csv',
    // Calling code to export only; '' exports every country
    exportCountry: '',
    // Export and copy only contacts that are not saved in the phone
    onlyUnsaved: false,
    // Keep collected numbers in the tab's sessionStorage across page reloads
    keepOnReload: false,
    // The one-time privacy and terms notice was dismissed
    noticeSeen: false,
    // Animations: 'system' (follow the OS reduced motion setting), 'on' or 'off'
    motion: 'system'
  };

  WA.settings = { ...DEFAULTS };

  // Firefox exposes promise-based `browser`, Chrome MV3 `chrome` returns promises too
  const storage = () => (globalThis.browser || globalThis.chrome).storage.local;

  WA.loadSettings = async () => {
    try {
      const stored = (await storage().get(STORAGE_KEY))[STORAGE_KEY] || {};
      WA.settings = { ...DEFAULTS, ...stored };
    } catch (e) {
      // Storage unavailable: keep the defaults for this page load
    }
    if (WA.settings.lang) WA.state.lang = WA.settings.lang;
  };

  WA.saveSettings = async (changes) => {
    Object.assign(WA.settings, changes);
    try {
      await storage().set({ [STORAGE_KEY]: { ...WA.settings } });
    } catch (e) {
      WA.Logger.error('errSettingsSave', e);
    }
  };
})();
