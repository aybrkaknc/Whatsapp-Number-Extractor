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

  // wa_<group>_<YYYY-MM-DD_HH-mm>.csv in local time; characters invalid in file names are dropped
  WA.csvFileName = (group, date = new Date()) => {
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
    const safe = group.replace(/[\\/:*?"<>|]/g, '').trim().replace(/\s+/g, '_').slice(0, 50);
    return `wa_${safe || 'list'}_${stamp}.csv`;
  };

  WA.buildCsv = (phones) => {
    const t = WA.t;
    const sep = (WA.settings && WA.settings.delimiter) || ';';
    // The sep= line lets Excel detect the delimiter; headers are stored with ';'
    const rows = [`sep=${sep}`, t('csvHeaders').split(';').join(sep)];
    for (const data of phones.values()) {
      rows.push([
        phoneCell(WA.formatCountry(data.country)),
        csvCell(data.name || t('unknown')),
        phoneCell(data.phone),
        phoneCell(WA.toE164(data.phone, data.country)),
        csvCell(t(data.isAdmin ? 'csvYes' : 'csvNo'))
      ].join(sep));
    }
    return rows.join('\n');
  };

  WA.downloadCsv = (phones) => {
    // UTF-8 BOM so Excel reads Turkish characters correctly
    const blob = new Blob(['\uFEFF' + WA.buildCsv(phones)], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = WA.csvFileName(WA.findGroupName());
    a.click();
  };
})();
