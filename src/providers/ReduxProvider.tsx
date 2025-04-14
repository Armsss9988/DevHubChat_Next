"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Skeleton } from "antd";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const { data: user, isPending, error } = useCurrentUser();
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (!user || dispatched) return;

    try {
      store.dispatch(login({ user }));
      setDispatched(true);
    } catch (err) {
      console.error("❌ Invalid token", err);
    }
  }, [user, dispatched]);

  if (isPending || (!dispatched && !error)) return <Skeleton active />;

  return <Provider store={store}>{children}</Provider>;
}
