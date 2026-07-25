import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resonance | Share your creative process",
  description: "A social platform where designers share ideas, work-in-progress, and design thinking.",
};


import { QueryProvider } from "@/providers/QueryProvider";
import { AuthInit } from "@/components/guards/AuthInit";

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
          <QueryProvider>
            <AuthInit>
              {children}
            </AuthInit>
          </QueryProvider>
          <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
