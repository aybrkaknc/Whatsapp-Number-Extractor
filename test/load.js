const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
// Content scripts without UI code, in manifest order
const FILES = [
  'src/state.js',
  'src/i18n/tr.js',
  'src/i18n/en.js',
  'src/i18n/i18n.js',
  'src/settings.js',
  'src/session.js',
  'src/logger.js',
  'src/country.js',
  'src/export.js',
  'src/scanner.js'
];

// Loads the scripts into a sandbox with just enough of `document` for module setup.
// `store` backs a fake chrome.storage.local so settings tests can inspect what was saved,
// `session` (a Map) backs a fake sessionStorage shared between simulated page loads.
module.exports = (lang = 'tr', store = {}, session = new Map()) => {
  const storage = {
    get: async (key) => ({ [key]: store[key] }),
    set: async (items) => { Object.assign(store, JSON.parse(JSON.stringify(items))); }
  };
  const sessionStorage = {
    getItem: (key) => (session.has(key) ? session.get(key) : null),
    setItem: (key, value) => { session.set(key, String(value)); },
    removeItem: (key) => { session.delete(key); }
  };
  const context = vm.createContext({
    document: { documentElement: { lang } }, Intl, console, sessionStorage, chrome: { storage: { local: storage } }
  });
  for (const file of FILES) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
  }
  return context.WA;
};
