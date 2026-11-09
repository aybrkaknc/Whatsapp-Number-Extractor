(() => {
  const WA = globalThis.WA ||= {};
  const PREFIX = '[WA-Extractor]';

  // Kept so the log panel can be re-rendered when the language changes
  WA.logHistory = [];

  WA.createLogLine = (item) => {
    const line = document.createElement('div');
    line.className = 'log-line';
    line.style.color = item.color;
    line.style.marginBottom = '6px';
    line.style.wordBreak = 'break-word';
    line.innerText = `[${item.time}] ${item.icon} ${WA.t(item.key, ...item.params)} ${item.rawErr ? String(item.rawErr) : ''}`;
    return line;
  };

  const append = (type, key, params = [], rawErr = '') => {
    const time = new Date().toLocaleTimeString(WA.state.lang === 'tr' ? 'tr-TR' : 'en-US');
    let color = '#ccc';
    let icon = '[i]';
    if (type === 'WARN') { color = '#ffeb3b'; icon = '[!]'; }
    if (type === 'ERROR') { color = '#f44336'; icon = '[x]'; }
    if (type === 'INFO') { color = '#4caf50'; icon = '[>]'; }

    const entry = { type, key, params, rawErr, color, icon, time };
    WA.logHistory.push(entry);

    const panel = document.getElementById('wa-extractor-log-terminal');
    if (panel) {
      panel.appendChild(WA.createLogLine(entry));
      panel.scrollTop = panel.scrollHeight;
    }
  };

  WA.Logger = {
    info: (key, ...params) => {
      console.log(`${PREFIX} [INFO]`, key, params);
      append('INFO', key, params);
    },
    warn: (key, ...params) => {
      console.warn(`${PREFIX} [WARN]`, key, params);
      append('WARN', key, params);
    },
    error: (key, rawErr = '', ...params) => {
      console.error(`${PREFIX} [ERROR]`, key, rawErr, params);
      // Log only; callers decide whether the user needs to see it (WA.showNotice)
      append('ERROR', key, params, rawErr);
    }
  };
})();
