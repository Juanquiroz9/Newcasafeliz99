import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "../firebase";

export type UserType = "landlord" | "tenant";

export interface UserProfile {
  fullName: string;
  email: string;
  userType: UserType;
  propertyCode?: string;
  address?: string;
  unitsCount?: number;
}

interface AuthContextValue {
  configured: boolean;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signUp: (
    fullName: string,
    email: string,
    password: string,
    userType: UserType
  ) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  saveProfileFields: (fields: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function friendlyAuthError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered. Try logging in instead.";
    case "auth/invalid-email":
      return "That doesn't look like a valid email address.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth!, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const clearError = () => setError(null);

  const signUp: AuthContextValue["signUp"] = async (
    fullName,
    email,
    password,
    userType
  ) => {
    if (!firebaseConfigured) {
      setError("Firebase isn't configured yet — see FIREBASE_SETUP.md.");
      throw new Error("Firebase not configured");
    }
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth!, email, password);
      await updateProfile(cred.user, { displayName: fullName });
      const newProfile: UserProfile = { fullName, email, userType };
      await setDoc(doc(db!, "users", cred.user.uid), {
        ...newProfile,
        createdAt: serverTimestamp(),
      });
      setProfile(newProfile);
    } catch (e: any) {
      setError(friendlyAuthError(e?.code ?? ""));
      throw e;
    }
  };

  const logIn: AuthContextValue["logIn"] = async (email, password) => {
    if (!firebaseConfigured) {
      setError("Firebase isn't configured yet — see FIREBASE_SETUP.md.");
      throw new Error("Firebase not configured");
    }
    setError(null);
    try {
      await signInWithEmailAndPassword(auth!, email, password);
    } catch (e: any) {
      setError(friendlyAuthError(e?.code ?? ""));
      throw e;
    }
  };

  const logOut = async () => {
    if (!firebaseConfigured) return;
    await signOut(auth!);
  };

  const saveProfileFields: AuthContextValue["saveProfileFields"] = async (
    fields
  ) => {
    if (!user || !firebaseConfigured) return;
    await setDoc(doc(db!, "users", user.uid), fields, { merge: true });
    setProfile((prev) => (prev ? { ...prev, ...fields } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        configured: firebaseConfigured,
        user,
        profile,
        loading,
        error,
        clearError,
        signUp,
        logIn,
        logOut,
        saveProfileFields,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
