# Firestore rules review (avatar/inventory)

Your current rules are **sufficient** for the profile avatar and inventory feature.

## What the app does

- **Profile / avatar / inventory**: The app writes to `users/{userId}` with:
  - `avatar` (e.g. `{ base: "#...", mouth: "smile" }`)
  - `inventory` (e.g. `{ base: ["#8b5cf6", ...], mouth: ["smile", "cool", ...]`)

  All of this is done with `set(..., { merge: true })` on the **current user’s** document only (i.e. `userId === request.auth.uid`).

## How your rules apply

```text
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  allow read: if request.auth != null;
  ...
}
```

- Only the **owner** can **write** their own `users/{userId}` document, so saving `avatar` and `inventory` is allowed.
- **Read**: any authenticated user can read any user doc (e.g. for friend profiles/search), which is fine.

So you **do not need to change** the Firestore rules for the new avatar/inventory behavior. They already allow:

- Users to read/write their own profile (including `avatar` and `inventory`).
- Other signed-in users to read profiles (e.g. for friends).

No rule updates are required for testing or production for this feature.
