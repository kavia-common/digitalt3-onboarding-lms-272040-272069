import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

/**
 * AuthContext provides session, signIn, signOut, and role-checking helpers to consuming components.
 */
const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session (persist across reloads)
  useEffect(() => {
    const currentSession = supabase.auth.getSession().then(({ data }) => {
      setSession(data?.session || null);
      setUser(data?.session?.user || null);
      setLoading(false);
    });

    // Listen for changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // PUBLIC_INTERFACE
  const signIn = useCallback(async (email, password) => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setSession(data.session);
    setUser(data.user);
    return data.user;
  }, []);

  // PUBLIC_INTERFACE
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  }, []);

  // For demo: Extract admin/employee roles from user metadata or claims.
  const isAdmin = user?.user_metadata?.role === "admin" || user?.email?.endsWith("@digitalt3-admin.com");
  const isEmployee = !isAdmin && !!user;

  const value = {
    user,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    isEmployee,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
