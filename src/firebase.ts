import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

// Firebase project config for the manager's Google sign-in. Set these
// VITE_FIREBASE_* vars in the environment (and in the Vercel project's env
// vars for production) — see Firebase Console > Project Settings > General.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Dev-only helper: after signing in, run `await getFirebaseIdToken()` in the
// browser console to copy a Firebase ID token for manual API testing (e.g. the
// Postman "Google Sign-In" request). Not exposed in production builds.
if (import.meta.env.DEV) {
  (globalThis as typeof globalThis & { getFirebaseIdToken?: () => Promise<string | undefined> }).getFirebaseIdToken =
    () => auth.currentUser?.getIdToken() ?? Promise.resolve(undefined);
}
