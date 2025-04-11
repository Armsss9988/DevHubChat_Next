import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
export const metadata: Metadata = {
  title: "Authenticate",
  description: "Join our ChatHub for fun",
};
import { redirect } from "next/navigation";
import { getServerCurrentUser } from "@/services/getServerCurrentUser";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerCurrentUser();
  if (user) {
    redirect("/room");
  }
  return (
    <div className="bg-gray-100 flex justify-center items-center h-full">
      {children}
    </div>
  );
}
