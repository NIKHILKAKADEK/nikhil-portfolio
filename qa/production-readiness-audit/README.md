# Module 10 verification

Production readiness, SEO and deployment preparation are complete locally. Nothing was deployed or published. Existing portfolio data, visible content, routes, themes, interactions and résumé bytes remain preserved.

## Files created

- `src/lib/site-url.ts`: one optional, validated production-origin environment variable; no local or placeholder fallback.
- `src/lib/seo.ts`: homepage/case-study metadata and supplied-fact Person JSON-LD.
- `src/app/sitemap.ts` and `src/app/robots.ts`: origin-aware crawler configuration.
- `public/social-preview.png`: real 1200×630 typographic PNG, 40,168 bytes, using supplied name, student profile and location.
- `.env.example`: documents `NEXT_PUBLIC_SITE_URL` with an empty value.
- `DEPLOYMENT.md`: install, environment, hosting, production start and post-deployment checks.
- `.vercelignore`: excludes local Module 6–10 QA artifacts from hosting uploads.
- `qa/production-readiness-audit/`: reproducible checks, 78 PNG screenshots, source/data baseline, accessibility and metadata results, Lighthouse JSON/HTML reports, before/after observations and this report. Temporary QA dependencies live under `tools/node_modules`; they are not application dependencies.

## Files modified

- `src/app/layout.tsx`: data-derived base title/description and keyboard skip link.
- `src/app/page.tsx`: specific homepage metadata and escaped Person JSON-LD.
- `src/app/projects/[slug]/page.tsx`: consistent case-study metadata and metadata-level not-found handling.
- `src/app/globals.css`: skip-link styling using existing theme tokens.
- `src/app/favicon.ico`: 32×32 ICO fallback generated from the existing N-mark SVG. `src/app/icon.svg` remains unchanged.
- `src/components/hero.tsx`: labeled group semantics; decorative status dot hidden from assistive technology.
- `src/components/navbar.tsx`: appropriate role for the labeled navigation group.
- `src/components/about-journey-education.tsx`: labeled group semantics and lighter Framer Motion primitives.
- `src/components/project-showcase.tsx`: matching visible/accessibility link names, descriptive screen-reader text, explicit `noopener noreferrer`, region semantics and lighter Framer Motion primitives.
- `src/components/technical-focus.tsx`: natural link name includes all visible text plus case-study context.
- `src/components/build-log.tsx`: appropriate role for the labeled GitHub group.
- `src/components/resume-link.tsx`: accessible labels include the unchanged visible action labels. Destinations, PDF opening and contact downloading behavior are unchanged.

The motion change uses the installed library's `LazyMotion`, `m` and `domAnimation` rather than loading unused drag/layout features. It adds no DOM wrapper, animation framework or dependency, and retains the existing reveal variants, viewport triggers and reduced-motion hook. Root package manifests, portfolio data, résumé, theme tokens, case-study content and layout styles were not changed in Module 10.

## Validation

- `npm.cmd run typecheck`: passed on the final application code.
- `npm.cmd run build`: passed on the final application code.
- Lint: not configured; no lint migration was performed.
- Tested `npm.cmd run start -- --port 3100`, not only a development server.
- Edge 154.0.4258.62 / Chromium, headless, Windows, Node 22.15.0.
- Homepage: light/dark at 1440, 1280, 1024, 768, 430 and 390px (12 checks).
- All four case-study routes: same viewport/theme matrix (48 checks).
- No horizontal overflow, clipped visible containers, widget/navbar overlaps or console errors in normal checked scenarios.
- Section offsets, navbar, mobile-menu keyboard/Escape/focus handoff/outside dismissal/resize behavior, case-study next/back and shared footer destinations passed.
- Keyboard-visible focus and skip link passed; the next Tab after using the skip link enters main content on homepage and case-study pages.
- Separate emulated touch contexts in both themes passed menu, section, theme and résumé actions, with no sticky hover movement.
- Live reduced-motion preference, visible offscreen content, once-only reveal re-entry, no-JavaScript and intentionally blocked application-script fallbacks passed. Desktop reveal animation was sampled and still plays with the lighter feature bundle.
- Contact email/phone/social destinations and actual résumé downloads passed. `/resume.pdf` returns HTTP 200, `application/pdf`, and the original PDF bytes.
- Five pages' title, description, OG and Twitter metadata passed. Person JSON-LD matches supplied data and contains no employment or award claims.
- Two unknown project slugs and an unrelated unknown route returned HTTP 404 with `noindex`, and no inherited homepage canonical.
- Favicon, SVG icon, social preview and résumé returned HTTP 200 with expected content types and exact asset bytes.
- Sitemap returns well-formed XML, robots returns text; missing-origin output contains no invented site URL. The configured-origin branch was unit-tested in isolation using a supplied HTTPS hostname as a fixture, never used in an application build. Full metadata against the real production origin awaits that origin.

