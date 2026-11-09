(() => {
  const WA = globalThis.WA ||= {};

  // Used only when the CSS tokens cannot be read; the real values live in panel.css
  const DEFAULT_MS = { '--wa-dur-fast': 100, '--wa-dur': 160, '--wa-dur-slow': 240 };

  // Duration token in milliseconds, read from the panel's CSS so scripts wait exactly as long as the animation runs
  WA.motion = (token = '--wa-dur') => {
    const scope = document.getElementById('wa-98-scope');
    const raw = scope && globalThis.getComputedStyle ? getComputedStyle(scope).getPropertyValue(token) : '';
    const ms = parseFloat(raw);
    return Number.isFinite(ms) ? ms : DEFAULT_MS[token];
  };

  // The "Animations" setting: 'system' follows the OS, 'on' always animates, 'off' never does
  WA.applyMotionMode = () => {
    const scope = document.getElementById('wa-98-scope');
    if (scope) scope.dataset.motion = (WA.settings && WA.settings.motion) || 'system';
  };

  // False when animations are off, or the OS asks for reduced motion (and where matchMedia
  // does not exist): everything then happens at once
  WA.motionAllowed = () => {
    const mode = WA.settings && WA.settings.motion;
    if (mode === 'on') return true;
    if (mode === 'off') return false;
    return typeof globalThis.matchMedia === 'function' && !globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // Plays a one-shot animation class on an element. With restart: false a run that is still going is left alone,
  // which keeps frequent updates (a new number every frame) from retriggering the flash.
  WA.replay = (el, cls, { restart = true } = {}) => {
    if (!el || !WA.motionAllowed()) return;
    if (el.classList.contains(cls)) {
      if (!restart) return;
      el.classList.remove(cls);
      // Forces a reflow so the browser starts the animation again
      void el.offsetWidth;
    }
    el.classList.add(cls);
    const timer = `_wa_${cls}`;
    clearTimeout(el[timer]);
    el[timer] = setTimeout(() => el.classList.remove(cls), WA.motion('--wa-dur-slow') + 60);
  };

  // Shows or hides an element with the shared enter / leave animation.
  //   instant  skip the animation (first render, or the old half of a view swap so two views never stack)
  //   dx, dy   direction the element comes from, in px
  //   delay    ms to wait before entering, for staggered groups
  //   enter    animation class: 'wa-enter' (slide and fade) or 'wa-grow' (scale up)
  WA.setHidden = (el, hidden, { instant = false, dx = 0, dy = 6, delay = 0, enter = 'wa-enter' } = {}) => {
    if (!el) return;
    const animate = !instant && WA.motionAllowed();
    clearTimeout(el._waLeave);

    if (!hidden) {
      const wasHidden = el.classList.contains('hide');
      // Showing again while it is still leaving just cancels the leave
      el.classList.remove('hide', 'wa-leave');
      if (wasHidden && animate) {
        el.style.setProperty('--wa-dx', `${dx}px`);
        el.style.setProperty('--wa-dy', `${dy}px`);
        el.style.animationDelay = delay ? `${delay}ms` : '';
        WA.replay(el, enter);
      }
      return;
    }

    if (el.classList.contains('hide') || el.classList.contains('wa-leave')) return;
    el.classList.remove('wa-enter', 'wa-grow', 'wa-pop');
    if (!animate) {
      el.classList.add('hide');
      return;
    }
    el.style.setProperty('--wa-dy', `${dy}px`);
    el.style.animationDelay = '';
    el.classList.add('wa-leave');
    el._waLeave = setTimeout(() => {
      el.classList.remove('wa-leave');
      el.classList.add('hide');
    }, WA.motion('--wa-dur') + 20);
  };
})();
