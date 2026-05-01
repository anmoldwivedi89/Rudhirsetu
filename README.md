## RudhirSetu (React + Firebase)

### Roles supported
- **Donor** → `/donor/*`
- **Hospital** → `/hospital/*`
- **Patient** → `/patient/*`

Role is stored in **Firestore** at `users/{uid}` under the field `role`.

### Filestructures (important parts)
- `src/firebase.js`: Firebase init, exports `auth` and `db`
- `src/contexts/AuthContext.jsx`: global auth state + loads `users/{uid}` profile
- `src/components/ProtectedRoute.jsx`: route guards
  - `RequireAuth`: must be logged in
  - `RequireRole`: must match allowed roles
- `src/components/RoleRedirect.jsx`: redirects logged-in user to their dashboard (`/dashboard`)
- `src/lib/roles.js`: roles enum + `getDashboardPath(role)`
- `src/lib/firestoreUsers.js`: helper functions for user profile + listing donors
- `src/pages/**`: role dashboards and other pages

### How role-based routing works
1. **Register**
   - Creates Firebase Auth user
   - Creates/updates Firestore doc `users/{uid}` with `role`, `name`, `phone`, `location`, etc.
2. **Login**
   - Signs in using Firebase Auth
   - Reads `users/{uid}` from Firestore to get the stored `role`
   - Redirects to the correct dashboard based on role
3. **Protected routes**
   - In `src/App.jsx`, each role page is wrapped like:
     - `<RequireAuth>` → blocks unauthenticated users
     - `<RequireRole allow={[...]} >` → blocks wrong roles and redirects them to their own dashboard

### Firestore collections used
#### `users/{uid}`
Stores the user profile + role:
- `role`: `donor | hospital | patient | admin`
- `name`, `email`, `phone`, `location`
- `bloodGroup` (donor only)

#### `requests/{requestId}`
Created by **hospital** or **patient**:
- `createdBy` (uid), `createdByRole`, `createdByName`, `createdByLocation`
- `bloodGroup`, `units`, `urgency`, `notes`
- `status`: `open | accepted | fulfilled | cancelled`
- `acceptedBy` (donor uid when accepted)
- `createdAt`, `updatedAt`

### Step-by-step test plan (beginner-friendly)
1. Start the app:

```bash
npm run dev
```

2. Create 3 users from `/register`:
   - One **Donor**
   - One **Hospital**
   - One **Patient**

3. Verify redirects:
   - After register/login, each user should land on their dashboard automatically.

4. Verify access blocking:
   - Logged in as Donor, try opening:
     - `/hospital/dashboard` or `/patient/dashboard`
   - You should be redirected back to `/donor/dashboard`.

5. Test blood request flow:
   - Login as **Hospital** → `Create Request` → submit a request
   - Login as **Donor** → `Requests` → accept the request
   - Login as **Patient** → `Request Blood Now` → create a request (shows in “Active Requests” list)

6. Verify Firestore data:
   - Firebase Console → Firestore → collection `users`
   - You should see documents for each user with correct `role`.
   - Firebase Console → Firestore → collection `requests`
    - You should see created requests and their `status`.

### If Firestore shows an “index required” error
Some queries may require a composite index (Firebase will show a direct link to create it).
Just click that link in the console to auto-create the index.

