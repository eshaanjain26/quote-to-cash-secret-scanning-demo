# Live demo run sheet

Timed for the 20-minute demo block (approx. minute 25 to minute 45 of the
60-minute session). Practice this end to end at least twice before Sep 9 at
real speed with a timer. Everything here assumes the repo is already pushed
to GitHub as public, per the setup steps in the repo README, with one
deliberate exception: `src/scripts/activate-billing.js` exists on disk but
is **not yet committed**. That file, and the block it triggers, is Beat 1 —
don't push it ahead of time, and don't run this run-through more than once
against the real repo without swapping in a fresh key value first (see
"If something breaks live" below).

Note on why this run sheet is shaped this way: GitHub now turns secret
scanning and push protection on by default for public repos on personal
accounts, so a hardcoded Stripe-shaped key gets blocked at the moment of
push, not discovered later sitting quietly in the Security tab. That
default-on behavior is actually a better demo than the one this run sheet
was originally written around — real-time push protection, in the terminal,
is a stronger opener than a pre-existing alert. Beat 1 is built around that.

Keep a terminal, a browser tab on the repo's Security tab, and a browser tab
on Settings → Code security open before you start screen sharing. Switching
tabs live is fine. Hunting for tabs live is not.

---

## Beat 1: push protection blocks the leak, live (approx. 6 minutes)

1. In the terminal, from the repo root, run:

   ```bash
   git add src/scripts/activate-billing.js
   git commit -m "Add setup-fee charge script"
   git push
   ```

2. The push is rejected. GitHub's push protection returns the block
   directly in the terminal output: secret type (Stripe API key), file,
   line, and a link to allow or resolve it. Narrate it as it prints — don't
   paraphrase, read the actual output on screen.
3. Narrate: "This is an ordinary commit. Nothing about it looked unusual to
   the person who wrote it. It never reached the remote — GitHub stopped it
   before the push even completed."
4. Do not bypass it live. Open `activate-billing.js`, swap the hardcoded
   `STRIPE_SECRET_KEY` literal for `process.env.STRIPE_SECRET_KEY`, then:

   ```bash
   git add src/scripts/activate-billing.js
   git commit -m "Add setup-fee charge script"
   git push
   ```

   Show the push succeed clean. That's the fix, not just the block.

## Beat 2: the blind spot (approx. 4 minutes)

1. Open `src/integration-procedures/CPQBillingActivation.ip.json`. Point out
   the `Authorization: Bearer qtc_live_...` value on the
   `ActivateBillingAccount` step — the same category of secret as the one
   that was just blocked, sitting in the repo since the initial push.
2. Switch to the repo's **Security** tab → **Secret scanning alerts**. No
   alert for it. Say out loud: "Stripe is a partner pattern GitHub ships by
   default. A vendor-specific enterprise token from a CPQ billing gateway
   is not. Nothing generic was ever going to catch this one."

## Beat 3: build the custom pattern, live (approx. 6 minutes)

Follow `docs/custom-pattern-regex.md` exactly: name, regex, test string, dry
run, review the match, publish, enable push protection for the pattern. Talk
through what the dry run finds while it's finding it, don't just wait
silently.

## Beat 4: the alert triage view (approx. 4 minutes)

1. Back in the Security tab, open the alert that just appeared for the QTC
   token now that the custom pattern is live.
2. Walk through the fields a security lead actually works from: secret
   type, validity state, location, who introduced it and when, and the
   resolution dropdown (revoke and rotate, used in tests, false positive,
   won't fix with reason).
3. Close on the state change: mark it however you'd actually resolve it in
   a real triage (revoke and rotate), and say what happens next in a real
   incident: rotate the credential at the vendor, confirm the scan comes
   back clean.

---

## If something breaks live

- Push protection doesn't trigger in Beat 1: check Settings → Code security
  → confirm push protection is on for the repo (not just secret scanning)
  and that you didn't already resolve/allow that exact secret value in an
  earlier rehearsal. If you've rehearsed this before, change one character
  in the `STRIPE_SECRET_KEY` value before the live run so it's a value
  GitHub hasn't seen and allowed yet.
- Dry run finds zero matches: confirm the regex is
  `qtc_(live|test)_[a-f0-9]{32}` exactly and the test string matches the
  literal value in `CPQBillingActivation.ip.json`.
- Running short on time: skip re-committing the clean fix at the end of
  Beat 1 and go straight to Beat 2. The block itself is the moment that
  lands; the clean re-push is a nice-to-have.
- Running long: cut Beat 4 down to just opening the alert and naming the
  fields, skip actually resolving it on screen.
