const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

const entry = (WA, phone, name, isAdmin = false, group = '') =>
  [WA.phoneKey(phone), { country: WA.detectCountry(phone), name, phone, isAdmin, group }];

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

test('buildCsv writes E.164, admin and group columns', () => {
  const WA = load('en');
  const phones = new Map([entry(WA, '+90 532 111 22 33', 'Ali', true, 'Aile')]);
  const lines = WA.buildCsv(phones).split('\n');
  assert.strictEqual(lines[1], 'Country;Name/Surname;Phone Number;E.164;Admin;Group');
  assert.ok(lines[2].endsWith(';"=""+905321112233""";"Yes";"Aile"'), lines[2]);
});

test('exportFileName uses the group name and extension, dropping invalid characters', () => {
  const WA = load();
  const date = new Date(2026, 10, 9, 8, 5);
  assert.strictEqual(WA.exportFileName('Aile / Grup: 2026?', 'csv', date), 'wa_Aile_Grup_2026_2026-11-09_08-05.csv');
  assert.strictEqual(WA.exportFileName('', 'vcf', date), 'wa_list_2026-11-09_08-05.vcf');
});

test('exportGroupName is null for lists merged from several groups', () => {
  const WA = load();
  assert.strictEqual(WA.exportGroupName(new Map([entry(WA, '+90 532 111 22 33', 'A', false, 'Aile')])), 'Aile');
  const merged = new Map([entry(WA, '+90 532 111 22 33', 'A', false, 'Aile'), entry(WA, '+49 151 23456789', 'B', false, 'Is')]);
  assert.strictEqual(WA.exportGroupName(merged), null);
});

test('filterPhones keeps only the country chosen for export', async () => {
  const WA = load('tr', { settings: { exportCountry: '49' } });
  await WA.loadSettings();
  const phones = new Map([entry(WA, '+90 532 111 22 33', 'A'), entry(WA, '+49 151 23456789', 'B')]);
  const filtered = WA.filterPhones(phones);
  assert.strictEqual(filtered.size, 1);
  assert.strictEqual(Array.from(filtered.values())[0].name, 'B');
});

test('buildVcf writes escaped vCard 3.0 contacts with E.164 numbers', () => {
  const WA = load();
  const vcf = WA.buildVcf(new Map([entry(WA, '+90 532 111 22 33', 'Ali; Veli, Jr', false, 'Aile')]));
  assert.ok(vcf.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n'), vcf);
  assert.ok(vcf.includes('FN:Ali\\; Veli\\, Jr\r\n'), vcf);
  assert.ok(vcf.includes('TEL;TYPE=CELL:+905321112233\r\n'), vcf);
  assert.ok(vcf.includes('NOTE:WhatsApp: Aile\r\n'), vcf);
  assert.ok(vcf.endsWith('END:VCARD\r\n'));
});

test('buildJson exports structured records', () => {
  const WA = load();
  const data = JSON.parse(WA.buildJson(new Map([entry(WA, '+49 151 23456789', 'Hans', true, 'Is')])));
  const expected = [{ country: 'DE', dialCode: '49', name: 'Hans', phone: '+49 151 23456789', e164: '+4915123456789', admin: true, group: 'Is' }];
  assert.strictEqual(JSON.stringify(data), JSON.stringify(expected));
});
