import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRooms } from "@/services/room";
import { getServerCurrentUser } from "@/services/getServerCurrentUser";
import { redirect } from "next/navigation";
import { WebsocketProvider } from "@/providers/WebsocketProvider";
export const metadata: Metadata = {
  title: "Chat Room",
  description: "Find people to chat, chill, and build cool stuff with.",
};

export default async function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  const user = await getServerCurrentUser();
  if (!user) {
    redirect("/login");
  }
  await queryClient.prefetchQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WebsocketProvider>
        <div className="h-full overflow-hidden">{children}</div>
      </WebsocketProvider>
    </HydrationBoundary>
  );
}
