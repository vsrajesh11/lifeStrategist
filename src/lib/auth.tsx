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
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);

          // Store auth state in localStorage for easy checking
          if (session) {
            localStorage.setItem("supabase.auth.token", "true");
          } else {
            localStorage.removeItem("supabase.auth.token");
          }
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);

      if (mounted) {
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
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    signIn: async (email: string, password: string) => {
      try {
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        return { data, error: null };
      } catch (error: any) {
        console.error("Sign in error:", error);
        return { data: null, error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          throw error;
        }

        return { data, error: null };
      } catch (error: any) {
        console.error("Sign up error:", error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        // Clear local storage
        localStorage.removeItem("supabase.auth.token");
        localStorage.removeItem("onboardingInProgress");
        localStorage.removeItem("hasCompletedOnboarding");

        return { error: null };
      } catch (error: any) {
        console.error("Sign out error:", error);
        return { error };
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
