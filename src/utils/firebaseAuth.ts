import {
  signInWithEmailAndPassword,
  signInWithCustomToken,
  createUserWithEmailAndPassword,
  User as FirebaseUser,
} from "firebase/auth";
import { auth, firebaseFunctions } from "./firebase";

// Interface for Firebase Function responses
interface FirebaseLoginResponse {
  success: boolean;
  customToken?: string;
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    role: string;
  };
  error?: string;
}

// Firebase Functions Authentication Utilities
export class FirebaseAuth {
  // Login using Firebase Function (server-side validation)
  static async loginWithFirebaseFunction(
    email: string,
    password: string
  ): Promise<FirebaseUser> {
    try {
      // Call Firebase Function for custom login
      const customLogin = firebaseFunctions.customLogin;
      const result = await customLogin({ email, password });

      // Type assertion for the response
      const response = result.data as FirebaseLoginResponse;

      if (response.success && response.customToken) {
        // Sign in with custom token
        const userCredential = await signInWithCustomToken(
          auth,
          response.customToken
        );
        return userCredential.user;
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Firebase Function login error:", error);
      throw new Error(error.message || "Firebase Function login failed");
    }
  }

  // Traditional Firebase Authentication
  static async loginWithFirebaseAuth(
    email: string,
    password: string
  ): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error: any) {
      console.error("Firebase Auth login error:", error);
      throw new Error(error.message || "Firebase Auth login failed");
    }
  }

  // Create user using Firebase Function
  static async createUserWithFirebaseFunction(userData: {
    email: string;
    password: string;
    displayName?: string;
    role?: string;
  }): Promise<any> {
    try {
      const createUser = firebaseFunctions.createUserWithClaims;
      const result = await createUser(userData);
      return result.data;
    } catch (error: any) {
      console.error("Firebase Function create user error:", error);
      throw new Error(
        error.message || "Failed to create user via Firebase Function"
      );
    }
  }

  // Get user details using Firebase Function
  static async getUserByEmail(email: string): Promise<any> {
    try {
      const getUser = firebaseFunctions.getUserByEmail;
      const result = await getUser({ email });
      return result.data;
    } catch (error: any) {
      console.error("Firebase Function get user error:", error);
      throw new Error(
        error.message || "Failed to get user via Firebase Function"
      );
    }
  }

  // Update user claims using Firebase Function
  static async updateUserClaims(
    uid: string,
    claims: Record<string, any>
  ): Promise<any> {
    try {
      const updateClaims = firebaseFunctions.updateUserClaims;
      const result = await updateClaims({ uid, claims });
      return result.data;
    } catch (error: any) {
      console.error("Firebase Function update claims error:", error);
      throw new Error(
        error.message || "Failed to update user claims via Firebase Function"
      );
    }
  }

  // Verify token using Firebase Function
  static async verifyToken(idToken: string): Promise<any> {
    try {
      const verifyToken = firebaseFunctions.verifyCustomToken;
      const result = await verifyToken({ idToken });
      return result.data;
    } catch (error: any) {
      console.error("Firebase Function verify token error:", error);
      throw new Error(
        error.message || "Failed to verify token via Firebase Function"
      );
    }
  }

  // Get current user's ID token
  static async getCurrentUserToken(): Promise<string | null> {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        return await currentUser.getIdToken();
      }
      return null;
    } catch (error: any) {
      console.error("Error getting current user token:", error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  // Get current user
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
}

// Export for easy access
export { FirebaseAuth as fbAuth };
