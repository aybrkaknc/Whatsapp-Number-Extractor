(() => {
  const WA = globalThis.WA ||= {};

  // Opt-in (settings.keepOnReload): the collected list survives a page reload in this tab.
  // sessionStorage is cleared when the tab closes and after Finish & DL.
  const KEY = 'wa-extractor-phones';
  const session = () => globalThis.sessionStorage;

  WA.savePhones = () => {
    try {
      if (!WA.settings.keepOnReload || WA.state.phones.size === 0) {
        session().removeItem(KEY);
        return;
      }
      session().setItem(KEY, JSON.stringify(Array.from(WA.state.phones)));
    } catch (e) {
      // sessionStorage blocked or full: the list simply is not kept
    }
  };

  // Returns how many numbers were restored
  WA.restorePhones = () => {
    if (!WA.settings.keepOnReload) return 0;
    try {
      const saved = JSON.parse(session().getItem(KEY) || '[]');
      for (const [key, data] of saved) WA.state.phones.set(key, data);
    } catch (e) {
      return 0;
    }
    return WA.state.phones.size;
  };
})();
