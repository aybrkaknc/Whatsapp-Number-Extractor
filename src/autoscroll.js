(() => {
  const WA = globalThis.WA ||= {};

  // Scrolls the list continuously, a few pixels every frame, instead of jumping a screen at a time.
  // Speeds are in list heights per second, so they feel the same in a small or a tall modal.
  // The pace is kept modest because WhatsApp renders only the rows near the viewport.
  WA.SCROLL_SPEEDS = { slow: 0.4, normal: 0.7, fast: 1.2 };

  const RAMP_MS = 400;        // starts from a standstill and eases up to full speed
  const SCAN_EVERY_MS = 250;  // safety scan between the ones the MutationObserver triggers
  const RELOOK_MS = 500;      // how often a lost list is searched for again
  const IDLE_MS = 2400;       // stop after this long without movement, new rows or a taller list
  // A late frame (rows loading, a busy page) moves the list by at most this much time. A larger
  // cap would make the list lurch to catch up; a smaller one just slows it down for a moment.
  const MAX_FRAME_MS = 34;

  // getArea() returns the scrollable list or null, scan(area) asks for a scan (it must be cheap,
  // the real work is scheduled outside the frame), onDone() runs once when the end is reached,
  // onLost() when the list cannot be found. Returns { stop() }.
  WA.startAutoScroll = ({ getArea, scan, onDone, onLost = () => {} }) => {
    let raf = 0;
    let stopped = false;
    let area = null;
    let pos = 0;            // the position we want, kept as a float so slow speeds stay smooth
    let last = 0;
    let startedAt = 0;
    let lastScan = 0;
    let lastLook = -RELOOK_MS;
    let lastTop = 0;
    let lastHeight = 0;
    let lastCount = 0;
    let lastMove = 0;

    const attach = (el) => {
      area = el;
      pos = lastTop = el.scrollTop;
      lastHeight = el.scrollHeight;
    };

    const frame = (now) => {
      if (stopped) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - (last || now), MAX_FRAME_MS);
      last = now;
      if (!startedAt) startedAt = lastMove = now;

      // The list may be replaced when WhatsApp re-renders the modal; look for it again twice a second
      if (!area || !area.isConnected) {
        if (now - lastLook < RELOOK_MS) return;
        lastLook = now;
        const found = getArea();
        if (!found) {
          onLost();
          return;
        }
        attach(found);
      }

      // Every layout read comes first and the one write last. Reading after writing would make the
      // browser lay the page out again in the middle of the frame, which shows up as stutter while
      // WhatsApp is adding rows.
      const top = area.scrollTop;
      const height = area.scrollHeight;
      const view = area.clientHeight;
      if (view === 0) {
        area = null;
        return;
      }

      // If the user scrolled by hand, continue from where they left it instead of fighting them
      if (Math.abs(top - pos) > 3) pos = top;

      const ramp = Math.min(1, (now - startedAt) / RAMP_MS);
      const eased = ramp * ramp * (3 - 2 * ramp);
      const screensPerSecond = WA.SCROLL_SPEEDS[WA.settings.scrollSpeed] || WA.SCROLL_SPEEDS.normal;
      const max = height - view;
      if (pos < max) {
        pos = Math.min(max, pos + screensPerSecond * view * eased * dt / 1000);
        area.scrollTop = pos;
      }

      if (now - lastScan >= SCAN_EVERY_MS) {
        lastScan = now;
        scan(area);
      }

      // Progress means the list moved, grew, or gave new numbers. Without any for a while we are at the end.
      // The positions compared are the ones read at the start of this and the previous frame.
      const count = WA.state.phones.size;
      if (Math.abs(top - lastTop) >= 1 || height !== lastHeight || count !== lastCount) {
        lastMove = now;
      } else if (now - lastMove > IDLE_MS) {
        stopped = true;
        scan(area);
        onDone();
      }
      lastTop = top;
      lastHeight = height;
      lastCount = count;
    };

    raf = requestAnimationFrame(frame);

    return {
      stop: () => {
        stopped = true;
        cancelAnimationFrame(raf);
      }
    };
  };
})();
