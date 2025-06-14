import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Clear any stale auth data on component mount
    localStorage.removeItem("supabase.auth.token");

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Store auth state in localStorage for easy checking
      if (session) {
        localStorage.setItem("supabase.auth.token", "true");
      } else {
        localStorage.removeItem("supabase.auth.token");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Force clear any previous state to avoid stale data
      if (!session) {
        setSession(null);
        setUser(null);
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("onboardingInProgress");
      } else {
        setSession(session);
        setUser(session?.user ?? null);
        localStorage.setItem("supabase.auth.token", "true");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signIn: async (email: string, password: string) => {
      try {
        console.log("🔐 Attempting sign in for:", email);
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        console.log("✅ Sign in result:", result.error ? "Error" : "Success");
        return result;
      } catch (error: any) {
        console.error("❌ Sign in error:", error);
        throw new Error(
          error.message ||
            "Failed to sign in. Please check your connection and try again.",
        );
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        console.log("📝 Attempting sign up for:", email);
        const result = await supabase.auth.signUp({ email, password });
        console.log("✅ Sign up result:", result.error ? "Error" : "Success");
        return result;
      } catch (error: any) {
        console.error("❌ Sign up error:", error);
        throw new Error(
          error.message ||
            "Failed to create account. Please check your connection and try again.",
        );
      }
    },
    signOut: async () => {
      try {
        console.log("🚪 Attempting sign out");
        const result = await supabase.auth.signOut();
        console.log("✅ Sign out result:", result.error ? "Error" : "Success");
        return result;
      } catch (error: any) {
        console.error("❌ Sign out error:", error);
        throw new Error(
          error.message || "Failed to sign out. Please try again.",
        );
      }
    },
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
