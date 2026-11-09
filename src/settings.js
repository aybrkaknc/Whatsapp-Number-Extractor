(() => {
  const WA = globalThis.WA ||= {};

  const STORAGE_KEY = 'settings';
  const DEFAULTS = {
    // null: follow WhatsApp's page language
    lang: null,
    // Calling code used for local numbers that start with 0
    defaultDial: '90',
    delimiter: ';',
    sound: true,
    scrollSpeed: 'normal',
    copyFormat: 'lines'
  };

  WA.SCROLL_INTERVALS = { slow: 1200, normal: 800, fast: 500 };
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
