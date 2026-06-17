import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppShell } from "@/components/AppShell";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bharat Climate Twin",
  description: "AI-powered digital twin for India's climate risk system using national datasets from ISRO, IMD, and more.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className={inter.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
