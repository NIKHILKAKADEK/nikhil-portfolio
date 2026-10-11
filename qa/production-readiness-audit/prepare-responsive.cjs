const fs = require('node:fs');
const path = require('node:path');
let code = fs.readFileSync(path.join(__dirname, '../responsive-motion-tests/check.cjs'), 'utf8');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, '../responsive-motion-tests/baseline.json'), 'utf8'));
fs.writeFileSync(path.join(__dirname, 'baseline.json'), JSON.stringify(baseline, null, 2));
code = code.replace("'src/styles/design-system.css']);", "'src/styles/design-system.css','src/app/globals.css','src/app/layout.tsx','src/app/page.tsx','src/app/projects/[slug]/page.tsx','src/app/favicon.ico','src/components/technical-focus.tsx','src/components/resume-link.tsx','src/components/build-log.tsx']);");
code = code.replace("!el.closest('.stage-orbit')", "!el.closest('.stage-orbit,.sr-only')");
// Fixed offscreen skip links can appear in stitched captures; they are invisible in normal viewports.
code = code.replace("style:'.site-header {position:relative !important;}'", "style:'.site-header {position:relative !important;} .skip-link:not(:focus-visible) {visibility:hidden !important;}'");
code = code.replace('Portfolio data, résumé bytes, routes, UI primitives, themes, and Modules 6–8 components unchanged; earlier component edits confined to motion and menu behavior.', 'Portfolio content/data and résumé bytes unchanged. Existing routes, components and design preserved; Module 10 adds metadata and accessibility semantics.');
fs.writeFileSync(path.join(__dirname, 'responsive.cjs'), code);
