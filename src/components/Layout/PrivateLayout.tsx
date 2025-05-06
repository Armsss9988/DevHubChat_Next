"use client";
import { useAppSelector } from "@/redux/hook";
import { redirect } from "next/navigation";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  if (!isAuthenticated) {
    localStorage.setItem("redirect", window.location.pathname);
    redirect("/login");
  } else return <>{children}</>;
}
