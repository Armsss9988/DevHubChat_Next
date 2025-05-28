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
      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-[#edd9b1] to-[#cbeacb]">
        <div className="bg-white shadow-black shadow-2xl p-6 md:p-16 rounded-3xl border-none flex flex-col items-center justify-center gap-8">
          <div className="flex flex-row items-center gap-2 align-bottom">
            <h2 className="font-bold text-5xl font-sans text-[#564009]">
              DevHub
            </h2>
            <h2 className="font-bold text-3xl font-sans text-[#33483a]">
              ChatApp
            </h2>
          </div>
          <div className="text-4xl">🌱</div>
          {children}
        </div>
      </div>
    </PublicLayout>
  );
}
