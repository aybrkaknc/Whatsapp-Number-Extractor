const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

test('csvCell quotes values and escapes quotes', () => {
  const WA = load();
  assert.strictEqual(WA.csvCell('Ali'), '"Ali"');
  assert.strictEqual(WA.csvCell('Ali "Veli"'), '"Ali ""Veli"""');
});

test('csvCell blocks spreadsheet formulas', () => {
  const WA = load();
  for (const value of ['=HACK()', '+1', '-1', '@SUM(A1)']) {
    assert.strictEqual(WA.csvCell(value), `"'${value}"`);
  }
});

test('phoneCell writes phone-like values as text formulas', () => {
  const WA = load();
  assert.strictEqual(WA.phoneCell('+90 532 111 22 33'), '"=""+90 532 111 22 33"""');
  assert.strictEqual(WA.phoneCell('+1'), '"=""+1"""');
});

test('phoneCell falls back to csvCell for other text', () => {
  const WA = load();
  assert.strictEqual(WA.phoneCell('Türkiye (+90)'), '"Türkiye (+90)"');
  assert.strictEqual(WA.phoneCell('=1+1'), `"'=1+1"`);
});
