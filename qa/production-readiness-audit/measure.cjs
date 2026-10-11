const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
(async () => {
  const { default: lighthouse } = await import(pathToFileURL(path.join(__dirname, 'tools/node_modules/lighthouse/core/index.js')));
  const { default: desktopConfig } = await import(pathToFileURL(path.join(__dirname, 'tools/node_modules/lighthouse/core/config/desktop-config.js')));
  const browser = await chromium.launch({ channel: 'msedge', headless: true, args: ['--remote-debugging-port=9222'] });
  const summaries = [];
  try {
    for (const [name, route, config] of [['home-mobile', '/', undefined], ['home-desktop', '/', desktopConfig], ['case-mobile', '/projects/sentinel-ai', undefined]]) {
      const result = await lighthouse(`http://localhost:3100${route}`, { port: 9222, output: ['json', 'html'], logLevel: 'error' }, config);
      fs.writeFileSync(path.join(__dirname, `lighthouse-${name}.json`), result.report[0]);
      fs.writeFileSync(path.join(__dirname, `lighthouse-${name}.html`), result.report[1]);
      const lhr = result.lhr;
      const row = { name, route, lighthouseVersion: lhr.lighthouseVersion, fetchTime: lhr.fetchTime, environment: lhr.environment, conditions: lhr.configSettings, scores: Object.fromEntries(Object.entries(lhr.categories).map(([k, v]) => [k, v.score * 100])), metrics: Object.fromEntries(['first-contentful-paint','largest-contentful-paint','total-blocking-time','cumulative-layout-shift','speed-index'].map(k => [k, { value: lhr.audits[k].numericValue, unit: lhr.audits[k].numericUnit, display: lhr.audits[k].displayValue }])), warnings: lhr.runWarnings, failedAudits: Object.entries(lhr.audits).filter(([, a]) => a.score !== null && a.score < 1).map(([id, a]) => ({ id, score: a.score, title: a.title, description: a.description })) };
      summaries.push(row);
      console.log(JSON.stringify({ name, scores: row.scores, metrics: row.metrics }, null, 2));
    }
  } finally { await browser.close(); }
  fs.writeFileSync(path.join(__dirname, 'measurements.json'), JSON.stringify({ scope: 'Single local production-server run per scenario; Edge/Chromium, light theme. Lighthouse simulated throttling; not deployed results or a guarantee.', summaries }, null, 2));
})().catch(e => { console.error(e); process.exitCode = 1; });
