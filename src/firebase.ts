import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

// Avoid touching the SDK at all when there's no real config -- getAuth()
// throws synchronously on an invalid API key, which would otherwise crash
// the whole app before it can render the "not configured yet" banner.
const app = firebaseConfigured
  ? initializeApp(firebaseConfig)
  : initializeApp({ apiKey: "demo", projectId: "demo" }, "unconfigured");

export const auth = firebaseConfigured ? getAuth(app) : null;
export const db = firebaseConfigured ? getFirestore(app) : null;
