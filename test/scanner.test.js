const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

const PHONE = '+90 532 111 22 33';

test('pickName prefers a ~profile name', () => {
  const WA = load();
  assert.strictEqual(WA.pickName(['Kayıtlı Kişi', PHONE, '~Profil Adı'], PHONE), 'Profil Adı');
});

test('pickName falls back to the saved contact name', () => {
  const WA = load();
  assert.strictEqual(WA.pickName(['Ali Veli', PHONE], PHONE), 'Ali Veli');
});

test('pickName skips admin tags, numbers and single characters', () => {
  const WA = load();
  assert.strictEqual(WA.pickName(['Grup yöneticisi', 'Admin', 'Group admin', PHONE, '+90 555 000 00 00', 'A', '  '], PHONE), '');
});

test('phoneKey merges formatting variants of the same number', () => {
  const WA = load();
  assert.strictEqual(WA.phoneKey('+90 532 111 22 33'), WA.phoneKey('+905321112233'));
  assert.strictEqual(WA.phoneKey('+1 (415) 555-2671'), '+14155552671');
});
