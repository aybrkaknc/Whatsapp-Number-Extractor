(() => {
  const WA = globalThis.WA ||= {};
  const { Logger } = WA;

  const PHONE_RE = /^\+?\d[\d\s\-()]{7,}$/;
  const ADMIN_TAGS = ['Admin', 'Grup yöneticisi', 'Group admin'];
  // Match both UI languages so detection does not depend on WhatsApp's locale
  const ARIA_LABELS = ['Üyeleri aratın', 'Search participants'];
  // Generated class names from WhatsApp's build change between releases, so this is only a fallback
  const LEGACY_LIST_SELECTOR = '.x1n2onr6.x1n2onr6.xupqr0c';

  const isScrollable = (el, margin) => el.scrollHeight > el.clientHeight + margin;

  // Nearest scrollable ancestor of the first member row inside the modal
  const listFromRows = (modal) => {
    const row = modal.querySelector('[role="listitem"]');
    for (let el = row && row.parentElement; el && el !== modal; el = el.parentElement) {
      if (isScrollable(el, 10)) return el;
    }
    return null;
  };

  WA.findActiveScrollContainer = (silent = false) => {
    const log = (level, key) => { if (!silent) Logger[level](key); };
    log('info', 'logSearching');

    const modal = ARIA_LABELS.map(label => document.querySelector(`div[aria-label="${label}"]`)).find(Boolean)
      || document.querySelector('[role="dialog"]');
    if (!modal) {
      log('info', 'logNoModal');
      log('error', 'errNoListArea');
      return null;
    }
    log('info', 'logGeneralModal');

    const fromRows = listFromRows(modal);
    if (fromRows) {
      log('info', 'logListFound');
      return fromRows;
    }

    const legacy = modal.querySelector(LEGACY_LIST_SELECTOR);
    if (legacy) {
      log('warn', 'logLegacySelector');
      return legacy;
    }

    log('warn', 'logFallbackSearch');
    const fallback = Array.from(modal.querySelectorAll('div')).find(div => isScrollable(div, 20));
    if (fallback) {
      log('info', 'logFallbackFound');
      return fallback;
    }

    log('error', 'errNoListArea');
    return null;
  };

  // Participant count as WhatsApp shows it ("123 katılımcı", "Grup · 45 üye", "12 participants").
  // Only whole-span matches count, so numbers inside chat messages are ignored. null when not found.
  const TOTAL_RE = /^(?:.*·\s*)?(\d[\d.,]*)\s*(katılımcı|üye|participants|members)$/iu;
  WA.findParticipantTotal = () => {
    for (const span of document.querySelectorAll('span')) {
      if (span.children.length > 0) continue;
      const match = span.textContent.trim().match(TOTAL_RE);
      if (match) return parseInt(match[1].replace(/[.,]/g, ''), 10) || null;
    }
    return null;
  };

  // Same number in different formats (+90 532 111 22 33 / +905321112233) maps to one key
  WA.phoneKey = (text) => text.replace(/[^\d+]/g, '');

  // Picks the display name from a member row's texts; a ~profile name wins over a saved contact name
  WA.pickName = (labels, phone) => {
    let name = '';
    for (const raw of labels) {
      const label = raw.trim();
      if (!label || label === phone || PHONE_RE.test(label) || ADMIN_TAGS.includes(label)) continue;
      if (label.startsWith('~')) return label.substring(1).trim();
      if (name === '' && label.length > 1) name = label;
    }
    return name;
  };

  // A member is a saved contact when the row shows a name without the "~" that WhatsApp puts
  // before the profile name of people who are not in the phone's contacts.
  // A row with only the number (no name) is not saved either.
  WA.isSavedContact = (labels, phone) => {
    const names = labels
      .map(raw => raw.trim())
      .filter(label => label.length > 1 && label !== phone && !PHONE_RE.test(label) && !ADMIN_TAGS.includes(label));
    return names.length > 0 && !names.some(label => label.startsWith('~'));
  };

  WA.hasAdminTag = (labels) => labels.some(label => ADMIN_TAGS.includes(label.trim()));

  // Name of the open chat (the group) from the conversation header; '' when not found
  WA.findGroupName = () => {
    const el = document.querySelector('#main header span[dir="auto"]');
    return el ? el.textContent.trim() : '';
  };

  WA.scanVisibleNumbers = (container) => {
    if (!container) return;
    const phones = WA.state.phones;

    try {
      let newFound = 0;
      // Stored per number so lists merged from several groups keep their origin
      const group = WA.findGroupName();

      container.querySelectorAll('span[dir="auto"]').forEach(span => {
        const text = span.textContent.trim();
        if (!PHONE_RE.test(text)) return;
        const key = WA.phoneKey(text);
        if (phones.has(key)) return;

        const row = span.closest('div[role="listitem"]') || span.parentElement.closest('div[style*="height"]') || span.closest('div');
        const labels = row ? Array.from(row.querySelectorAll('span[dir="auto"], span[title]'), el => el.textContent) : [];

        phones.set(key, {
          country: WA.detectCountry(text),
          name: WA.pickName(labels, text),
          phone: text,
          isAdmin: WA.hasAdminTag(labels),
          isSaved: WA.isSavedContact(labels, text),
          group
        });
        newFound++;
        WA.renderStatus();
      });

      if (newFound > 0) {
        Logger.info('logScanSuccess', newFound, phones.size);
        WA.savePhones();
      }
    } catch (err) {
      Logger.error('errScanFail', err);
      WA.showNotice('errScanFail', 'error');
    }
  };
})();
