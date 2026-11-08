(() => {
  const WA = globalThis.WA ||= {};

  WA.t = (key, ...args) => {
    let text = WA.strings[WA.state.lang][key] || key;
    args.forEach((val, i) => { text = text.replace(`{${i}}`, val); });
    return text;
  };
})();
