# Nikhil Kakade Portfolio

This project includes a standalone HTML portfolio and a full Next.js portfolio. The standalone version runs independently and does not need Node.js, npm, or a local web server.

## Open the standalone portfolio

1. Open `D:\portfolio\standalone` in File Explorer.
2. Double-click `index.html`.
3. Chrome or Edge opens the portfolio. Keep `style.css`, `script.js`, and the `assets` folder beside `index.html` so its styling, mobile menu, profile photo, and résumé link load.

The standalone page uses `standalone/index.html`, `standalone/style.css`, and `standalone/script.js`, with its résumé and image kept in `standalone/assets/`. Its résumé is `standalone/assets/documents/resume.pdf`; the Next.js app uses `public/resume.pdf`. These are copies of the same document, so update both when the résumé changes.

## Run the Next.js application

The supplied profile photo is stored at `public/profile.jpeg` for Next.js and `standalone/assets/images/profile.jpeg` for the standalone page.

1. Open `D:\portfolio` in VS Code.
2. Open the integrated terminal.
3. Run `npm install` only if `node_modules` is missing or dependencies have changed.
4. Start the development server with the existing script:

   ```powershell
   npm run dev
   ```

5. Open the local URL printed in the terminal (usually `http://localhost:3000`).

Other existing scripts are `npm run typecheck`, `npm run build`, and `npm start` (for serving a production build after building).

## Important files and folders

- `standalone/index.html` — directly openable standalone page
- `standalone/style.css` — standalone responsive styles
- `standalone/script.js` — standalone mobile navigation and theme toggle
- `standalone/assets/documents/resume.pdf` — standalone résumé copy
- `standalone/README.md` — standalone-specific file notes
- `src/app/` — Next.js routes, layouts, page metadata, and page-level styles
- `src/components/` — reusable React interface and portfolio sections
- `src/data/` — portfolio content, skills, project and education data
- `src/hooks/` — React hooks
- `src/lib/` — SEO and site URL helpers
- `src/styles/` — shared design system styles
- `public/` — Next.js static assets: `resume.pdf` and `social-preview.png`
- `qa/` — preserved visual checks, project/contact regression checks, responsive-motion tests, and production-readiness reports; these are not application source files
- `package.json` — existing scripts and dependencies
- `DEPLOYMENT.md` — production hosting and deployment notes

There is no separate `tests/` directory or configured lint script in this project. The `.module*-qa/` folders contain the existing manual and automated verification artifacts and tools.
