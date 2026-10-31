# PyStep: learn Python in the browser

React + Vite app. Python runs in the browser with Pyodide. Works as a PWA and as an Android APK (Capacitor).

## Run locally
```
npm install
npm run dev
```

## Add lessons
Open `src/curriculum.js` and add a line like `L(title, explanation, starterCode, expectedOutput)` to a level.
A lesson is marked done when the code's printed output equals `expectedOutput`.

## PWA (installable)
1. Push this project to a GitHub repo (branch `main`).
2. Repo Settings > Pages > Source: **GitHub Actions**.
3. The `Deploy PWA` workflow publishes the site. Open the link on your phone and choose **Install app** or **Add to Home screen**.

## Android APK
1. Push to `main` (or run the `Build Android APK` workflow manually from the Actions tab).
2. Open the finished run and download the `pystep-debug-apk` artifact. Unzip it and install `app-debug.apk` on your phone.
3. For Play Store you need a signed release build (keystore stored in GitHub Secrets). This is not set up yet.

## Notes
- Python files load from a CDN the first time, so the first run needs internet. After that the PWA caches them.
- Run `npm install` locally once and commit `package-lock.json`; then you can use `npm ci` in the workflows.
