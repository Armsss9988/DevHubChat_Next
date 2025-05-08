"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { login } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Spin } from "antd";

interface ReduxProviderProps {
  children: React.ReactNode;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const { data: user, isPending } = useCurrentUser(isLogged);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLogged(loggedIn);
  }, []);

  useEffect(() => {
    if (user) {
      store.dispatch(login({ user }));
    }
    if (!isPending) {
      setHydrated(true);
    }
  }, [user, isPending]);

  if ((!hydrated || isPending) && isLogged) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return <Provider store={store}>{children}</Provider>;
}
