
/**
 * activate-billing.js
 *
 * Middleware script wired into the CPQ deployment. Runs after contract
 * activation to charge the setup fee through the payment processor
 * before the billing gateway call in CPQBillingActivation.ip.json fires.
 *
 * This is the kind of script that gets written once during a CPQ rollout,
 * works, and then never gets touched again -- which is exactly why the
 * hardcoded key below sat here undetected until secret scanning was
 * turned on for this repo.
 */

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
async function chargeSetupFee(accountId, amountCents) {
  const response = await fetch("https://api.stripe.com/v1/charges", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      amount: String(amountCents),
      currency: "usd",
      description: `CPQ setup fee for account ${accountId}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stripe charge failed for account ${accountId}: ${response.status}`);
  }

  return response.json();
}

module.exports = { chargeSetupFee };

