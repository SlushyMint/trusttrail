import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { log } from 'node:console';
import process from 'node:process';

// Read only project source/configuration and public release files. Never emit matched values.
const roots = ['src', 'public', 'dist'];
const configs = ['index.html', 'art-direction.html', 'dual-os.html', 'package.json', 'package-lock.json', 'vercel.json', 'vite.config.ts', '.npmrc', '.gitignore'];
const patterns = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/],
  ['aws-access-key', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/],
  ['openai-key', /\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/],
  ['google-api-key', /\bAIza[A-Za-z0-9_-]{35}\b/],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/],
  ['literal-credential', /\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|password)\s*[:=]\s*["'][A-Za-z0-9_+/=-]{20,}["']/i],
];
const files = [...configs];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.isFile()) files.push(path);
  }
}
for (const root of roots) await walk(root);
const findings = [];
const exposedConfiguration = [];
let textFiles = 0;
let bytes = 0;
for (const file of files) {
  const buffer = await readFile(file);
  bytes += buffer.length;
  if (file.startsWith('dist/') && /(?:^|\/)(?:\.env(?:\..*)?|\.git|\.aws|\.npmrc|package-lock\.json)|\.(?:pem|key|map)$/.test(relative('dist', file))) exposedConfiguration.push(file);
  if (buffer.includes(0)) continue;
  textFiles++;
  const source = buffer.toString('utf8');
  for (const [rule, pattern] of patterns) if (pattern.test(source)) findings.push({ file, rule });
}
const lock = JSON.parse(await readFile('package-lock.json', 'utf8'));
const packages = Object.entries(lock.packages).filter(([path]) => path);
const supplyChain = {
  lockfileVersion: lock.lockfileVersion,
  packages: packages.length,
  missingIntegrity: packages.filter(([, item]) => !item.link && !item.inBundle && !item.integrity).map(([path]) => path),
  bundledPackages: packages.filter(([, item]) => item.inBundle).map(([path]) => path),
  nonRegistrySources: packages.filter(([, item]) => item.resolved && !item.resolved.startsWith('https://registry.npmjs.org/')).map(([path]) => path),
  installScripts: packages.filter(([, item]) => item.hasInstallScript).map(([path]) => path),
};
const publicBytes = (await Promise.all(files.filter(file => file.startsWith('dist/')).map(async file => (await stat(file)).size))).reduce((a, b) => a + b, 0);
log(JSON.stringify({ scope: roots.concat(configs), files: files.length, textFiles, bytes, publicBytes, findings, exposedConfiguration, supplyChain, limitation: 'Pattern scan, not proof of absence. Private credential directories and Git metadata are intentionally excluded.' }, null, 2));
if (findings.length || exposedConfiguration.length || supplyChain.missingIntegrity.length || supplyChain.nonRegistrySources.length) process.exitCode = 1;