## Accessibility review

axe-core 4.14.0: **zero violations across 20 page audits** (five routes, both themes, 1440/390px), plus two open-mobile-menu audits. The scans include WCAG A/AA tags and best practices. Semantic/heading checks found one main and h1 per page, no skipped heading levels, no unlabeled images or links, and safe new-tab relationships. Code-rendered project diagrams keep descriptive conceptual-flow labels; there are no raster project screenshots.

axe marked 41 homepage text nodes per theme/width for contrast review because decorative pseudo-element connectors prevented background detection. Supplemental alpha-composited solid-color checks on those desktop items found no below-threshold ratios: minimum **4.755:1 light** and **5.515:1 dark**. Project/technical-focus and mobile viewport screenshots were visually inspected; connector lines do not paint over the text. The supplemental model does not sample gradients, shadows, anti-aliased glyph pixels or all focus/hover combinations. Keyboard, focus, menu and reduced-motion checks provide additional evidence; automated scores do **not** establish full accessibility compliance.

## Actual performance measurements

Lighthouse 12.8.2, local production server on loopback, Edge/Chromium, light theme, one final run per scenario, after other browser checks finished. These are **local measurements, not deployed results** or a controlled benchmark.

| Scenario | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Homepage, simulated mobile | 81 | 100 | 100 | 63 | 2611.94 ms | 605.5 ms | 0 |
| Homepage, desktop preset | 99 | 100 | 100 | 63 | 613.40 ms | 95 ms | 0 |
| SentinelAI case study, simulated mobile | 98 | 100 | 100 | 63 | 1584.42 ms | 142 ms | 0 |

Mobile settings: 412×823, device scale 1.75, simulated 150ms RTT / 1638.4 Kbps throughput / 4× CPU slowdown. Desktop preset: 1350×940, scale 1, 40ms RTT / 10240 Kbps throughput / 1× CPU. Complete settings, environment, times, warnings and audits are recorded in `measurements.json` and each Lighthouse JSON/HTML report.

The initial homepage-mobile observation scored 68 with 1382 ms TBT. After the feature-bundle change, the recorded script transfer total fell from **191,735 to 178,357 bytes** (13,378 fewer bytes, same eight script requests). The paired score observations are not proof of a repeatable score gain; machine/load variation also affects them. Original reports are retained with the `before-` prefix, and actual script-transfer totals are in `bundle-comparison.json`.

The 60 responsive page observations also record durations and Layout Instability API entry sums in `results.json`. Maximum sum excluding recent-input entries: **0**. Maximum raw sum including recent input: **1.9971687500000002**. These automation sums are not CLS scores. Hover/focus layout dimensions were unchanged, with up to 1px coordinate rounding tolerance.

Images and fonts: homepage/case-study visuals are HTML/SVG rather than page raster images; no important image priority was removed. Existing system-font fallbacks require no remote font request and were preserved. The PNG preview is only a sharing asset. All application dependencies remain used; none were removed. No route delay, artificial loader or continuous animation was added.

## Remaining requirements and untested scenarios

1. **Real production origin missing:** set `NEXT_PUBLIC_SITE_URL` before building for deployment. Until then, indexing is disabled, sitemap is empty and canonical/OG URL/absolute social-image metadata fields are omitted. The asset is ready; its absolute metadata references require that origin. This is why current Lighthouse SEO scores are 63. Rebuild and verify the actual hosted metadata/crawler behavior after supplying the origin.
2. **Mobile blocking time remains an optimization opportunity:** final simulated homepage TBT was 605.5 ms, and Lighthouse still reports unused JavaScript in framework/application chunks. No working interaction was removed to chase a score.
3. **Firefox and WebKit unavailable:** their Playwright executables were not installed, so they remain untested. No real Safari or physical-device testing was performed. WebKit testing, if later performed, should be described as WebKit rather than real Safari.
4. **Deployed checks pending:** hosting, HTTPS/custom domain, real social-crawler fetching, actual production URL output, real-user performance and broader assistive-technology/browser review were not tested. Nothing was published during this module.

See `DEPLOYMENT.md` for the required variable, install/build/start commands, native Next.js hosting setup and post-deployment checks.
