const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const sharp = require('sharp');
const root = path.resolve(__dirname, '../..');
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/data/portfolio.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const source = { exports: {} };
new Function('exports', code)(source.exports);
const { personal } = source.exports.portfolio;
const escape = text => text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f8f7f4"/>
<path d="M72 72H1128 M72 558H1128" stroke="#e0e1df" stroke-width="2"/>
<text x="76" y="131" fill="#204377" font-family="Arial, sans-serif" font-size="20" letter-spacing="4">PORTFOLIO</text>
<text x="72" y="308" fill="#191d23" font-family="Arial, sans-serif" font-size="76" letter-spacing="-3">${escape(personal.name)}</text>
<text x="76" y="382" fill="#204377" font-family="Arial, sans-serif" font-size="32">${escape(personal.role)}</text>
<text x="76" y="514" fill="#6a7079" font-family="Arial, sans-serif" font-size="22">${escape(personal.location)}</text>
</svg>`;
(async () => {
  await sharp(Buffer.from(svg)).png().toFile(path.join(root, 'public/social-preview.png'));
  // Reuse the existing N mark for the ICO fallback as well as the SVG icon.
  const png = await sharp(path.join(root, 'src/app/icon.svg')).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
  header[6] = 32; header[7] = 32;
  header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(root, 'src/app/favicon.ico'), Buffer.concat([header, png]));
  console.log('Created 1200×630 typographic social preview and matching 32×32 favicon.');
})();
