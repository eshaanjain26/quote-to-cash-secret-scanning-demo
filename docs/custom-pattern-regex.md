# Custom secret scanning pattern: the QTC gateway token

This is the exact pattern to build live during the talk. It closes the gap for
the one secret in this repo that no built-in GitHub pattern catches: the OAuth
token for the fictional "quote-to-cash" billing gateway, hardcoded in
`src/integration-procedures/CPQBillingActivation.ip.json`.

## Where to build it

Repo (or org) → **Settings** → **Code security** → **Secret scanning** →
**Custom patterns** → **New pattern**.

## Pattern definition

| Field | Value |
|---|---|
| Pattern name | `QTC Billing Gateway Token` |
| Secret format (regex) | `qtc_(live\|test)_[a-f0-9]{32}` |
| Test string | `qtc_live_8f3a1c9d7e2b4561f0a3c8d2e9b7154a` |

That test string is the literal value already sitting in
`CPQBillingActivation.ip.json`, which is what makes the dry run land: it will
find a real match in the repo's history in front of the audience, not a
synthetic example.

## Live steps

1. Paste the pattern name and regex.
2. Paste the test string, confirm it highlights as a match.
3. Click **Save and dry run**. Wait for the scan (usually seconds on a repo
   this small) and open the results: it should show one match, the existing
   token in `CPQBillingActivation.ip.json`.
4. Click **Publish pattern**.
5. On the publish screen, check **Enable push protection for this pattern**.
6. Confirm. The pattern is now live and enforced on every future push.

## What this proves to the room

Before this pattern existed, that token sat in the repo, in a file most
AppSec scanners never open, matching a format specific to one CPQ vendor's
billing gateway. Nothing generic was ever going to catch it. The custom
pattern is what makes GitHub's secret scanning fit a stack that was built out
of Salesforce/Vlocity, not out of application code.
