import { AuthProvider } from "@refinedev/core";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      let user;

      // Check if this is a Google authentication (we use a special password flag)
      if (password === "google_auth") {
        // For Google auth, the user should already be signed in via popup
        // We just need to get the current user and their token
        user = auth.currentUser;
        if (!user) {
          throw new Error("Google authentication failed - no user found");
        }
      } else {
        // Regular email/password authentication
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
      }

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send the Firebase token to your backend for verification and get your JWT
      const response = await axios.post(
        `${API_URL}/account/accounts/login/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      localStorage.setItem("auth_token", idToken);

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: error.message || "Login failed",
        },
      };
    }
  },

  logout: async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: "LogoutError",
          message: error.message || "Logout failed",
        },
      };
    }
  },

  check: async () => {
    return new Promise((resolve) => {
      // Set a timeout to prevent infinite waiting
      const timeout = setTimeout(() => {
        console.log("Auth check timeout - assuming not authenticated");
        resolve({ authenticated: false, redirectTo: "/login" });
      }, 3000);

      const unsubscribe = onAuthStateChanged(
        auth,
        (user: FirebaseUser | null) => {
          clearTimeout(timeout);

          console.log("Auth check - Firebase user:", user?.email || "none");

          if (user) {
            console.log("Auth check - User is authenticated");
            resolve({ authenticated: true });
          } else {
            console.log("Auth check - User is NOT authenticated");
            resolve({ authenticated: false, redirectTo: "/login" });
          }

          unsubscribe();
        }
      );
    });
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role || "CUSTOMER";
    }
    return null;
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        name: user.fullName || user.email,
        email: user.email,
        avatar: null,
        role: user.role,
      };
    }
    return null;
  },

  onError: async (error) => {
    if (error.status === 401 || error.status === 403) {
      return {
        logout: true,
        redirectTo: "/login",
      };
    }
    return { error };
  },
};
