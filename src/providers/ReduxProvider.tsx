"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { login } from "@/store/authSlice";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface ReduxProviderProps {
  children: React.ReactNode;
  accessToken: string | null;
}

export default function ReduxProvider({
  children,
  accessToken,
}: ReduxProviderProps) {
  useEffect(() => {
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken) as User;
        store.dispatch(login({ user: decoded }));
        console.log("DEcodeed", JSON.stringify(decoded));
      } catch (err) {
        console.error("❌ Invalid token", err);
      }
    }
  }, [accessToken]);

  return <Provider store={store}>{children}</Provider>;
}
