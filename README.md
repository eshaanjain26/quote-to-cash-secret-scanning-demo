# Quote-to-Cash Secret Scanning Demo

Companion repo for the Microsoft Reactor session **"The Quote-to-Cash Blind Spot: Secret Scanning for Enterprise Revenue Systems"** (Sep 9, 2026), presented by Eshaan Jain.

> **All credentials in this repo are dummy, non-functional test values written for this demo.** They follow real vendor token formats on purpose, because that is what makes GitHub Advanced Security actually catch them. Do not reuse these values and do not model your own secrets on them.

## What this repo models

A typical CPQ to billing rollout: a Salesforce/Vlocity CPQ deployment that activates billing through an external revenue-tool gateway and processes a card payment through a Stripe-style API. Three places a quote-to-cash stack actually keeps credentials, and where each one lives here:

| Where credentials hide | File in this repo |
|---|---|
| Integration Procedure calling the billing gateway | `src/integration-procedures/CPQBillingActivation.ip.json` |
| Middleware script wiring CPQ to the payment processor | `src/scripts/activate-billing.js` |
| CI/CD deployment pipeline for the CPQ package | `.github/workflows/cpq-deploy.yml` |

The Integration Procedure and the middleware script each hardcode a secret. The workflow file is the fixed version: it pulls its token from a GitHub Actions secret instead of the source file. That contrast is the point of the talk: the fix is not exotic, it just has to actually get applied to the business-configuration layer, not only to application code.

## The two secrets in this repo (both fake)

1. `STRIPE_SECRET_KEY` in `activate-billing.js` — formatted like a live Stripe secret key. GitHub's secret scanning catches this with zero setup, because Stripe is a partner pattern GitHub ships out of the box.
2. `QTC_OAUTH_TOKEN` in `CPQBillingActivation.ip.json` — formatted like an OAuth bearer token from a fictional enterprise revenue-tool gateway ("QTC" = quote-to-cash). Nothing built into GitHub recognizes this format. That is the blind spot: the vendor-specific tokens business systems teams actually use are exactly the ones with no out-of-the-box pattern. Closing that gap is what the custom pattern in `docs/custom-pattern-regex.md` does.

## Demo materials

- `docs/demo-run-sheet.md` — the click-by-click live demo script (timed, matches the talk's run of show).
- `docs/custom-pattern-regex.md` — the exact custom secret scanning pattern used live: name, regex, test string, dry run, publish, push protection.

## Setting this repo up before you present

GitHub now turns secret scanning and push protection on by default for
public repos on personal accounts, so the setup here is shaped around
that: `activate-billing.js`'s hardcoded Stripe key gets blocked at the
moment of push, not discovered later as an alert already sitting in the
repo. The live block is the demo's opening beat, not something to avoid.

1. Push this repo to GitHub as **public** — but leave
   `src/scripts/activate-billing.js` **uncommitted**. Everything else
   (including the QTC token in `CPQBillingActivation.ip.json`, which no
   built-in pattern catches) pushes clean.
2. Repo Settings → Code security → confirm **Secret scanning** and **Push
   protection** are on (they're on by default for a new public repo, but
   verify rather than assume). Stripe's built-in pattern needs no extra
   config.
3. Do **not** enable the custom pattern yet. That gets built live, on
   stage, per the demo run sheet — that is the moment that makes the
   point.
4. Committing `activate-billing.js` — and watching push protection block
   it in real time — is Beat 1 of `docs/demo-run-sheet.md`. Don't push it
   ahead of time; that's what makes the block live instead of stale.
