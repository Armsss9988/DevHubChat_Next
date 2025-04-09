import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
export const metadata: Metadata = {
  title: "Chat",
  description: "ChatHub for fun",
};

export default async function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}
