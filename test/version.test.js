const test = require('node:test');
const assert = require('node:assert');
const manifest = require('../manifest.json');
const pkg = require('../package.json');

test('manifest.json and package.json have the same version', () => {
  assert.strictEqual(manifest.version, pkg.version);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
});
