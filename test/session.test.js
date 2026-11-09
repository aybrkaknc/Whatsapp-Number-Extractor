const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

const phone = (WA) => ['+905321112233', {
  country: WA.detectCountry('+90 532 111 22 33'), name: 'Ali', phone: '+90 532 111 22 33', isAdmin: false, group: 'Aile'
}];

test('kept list survives a reload when keepOnReload is on', async () => {
  const session = new Map();
  const first = load('tr', { settings: { keepOnReload: true } }, session);
  await first.loadSettings();
  first.state.phones.set(...phone(first));
  first.savePhones();

  const second = load('tr', { settings: { keepOnReload: true } }, session);
  await second.loadSettings();
  assert.strictEqual(second.restorePhones(), 1);
  assert.strictEqual(second.state.phones.get('+905321112233').group, 'Aile');
});

test('nothing is kept when keepOnReload is off', async () => {
  const session = new Map();
  const WA = load('tr', {}, session);
  await WA.loadSettings();
  WA.state.phones.set(...phone(WA));
  WA.savePhones();
  assert.strictEqual(session.size, 0);
  assert.strictEqual(WA.restorePhones(), 0);
});

test('an empty list clears the kept copy', async () => {
  const session = new Map([['wa-extractor-phones', '[]']]);
  const WA = load('tr', { settings: { keepOnReload: true } }, session);
  await WA.loadSettings();
  WA.savePhones();
  assert.strictEqual(session.has('wa-extractor-phones'), false);
});
