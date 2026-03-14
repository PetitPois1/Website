# Firebase: Require email verification to use the app

The app is configured so that:

1. **On sign up**: A verification email is sent and the user is signed out. They see: *"Account created! Check your email to verify your address, then sign in."*
2. **On sign in**: If the email is not verified, sign-in is refused and they see: *"Please verify your email before signing in. Check your inbox for the verification link (and spam folder)."*

No extra Firebase **security rules** are required for this; verification is enforced in the app (auth.js).

## What to do in Firebase

### 1. Email/Password provider

- Go to [Firebase Console](https://console.firebase.google.com) → your project.
- **Authentication** → **Sign-in method**.
- Ensure **Email/Password** is **Enabled** (and **Email link** is optional).

### 2. Verification email template (optional but recommended)

- **Authentication** → **Templates**.
- Click **Email address verification**.
- Edit the **Subject** and **Body** if you want (e.g. add your app name or support link).
- Set **From name** (e.g. your app name) so the email is clearly from you.
- Save.

### 3. Authorized domains

- **Authentication** → **Settings** → **Authorized domains**.
- Add any domain you use in production (e.g. `yourgame.com`).
- `localhost` is already allowed for local testing.

### 4. (Optional) Block unverified users in Firestore

If you want a second layer of protection, you can require `request.auth.token.email_verified === true` in Firestore rules for writes. The app already blocks unverified users from signing in, so this is optional.

Example (only allow writes when email is verified):

```text
match /users/{userId} {
  allow read, write: if request.auth != null
    && request.auth.uid == userId
    && request.auth.token.email_verified == true;
  allow read: if request.auth != null;
  // ... rest of rules
}
```

If you add this, unverified users who somehow got a token would still be rejected by Firestore.

## Testing

1. Sign up with a real email you can access.
2. Check inbox (and spam) for the verification email and click the link.
3. Return to the app and sign in; it should succeed.
4. Try signing in before verifying; you should see the “Please verify your email” message.
