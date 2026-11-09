(() => {
  const WA = globalThis.WA ||= {};

  // Escape quotes and prefix values starting with = + - @ so spreadsheets do not run them as formulas
  const csvCell = (value) => {
    let s = String(value).replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s}"`;
  };

  // Country and phone values only hold digits, spaces, + - ( ), so they can be written
  // as ="value": Excel shows them as plain text, without a visible apostrophe
  const PHONE_LIKE = /^\+?[\d\s\-()]+$/;
  const phoneCell = (value) => {
    const s = String(value);
    return PHONE_LIKE.test(s) ? `"=""${s}"""` : csvCell(s);
  };

  // Exposed for unit tests
  WA.csvCell = csvCell;
  WA.phoneCell = phoneCell;

  const FORMATS = {
    csv: { ext: 'csv', type: 'text/csv;charset=utf-8;' },
    vcf: { ext: 'vcf', type: 'text/vcard;charset=utf-8;' },
    json: { ext: 'json', type: 'application/json;charset=utf-8;' }
  };

  // wa_<group>_<YYYY-MM-DD_HH-mm>.<ext> in local time; characters invalid in file names are dropped
  WA.exportFileName = (group, ext, date = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
    const safe = group.replace(/[\\/:*?"<>|]/g, '').trim().replace(/\s+/g, '_').slice(0, 50);
    return `wa_${safe || 'list'}_${stamp}.${ext}`;
  };

  // The group name when every number comes from the same group ('' if it is unknown),
  // null for a list merged from several groups
  WA.exportGroupName = (phones) => {
    const groups = new Set(Array.from(phones.values(), d => d.group || ''));
    return groups.size === 1 ? [...groups][0] : null;
  };

  // Export filters from the settings: a country and/or only contacts not saved in the phone.
  // Entries restored from an older session have no isSaved value and count as not saved.
  WA.filterPhones = (phones) => {
    const { exportCountry: dial, onlyUnsaved } = WA.settings || {};
    if (!dial && !onlyUnsaved) return phones;
    return new Map(Array.from(phones).filter(([, d]) =>
      (!dial || (d.country && d.country.dial === dial)) && (!onlyUnsaved || d.isSaved !== true)));
  };

  WA.buildCsv = (phones) => {
    const t = WA.t;
    const sep = (WA.settings && WA.settings.delimiter) || ';';
    // No "sep=" line: placed after the UTF-8 BOM it makes Excel read the file as ANSI (TÃ¼rkiye).
    // Excel then uses the system list separator, which is ';' on Turkish systems (see the delimiter setting).
    // Headers are stored with ';'.
    const rows = [t('csvHeaders').split(';').join(sep)];
    for (const data of phones.values()) {
      rows.push([
        phoneCell(WA.formatCountry(data.country)),
        csvCell(data.name || t('unknown')),
        phoneCell(data.phone),
        phoneCell(WA.toE164(data.phone, data.country)),
        csvCell(t(data.isAdmin ? 'csvYes' : 'csvNo')),
        csvCell(data.group || '')
      ].join(sep));
    }
    return rows.join('\n');
  };

  // vCard 3.0 text value: escape backslash, comma, semicolon and line breaks
  const vcfText = (value) => String(value)
    .replace(/\\/g, '\\\\')
    .replace(/[,;]/g, m => '\\' + m)
    .replace(/\r?\n/g, '\\n');

  // One contact per number, ready to import into a phone or address book
  WA.buildVcf = (phones) => Array.from(phones.values(), d => {
    const name = vcfText(d.name || d.phone);
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:;${name};;;`,
      `FN:${name}`,
      `TEL;TYPE=CELL:${WA.toE164(d.phone, d.country) || d.phone}`
    ];
    if (d.group) lines.push(`NOTE:${vcfText('WhatsApp: ' + d.group)}`);
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }).join('\r\n') + '\r\n';

  WA.buildJson = (phones) => JSON.stringify(Array.from(phones.values(), d => ({
    country: d.country ? d.country.region : null,
    dialCode: d.country ? d.country.dial : null,
    name: d.name || null,
    phone: d.phone,
    e164: WA.toE164(d.phone, d.country) || null,
    admin: Boolean(d.isAdmin),
    savedContact: Boolean(d.isSaved),
    group: d.group || null
  })), null, 2);

  WA.downloadExport = (phones) => {
    const key = (WA.settings && WA.settings.exportFormat) || 'csv';
    const format = FORMATS[key] || FORMATS.csv;
    const body = key === 'vcf' ? WA.buildVcf(phones) : key === 'json' ? WA.buildJson(phones) : WA.buildCsv(phones);
    // UTF-8 BOM only for CSV, so Excel reads Turkish characters correctly
    const blob = new Blob([(format === FORMATS.csv ? '﻿' : '') + body], { type: format.type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    // Merged lists get the generic name; a single unknown group falls back to the open chat
    const group = WA.exportGroupName(phones);
    a.download = WA.exportFileName(group === null ? '' : group || WA.findGroupName(), format.ext);
    a.click();
  };
})();
