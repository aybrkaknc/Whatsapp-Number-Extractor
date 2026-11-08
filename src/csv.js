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

  WA.downloadCsv = (phones) => {
    const t = WA.t;
    // The sep=; line lets Excel detect the delimiter
    const rows = ['sep=;', t('csvHeaders')];
    for (const data of phones.values()) {
      rows.push([phoneCell(data.country || t('unknown')), csvCell(data.name || t('unknown')), phoneCell(data.phone)].join(';'));
    }

    // UTF-8 BOM so Excel reads Turkish characters correctly
    const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `wa_list_${new Date().getTime()}.csv`;
    a.click();
  };
})();
