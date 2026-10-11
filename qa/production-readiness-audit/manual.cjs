const { chromium } = require('playwright');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
(async () => {
 const browser = await chromium.launch({ channel: 'msedge', headless: true }); const rows=[];
 try {
  for (const theme of ['light','dark']) {
   const page = await browser.newPage({ colorScheme:theme, viewport:{width:390,height:844} });
   const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
   await page.goto('http://localhost:3100',{waitUntil:'networkidle'});
   await page.keyboard.press('Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('main').contains(document.activeElement)));
   await page.locator('.mobile-menu-toggle').click();await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'tools/node_modules/axe-core/axe.min.js'),'utf8')});
   const audit=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice']}}));assert.deepEqual(audit.violations,[]);
   await page.screenshot({path:path.join(__dirname,`menu-accessibility-${theme}.png`)});await page.keyboard.press('Escape');assert.ok(await page.locator('.mobile-menu-toggle').evaluate(e=>e===document.activeElement));
   await page.locator('#skills').scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.locator('.technical-focus-grid').screenshot({path:path.join(__dirname,`contrast-focus-${theme}-390.png`),animations:'disabled',style:'.site-header,.skip-link {visibility:hidden !important;}'});
   await page.setViewportSize({width:1440,height:1000});await page.locator('.project-feature').first().scrollIntoViewIfNeeded();await page.waitForTimeout(400);await page.locator('.project-feature').first().screenshot({path:path.join(__dirname,`contrast-project-${theme}-1440.png`),animations:'disabled'});
   await page.goto('http://localhost:3100/projects/leadsutra-ai',{waitUntil:'networkidle'});await page.keyboard.press('Tab');await page.keyboard.press('Enter');await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('main').contains(document.activeElement)));
   assert.deepEqual(errors,[]);rows.push({theme,skipLink:'first keyboard stop; following Tab enters main on homepage and case study',mobileMenuAxeViolations:0,escapeFocus:'pass',consoleErrors:0});await page.close();
  }
 }finally{await browser.close();}
 fs.writeFileSync(path.join(__dirname,'manual-interactions.json'),JSON.stringify({rows,status:'pass'},null,2));console.log(JSON.stringify(rows,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
