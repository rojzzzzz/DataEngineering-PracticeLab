# Contributing

Use Python 3.11+ and Node.js 22.19+ for development. Follow the installation
instructions in [README.md](README.md), then install the editor dependencies
with `npm ci` in `erd_frontend`.

Before opening a pull request, run:

```sh
python -m pytest tests -q
cd erd_frontend
npm test
npm run format:check
npm run build
```

Edit frontend sources in `erd_frontend/src`, then rebuild and include the
generated assets with your changes. Keep third-party notices and font licenses.
Use temporary databases for tests and browser checks; never include personal
progress, API keys, runner tokens, uploaded banks or backups in a pull request.

The optional editor browser regression uses Playwright and the built assets:

```sh
cd erd_frontend
npm install --no-save --package-lock=false playwright
npx playwright install chromium
cd ..
node scripts/verify_editor_recovery.cjs
```

If Playwright is installed elsewhere, set `PLAYWRIGHT_MODULE` to that package.
`PLAYWRIGHT_CHANNEL` can select an installed browser channel such as `chrome`.
The check starts and closes its own local test server and needs no API keys.

Describe the problem, the resulting behavior and the checks you ran. For bugs,
include reproduction steps and relevant Python, Node.js and operating-system
versions. Use synthetic examples instead of private data.
See [SECURITY.md](SECURITY.md) for vulnerability reporting.

This project is licensed under the [MIT License](LICENSE). Third-party assets
retain their own licenses, as listed in the notices under `erd_frontend` and
`static/pipeline`.
