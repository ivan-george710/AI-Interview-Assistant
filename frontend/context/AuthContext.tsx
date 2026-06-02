"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    loading: true,
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        console.log(
          "SESSION:",
          session
        );

        setUser(
          session?.user ?? null
        );
      } catch (error) {
        console.error(
          "AUTH ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log(
          "AUTH CHANGED:",
          session
        );

        setUser(
          session?.user ?? null
        );
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log(
    "AUTH CONTEXT"
  );
  console.log("USER:", user);
  console.log(
    "LOADING:",
    loading
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () =>
  useContext(AuthContext);