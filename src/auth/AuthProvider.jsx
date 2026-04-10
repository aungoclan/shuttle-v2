import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAuth() {
      setLoadingAuth(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const currentSession = sessionData?.session ?? null;

      if (!mounted) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await loadAdminStatus(currentSession.user.id);
      } else {
        setIsAdmin(false);
      }

      if (mounted) setLoadingAuth(false);
    }

    loadAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession ?? null);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user) {
        await loadAdminStatus(nextSession.user.id);
      } else {
        setIsAdmin(false);
      }

      setLoadingAuth(false);
    });

    async function loadAdminStatus(userId) {
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.error("loadAdminStatus error:", error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(Boolean(data));
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  }

  async function signUp(email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  const value = useMemo(
    () => ({
      session,
      user,
      isAdmin,
      loadingAuth,
      signIn,
      signUp,
      signOut,
    }),
    [session, user, isAdmin, loadingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}