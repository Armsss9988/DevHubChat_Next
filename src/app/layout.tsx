import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "../providers/ReactQueryProviders";
import Header from "@/components/LayoutPart/Header";
import { Suspense } from "react";
import ReduxProvider from "@/providers/ReduxProvider";
import { WebsocketProvider } from "../providers/WebsocketProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
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
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=3, user-scalable=yes"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex-1 flex flex-col overflow-hidden`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <ToastProvider>
            <NotificationProvider>
              <ReactQueryProvider>
                <ReduxProvider>
                  <WebsocketProvider>
                    <Header />
                    {children}
                  </WebsocketProvider>
                </ReduxProvider>
              </ReactQueryProvider>
            </NotificationProvider>
          </ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
