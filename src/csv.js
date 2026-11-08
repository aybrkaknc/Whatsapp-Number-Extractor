(() => {
  const WA = globalThis.WA ||= {};

  // Escape quotes and prefix values starting with = + - @ so spreadsheets do not run them as formulas
  const csvCell = (value) => {
    let s = String(value).replace(/"/g, '""');
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return `"${s}"`;
  };

  WA.downloadCsv = (phones) => {
    const t = WA.t;
    // The sep=; line lets Excel detect the delimiter
    const rows = ['sep=;', t('csvHeaders')];
    for (const data of phones.values()) {
      rows.push([data.country || t('unknown'), data.name || t('unknown'), data.phone].map(csvCell).join(';'));
    }

    // UTF-8 BOM so Excel reads Turkish characters correctly
    const blob = new Blob(['﻿' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wa_list_${new Date().getTime()}.csv`;
    a.click();
  };
})();
