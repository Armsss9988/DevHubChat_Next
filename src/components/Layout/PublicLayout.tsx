"use client";
import { useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  if (isAuthenticated) {
    const redirect = localStorage.getItem("redirect");
    router.push(redirect || "/login");
    return null;
  } else return <>{children}</>;
}
