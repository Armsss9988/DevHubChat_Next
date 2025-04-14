"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { login } from "@/store/authSlice";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "antd";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const { data: user, isPending } = useCurrentUser();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      if (user) {
        try {
          store.dispatch(login({ user: user }));
        } catch (err) {
          console.error("❌ Invalid token", err);
        }
        setLoading(false);
      }
    };
    getUser();
  }, [user]);
  if (isPending || loading) return <Skeleton active />;
  return <Provider store={store}>{children}</Provider>;
}
