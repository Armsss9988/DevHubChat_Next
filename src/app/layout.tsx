import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProviders";
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
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full w-full flex-1 flex flex-col overflow-hidden`}
        >
          <Header />
          {children}
        </body>
      </html>
      <ReactQueryDevtools initialIsOpen={false} />
    </ReactQueryProvider>
  );
}
