(() => {
  const WA = globalThis.WA ||= {};
  const { Logger } = WA;

  const PHONE_RE = /^\+?\d[\d\s\-()]{7,}$/;
  const ADMIN_TAGS = ['Admin', 'Grup yöneticisi', 'Group admin'];

  WA.findActiveScrollContainer = (silent = false) => {
    if (!silent) Logger.info('logSearching');

    // Match both UI languages so detection does not depend on WhatsApp's locale
    const ariaLabels = ['Üyeleri aratın', 'Search participants'];
    let modernModal = null;
    let modal = null;

    // 1. Current WhatsApp search modal
    for (const label of ariaLabels) {
      if (!modernModal) {
        modernModal = document.querySelector(`div[aria-label="${label}"] .x1n2onr6.x1n2onr6.xupqr0c`);
      }
      if (!modal) {
        modal = document.querySelector(`div[aria-label="${label}"]`);
      }
    }

    if (modernModal) {
      if (!silent) Logger.info('logModernModal');
      return modernModal;
    }

    // 2. Any dialog
    if (!modal) {
      modal = document.querySelector('div[role="dialog"]');
    }

    if (modal) {
      if (!silent) Logger.info('logGeneralModal');
      const listItem = modal.querySelector('div[role="listitem"]');

      if (listItem) {
        let parent = listItem.parentElement;
        while (parent && parent !== modal) {
          if (parent.scrollHeight > parent.clientHeight + 10) {
            if (!silent) Logger.info('logListFound');
            return parent;
          }
          parent = parent.parentElement;
        }
      }

      if (!silent) Logger.warn('logFallbackSearch');
      const allDivs = Array.from(modal.querySelectorAll('div'));
      const fallbackScrollable = allDivs.find(div => div.scrollHeight > div.clientHeight + 20);
      if (fallbackScrollable) {
        if (!silent) Logger.info('logFallbackFound');
        return fallbackScrollable;
      }
    } else {
      if (!silent) Logger.info('logNoModal');
    }

    if (!silent) Logger.error('errNoListArea');
    return null;
  };

  WA.scanVisibleNumbers = (container) => {
    if (!container) return;
    const phones = WA.state.phones;

    try {
      const spans = container.querySelectorAll('span[dir="auto"]');
      let newFound = 0;

      spans.forEach(span => {
        const text = span.textContent.trim();
        if (!PHONE_RE.test(text) || phones.has(text)) return;

        let name = '';
        const row = span.closest('div[role="listitem"]') || span.parentElement.closest('div[style*="height"]') || span.closest('div');
        if (row) {
          for (const el of row.querySelectorAll('span[dir="auto"], span[title]')) {
            const label = el.textContent.trim();
            // Skip admin tags and the number itself
            if (!label || label === text || PHONE_RE.test(label) || ADMIN_TAGS.includes(label)) continue;
            if (label.startsWith('~')) {
              name = label.substring(1).trim();
              break;
            }
            // Saved contact name, used unless a ~profile name follows
            if (name === '' && label.length > 1) name = label;
          }
        }

        let country = text.split(' ')[0];
        if (!country.includes('+')) {
          // Local format such as 05...
          country = text.startsWith('0') ? 'TR' : '';
        }

        phones.set(text, { country, name, phone: text });
        newFound++;
        WA.renderStatus();
      });

      if (newFound > 0) {
        Logger.info('logScanSuccess', newFound, phones.size);
      }
    } catch (err) {
      Logger.error('errScanFail', err);
    }
  };
})();
