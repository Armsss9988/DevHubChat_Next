import type { Metadata } from "next";
import "@ant-design/v5-patch-for-react-19";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getRooms } from "@/services/room";
export const metadata: Metadata = {
  title: "Authenticate",
  description: "Join our ChatHub for fun",
};

export default async function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="">{children}</div>
    </HydrationBoundary>
  );
}
