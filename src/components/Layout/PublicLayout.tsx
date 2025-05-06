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
    router.push("/room");
    return null;
  } else return <>{children}</>;
}
