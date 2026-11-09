// Sets the same version in manifest.json and package.json.
// Usage: npm run bump -- 1.4.0
const fs = require('node:fs');
const path = require('node:path');

const version = process.argv[2];
if (!/^\d+\.\d+\.\d+$/.test(version || '')) {
  console.error('Usage: npm run bump -- <MAJOR.MINOR.PATCH>');
  process.exit(1);
}

for (const file of ['manifest.json', 'package.json']) {
  const target = path.join(__dirname, '..', file);
  const text = fs.readFileSync(target, 'utf8');
  // Replace only the top-level "version" so the rest of the formatting stays as it is
  const updated = text.replace(/("version"\s*:\s*")[^"]*(")/, `$1${version}$2`);
  if (updated === text && !text.includes(`"version": "${version}"`)) {
    console.error(`No "version" field found in ${file}`);
    process.exit(1);
  }
  fs.writeFileSync(target, updated);
  console.log(`${file}: ${version}`);
}
