# Security and Publishing

## What this protects

This is a static site. It has no server-side editor, upload endpoint, admin login, database, or API credentials. Visitors cannot write changes back to GitHub Pages through the website. Publishing access is controlled by your GitHub account, repository permissions, and deployment settings.

The production build adds a Content Security Policy that allows local scripts, fonts, images, and connections; blocks inline/evaluated scripts, embedded frames/objects, base-URL changes, and form submission; and sets a no-referrer policy. Inline styles are allowed because React and Motion use them. The policy is production-only so Vite's development tooling still works.

Build verification compares the six original documents against the SHA-256 values recorded in the repository. It also rejects symlinks, environment-file names, private-key file extensions, and Git/dependency directories in the deployment output. These are useful checks, not complete secret scanning or a digital signature. Someone with repository write access could change both a file and its expected hash.

## Required GitHub Settings

1. Enable a passkey or two-factor authentication on your GitHub account. Secure your recovery methods and review account sessions, SSH keys, personal access tokens, and authorized applications. Never place tokens or private keys in this project.
2. In repository **Settings > Pages**, select **GitHub Actions** as the build/deployment source. Enable **Enforce HTTPS**. The workflow is configured for `https://darshitsharma.github.io/portfolio/`.
3. Protect the publishing branch, currently `master`, with an active branch ruleset: block force pushes and deletion, require pull requests, and require the `build` status check after the workflow has run once. Keep bypass permissions limited and review collaborator access. These protections are available for public repositories on GitHub Free; check your plan if the repository is private.
4. Restrict the `github-pages` environment to deployments from `master`. Do not leave it open to arbitrary branches or tags. The workflow independently restricts deployments to this branch and does not deploy pull requests.
5. Enable Dependabot alerts, secret scanning, and push protection where available. Weekly dependency/action update PRs are configured. Review them and rerun checks; do not blindly auto-merge.
6. Review the certificates before publishing: they contain personal information and signatures. All files in `public/`, and all files in a public repository, are publicly downloadable. Remove or redact anything you do not intend to publish before committing it; the bundled originals have deliberately not been altered.

`CODEOWNERS` requests review from `@darshitsharma`; it does not enforce access control by itself. Requiring Code Owner approval needs branch protection and an eligible reviewer. GitHub does not allow you to approve your own PR, so a solo maintainer should not enable an approval requirement they cannot satisfy. Add a trusted reviewer to CODEOWNERS before requiring approval of your own changes.

If you rename `master` to `main`, update both branch filters/conditions in the workflow and the GitHub protections/environment settings. If you rename the repository or use a custom domain/user site, update `PAGES_BASE_PATH` in the workflow (`/` for a root site).

## Deployment Controls

The workflow uses immutable, verified GitHub Action commit pins, `npm ci` with the committed lockfile, high/critical dependency-audit gating, lint, unit tests, artifact checks, and desktop/mobile tests against the actual production build under `/portfolio/`. Only the deployment job receives `pages: write` and OIDC permission. Checkout credentials are not persisted. No personal access token is needed. Only `dist/` is uploaded, after checks pass.

GitHub Pages does not let this repository configure arbitrary HTTP response headers. Do not rely on a `_headers` file, `frame-ancestors` in a meta tag, or an `X-Frame-Options` meta tag. The HTML policy cannot enforce embedding protection for the site or directly opened PDFs. If you need custom response headers, use a host or proxy that supports them.

## Resume Authenticity Limits

A public resume or certificate can always be downloaded, copied, screenshotted, or edited elsewhere. Disabling right-click, hiding links, or adding PDF editing passwords does not provide reliable protection. Local browser/DevTools edits affect only that visitor's copy, not your published site.

The resume download currently generates a PDF in the visitor's browser from the published portfolio data. It is not cryptographically signed. To let recipients verify an independently shared resume, publish an original PDF digitally signed using a trusted certificate and keep its signing key offline. A signature makes changes detectable in compatible PDF readers; it does not prevent someone from making an altered copy. This project does not invent a signing identity or store a signing key.

## Reporting

Do not post personal information, credentials, or private documents in public issues. Use GitHub private vulnerability reporting when enabled, or the contact email listed on the portfolio.