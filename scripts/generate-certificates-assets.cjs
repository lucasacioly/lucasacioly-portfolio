const fs = require('node:fs');
const path = require('node:path');

const projectRoot = process.cwd();
const webappRoot = path.join(projectRoot, 'src/main/webapp');
const certsRoot = path.join(webappRoot, 'content/images/certs');
const outputFile = path.join(webappRoot, 'app/entities/certificates/certificates.assets.ts');

function walkPdfFiles(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkPdfFiles(fullPath));
      return;
    }

    if (/\.pdf$/i.test(entry.name)) {
      files.push(fullPath);
    }
  });

  return files;
}

function toWebappRelativePosix(absolutePath) {
  return path.relative(webappRoot, absolutePath).split(path.sep).join('/');
}

function buildTsFile(assetPaths) {
  const lines = assetPaths.map(assetPath => `  '${assetPath}',`);
  const body = lines.join('\n');

  return `export const CERTIFICATE_ASSETS = [\n${body}\n] as const;\n`;
}

if (!fs.existsSync(certsRoot)) {
  throw new Error(`Certificates root not found: ${certsRoot}`);
}

const assets = walkPdfFiles(certsRoot)
  .map(toWebappRelativePosix)
  .sort((left, right) => left.localeCompare(right));

fs.writeFileSync(outputFile, buildTsFile(assets), 'utf8');

console.log(`[certificates] Updated ${path.relative(projectRoot, outputFile)} with ${assets.length} PDFs.`);