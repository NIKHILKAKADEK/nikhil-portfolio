# Deployment preparation

This is a standard Next.js App Router application using the existing Node-server configuration (`next.config.ts` has no static-export or standalone setting). Nothing has been deployed during Module 10.

## Install and validate

Use a Node version supported by the installed Next.js package (minimum 20.9). These checks were run with Node 22.15.0 and npm 10.9.2.

```sh
npm ci
npm run typecheck
npm run build
npm start
```

There is no configured lint script. Do not use `npm run dev` as the production start command.

## Required environment variable

Set `NEXT_PUBLIC_SITE_URL` to the site's actual public HTTPS origin **before `npm run build`**. Use only the origin, with no path, port, credentials, query or fragment. A trailing slash is accepted. `.env.example` documents the variable without supplying a fictitious domain. For local configuration, copy it to `.env.local` and supply the real origin; on hosting, use the provider's production environment settings.

No production URL was present in the checkout or task environment. This remains a deployment requirement. Without it, pages emit `noindex, nofollow`, robots disallows crawling, sitemap has no entries, and canonical/Open Graph URL/social-image URL fields are omitted. Person facts remain available without a site URL. Invalid and obvious placeholder origins cause an error. Once the origin is supplied, rebuild: all five canonical URLs, both social-image metadata references, Person URL, sitemap entries and crawl rules are generated from that origin. These pages are prerendered, so changing only the start-time variable will not update their SEO output.

No API keys, contact backend or GitHub API configuration are required.

## Hosting setup

Use a host with native Next.js support (for example, Vercel's Next.js framework preset) or a Node.js server. Set the repository root as the project root, install with `npm ci`, and build with `npm run build`. Configure the production environment variable and custom/public domain before the build.

For a Node host, start with `npm start -- --hostname 0.0.0.0` and configure `PORT` as required by the host. Retain `.next`, `public`, the package manifests, runtime dependencies and configuration; place the server behind the host's HTTPS endpoint or reverse proxy. Deploy the complete Next.js build, rather than treating `.next` as a static folder. Preserve native routing and 404 responses. No static-export migration or hosting adapter was introduced.

The `qa/` directory and its temporary tools are local verification artifacts and are not needed by the running application. `.vercelignore` excludes it from Vercel uploads. Exclude it from other host bundles as well. Retain `public/resume.pdf` and `public/social-preview.png`. The preview is a real 1200×630 PNG containing supplied name, student profile and location; it does not depict projects.

## Post-deployment checks

1. Open the HTTPS homepage and all four `/projects/…` routes; verify an unknown project returns HTTP 404.
2. Inspect each page's title, description, canonical, Open Graph and Twitter metadata. Confirm all site URLs use the actual origin and the preview returns HTTP 200 with `image/png`.
3. Confirm `/sitemap.xml` contains the homepage and four case-study URLs, `/robots.txt` allows crawling and points to that sitemap, and page robots metadata allows indexing. Check homepage Person JSON-LD contains only the supplied facts.
4. Verify `/favicon.ico`, `/icon.svg` and `/resume.pdf`. Check that the PDF opens from header/hero and downloads from Contact with the intended filename.
5. Test both themes on desktop/tablet/mobile, navigation anchors, mobile-menu keyboard/Escape/focus behavior, footer navigation from case studies, contact destinations, visible focus and reduced motion.
6. Check browser console/network errors and run accessibility/performance checks on the deployed origin. Local Module 10 measurements are not deployed results. Test Firefox and WebKit or real target browsers separately; neither engine was installed locally.

See `qa/production-readiness-audit/README.md` for local verification, measurements and remaining requirements.
