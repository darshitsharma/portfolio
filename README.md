# Darshit Sharma | AI & ML Portfolio

A responsive, high-key portfolio built with React 19, TypeScript, Vite, Motion, Lucide, and Three.js. Fonts are bundled locally. No API keys or external asset services are required.

## Run locally

Use Node.js 22.12+ or a current Node.js LTS release.

```sh
npm install
npm run dev
```

Vite prints the local URL, normally http://localhost:5173. Use the port it reports if that port is occupied.

## Verification

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite covers desktop and mobile layouts, filters, case-study and document dialogs, focus restoration, timeline expansion, byte-identical certificate downloads, local logo loading, responsive document previews, contact destinations, WCAG A/AA checks, nonblank animated WebGL pixels, and the absence of chatbot controls. `npm run format` formats the source and tests.

## Content and behavior

- `src/data.ts` is the shared resume source for projects, experience, skills, and PDF content. Update dates and metrics there as the resume changes.
- The four professional case studies explain architecture, engineering rationale, and evaluation scope using the supplied resume. Personal projects are separate: AgentFlow and AMEX were checked against their public GitHub READMEs and core implementation files on 25 Oct 2026. Source URLs and evidence notes live in `src/data.ts`; no personal-project production outcomes or unverified benchmark rankings are claimed.
- Toptal network membership and the public profile URL were checked on 25 Oct 2026. The profile lists membership since 22 Oct 2026. The hero, contact section, and generated resume link to the canonical public profile without its preview query parameter.
- The INR 172+ Cr headline combines INR 152 Cr of business impact with INR 20 Cr in one-time savings. INR 30 lakh per-cycle savings are reported separately.
- `src/Avatar.tsx` contains a custom Three.js companion. It follows the cursor, reacts to hero buttons, can be paused, respects reduced-motion preferences, and has a CSS fallback for unavailable WebGL. Replace the `Robot` model to use a future personal 3D asset.
- Native case-study dialogs provide focus containment and Escape support.
- Resume PDF generates a new, paginated PDF from the supplied text using jsPDF. It does not download the original resume PDF, which was not available as a workspace file. To use the original, add it to `public/` and replace the download handler with a download link.
- The generated PDF includes the selected personal projects and clickable GitHub/Toptal links. The attached original resume is not rewritten or digitally signed.
- Case-study diagrams are illustrative, not live dashboards or proprietary project data.
- Contact links open email, telephone, and LinkedIn destinations. No contact messages are collected by the website.

## Bundled documents and logos

- The current Mahindra role includes the four supplied awards. Each internship includes its corresponding original certificate. Titles, printed issue dates, and local paths are in `src/data.ts`.
- All six originals are copied into `public/documents/`. The source files in Downloads remain unchanged. `public/documents/provenance.json` records their original filenames and SHA-256 hashes, checked by the unit tests.
- The award originals have `.jpg` filenames but contain PNG data. Repository copies use `.png` extensions without changing their bytes.
- Certificate thumbnails are first-page PNG renderings of the original PDFs. Previews are uncropped and keyboard accessible; open and download links always point to the original image or PDF, not its thumbnail.
- `public/logos/` contains Mahindra Group's actual LinkedIn company icon and official skill marks from the projects' own sites. `src/brand-assets.json` records each source page and asset URL. The deployed app reads only local assets, with no runtime dependency on LinkedIn or third-party image services.
- Skills without a verified project-specific mark stay text-only. This includes general concepts and protocols without a single brand, plus cuDF, LLaMA, LangGraph, and pgvector. No replacement logos are fabricated.
- Logos identify the corresponding tools and employer; no endorsement is implied. Their owners retain their marks. Review applicable brand guidelines for redistribution.

To refresh assets on the author's Mac with the source Downloads files still present, run `node scripts/prepare-assets.mjs`. This uses the installed Playwright Chromium and macOS `sips`; `--documents-only` skips logo downloads. It refuses to replace a differing original copy. Asset preparation is not required for deployment: the originals, previews, and logos are already bundled.

## Deploy

For the `darshitsharma/portfolio` repository on GitHub Pages, enable **Settings > Pages > GitHub Actions**, then push the reviewed source to `main`. The included workflow verifies the site and deploys only the built `dist/` artifact. It uses the `/portfolio/` base path and does not publish pull requests. No deployment token needs to be added to the repo. See [SECURITY.md](SECURITY.md) for the account, branch, and environment protection checklist; those settings must be enabled in GitHub separately.

To reproduce the production Pages checks locally:

```sh
PAGES_BASE_PATH=/portfolio/ npm run build
PAGES_BASE_PATH=/portfolio/ npm run test:e2e:production
```

The production build includes a browser Content Security Policy and a document-integrity/secret-file-pattern check. A published resume cannot be made uncopyable or uneditable after download; protect publishing access and use a digitally signed original PDF if third-party authenticity verification is required.

For a root-hosted deployment:

```sh
npm run build
npm run preview
```

Deploy the `dist/` directory to a static host such as Netlify, Vercel, Cloudflare Pages, or GitHub Pages. For subdirectory hosting, set Vite's `base` in `vite.config.ts` and use the same base for public assets. Add your production domain and social preview image to `index.html` when known.

The 3D engine and PDF generator are lazy-loaded separately from the main page. Vite may report a large optional 3D chunk; it is not part of the initial main bundle. No private project data, credentials, or tracking scripts are included.
