const test = require('node:test');
const assert = require('node:assert');
const load = require('./load');

test('animations follow the system by default', async () => {
  const WA = load('en');
  await WA.loadSettings();
  assert.strictEqual(WA.settings.motion, 'system');
  // The test sandbox has no matchMedia, which counts as "no animation possible"
  assert.strictEqual(WA.motionAllowed(), false);
});

test('the "on" setting forces animations, "off" disables them', async () => {
  const on = load('en', { settings: { motion: 'on' } });
  await on.loadSettings();
  assert.strictEqual(on.motionAllowed(), true);

  const off = load('en', { settings: { motion: 'off' } });
  await off.loadSettings();
  assert.strictEqual(off.motionAllowed(), false);
});

test('duration tokens fall back to defaults when the CSS cannot be read', () => {
  const WA = load('en');
  assert.strictEqual(WA.motion('--wa-dur-fast'), 100);
  assert.strictEqual(WA.motion('--wa-dur'), 160);
  assert.strictEqual(WA.motion('--wa-dur-slow'), 240);
});
