import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import {
  getFunctions,
  connectFunctionsEmulator,
  httpsCallable,
} from "firebase/functions";

// Firebase configuration
// Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Functions
export const functions = getFunctions(app);

// Connect to emulators in development
if (import.meta.env.MODE === "development") {
  // Uncomment these lines if you're using Firebase emulators
  // connectAuthEmulator(auth, "http://localhost:9099");
  // connectFunctionsEmulator(functions, "localhost", 5001);
}

// Firebase Functions callable
export const callFirebaseFunction = (functionName: string) => {
  return httpsCallable(functions, functionName);
};

// Common Firebase Functions for authentication
export const firebaseFunctions = {
  // Custom login function that calls your Firebase Function
  customLogin: callFirebaseFunction("customLogin"),

  // Verify custom token
  verifyCustomToken: callFirebaseFunction("verifyCustomToken"),

  // Create user with custom claims
  createUserWithClaims: callFirebaseFunction("createUserWithClaims"),

  // Update user claims
  updateUserClaims: callFirebaseFunction("updateUserClaims"),

  // Get user by email
  getUserByEmail: callFirebaseFunction("getUserByEmail"),
};

export default app;
