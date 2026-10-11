# Module 9 verification

Completed Motion + Responsive Polish only. Module 10 was not started.

## Changed files

- `src/components/navbar.tsx`: mobile menu keyboard, focus, Escape, outside dismissal and resize handling.
- `src/components/hero.tsx`: simplify existing entrance markup; preserve content and links.
- `src/components/about-journey-education.tsx` and `src/components/project-showcase.tsx`: visible server output, restrained once-only reveals and live motion preference handling.
- `src/hooks/use-motion-enabled.ts` (new): viewport, pointer and reduced-motion subscription; still server snapshot.
- `src/app/portfolio.css` and `src/styles/design-system.css`: consistent motion tokens, hover media queries, equivalent keyboard focus, anchor offsets, touch targets and mobile hero fit.

Portfolio data, résumé bytes, case-study routes, contact/footer/ResumeLink components, UI primitives and Modules 6–8 source components match the saved baseline. Earlier component edits are confined to motion and menu behavior. No dependencies were added, no artificial loading screen or navigation delay was introduced.

## Validation

- `npm.cmd run typecheck`: passed.
- `npm.cmd run build`: passed; the existing homepage and four case-study routes remain generated.
- Lint: no configured script.
- Production browser verification: `node qa/responsive-motion-tests/check.cjs`, Microsoft Edge via Playwright, passed.
- Homepage: both themes at 1440, 1280, 1024, 768, 430 and 390px (12 combinations).
- Case studies: all four routes in the same viewport/theme matrix (48 combinations).
- No horizontal overflow, clipped containers, hero overlaps or console errors in the checked scenarios.
- Keyboard focus, mobile menu Escape/focus handoff/outside dismissal/Tab exit/resize handling, section offsets, once-only reveals and live reduced-motion changes passed.
- Separate touch contexts in both themes: menu, section navigation, theme switching and résumé download passed; no sticky hover movement or continuous floating animation.
- No-JavaScript and intentionally blocked application-script scenarios: content visible, native footer navigation and résumé download passed.
- Contact destinations, footer destinations, keyboard next-project navigation and actual PDF downloads passed. `/resume.pdf` returns HTTP 200 with PDF content type and bytes identical to the original résumé.

## Measured layout observations

`results.json` records 60 page observations using the Chromium Layout Instability API, including observation duration and raw value sums. The maximum observed value sum without recent input was **0**. Five homepage observations contained entries marked with recent input; the maximum raw sum including those entries was **1.9964374999999999**. These sums describe the automated interactions; they are not a CLS or Lighthouse score. Hover/focus layout dimensions remained unchanged, with a maximum 1px coordinate rounding tolerance.

## Artifacts and limitations

`results.json` is the final passing report; `check.cjs` is the reproducible browser check. The 76 PNG screenshots cover homepage, hero, menus, all case-study combinations, fallback scenarios and initial layout preflight. `baseline.json` records preserved data/source hashes. Checks were performed in Chromium-based Edge; other browser engines were not tested.

No unresolved issues were found in the tested scenarios.
