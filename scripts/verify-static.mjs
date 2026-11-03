#!/usr/bin/env node
/**
 * Dependency-free release check for the static Bangkok 3D site.
 *
 *   node scripts/verify-static.mjs
 *
 * This intentionally does not launch a browser. The browser self-test (?selftest=1) covers runtime
 * behaviour; this script protects the repository and release metadata that a browser cannot see.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const passes = [];

function check(name, fn) {
  try {
    const result = fn();
    if (result === false || (typeof result === 'string' && result.length)) {
      failures.push(`${name}${result ? ` — ${result}` : ''}`);
    } else {
      passes.push(name);
    }
  } catch (error) {
    failures.push(`${name} — ${error.message}`);
  }
}

function read(relative) {
  return readFileSync(join(root, relative), 'utf8');
}

function exists(relative) {
  return existsSync(join(root, relative));
}

const required = [
  'index.html',
  'style.css',
  'script.js',
  'README.md',
  'AGENTS.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY.md',
  'SUPPORT.md',
  'AUTHORS.md',
  'LICENSE',
  'THIRD_PARTY_NOTICES.md',
  'state.json',
  'STATE.md',
  'robots.txt',
  'sitemap.xml',
  'favicon.svg',
  '.nojekyll',
  '.editorconfig',
  '.gitattributes',
  '.github/CODEOWNERS',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug_report.yml',
  '.github/ISSUE_TEMPLATE/feature_request.yml',
  '.github/ISSUE_TEMPLATE/config.yml',
  '.github/workflows/static-check.yml',
  'scripts/verify-static.mjs',
  'docs/README.md',
  'docs/ARCHITECTURE.md',
  'docs/CONTROLS.md',
  'docs/DATA_FORMAT.md',
  'docs/TESTING.md',
  'docs/DEPLOYMENT.md',
  'docs/RELEASE_CHECKLIST.md',
  'docs/ACCESSIBILITY.md',
  'docs/PERFORMANCE.md',
  'docs/FAQ.md',
  'docs/ROADMAP.md'
];

check('required release files exist', () => {
  const missing = required.filter((f) => !exists(f));
  return missing.length ? `missing ${missing.join(', ')}` : true;
});

const state = JSON.parse(read('state.json'));
check('state.json parses', () => true);
check('state tokens are numeric', () =>
  ['input', 'output', 'reasoning', 'total'].every((k) => Number.isFinite(state.tokens?.[k])));

const script = read('script.js');
const appVersion = (script.match(/version:\s*'([0-9]+\.[0-9]+\.[0-9]+)'/) || [])[1];
check('APP version is semver', () => /^\d+\.\d+\.\d+$/.test(appVersion || ''));
check('state version equals APP version', () => {
  const declared = state.projectVersion || state.version;
  return declared === appVersion || `state ${declared} != app ${appVersion}`;
});
check('changelog contains the current version', () => read('CHANGELOG.md').includes(`## [${appVersion}]`));
check('export filename is pinned', () => script.includes("exportName: 'bangkok_3d_tour.json'") || 'exportName missing');
check('storage key is pinned', () => script.includes("storageKey: 'bangkok3d.state.v1'") || 'storageKey missing');

const index = read('index.html');
check('Three.js r128 CDN is pinned', () => index.includes('three.js/r128/three.min.js') || 'Three CDN missing');
check('OrbitControls r128 CDN is pinned', () => index.includes('three@0.128.0/examples/js/controls/OrbitControls.js') || 'OrbitControls CDN missing');
check('PointerLockControls is absent', () => !index.includes('PointerLockControls') || 'pointer lock script still present');
check('the walk hint says drag to look', () => index.includes('Drag to look around') || 'drag hint missing');

const readme = read('README.md');
const imageRefs = [...readme.matchAll(/screenshots\/[A-Za-z0-9._-]+\.jpg/g)].map((m) => m[0]);
check('README image references resolve', () => {
  const missing = [...new Set(imageRefs)].filter((p) => !exists(p));
  return missing.length ? `missing ${missing.join(', ')}` : true;
});
check('README documents the self-test count', () => /24\s*\/\s*24/.test(readme) || 'README does not mention 24/24');
check('README links the documentation index', () => readme.includes('docs/README.md') || 'docs index not linked in README');

const shots = readdirSync(join(root, 'screenshots')).filter((f) => f.endsWith('.jpg'));
check('release screenshots present', () => shots.length >= 10 || `only ${shots.length} JPEG screenshots`);
check('docs testing guide states 24 / 24', () => read('docs/TESTING.md').includes('24 / 24') || 'TESTING.md count stale');

check('no obvious credentials are committed', () => {
  const patterns = [/ghp_[A-Za-z0-9]{20,}/, /github_pat_[A-Za-z0-9_]{20,}/, /BEGIN (RSA|OPENSSH|EC) PRIVATE KEY/];
  const files = ['index.html', 'script.js', 'style.css', 'README.md', 'AGENTS.md', 'state.json', 'STATE.md',
    'SECURITY.md', 'SUPPORT.md', 'CONTRIBUTING.md', 'CHANGELOG.md'];
  for (const file of files) {
    const text = read(file);
    for (const pattern of patterns) {
      if (pattern.test(text)) return `credential-like content in ${file}`;
    }
  }
  return true;
});

console.log('Bangkok 3D static release check');
for (const name of passes) console.log(`✓ ${name}`);
for (const failure of failures) console.error(`✕ ${failure}`);
console.log(`\n${passes.length} / ${passes.length + failures.length} checks passed`);
process.exit(failures.length ? 1 : 0);
