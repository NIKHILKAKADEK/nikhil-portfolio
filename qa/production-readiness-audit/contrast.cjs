const fs = require('node:fs'), path = require('node:path');
const { chromium } = require('playwright');
(async () => {
  const audits = JSON.parse(fs.readFileSync(path.join(__dirname, 'accessibility.json'), 'utf8'));
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const reviews = [];
  try {
    for (const theme of ['light', 'dark']) {
      const audit = audits.results.find(r => r.theme === theme && r.width === 1440 && r.route === '/');
      const selectors = [...new Set(audit.incomplete.filter(r => r.id === 'color-contrast').flatMap(r => r.nodes.map(n => n.target[0])))];
      const page = await browser.newPage({ colorScheme: theme, viewport: { width: 1440, height: 1000 } });
      await page.goto('http://localhost:3100', { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const rows = await page.evaluate(selectors => {
        const rgba = value => { const a = value.match(/[\d.]+/g)?.map(Number); return a && a.length >= 3 ? [a[0], a[1], a[2], a[3] ?? 1] : null; };
        const blend = (fg, bg) => fg.slice(0, 3).map((c, i) => c * fg[3] + bg[i] * (1 - fg[3]));
        const luminance = c => c.map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }).reduce((s, c, i) => s + c * [.2126, .7152, .0722][i], 0);
        return selectors.map(selector => {
          const element = document.querySelector(selector); if (!element) return { selector, missing: true };
          const chain = []; for (let node = element; node; node = node.parentElement) chain.unshift(node);
          let bg = [255, 255, 255]; for (const node of chain) { const color = rgba(getComputedStyle(node).backgroundColor); if (color) bg = blend(color, bg); }
          const style = getComputedStyle(element), color = rgba(style.color); const fg = blend(color, bg);
          const l = [luminance(fg), luminance(bg)].sort((a, b) => b - a); const ratio = (l[0] + .05) / (l[1] + .05);
          const fontSize = parseFloat(style.fontSize), large = fontSize >= 24 || (fontSize >= 18.66 && Number(style.fontWeight) >= 700);
          return { selector, text: element.textContent.trim(), foreground: style.color, compositedBackground: bg, ratio, threshold: large ? 3 : 4.5, passes: ratio >= (large ? 3 : 4.5), ancestorOpacity: chain.map(n => getComputedStyle(n).opacity).filter(o => o !== '1') };
        });
      }, selectors);
      reviews.push({ theme, width: 1440, route: '/', rows }); await page.close();
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, 'contrast-review.json'), JSON.stringify({ method: 'Supplemental computed-color checks for axe incomplete homepage text items. Ancestor solid backgrounds are alpha-composited. Does not sample pseudo elements, gradients, shadows or anti-aliased glyph pixels; visual inspection is still required.', reviews }, null, 2));
  console.log(JSON.stringify(reviews.map(r => ({ theme: r.theme, checked: r.rows.length, minRatio: Math.min(...r.rows.map(n => n.ratio)), belowThreshold: r.rows.filter(n => !n.passes) })), null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
