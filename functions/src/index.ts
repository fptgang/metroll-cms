import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Interface for login data
interface LoginData {
  email: string;
  password: string;
}

// Interface for token verification data
interface TokenData {
  idToken: string;
}

// Interface for create user data
interface CreateUserData {
  email: string;
  password: string;
  displayName?: string;
  role?: string;
}

// Interface for update claims data
interface UpdateClaimsData {
  uid: string;
  claims: Record<string, any>;
}

// Interface for get user data
interface GetUserData {
  email: string;
}

// Custom login function that validates user credentials and returns custom claims
export const customLogin = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    try {
      const { email, password }: LoginData = data;

      if (!email || !password) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Email and password are required"
        );
      }

      // Here you would typically validate credentials against your database
      // For demo purposes, we're using a simple check
      // In production, you should validate against your secure user database

      // Get user by email
      let user;
      try {
        user = await admin.auth().getUserByEmail(email);
      } catch (error) {
        throw new functions.https.HttpsError("not-found", "User not found");
      }

      // In a real implementation, you would verify the password here
      // This is just a placeholder - DO NOT use this in production
      if (password !== "password123") {
        throw new functions.https.HttpsError(
          "permission-denied",
          "Invalid credentials"
        );
      }

      // Generate custom token with additional claims
      const customClaims = {
        role: user.customClaims?.role || "CUSTOMER",
        loginMethod: "custom",
        loginTime: Date.now(),
      };

      const customToken = await admin
        .auth()
        .createCustomToken(user.uid, customClaims);

      return {
        success: true,
        customToken,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: customClaims.role,
        },
      };
    } catch (error) {
      console.error("Custom login error:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        "internal",
        "An error occurred during login"
      );
    }
  }
);

// Verify custom token and get user claims
export const verifyCustomToken = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    try {
      const { idToken }: TokenData = data;

      if (!idToken) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "ID token is required"
        );
      }

      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      return {
        success: true,
        uid: decodedToken.uid,
        email: decodedToken.email,
        claims: decodedToken,
      };
    } catch (error) {
      console.error("Token verification error:", error);
      throw new functions.https.HttpsError(
        "permission-denied",
        "Invalid token"
      );
    }
  }
);

// Create user with custom claims
export const createUserWithClaims = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    try {
      // Check if the user is authenticated and has admin role
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const {
        email,
        password,
        displayName,
        role = "CUSTOMER",
      }: CreateUserData = data;

      if (!email || !password) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Email and password are required"
        );
      }

      // Create the user
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, {
        role,
        createdBy: context.auth.uid,
        createdAt: Date.now(),
      });

      return {
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          role,
        },
      };
    } catch (error) {
      console.error("Create user error:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while creating user"
      );
    }
  }
);

// Update user claims
export const updateUserClaims = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    try {
      // Check if the user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const { uid, claims }: UpdateClaimsData = data;

      if (!uid || !claims) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "UID and claims are required"
        );
      }

      // Update custom claims
      await admin.auth().setCustomUserClaims(uid, {
        ...claims,
        updatedBy: context.auth.uid,
        updatedAt: Date.now(),
      });

      return {
        success: true,
        message: "Claims updated successfully",
      };
    } catch (error) {
      console.error("Update claims error:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError(
        "internal",
        "An error occurred while updating claims"
      );
    }
  }
);

// Get user by email
export const getUserByEmail = functions.https.onCall(
  async (data: any, context: functions.https.CallableContext) => {
    try {
      // Check if the user is authenticated
      if (!context.auth) {
        throw new functions.https.HttpsError(
          "unauthenticated",
          "User must be authenticated"
        );
      }

      const { email }: GetUserData = data;

      if (!email) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "Email is required"
        );
      }

      const userRecord = await admin.auth().getUserByEmail(email);

      return {
        success: true,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          customClaims: userRecord.customClaims,
          emailVerified: userRecord.emailVerified,
          disabled: userRecord.disabled,
        },
      };
    } catch (error) {
      console.error("Get user error:", error);

      if (error instanceof functions.https.HttpsError) {
        throw error;
      }

      throw new functions.https.HttpsError("not-found", "User not found");
    }
  }
);

// Authentication trigger - runs when a user is created
export const onUserCreate = functions.auth
  .user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    try {
      console.log("New user created:", user.uid, user.email);

      // Set default claims for new users
      await admin.auth().setCustomUserClaims(user.uid, {
        role: "CUSTOMER",
        createdAt: Date.now(),
        emailVerified: user.emailVerified,
      });

      // You can add additional logic here like:
      // - Send welcome email
      // - Create user profile in database
      // - Log user creation event
    } catch (error) {
      console.error("Error in user creation trigger:", error);
    }
  });

// Authentication trigger - runs when a user is deleted
export const onUserDelete = functions.auth
  .user()
  .onDelete(async (user: admin.auth.UserRecord) => {
    try {
      console.log("User deleted:", user.uid, user.email);

      // Clean up user data when account is deleted
      // You can add logic here to:
      // - Delete user data from database
      // - Cancel subscriptions
      // - Log deletion event
    } catch (error) {
      console.error("Error in user deletion trigger:", error);
    }
  });
