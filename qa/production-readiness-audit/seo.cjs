const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const ts = require('typescript'), crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '../..'), cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const module = { exports: {} }; cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  new Function('require','module','exports',code)(name => name.startsWith('@/') ? load(path.join(root,'src',`${name.slice(2)}.ts`)) : require(name),module,module.exports);
  return module.exports;
}
const { portfolio: data } = load(path.join(root,'src/data/portfolio.ts'));
const { getSiteUrl } = load(path.join(root,'src/lib/site-url.ts'));
const seo = load(path.join(root,'src/lib/seo.ts'));
const sitemap = load(path.join(root,'src/app/sitemap.ts')).default;
const robots = load(path.join(root,'src/app/robots.ts')).default;
const original = process.env.NEXT_PUBLIC_SITE_URL;
delete process.env.NEXT_PUBLIC_SITE_URL;
assert.equal(getSiteUrl(),undefined); assert.deepEqual(sitemap(),[]); assert.equal(robots().rules.disallow,'/');
assert.equal(seo.pageMetadata('Title','Description','/').openGraph.images,undefined);
for (const invalid of ['http://localhost:3100','https://example.com','https://portfolio.test','https://127.0.0.1','not-a-url','https://github.com/path','https://github.com/?query=1']) {
  process.env.NEXT_PUBLIC_SITE_URL=invalid; assert.throws(getSiteUrl);
}
// A supplied HTTPS hostname is used only as an isolated unit fixture; never in an application build.
process.env.NEXT_PUBLIC_SITE_URL='https://github.com';
const metadata=seo.pageMetadata('Title','Description','/projects/sentinel-ai');
assert.equal(metadata.alternates.canonical,'https://github.com/projects/sentinel-ai');
assert.equal(metadata.openGraph.images[0].url,'https://github.com/social-preview.png');
assert.deepEqual(metadata.twitter.images,metadata.openGraph.images);
assert.equal(sitemap().length,5); assert.equal(robots().sitemap,'https://github.com/sitemap.xml');
assert.equal(seo.personStructuredData().url,'https://github.com/');
if(original===undefined)delete process.env.NEXT_PUBLIC_SITE_URL;else process.env.NEXT_PUBLIC_SITE_URL=original;
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const result={productionUrlConfigured:Boolean(original),configuredBranch:'unit-tested only; actual origin not supplied',routes:[],assets:[],unknownRoutes:[],manualSemantics:[]};
 try {
  const page=await browser.newPage();
  for(const project of [null,...data.projects]){
   const route=project?project.caseStudy:'/';assert.equal((await page.goto(`http://localhost:3100${route}`,{waitUntil:'networkidle'})).status(),200);
   const title=project?`${project.title} | ${data.personal.name}`:seo.homeTitle,desc=project?project.description:seo.homeDescription;
   assert.equal(await page.title(),title);
   for(const [selector,value] of [['meta[name="description"]',desc],['meta[property="og:title"]',title],['meta[property="og:description"]',desc],['meta[name="twitter:title"]',title],['meta[name="twitter:description"]',desc],['meta[name="twitter:card"]','summary_large_image']])assert.equal(await page.locator(selector).getAttribute('content'),value);
   assert.equal(await page.locator('link[rel="canonical"],meta[property="og:url"],meta[property="og:image"],meta[name="twitter:image"]').count(),0);
   assert.ok((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
   const facts=await page.locator('script[type="application/ld+json"]').allTextContents();
   if(!project){const person=JSON.parse(facts[0]);assert.equal(person.name,data.personal.name);assert.equal(person.email,data.personal.email);assert.equal(person.telephone,data.personal.phone);assert.equal(person.address,data.personal.location);assert.deepEqual(person.sameAs,data.socialLinks.filter(l=>l.href.startsWith('https:')).map(l=>l.href));assert.equal(person.url,undefined);assert.equal(person.award,undefined);assert.equal(person.worksFor,undefined);}
   const semantic=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,mains:document.querySelectorAll('main').length,lang:document.documentElement.lang,headings:[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(e=>({level:Number(e.tagName.slice(1)),text:e.textContent})),unlabelledImages:[...document.querySelectorAll('img')].filter(e=>!e.hasAttribute('alt')).length,blankLinks:[...document.querySelectorAll('a')].filter(e=>!(e.textContent.trim()||e.getAttribute('aria-label'))).length,unsafeExternal:[...document.querySelectorAll('a[target="_blank"]')].filter(e=>!e.rel.includes('noopener')||!e.rel.includes('noreferrer')).length}));
   assert.equal(semantic.h1,1);assert.equal(semantic.mains,1);assert.equal(semantic.lang,'en');assert.equal(semantic.unlabelledImages,0);assert.equal(semantic.blankLinks,0);assert.equal(semantic.unsafeExternal,0);
   for(let i=1;i<semantic.headings.length;i++)assert.ok(semantic.headings[i].level<=semantic.headings[i-1].level+1,'Heading levels do not skip');
   await page.keyboard.press('Tab');await page.locator('.skip-link').focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await page.locator('.skip-link').evaluate(e=>e.matches(':focus-visible')&&getComputedStyle(e).outlineStyle==='solid'&&e.getBoundingClientRect().top>=0),true);await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>location.hash),'#main-content');
   result.routes.push({route,title,metadata:'pass; absolute URLs omitted until deployment configuration',structuredData:!project?'supplied facts only':'not duplicated',skipLink:'pass'});result.manualSemantics.push({route,...semantic});
  }
  for(const route of ['/projects/not-a-project','/projects/unknown-production-check','/missing-page']){const response=await page.goto(`http://localhost:3100${route}`,{waitUntil:'networkidle'});assert.equal(response.status(),404);assert.ok(await page.getByText('This page could not be found.').count());assert.ok((await page.locator('meta[name="robots"]').first().getAttribute('content')).includes('noindex'));assert.equal(await page.locator('link[rel="canonical"]').count(),0);result.unknownRoutes.push({route,status:404,noindex:true});}
  for(const [url,file,type] of [['/social-preview.png','public/social-preview.png','image/png'],['/favicon.ico','src/app/favicon.ico','image/'],['/icon.svg','src/app/icon.svg','image/svg+xml'],['/resume.pdf','public/resume.pdf','application/pdf']]){const response=await page.request.get(`http://localhost:3100${url}`);assert.equal(response.status(),200);assert.ok(response.headers()['content-type'].includes(type));assert.equal(hash(await response.body()),hash(fs.readFileSync(path.join(root,file))));result.assets.push({url,status:200,contentType:response.headers()['content-type'],bytes:(await response.body()).length});}
  const sitemapResponse=await page.request.get('http://localhost:3100/sitemap.xml');assert.equal(sitemapResponse.status(),200);assert.ok(sitemapResponse.headers()['content-type'].includes('xml'));
  const xml=await sitemapResponse.text();assert.equal(xml.includes('<loc>'),false);assert.equal(await page.evaluate(xml=>new DOMParser().parseFromString(xml,'application/xml').querySelectorAll('parsererror').length,xml),0);
  const robotsResponse=await page.request.get('http://localhost:3100/robots.txt');assert.equal(robotsResponse.status(),200);assert.ok(robotsResponse.headers()['content-type'].includes('text/plain'));
  const text=await robotsResponse.text();assert.ok(text.includes('Disallow: /'));assert.equal(text.includes('Sitemap:'),false);
  result.sitemap='valid XML; zero URLs while production URL is missing';result.robots=text;
  await page.goto('http://localhost:3100/social-preview.png');await page.screenshot({path:path.join(__dirname,'social-preview.png')});
 }finally{await browser.close();}
 result.status='pass';fs.writeFileSync(path.join(__dirname,'seo-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,routes:result.routes.length,unknownRoutes:result.unknownRoutes,assets:result.assets},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
