const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

const entry = (WA, phone, name, isAdmin = false) => [WA.phoneKey(phone), { country: WA.detectCountry(phone), name, phone, isAdmin }];

test('toE164 normalizes international and local numbers', () => {
  const WA = load();
  assert.strictEqual(WA.toE164('+90 532 111 22 33', WA.detectCountry('+90 532 111 22 33')), '+905321112233');
  assert.strictEqual(WA.toE164('+1 (415) 555-2671', null), '+14155552671');
  assert.strictEqual(WA.toE164('0532 111 22 33', WA.detectCountry('0532 111 22 33')), '+905321112233');
  assert.strictEqual(WA.toE164('5321112233 45', null), '');
});

test('hasAdminTag detects admin labels in both languages', () => {
  const WA = load();
  assert.strictEqual(WA.hasAdminTag(['Ali', 'Grup yöneticisi']), true);
  assert.strictEqual(WA.hasAdminTag(['Ali', ' Group admin ']), true);
  assert.strictEqual(WA.hasAdminTag(['Ali', '+90 532 111 22 33']), false);
});

test('countrySummary counts per country, most frequent first', () => {
  const WA = load('tr');
  const phones = new Map([
    entry(WA, '+49 151 23456789', 'A'),
    entry(WA, '+90 532 111 22 33', 'B'),
    entry(WA, '+90 532 111 22 34', 'C')
  ]);
  assert.strictEqual(WA.countrySummary(phones), 'Türkiye (+90): 2, Almanya (+49): 1');
});

test('buildCsv writes E.164 and admin columns', () => {
  const WA = load('en');
  const phones = new Map([entry(WA, '+90 532 111 22 33', 'Ali', true)]);
  const lines = WA.buildCsv(phones).split('\n');
  assert.strictEqual(lines[1], 'Country;Name/Surname;Phone Number;E.164;Admin');
  assert.ok(lines[2].endsWith(';"=""+905321112233""";"Yes"'), lines[2]);
});

test('csvFileName uses the group name and drops invalid characters', () => {
  const WA = load();
  const date = new Date(2026, 10, 9, 8, 5);
  assert.strictEqual(WA.csvFileName('Aile / Grup: 2026?', date), 'wa_Aile_Grup_2026_2026-11-09_08-05.csv');
  assert.strictEqual(WA.csvFileName('', date), 'wa_list_2026-11-09_08-05.csv');
});
