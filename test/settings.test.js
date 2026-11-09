const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

test('loadSettings keeps defaults when nothing is stored', async () => {
  const WA = load('tr');
  await WA.loadSettings();
  assert.strictEqual(WA.settings.defaultDial, '90');
  assert.strictEqual(WA.settings.delimiter, ';');
  assert.strictEqual(WA.settings.sound, true);
  assert.strictEqual(WA.state.lang, 'tr');
});

test('loadSettings applies the saved language over the page language', async () => {
  const WA = load('tr', { settings: { lang: 'en', sound: false } });
  await WA.loadSettings();
  assert.strictEqual(WA.state.lang, 'en');
  assert.strictEqual(WA.settings.sound, false);
  assert.strictEqual(WA.settings.delimiter, ';');
});

test('saveSettings writes the merged settings to storage', async () => {
  const store = {};
  const WA = load('tr', store);
  await WA.loadSettings();
  await WA.saveSettings({ delimiter: ',' });
  assert.strictEqual(store.settings.delimiter, ',');
  assert.strictEqual(store.settings.defaultDial, '90');
});

test('local numbers use the default country from the settings', async () => {
  const WA = load('en', { settings: { defaultDial: '49' } });
  await WA.loadSettings();
  const c = WA.detectCountry('0151 23456789');
  assert.strictEqual(`${c.dial}|${c.region}`, '49|DE');
  assert.strictEqual(WA.toE164('0151 23456789', c), '+4915123456789');
});

test('buildCsv uses the delimiter from the settings', async () => {
  const WA = load('en', { settings: { delimiter: ',' } });
  await WA.loadSettings();
  const phones = new Map([['+905321112233', { country: WA.detectCountry('+90 532 111 22 33'), name: 'Ali', phone: '+90 532 111 22 33', isAdmin: false }]]);
  const lines = WA.buildCsv(phones).split('\n');
  assert.strictEqual(lines[0], 'sep=,');
  assert.strictEqual(lines[1], 'Country,Name/Surname,Phone Number,E.164,Admin,Group');
  assert.strictEqual(lines[2].split('","').length, 6);
});

test('countryOptions lists named countries sorted for the UI language', () => {
  const WA = load('tr');
  const options = WA.countryOptions();
  assert.ok(options.some(o => o.dial === '90' && o.label === 'Türkiye (+90)'));
  assert.ok(!options.some(o => o.dial === '1' || o.dial === '7'));
  // The array comes from the sandbox realm, so compare as JSON
  const labels = Array.from(options, o => o.label);
  assert.strictEqual(JSON.stringify(labels), JSON.stringify([...labels].sort((a, b) => a.localeCompare(b, 'tr'))));
});
