"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";

type AuthSessionContextValue = {
  isAuthenticated: boolean;
  isReady: boolean;
  user: User | null;
};

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

type AuthSessionProviderProps = Readonly<{
  children: ReactNode;
  initialUser: User | null;
}>;

export function AuthSessionProvider({ children, initialUser }: AuthSessionProviderProps) {
  return (
    <AuthSessionContext.Provider
      value={{
        isAuthenticated: initialUser !== null,
        isReady: true,
        user: initialUser,
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error("useAuthSession must be used within an AuthSessionProvider.");
  }

  return context;
}