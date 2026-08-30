# Getting this repo onto GitHub

Run this once, from this folder. Note the `git add` below deliberately
excludes `src/scripts/activate-billing.js` — that file stays uncommitted
on disk. Committing and pushing it live, and watching push protection
block it, is Beat 1 of the demo (see `docs/demo-run-sheet.md`); don't push
it ahead of time.

```bash
git init
git add . ':!src/scripts/activate-billing.js'
git commit -m "Initial commit: CPQ billing activation demo"
git branch -M main
git remote add origin https://github.com/eshaanjain26/quote-to-cash-secret-scanning-demo.git
git push -u origin main
```

If the repo doesn't exist on GitHub yet, create it first at
github.com/new: name it `quote-to-cash-secret-scanning-demo`, set it to
**Public**, and don't initialize it with a README (this folder already has
one) -- then run the commands above.

After the push:

1. Repo → **Settings** → **Code security** → confirm **Secret scanning**
   and **Push protection** are on. GitHub turns both on by default for a
   new public repo on a personal account, but verify rather than assume.
2. Leave the custom pattern OFF until you build it live, per
   `docs/demo-run-sheet.md`.
3. Do a full dry run of the demo end to end at least once before Sep 9,
   ideally against a second scratch copy of the repo so your rehearsal push
   protection block doesn't consume the exact key value you plan to use
   live (push protection remembers a value once it's been allowed/resolved
   for a repo). If you rehearse against this same repo, change one
   character in `STRIPE_SECRET_KEY` before the real run.
