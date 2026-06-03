# Firestore rules

A full, working rules file is in **`firestore.rules`** at the project root. Deploy it from Firebase Console (**Firestore** → **Rules** → paste and **Publish**) or via Firebase CLI: `firebase deploy --only firestore:rules`.

---

## Avatar / inventory

Your rules are **sufficient** for the profile avatar and inventory feature.

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

---

## Neon Dash (`custom_levels`)

Neon Dash loads and saves levels in the **`custom_levels`** collection. If you see "missing or insufficient permissions" when loading Community or My Levels, the Firestore rules were missing this collection.

The **`firestore.rules`** file includes:

- **Read**: Anyone can read documents where `isPublic` is true (or missing); signed-in users can read their own levels (`authorId == request.auth.uid`).
- **Create**: Signed-in users can create a level only if `authorId` is their own uid.
- **Update / Delete**: Only the level author can update or delete a document.

Use the full **`firestore.rules`** content in the Firebase Console so both `users`/subcollections and `custom_levels` work.
