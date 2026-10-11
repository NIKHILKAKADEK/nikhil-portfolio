const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const axe = fs.readFileSync(path.join(__dirname, 'tools/node_modules/axe-core/axe.min.js'), 'utf8');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = [];
  try {
    for (const theme of ['light', 'dark']) for (const width of [1440, 390]) {
      const context = await browser.newContext({ colorScheme: theme, viewport: { width, height: 1000 } });
      const page = await context.newPage();
      for (const route of ['/', '/projects/leadsutra-ai', '/projects/sentinel-ai', '/projects/hospital-management', '/projects/emergency-navigation']) {
        await page.goto(`http://localhost:3100${route}`, { waitUntil: 'networkidle' });
        await page.addScriptTag({ content: axe });
        const result = await page.evaluate(async () => await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] } }));
        results.push({ theme, width, route, violations: result.violations, incomplete: result.incomplete, passes: result.passes.map(r => r.id) });
        console.log(theme, width, route, result.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary })) })));
      }
      await context.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, 'accessibility.json'), JSON.stringify({ tool: 'axe-core', version: require('./tools/node_modules/axe-core/package.json').version, browser: 'Chromium / Edge', results, caveat: 'Automated checks do not establish full accessibility compliance. Incomplete items require manual review.' }, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
