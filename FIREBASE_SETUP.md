# Setting up real accounts (Firebase Auth + Firestore)

The app now has real sign-up/login wired in (`src/contexts/AuthContext.tsx`,
`src/firebase.ts`) using Firebase Authentication and Firestore. Until you
connect a real Firebase project, the app runs fine but shows a
"Firebase isn't configured yet" banner and sign-up/login are disabled.

## 1. Create the Firebase project (free)

1. Go to https://console.firebase.google.com/ and sign in with a Google
   account.
2. "Add project" → name it (e.g. "CasaFeliz") → you can disable Google
   Analytics for this project, it's not needed → Create.

## 2. Register a Web App

1. In the project overview, click the `</>` (web) icon to add a web app.
2. Nickname it anything (e.g. "CasaFeliz Web") — you do **not** need
   Firebase Hosting for this step.
3. It'll show you a `firebaseConfig` object like:

   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "casafeliz-xxxxx.firebaseapp.com",
     projectId: "casafeliz-xxxxx",
     storageBucket: "casafeliz-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef",
   };
   ```

   Keep this page open — you'll need these six values next. (These are
   safe to share/commit in the sense that they aren't secret credentials —
   Firebase's real security boundary is the rules in `firestore.rules` —
   but they're kept out of git here anyway via `.env.local` for
   convenience, e.g. swapping between a dev and prod project.)

## 3. Enable Email/Password sign-in

1. In the left sidebar: Build → Authentication → Get started.
2. Sign-in method tab → Email/Password → enable it → Save.

## 4. Create the Firestore database

1. Left sidebar: Build → Firestore Database → Create database.
2. Choose a region close to you, start in **production mode** (the repo's
   `firestore.rules` will lock it down correctly).

## 5. Deploy the security rules

The repo already has `firestore.rules` (users can only read/write their
own profile document) and `firebase.json` pointing to it. Simplest way to
apply it without installing anything:

1. Firestore Database → Rules tab in the console.
2. Paste the contents of `firestore.rules` from this repo.
3. Publish.

(Alternatively, if you have the Firebase CLI: `firebase login`, then
`firebase deploy --only firestore:rules` from the repo root.)

## 6. Wire the app to your project

```bash
cp .env.example .env.local
```

Fill in the six values from step 2 into `.env.local`. Then:

```bash
npm install
npm run dev
```

The "Firebase isn't configured yet" banner should disappear, and
sign-up/login will work for real — a new account creates a Firebase Auth
user and a `users/{uid}` Firestore document with their name/email/type.

To ship it into the native apps too:

```bash
npm run cap:sync
```

(Capacitor bundles the built web app, including these env values baked in
at build time — same as any Vite app.)

## What's real now vs. still simulated

- **Real:** account creation, login, session persistence, storing the
  user's name/type/property address in Firestore.
- **Still simulated:** phone SMS verification, ID upload/verification,
  bank connection, rent payments, the tenant roster/messages/QR linking.
  Those are separate integrations (Twilio, Stripe Identity, Plaid, Stripe
  Payments) — happy to wire up whichever's next.
