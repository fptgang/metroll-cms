# Firebase Functions Authentication Setup

This project now includes Firebase Functions for server-side authentication alongside the existing client-side Firebase Authentication.

## 🚀 Features Added

### ✅ **Complete Firebase Authentication Setup**

- **Client-side Firebase Auth** (Email/Password + Google Login)
- **Firebase Functions** for server-side authentication logic
- **Custom token generation** with user claims
- **User management functions** (create, update, delete)
- **Authentication triggers** for user lifecycle events

### ✅ **Enhanced Login System**

- **Custom Firebase Login Page** with Google OAuth
- **Multiple authentication methods**:
  - Traditional Firebase Auth
  - Firebase Functions with custom validation
  - Google Sign-in
- **Responsive design** with modern UI

### ✅ **Firebase Functions Features**

- `customLogin` - Server-side login validation
- `verifyCustomToken` - Token verification
- `createUserWithClaims` - User creation with custom roles
- `updateUserClaims` - Update user permissions
- `getUserByEmail` - User lookup functionality
- `onUserCreate` - Automatic setup for new users
- `onUserDelete` - Cleanup when users are deleted

## 📁 Project Structure

```
metroll-cms/
├── functions/                    # Firebase Functions
│   ├── src/
│   │   └── index.ts             # Cloud Functions code
│   ├── package.json             # Functions dependencies
│   └── tsconfig.json            # TypeScript config
├── src/
│   ├── utils/
│   │   ├── firebase.ts          # Firebase config + Functions client
│   │   └── firebaseAuth.ts      # Firebase Auth utilities
│   ├── providers/
│   │   └── authProvider.ts      # Enhanced auth provider
│   └── pages/auth/
│       └── login.tsx            # Custom login page
└── firebase.json                # Firebase project config
```

## 🔧 Setup Instructions

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Functions

```bash
firebase init functions
```

### 4. Install Functions Dependencies

```bash
cd functions
npm install
```

### 5. Build Functions

```bash
npm run build
```

### 6. Deploy Functions (optional)

```bash
firebase deploy --only functions
```

### 7. Run Local Emulator (for development)

```bash
firebase emulators:start
```

## 🔐 Environment Variables

Add these to your `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# API Configuration
VITE_API_URL=http://localhost:8000/api/v1
```

## 💻 How to Use

### Basic Login (Client-side Firebase Auth)

```typescript
import { useLogin } from "@refinedev/core";

const { mutate: login } = useLogin();

// Regular login
login({ email: "user@example.com", password: "password123" });
```

### Firebase Functions Login (Server-side validation)

```typescript
import { fbAuth } from "../utils/firebaseAuth";

// Login with Firebase Function
const user = await fbAuth.loginWithFirebaseFunction(
  "user@example.com",
  "password123"
);
```

### Using Firebase Functions Directly

```typescript
import { firebaseFunctions } from "../utils/firebase";

// Create user with custom claims
const result = await firebaseFunctions.createUserWithClaims({
  email: "newuser@example.com",
  password: "password123",
  displayName: "New User",
  role: "CUSTOMER",
});

// Update user claims
await firebaseFunctions.updateUserClaims({
  uid: "user-uid",
  claims: { role: "ADMIN", permissions: ["read", "write"] },
});
```

## 🛡️ Security Features

### Custom Claims

Users automatically get custom claims:

- `role`: User role (CUSTOMER, ADMIN, etc.)
- `createdAt`: Account creation timestamp
- `loginMethod`: How they logged in (custom, google, etc.)
- `emailVerified`: Email verification status

### Server-side Validation

Firebase Functions provide:

- **Secure password validation**
- **Custom business logic**
- **Rate limiting** (can be added)
- **Audit logging** (can be added)

## 🔄 Authentication Flow

### Traditional Flow

1. User enters credentials
2. Firebase Auth validates
3. ID token generated
4. Backend validates token
5. User logged in

### Firebase Functions Flow

1. User enters credentials
2. **Firebase Function validates** (server-side)
3. **Custom token generated** with claims
4. User signs in with custom token
5. Backend validates token
6. User logged in with custom claims

## 📝 Firebase Functions Available

| Function               | Purpose                      | Auth Required |
| ---------------------- | ---------------------------- | ------------- |
| `customLogin`          | Server-side login validation | ❌            |
| `verifyCustomToken`    | Verify ID tokens             | ❌            |
| `createUserWithClaims` | Create users with roles      | ✅            |
| `updateUserClaims`     | Update user permissions      | ✅            |
| `getUserByEmail`       | Lookup user details          | ✅            |
| `onUserCreate`         | Auto-setup new users         | 🔄 Trigger    |
| `onUserDelete`         | Cleanup deleted users        | 🔄 Trigger    |

## 🚀 Next Steps

1. **Deploy to Production**: Use `firebase deploy --only functions`
2. **Add Security Rules**: Configure Firestore/Storage rules
3. **Monitor Usage**: Check Firebase Console for function metrics
4. **Add More Functions**: Extend with custom business logic
5. **Setup CI/CD**: Automate deployment process

## 🐛 Troubleshooting

### Functions Not Working?

- Check if emulator is running: `firebase emulators:start`
- Verify environment variables are set
- Check function logs: `firebase functions:log`

### Authentication Issues?

- Ensure Firebase config is correct
- Check if user exists in Firebase Console
- Verify token hasn't expired

### TypeScript Errors?

- Run `npm run build` in functions directory
- Check `tsconfig.json` configuration
- Ensure all dependencies are installed

## 📚 Learn More

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Refine Auth Guide](https://refine.dev/docs/core/providers/auth-provider/)

---

**Your Firebase Functions authentication is now ready! 🎉**

The project supports both traditional Firebase Auth and server-side Firebase Functions, giving you maximum flexibility for your authentication needs.
