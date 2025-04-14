import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
import PublicLayout from "@/components/Layout/PublicLayout";
export const metadata: Metadata = {
  title: "Authenticate",
  description: "Join our ChatHub for fun",
};

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicLayout>
      <div className="bg-gray-100 flex justify-center items-center h-full">
        {children}
      </div>
    </PublicLayout>
  );
}
