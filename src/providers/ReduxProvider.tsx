"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { login } from "@/store/authSlice";
import { useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "antd";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const { data: user, isPending } = useCurrentUser();
  useEffect(() => {
    const getUser = async () => {
      if (user) {
        try {
          console.log("User get hereee:", user);
          store.dispatch(login({ user: user }));
          console.log("DEcodeed", JSON.stringify(user));
        } catch (err) {
          console.error("❌ Invalid token", err);
        }
      }
    };
    getUser();
  }, [user]);
  if (isPending) return <Skeleton active />;
   return <Provider store={store}>{children}</Provider>;
}
