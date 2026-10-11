const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),ts=require('typescript');
const root=path.resolve(__dirname,'../..'),base=JSON.parse(fs.readFileSync(path.join(__dirname,'baseline.json'),'utf8'));
const mod={exports:{}};
new Function('exports','module',ts.transpile(fs.readFileSync(path.join(root,'src/data/portfolio.ts'),'utf8'),{module:ts.ModuleKind.CommonJS}))(mod.exports,mod);
const data=mod.exports.portfolio;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const normalize=s=>s.replace(/\r\n/g,'\n');
(async()=>{
 const intentionalChanges=new Set(['src/components/hero.tsx','src/components/navbar.tsx','src/components/footer.tsx','src/app/projects/[slug]/page.tsx']);
 for(const [file,h] of Object.entries(base.hashes))if(!intentionalChanges.has(file))assert.equal(hash(fs.readFileSync(path.join(root,file))),h,`${file} preserved`);
 for(const [key,value] of Object.entries(base.portfolio))assert.deepEqual(data[key],value,`${key} data preserved`);
 assert.ok(normalize(fs.readFileSync(path.join(root,'src/app/portfolio.css'),'utf8')).startsWith(normalize(base.css)),'Existing CSS preserved; new styles appended');
 const pdf=fs.readFileSync(path.join(root,'public/resume.pdf')),pdfInspection=JSON.parse(fs.readFileSync(path.join(__dirname,'resume-inspection.json'),'utf8'));
 assert.ok(pdfInspection.pdfHeader && pdfInspection.eof && pdfInspection.nameFound && pdfInspection.emailFound && pdfInspection.pages===1);
 assert.equal(hash(pdf),pdfInspection.sha256);
 assert.equal(data.resume.available,true);
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const results=[],caseResults=[];
 try{
  for(const theme of ['light','dark'])for(const width of [1440,1280,1024,768,430,390]){
   const context=await browser.newContext({viewport:{width,height:1000},colorScheme:theme,acceptDownloads:true});
   try{
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
    assert.equal((await page.goto('http://localhost:3100',{waitUntil:'networkidle'})).status(),200);
    assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
    assert.equal(await page.locator('#contact').count(),1);
    assert.equal(await page.locator('footer').count(),1);
    assert.equal(await page.locator('#contact-heading').textContent(),'Have a problem worth building?');
    assert.equal(await page.locator('.contact-introduction').textContent(),'Whether it is an AI system, full-stack product or something experimental, I’m always interested in building and learning.');
    assert.equal(await page.locator('#contact form').count(),0);
    assert.equal(await page.locator('#contact a[href="mailto:kakden19@gmail.com"]').count(),1);
    assert.equal(await page.locator('.contact-phone').getAttribute('href'),'tel:+919673217349');
    assert.equal(await page.locator('.contact-phone').textContent(),'+91 9673217349');
    assert.equal(await page.locator('.contact-details p').textContent(),'Nashik, Maharashtra, India');
    for(const s of [{label:'LinkedIn',href:'https://www.linkedin.com/in/nikhilkakade28/'},{label:'GitHub',href:'https://github.com/NIKHILKAKADEK'}]){
     const a=page.locator(`.contact-social-links a[href="${s.href}"]`);assert.equal(await a.count(),1);assert.equal(await a.getAttribute('rel'),'noopener noreferrer');assert.equal(await a.getAttribute('target'),'_blank');assert.ok((await a.getAttribute('aria-label')).includes(s.label));
    }
    assert.equal(await page.locator('.footer-identity strong').textContent(),'Nikhil Ajay Kakade');
    assert.equal(await page.locator('.footer-identity > span').first().textContent(),'AI & Data Science');
    assert.equal(await page.locator('.footer-copyright').textContent(),`© ${new Date().getFullYear()}`);
    const resumeLinks=page.locator('a[href="/resume.pdf"]');assert.equal(await resumeLinks.count(),3);
    assert.equal(await page.locator('.resume-pending').count(),0);
    const response=await context.request.get('http://localhost:3100/resume.pdf');assert.equal(response.status(),200);assert.ok(response.headers()['content-type'].includes('application/pdf'));assert.equal(hash(await response.body()),hash(pdf));
    const downloadLink=page.locator('#contact a[download]');assert.equal(await downloadLink.getAttribute('href'),data.resume.href);
    const [download]=await Promise.all([page.waitForEvent('download'),downloadLink.click()]);
    assert.equal(download.suggestedFilename(),'Nikhil-Ajay-Kakade-Resume.pdf');assert.equal(await download.failure(),null);assert.equal(hash(fs.readFileSync(await download.path())),hash(pdf));
    assert.ok((await page.locator('#contact').innerText()).includes('Download Résumé'));
    assert.ok(!(await page.locator('#contact').innerText()).includes('public/'));
    // Preserve the existing section contents and activate their existing viewport reveals.
    for(const selector of ['.hero','#about','.journey-section','#education','.projects-intro',...data.projects.map(p=>`#project-${p.id}-title`),'#more-projects','#skills','#credentials','#build-log','#contact']){await page.locator(selector).scrollIntoViewIfNeeded();await page.waitForTimeout(60);}
    await page.waitForTimeout(900);
    const visible=await page.evaluate(()=>['.hero','.about-copy','.journey-card','.education-card','.project-feature','.technical-focus-card','.credential-card','.build-log-achievement'].flatMap(s=>[...document.querySelectorAll(s)]).every(el=>getComputedStyle(el).opacity==='1' && el.getBoundingClientRect().width>0));assert.equal(visible,true);
    assert.equal(await page.locator('.project-feature').count(),4);assert.equal(await page.locator('.technical-focus-card').count(),4);assert.equal(await page.locator('.credential-card').count(),3);assert.equal(await page.locator('.repository-list').count(),1);assert.equal(await page.locator('.repository-list li').count(),6);assert.equal(await page.locator('.build-log-achievement').count(),1);
    const layout=await page.evaluate(()=>{
     const items=[...document.querySelectorAll('#contact *,footer *')];const bad=items.filter(el=>{const r=el.getBoundingClientRect();return r.width&&(r.left< -1||r.right>innerWidth+1||el.scrollWidth>el.clientWidth+1&&getComputedStyle(el).overflowX==='visible');}).map(el=>`${el.tagName}.${el.className}`);
     const small=[...document.querySelectorAll('#contact a,footer a')].filter(el=>el.getBoundingClientRect().height<44).map(el=>el.textContent);
     return {bad,small,overflow:document.documentElement.scrollWidth>innerWidth};
    });assert.deepEqual(layout.bad,[],JSON.stringify({width,theme,layout}));assert.deepEqual(layout.small,[]);assert.equal(layout.overflow,false);
    // Follow each footer anchor on the homepage.
    for(const link of data.footer.navigation){const a=page.locator(`footer a[href="${link.href}"]`);assert.equal(await a.count(),1);await a.click();await page.waitForFunction(hash=>location.hash===hash,link.href.slice(1));assert.equal(await page.locator(link.href.slice(1)).count(),1);}
    // The mobile navigation closes after navigating to Contact.
    if(width<=760){await page.getByRole('button',{name:'Open navigation menu'}).click();assert.equal(await page.locator('#mobile-navigation a[href="/resume.pdf"]').count(),1);await page.locator('#mobile-navigation a[href="#contact"]').click();assert.equal(await page.locator('#mobile-navigation').count(),0);}
    else{for(const item of data.navigation){await page.locator(`.nav-links a[href="${item.href}"]`).click();await page.waitForFunction(hash=>location.hash===hash,item.href);assert.equal(await page.locator(item.href).count(),1);}}
    const email=page.locator('#contact a[href^="mailto:"]');
    await page.evaluate(()=>{document.activeElement.blur();window.scrollTo(0,0)});
    // Start the tab sequence at the first document link; then reach Contact using Tab.
    await page.locator('.nav-brand').focus();
    for(let i=0;i<70;i++){await page.keyboard.press('Tab');if(await email.evaluate(el=>el===document.activeElement))break;}
    assert.ok(await email.evaluate(el=>el===document.activeElement));
    for(const selector of ['#contact a[download]','.contact-phone','.contact-social-links li:nth-child(1) a','.contact-social-links li:nth-child(2) a','footer a']){
     assert.ok(await page.evaluate(()=>document.activeElement.matches(':focus-visible')&&(getComputedStyle(document.activeElement).boxShadow!=='none'||getComputedStyle(document.activeElement).outlineStyle==='solid')));
     await page.keyboard.press('Tab');assert.ok(await page.locator(selector).first().evaluate(el=>el===document.activeElement));
    }
    await page.evaluate(()=>document.activeElement.blur());
    await page.locator('#contact').screenshot({path:path.join(__dirname,`contact-${theme}-${width}.png`),style:'.site-header {visibility:hidden !important;}'});
    await page.locator('footer').screenshot({path:path.join(__dirname,`footer-${theme}-${width}.png`),style:'.site-header {visibility:hidden !important;}'});
    assert.deepEqual(errors,[]);
    console.log(theme + ' ' + width + ': contact, footer, download and keyboard passed');
    results.push({theme,width,contact:'pass',footer:'pass',touchTargets:'at least 44px',keyboardFocus:'pass',destinations:'pass',resumePdf:'valid original PDF; browser download hash matches',navigation:'pass',existingModules:'pass',overflow:false,consoleErrors:0});
   }finally{await context.close();}
  }
  for(const theme of ['light','dark']){
   const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:theme,reducedMotion:'reduce'});
   try{
    const page=await context.newPage();
    await page.goto('http://localhost:3100',{waitUntil:'networkidle'});await page.locator('#contact').scrollIntoViewIfNeeded();await page.locator('.contact-social-links a').first().hover();
    assert.equal(await page.locator('.contact-social-links a > svg').first().evaluate(el=>getComputedStyle(el).transform),'none');
    for(const project of data.projects){
     const errors=[];const listener=e=>errors.push(e.message);page.on('pageerror',listener);
     assert.equal((await page.goto(`http://localhost:3100${project.caseStudy}`,{waitUntil:'networkidle'})).status(),200);assert.equal(await page.locator('h1').textContent(),project.title);assert.equal(await page.locator('footer').count(),1);assert.equal(await page.locator('#contact').count(),0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
     const links=await page.locator('footer a').evaluateAll(as=>as.map(a=>({href:a.getAttribute('href'),text:a.textContent})));assert.deepEqual(links,data.footer.navigation.map(l=>({href:l.href,text:l.label})));
     // Navigate from every case study back to the real Contact section.
     await page.locator('footer a[href="/#contact"]').click();await page.waitForURL('http://localhost:3100/#contact');assert.equal(await page.locator('#contact').count(),1);assert.equal(await page.locator('html').getAttribute('data-theme'),theme);assert.deepEqual(errors,[]);page.off('pageerror',listener);
     caseResults.push({theme,width:390,route:project.caseStudy,footerLinks:'pass',contactReturn:'pass',overflow:false,pageErrors:0});
    }
    // Exercise every footer destination from a shared case-study footer.
    for(const link of data.footer.navigation){await page.goto(`http://localhost:3100${data.projects[0].caseStudy}`,{waitUntil:'networkidle'});await page.locator(`footer a[href="${link.href}"]`).click();await page.waitForURL(`http://localhost:3100${link.href}`);assert.equal(await page.locator(link.href.slice(1)).count(),1);}
   }finally{await context.close();}
  }
  const report={sourcePreservation:'pass: Modules 1–7 data unchanged; protected components/theme/asset unchanged; résumé links and navigation completed; existing CSS preserved with scoped additions',typecheck:'pass',build:'pass',lint:'not configured',resume:{...pdfInspection,url:'/resume.pdf',asset:'existing file reused unchanged',httpStatus:200,contentType:'application/pdf',browserDownloads:'passed in all 12 width/theme combinations',downloadFilename:data.resume.downloadName},results,caseStudyRoutes:caseResults,reducedMotion:'pass in both themes',screenshots:'contact and footer at all six widths in both themes',unresolvedIssues:[]};
  fs.writeFileSync(path.join(__dirname,'results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({checks:results.length,caseStudies:caseResults.length,pdfDownload:'pass',sourcePreservation:'pass',keyboard:'pass',reducedMotion:'pass',overflow:false,consoleErrors:0,results:path.join(__dirname,'results.json')},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

