(() => {
  const WA = globalThis.WA ||= {};

  // Opt-in (settings.keepOnReload): the collected list survives a page reload in this tab.
  // sessionStorage is cleared when the tab closes and after Finish & DL.
  const KEY = 'wa-extractor-phones';
  const session = () => globalThis.sessionStorage;

  let timer = null;

  // Writing the whole list is costly once it is long, so while scanning it is saved at most once a
  // second, not after every batch. Nothing is scheduled at all when the option is off.
  WA.savePhonesSoon = () => {
    if (!WA.settings.keepOnReload || timer !== null) return;
    timer = setTimeout(() => WA.savePhones(), 1000);
  };

  // Saves right now (Finish & DL, turning the option off, leaving the page)
  WA.savePhones = () => {
    clearTimeout(timer);
    timer = null;
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
