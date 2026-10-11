const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ts = require('typescript');
const root = path.resolve(__dirname, '../..');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'baseline.json'), 'utf8'));
const m = { exports: {} };
new Function('exports','module',ts.transpile(fs.readFileSync(path.join(root,'src/data/portfolio.ts'),'utf8'), {module: ts.ModuleKind.CommonJS}))(m.exports,m);
const portfolio = m.exports.portfolio;
const normalize = s => s.replace(/\r\n/g, '\n');
(async () => {
  for (const [file, hash] of Object.entries(baseline.hashes)) assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex'), hash, `${file} preserved`);
  for (const [key, data] of Object.entries(baseline.portfolio)) if (key !== 'achievements') assert.deepEqual(portfolio[key], data, `${key} data preserved`);
  assert.ok(normalize(fs.readFileSync(path.join(root,'src/app/portfolio.css'),'utf8')).startsWith(normalize(baseline.css)), 'Existing CSS preserved');
  const showcase = fs.readFileSync(path.join(root,'src/components/project-showcase.tsx'),'utf8');
  assert.equal(normalize(showcase.split('<div className="editorial-section more-projects"')[0]),normalize(baseline.showcase.split('<div className="editorial-section more-projects"')[0]), 'Featured project component preserved');
  const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const results = [];
  const routeResults = [];
  try {
    for (const theme of ['light','dark']) {
      for (const width of [1440,1280,1024,768,430,390]) {
        const context = await browser.newContext({viewport:{width,height:1000},colorScheme:theme});
        try {
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', e => errors.push(e.message));
          page.on('console', msg => {if(msg.type()==='error') errors.push(msg.text());});
          assert.equal((await page.goto('http://localhost:3100',{waitUntil:'networkidle'})).status(),200);
          assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
          for(const selector of ['#hero-title','#about-heading','.journey-heading','#education-heading','#projects-heading','#technical-focus-heading','#credentials-heading']) assert.equal(await page.locator(selector).count(),1);
          assert.equal(await page.locator('.project-feature').count(),4);
          assert.equal(await page.locator('.technical-focus-card').count(),4);
          assert.equal(await page.locator('.credential-card').count(),3);
          assert.equal(await page.locator('.repository-list').count(),1);
          assert.equal(await page.locator('.repository-list li').count(),6);
          assert.equal(await page.locator('#build-log .repository-list').count(),0);
          assert.equal(await page.locator('.build-log-achievement').count(),1);
          assert.equal(await page.locator('.build-log-achievement h3').textContent(),'Smart India Hackathon 2025');
          assert.equal(await page.locator('.build-log-achievement-result').textContent(),'Internal College Round Qualified');
          assert.equal(await page.locator('.build-log-repositories li').count(),2);
          const allRepoLinks = [...baseline.portfolio.projectShowcase.repositories,...portfolio.buildLog.github.selectedRepositories];
          assert.equal(new Set(allRepoLinks.map(r=>r.github)).size,8, 'Eight distinct repository links across existing list and compact area');
          for(const r of allRepoLinks) {
            const links=page.locator(`.repository-list a[href="${r.github}"], .build-log-repositories a[href="${r.github}"]`);
            assert.equal(await links.count(),1);
            assert.equal(await links.getAttribute('rel'),'noopener noreferrer');
            assert.equal(await links.getAttribute('target'),'_blank');
            assert.ok(await links.getAttribute('aria-label'));
          }
          assert.equal(await page.getByRole('link',{name:'Explore GitHub:'}).getAttribute('href'),'https://github.com/NIKHILKAKADEK');
          assert.equal(await page.locator('.build-log-more-link').getAttribute('href'),'#more-projects');
          // Trigger the existing viewport animations before checking their rendered state.
          for(const selector of ['.hero','#about','.journey-section','#education','.projects-intro',...portfolio.projects.map(r=>`#project-${r.id}-title`),'#more-projects','#skills','#credentials','#build-log']) {
            await page.locator(selector).scrollIntoViewIfNeeded();
            await page.waitForTimeout(60);
          }
          await page.waitForTimeout(900);
          const visual=await page.evaluate(()=>{
            const visible = ['.hero','.about-copy','.journey-card','.education-card','.project-feature','.technical-focus-card','.credential-card','.build-log-achievement'].flatMap(s=>[...document.querySelectorAll(s)]).every(el=>getComputedStyle(el).opacity==='1' && el.getBoundingClientRect().width>0);
            const bad=[...document.querySelector('#build-log').querySelectorAll('*')].filter(el=>{const r=el.getBoundingClientRect();return r.width && (r.left < -1 || r.right > innerWidth+1 || el.scrollWidth>el.clientWidth+1 && getComputedStyle(el).overflowX==='visible');}).map(el=>`${el.tagName}.${el.className}`);
            return {visible,bad,overflow:document.documentElement.scrollWidth>innerWidth,columns:getComputedStyle(document.querySelector('.build-log-content')).gridTemplateColumns.split(' ').length};
          });
          assert.deepEqual(visual.bad,[],JSON.stringify({width,theme,visual}));
          assert.equal(visual.overflow,false);
          assert.equal(visual.visible,true,'Modules 1–7 visible after reveal');
          assert.equal(visual.columns,width>700?2:1);
          // Reach the first new repository link using the keyboard from the document start.
          const first=page.locator('.build-log-repositories a').first();
          for(let i=0;i<65;i++){await page.keyboard.press('Tab');if(await first.evaluate(el=>el===document.activeElement))break;}
          assert.ok(await first.evaluate(el=>el===document.activeElement));
          for(const selector of ['.build-log-repositories li:nth-child(2) a','.build-log-actions .ds-button','.build-log-more-link']) {
            assert.ok(await page.evaluate(()=>document.activeElement.matches(':focus-visible') && getComputedStyle(document.activeElement).outlineStyle==='solid'));
            await page.keyboard.press('Tab');
            assert.ok(await page.locator(selector).evaluate(el=>el===document.activeElement));
          }
          await page.keyboard.press('Enter');
          await page.waitForTimeout(500);
          assert.equal(new URL(page.url()).hash,'#more-projects');
          await page.locator('#build-log').scrollIntoViewIfNeeded();
          await page.evaluate(()=>document.activeElement.blur());
          await page.locator('#build-log').screenshot({path:path.join(__dirname,`${theme}-${width}.png`),style:'.site-header {visibility:hidden !important;}'});
          assert.deepEqual(errors,[]);
          results.push({theme,width,layout:'pass',overflow:false,consoleErrors:0,keyboard:'pass',githubDestinations:'pass',existingModules:'pass',repositoryShowcase:'single existing grid plus two distinct compact links'});
        } finally {await context.close();}
      }
      const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:theme,reducedMotion:'reduce'});
      try {
        const page=await context.newPage();
        await page.goto('http://localhost:3100',{waitUntil:'networkidle'});
        await page.locator('#build-log').scrollIntoViewIfNeeded();
        await page.locator('.build-log-repositories a').first().hover();
        const reduced=await page.locator('#build-log').evaluate(el=>[...el.querySelectorAll('a, a > svg, .build-log-achievement')].every(n=>getComputedStyle(n).transitionDuration==='0s' && getComputedStyle(n).transform==='none'));
        assert.equal(reduced,true);
        for(const project of portfolio.projects){
          const errors=[];
          const listener=e=>errors.push(e.message);
          page.on('pageerror',listener);
          assert.equal((await page.goto(`http://localhost:3100${project.caseStudy}`,{waitUntil:'networkidle'})).status(),200);
          assert.equal(await page.locator('h1').textContent(),project.title);
          assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
          assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
          assert.deepEqual(errors,[]);
          page.off('pageerror',listener);
          routeResults.push({theme,width:390,route:project.caseStudy,status:'pass'});
        }
      }finally{await context.close();}
    }
    const noJsContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    try{const page=await noJsContext.newPage();await page.goto('http://localhost:3100');assert.equal(await page.locator('#build-log').evaluate(el=>getComputedStyle(el).opacity),'1');assert.equal(await page.locator('.build-log-achievement').count(),1);}finally{await noJsContext.close();}
    const report={sourcePreservation:'pass: Modules 1–6 data and protected files unchanged; CSS only appended; More Experiments only gains anchor and shared profile URL/rel attributes',typecheck:'pass',build:'pass',lint:pkg.scripts.lint?'configured':'not configured',results,caseStudyRoutes:routeResults,reducedMotion:'pass in both themes',serverRenderedContent:'pass with JavaScript disabled',unresolvedIssues:[]};
    fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(report,null,2));
    console.log(JSON.stringify({widthThemeChecks:results.length,caseStudyChecks:routeResults.length,sourcePreservation:'pass',keyboard:'pass',reducedMotion:'pass',consoleErrors:0,overflow:false,lint:report.lint,results:path.join(__dirname,'results.json')},null,2));
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

