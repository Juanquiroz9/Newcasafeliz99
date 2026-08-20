# CasaFeliz Privacy Policy

_Last updated: 2026-08-20_

## Summary

CasaFeliz uses Firebase (Google) for account creation and login. Your
name, email address, and account type (landlord/tenant) are stored so
you can log back in and see your own data. Everything else in the app —
phone verification, ID upload, bank connection, rent payments, the
tenant roster and messages — is currently a simulated demo and does not
transmit real data anywhere.

## What we collect

When you create an account:

- **Full name, email address, account type** — stored in our Firestore
  database (via Firebase Authentication and Firestore, both operated by
  Google) so you can log in again later.
- **Password** — handled entirely by Firebase Authentication; we never
  see or store your password ourselves.
- **Property address and unit count** (landlords only, if entered) —
  stored the same way.

Security rules on our database ensure only you can read or write your
own account record — nobody else's account, including other
landlords/tenants, can see it.

## What we don't collect

- Phone numbers you enter during "phone verification" are not sent
  anywhere or stored — that step is simulated.
- ID photos, bank account selections, and payment details shown in the
  app are not real — nothing is uploaded, verified, or charged. Buttons
  referencing Stripe, Plaid, and Twilio simulate what those integrations
  would look like; **no real connection to any of these services is
  made** at this time.
- We do not use analytics or advertising SDKs, and do not sell or share
  your data with third parties.

## Data retention & deletion

Your account record persists until you ask us to delete it. To request
deletion, contact us at the email below.

## Children's privacy

CasaFeliz is not directed at children and we do not knowingly collect
data from anyone under 13.

## Changes to this policy

If real payments, identity verification, or bank connections are added
in the future, this policy will be updated to reflect exactly what data
is collected and how it is used before that functionality ships.

## Contact

For privacy questions about this app, contact: <REPLACE_WITH_SUPPORT_EMAIL>
