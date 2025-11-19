# Supabase Integration for DigitalT3 LMS Frontend

## Setup

- Requires environment variables:
  - `REACT_APP_SUPABASE_URL` - Supabase project URL
  - `REACT_APP_SUPABASE_KEY` - Supabase anon/public API key

## Configuration

- Supabase JS client is initialized in `src/supabaseClient.js` and is imported wherever needed.
- Ensures no secrets are hardcoded and only environment variables are used.

## Authentication Flow

- `AuthContext` (`src/AuthContext.js`) is used to:
  - Provide access to the current session and user state across the app.
  - Expose `signIn(email, password)` and `signOut()` methods.
  - Persistally monitor the session via Supabase's `onAuthStateChange`.
  - Check for user roles (admin or employee) via metadata or email domain.

- The login page provides email/password authentication.
- Route guards protect all dashboard/content pages; only authenticated users can access.
- Only users recognized as admin (via `user_metadata.role` or admin email domain) may visit admin pages.

## Security and Best Practices

- All credentials are provided via environment variables and never hardcoded.
- Sensitive session data is maintained securely following Supabase/Bandit best practices.
- The client uses no direct DB access—only authenticated https API requests.

## Extending

- To add OAuth providers, see Supabase docs for social login.
- To add role-based UI, extend AuthContext logic and Layout change based on `isAdmin` and `isEmployee`.

## References

- [Supabase JS Docs](https://supabase.com/docs/reference/javascript)
- [Securing Frontend Client](https://supabase.com/docs/guides/auth/auth-helpers/auth-component)
