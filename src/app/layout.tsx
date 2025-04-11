import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProviders";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getServerCurrentUser } from "@/services/getServerCurrentUser";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "@/components/LayoutPart/Header";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devhub",
  description: "Devhub community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["currentUser"],
    queryFn: async () => await getServerCurrentUser(),
  });
  return (
    <html lang="en" className="h-full">
      <ReactQueryProvider>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex flex-col`}
          >
            <Header />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {children}
            </div>
          </body>
        </HydrationBoundary>
        <ReactQueryDevtools initialIsOpen={false} />
      </ReactQueryProvider>
    </html>
  );
}
