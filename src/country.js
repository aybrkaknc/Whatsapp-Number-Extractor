(() => {
  const WA = globalThis.WA ||= {};

  // Calling code -> ISO 3166-1 region. null means the code is shared by several
  // countries (+1, +7), so only the calling code is reported instead of guessing.
  // ITU calling codes are prefix-free, so the first match of 1, 2 or 3 digits is correct.
  const DIAL_CODES = {
    1: null, 7: null,
    20: 'EG', 27: 'ZA', 30: 'GR', 31: 'NL', 32: 'BE', 33: 'FR', 34: 'ES', 36: 'HU', 39: 'IT', 40: 'RO',
    41: 'CH', 43: 'AT', 44: 'GB', 45: 'DK', 46: 'SE', 47: 'NO', 48: 'PL', 49: 'DE', 51: 'PE', 52: 'MX',
    53: 'CU', 54: 'AR', 55: 'BR', 56: 'CL', 57: 'CO', 58: 'VE', 60: 'MY', 61: 'AU', 62: 'ID', 63: 'PH',
    64: 'NZ', 65: 'SG', 66: 'TH', 81: 'JP', 82: 'KR', 84: 'VN', 86: 'CN', 90: 'TR', 91: 'IN', 92: 'PK',
    93: 'AF', 94: 'LK', 95: 'MM', 98: 'IR',
    211: 'SS', 212: 'MA', 213: 'DZ', 216: 'TN', 218: 'LY', 220: 'GM', 221: 'SN', 222: 'MR', 223: 'ML',
    224: 'GN', 225: 'CI', 226: 'BF', 227: 'NE', 228: 'TG', 229: 'BJ', 230: 'MU', 231: 'LR', 232: 'SL',
    233: 'GH', 234: 'NG', 235: 'TD', 236: 'CF', 237: 'CM', 238: 'CV', 239: 'ST', 240: 'GQ', 241: 'GA',
    242: 'CG', 243: 'CD', 244: 'AO', 245: 'GW', 248: 'SC', 249: 'SD', 250: 'RW', 251: 'ET', 252: 'SO',
    253: 'DJ', 254: 'KE', 255: 'TZ', 256: 'UG', 257: 'BI', 258: 'MZ', 260: 'ZM', 261: 'MG', 263: 'ZW',
    264: 'NA', 265: 'MW', 266: 'LS', 267: 'BW', 268: 'SZ', 269: 'KM',
    351: 'PT', 352: 'LU', 353: 'IE', 354: 'IS', 355: 'AL', 356: 'MT', 357: 'CY', 358: 'FI', 359: 'BG',
    370: 'LT', 371: 'LV', 372: 'EE', 373: 'MD', 374: 'AM', 375: 'BY', 376: 'AD', 377: 'MC', 378: 'SM',
    380: 'UA', 381: 'RS', 382: 'ME', 385: 'HR', 386: 'SI', 387: 'BA', 389: 'MK',
    420: 'CZ', 421: 'SK', 423: 'LI',
    501: 'BZ', 502: 'GT', 503: 'SV', 504: 'HN', 505: 'NI', 506: 'CR', 507: 'PA', 509: 'HT',
    591: 'BO', 592: 'GY', 593: 'EC', 595: 'PY', 597: 'SR', 598: 'UY',
    673: 'BN', 674: 'NR', 675: 'PG', 676: 'TO', 679: 'FJ',
    852: 'HK', 853: 'MO', 855: 'KH', 856: 'LA', 880: 'BD', 886: 'TW',
    960: 'MV', 961: 'LB', 962: 'JO', 963: 'SY', 964: 'IQ', 965: 'KW', 966: 'SA', 967: 'YE', 968: 'OM',
    970: 'PS', 971: 'AE', 972: 'IL', 973: 'BH', 974: 'QA', 975: 'BT', 976: 'MN', 977: 'NP',
    992: 'TJ', 993: 'TM', 994: 'AZ', 995: 'GE', 996: 'KG', 998: 'UZ'
  };

  // Returns { dial, region } or null when the country cannot be told from the number
  WA.detectCountry = (phone) => {
    const text = phone.trim();
    const digits = text.replace(/\D/g, '');

    if (text.startsWith('+')) {
      for (let len = 1; len <= 3; len++) {
        const dial = digits.slice(0, len);
        if (dial in DIAL_CODES) return { dial, region: DIAL_CODES[dial] };
      }
      // Unknown code: trust the first block only when it is short enough to be a calling code
      const first = text.split(/[\s(-]/)[0].replace(/\D/g, '');
      return first.length > 0 && first.length <= 4 ? { dial: first, region: null } : null;
    }

    // Local format such as 05...: use the country chosen in the settings (Turkey by default)
    if (text.startsWith('0')) {
      const dial = (WA.settings && WA.settings.defaultDial) || '90';
      return { dial, region: DIAL_CODES[dial] || null };
    }

    return null;
  };

  // Countries with a unique calling code, sorted by their name in the UI language
  WA.countryOptions = () => Object.entries(DIAL_CODES)
    .filter(([, region]) => region)
    .map(([dial, region]) => ({ dial, label: WA.formatCountry({ dial, region }) }))
    .sort((a, b) => a.label.localeCompare(b.label, WA.state.lang));

  // Formats the detected country in the current UI language, e.g. "Türkiye (+90)"
  WA.formatCountry = (country) => {
    if (!country) return WA.t('unknown');
    if (!country.region) return `+${country.dial}`;
    let name = country.region;
    try {
      name = new Intl.DisplayNames([WA.state.lang], { type: 'region' }).of(country.region) || name;
    } catch (e) {}
    return `${name} (+${country.dial})`;
  };

  // E.164 form such as +905321112233; '' when the number carries no country information
  WA.toE164 = (phone, country) => {
    const digits = phone.replace(/\D/g, '');
    if (phone.trim().startsWith('+')) return '+' + digits;
    if (country && digits.startsWith('0')) return `+${country.dial}${digits.slice(1)}`;
    return '';
  };

  // "Türkiye (+90): 2, Almanya (+49): 1", most frequent first
  WA.countrySummary = (phones) => {
    const counts = new Map();
    for (const { country } of phones.values()) {
      const label = WA.formatCountry(country);
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    return Array.from(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label, n]) => `${label}: ${n}`)
      .join(', ');
  };
})();
