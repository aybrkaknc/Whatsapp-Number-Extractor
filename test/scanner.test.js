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

test('isSavedContact: a name without ~ means a saved contact', () => {
  const WA = load();
  assert.strictEqual(WA.isSavedContact(['Ali Veli', PHONE], PHONE), true);
});

test('isSavedContact: a ~profile name means the contact is not saved', () => {
  const WA = load();
  assert.strictEqual(WA.isSavedContact(['~Profil Adı', PHONE], PHONE), false);
  // A ~ name next to a plain name still marks the member as not saved
  assert.strictEqual(WA.isSavedContact(['Ali Veli', '~Profil Adı', PHONE], PHONE), false);
});

test('isSavedContact: a row with only the number, admin tag or one character is not saved', () => {
  const WA = load();
  assert.strictEqual(WA.isSavedContact([PHONE], PHONE), false);
  assert.strictEqual(WA.isSavedContact(['Group admin', PHONE, 'A'], PHONE), false);
});
