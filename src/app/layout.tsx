import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/global-providers";
import AnimatedPage from "@/components/AnimatedPage";
import { Toaster } from "@/components/ui/sonner";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkSure",
  description:
    "Escrow-backed artisan marketplace for trusted jobs, contracts, and completion.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
};

import { NetworkStatus } from "@/components/ui/network-status";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${monoFont.variable} ${headingFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans flex flex-col bg-background text-foreground">
        <NetworkStatus />
        <QueryProvider>
          <AnimatedPage>{children}</AnimatedPage>
          <Toaster richColors position="top-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
