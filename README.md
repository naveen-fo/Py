# PyStep: learn Python in a 3D world

All files are in the repo root (no folders). React + Vite + Three.js. Python runs in the browser (Pyodide).

## Step 1: upload
Upload every file from this zip to the root of your GitHub repo (branch `main`).

## Step 2: add the two workflow files (GitHub needs a folder for these)
`android-apk.yml` and `deploy-pwa.yml` in this zip are only copies. GitHub runs workflows only from `.github/workflows/`.
For each one: repo > Add file > Create new file > in the name box type `.github/workflows/android-apk.yml`
(typing `/` makes the folders) > paste the file content > Commit. Repeat with `.github/workflows/deploy-pwa.yml`.

## PWA
Settings > Pages > Source: **GitHub Actions**. After the `Deploy PWA` run finishes, open the link on your phone and choose Install app.

## Android APK
Actions tab > **Build Android APK** > Run workflow. When done, download the `pystep-debug-apk` artifact and install `app-debug.apk`.

## Add lessons
Add a line `L(title, explanation, starterCode, expectedOutput)` in `curriculum.js`.

## Blank white page?
The page now shows an error message instead of staying blank. Also check that Pages Source is **GitHub Actions**, not "Deploy from a branch".
