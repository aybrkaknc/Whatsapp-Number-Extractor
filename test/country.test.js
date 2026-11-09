const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

// Objects come from the sandbox realm, so compare fields instead of deepStrictEqual
const country = (WA, phone) => {
  const c = WA.detectCountry(phone);
  return c && `${c.dial}|${c.region}`;
};

test('detectCountry reads the calling code with or without spaces', () => {
  const WA = load();
  assert.strictEqual(country(WA, '+90 532 111 22 33'), '90|TR');
  assert.strictEqual(country(WA, '+905321112233'), '90|TR');
  assert.strictEqual(country(WA, '+971 50 123 4567'), '971|AE');
  assert.strictEqual(country(WA, '+420 601 123 456'), '420|CZ');
});

test('detectCountry does not guess shared or unknown codes', () => {
  const WA = load();
  assert.strictEqual(country(WA, '+1 (415) 555-2671'), '1|null');
  assert.strictEqual(country(WA, '+7 912 345 67 89'), '7|null');
  assert.strictEqual(country(WA, '+999 12 3456 7890'), '999|null');
  assert.strictEqual(country(WA, '5321112233 45'), null);
});

test('detectCountry treats local 0 numbers as Turkish', () => {
  assert.strictEqual(country(load(), '05321112233'), '90|TR');
});

test('formatCountry follows the UI language', () => {
  const tr = load('tr');
  const en = load('en');
  assert.strictEqual(tr.formatCountry(null), 'Bilinmiyor');
  assert.strictEqual(en.formatCountry(null), 'Unknown');
  assert.strictEqual(tr.formatCountry({ dial: '1', region: null }), '+1');
  assert.strictEqual(tr.formatCountry({ dial: '49', region: 'DE' }), 'Almanya (+49)');
  assert.strictEqual(en.formatCountry({ dial: '49', region: 'DE' }), 'Germany (+49)');
});
