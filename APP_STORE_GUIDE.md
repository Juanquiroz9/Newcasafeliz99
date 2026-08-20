# Publishing CasaFeliz to the App Store & Google Play

The app is now wrapped as a native project for both platforms using
[Capacitor](https://capacitorjs.com/) — `android/` and `ios/` are real,
buildable native projects that load the React app's compiled output. App
icons and splash screens are already generated in both projects from
`resources/`.

## Read this first: compliance risk

CasaFeliz's UI name-drops real companies (Stripe, Plaid, Twilio, Auth0,
Firebase) and simulates identity verification, bank connection, and rent
payment. As of the Firebase Auth integration (see `FIREBASE_SETUP.md`),
**account creation and login are real** — everything else (phone SMS,
ID upload, bank connection, rent payment) is still simulated; see
`PRIVACY.md` for exactly what the app does and doesn't do.

This is very likely to cause problems in review, especially on Apple's
App Store:

- **Apple Guideline 2.1 / 4.2 (Minimum Functionality)** — apps whose
  core features don't actually work are rejected.
- **Misrepresentation** — showing "Powered by Stripe Identity" /
  "Powered by Plaid" badges without a real integration can read as
  implying a partnership or certification that doesn't exist.
- Google Play is generally more lenient on launch but still requires an
  accurate **Data Safety** form and can reject apps for deceptive
  behavior claims.

Before a real public submission, you have two realistic paths:

1. **Wire up real backends** (Stripe, Plaid, Twilio, etc. — or your own
   equivalents) so the features actually work, or
2. **Relabel the demo** — remove/soften the "Powered by X" badges and
   ship it clearly as a prototype/concept app (still fine for Google
   Play; iOS may still flag incomplete flows like the ID upload step
   that doesn't do anything real).

I can help with either — just say which direction you want. Everything
below gets you to "ready to submit," but the review outcome depends on
this.

## Prerequisites

| | Apple App Store | Google Play |
|---|---|---|
| Account | [Apple Developer Program](https://developer.apple.com/programs/) — $99/year | [Google Play Console](https://play.google.com/console/signup) — $25 one-time |
| Build machine | A Mac with Xcode (or a cloud Mac: MacStadium, Codemagic, GitHub Actions `macos-latest`) | Any OS — Android Studio |
| Sign-up needs | Legal name/business, D-U-N-S number if enrolling as an org | Legal name/business, government ID for verification |
| Review time | ~1–3 days typically | Few hours to a few days |

Neither account can be created on your behalf — they require your own
identity/payment verification.

## App identity (decide before first submission)

- **Bundle/Application ID:** currently set to `com.casafeliz.app` in
  `capacitor.config.ts`, `android/app/build.gradle`, and the iOS
  project. This is effectively permanent once you submit — change it
  now if you want something else (e.g. `com.yourcompany.casafeliz`),
  by editing those three places and running `npx cap sync`.
- **App name:** "CasaFeliz" — set in `capacitor.config.ts` and both
  native projects.
- **Version:** 1.0.0 (Android `versionCode` 1, iOS build 1).

## Building locally

```bash
npm install
npm run build      # builds the web app into dist/
npx cap sync        # copies dist/ into both native projects
```

Run this after any change to `src/`.

### Android

```bash
npx cap open android
```

This opens the project in Android Studio (installs the Android SDK for
you on first run — that's the piece this sandbox couldn't do). From
there:

1. Build → Generate Signed Bundle / APK → Android App Bundle (`.aab`,
   what Play Store wants).
2. Create a new keystore if you don't have one, and **back it up** —
   losing it means you can never update the app under the same listing
   again.
3. Upload the resulting `.aab` in Play Console → your app → Production
   (or Internal testing first, recommended).

### iOS

Requires a Mac:

```bash
npx cap open ios
```

Opens `App.xcworkspace` in Xcode. From there:

1. Select the "App" target → Signing & Capabilities → choose your Apple
   Developer team (auto-manages the provisioning profile).
2. Product → Archive.
3. In the Organizer window, "Distribute App" → App Store Connect →
   Upload.
4. In [App Store Connect](https://appstoreconnect.apple.com/), create
   the app listing, attach the build, fill in the required metadata,
   and submit for review.

## Store listing checklist

Both stores require, roughly:

- [ ] App icon (already generated)
- [ ] Screenshots per required device size — take these from the running
      app; Apple needs 6.7" and 6.5" iPhone sizes at minimum, Play needs
      phone + (if supporting tablets) 7"/10" tablet screenshots
- [ ] Short + full description
- [ ] Privacy policy URL — **must be publicly hosted**, e.g. push
      `PRIVACY.md` to GitHub Pages, or paste it into a Google Doc/Notion
      page published publicly. Fill in the support email placeholder in
      that file first.
- [ ] Support URL / contact email
- [ ] Content rating questionnaire (both stores ask about violence,
      gambling, data collection, etc. — answer honestly; per
      `PRIVACY.md`, this app currently collects no data)
- [ ] Google Play **Data Safety** section / Apple **App Privacy**
      (Nutrition Label) — both should currently say "no data collected"
      given the app's real behavior
- [ ] Category (Lifestyle or Productivity fits)
- [ ] Age rating

## What's already done

- `capacitor.config.ts`, `android/`, `ios/` — native project scaffolding
- App icon + splash screen (light & dark) generated for both platforms
  from `resources/icon.png` and `resources/splash.png`
- `PRIVACY.md` — draft privacy policy matching the app's actual behavior

## What only you can do

- Create the Apple/Google developer accounts and pay the fees
- Build and sign the binaries (needs Android Studio locally / a Mac for
  iOS — this sandbox has neither the Android SDK access nor macOS)
- Take screenshots, write final store copy, host the privacy policy
- Submit through App Store Connect / Play Console and respond to any
  review feedback
