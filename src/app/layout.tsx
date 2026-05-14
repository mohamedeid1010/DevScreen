import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import Link from "next/link";
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
  title: {
    default: "DevScreen — AI Recruitment Platform",
    template: "%s | DevScreen",
  },
  description:
    "AI-powered recruitment platform. Analyze GitHub profiles with AST, embeddings, and Gemini AI to find the best engineering talent.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#09090b] text-[#f2eae3] font-[family-name:var(--font-geist-sans)]">
        <nav className="border-b border-[#ffffff12] bg-[#0a0a0d]/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-lg font-semibold tracking-tight hover:text-[#e4002b] transition-colors">
                DevScreen
              </Link>
              <div className="hidden sm:flex items-center gap-4 text-sm text-[#a8a29e]">
                <Link href="/analyze" className="hover:text-[#f2eae3] transition">
                  Analyze
                </Link>
                <Link href="/candidate" className="hover:text-[#f2eae3] transition">
                  For Candidates
                </Link>
                <Link href="/history" className="hover:text-[#f2eae3] transition">
                  History
                </Link>
              </div>
            </div>
            <Link
              href="/hr"
              className="px-4 py-1.5 rounded-lg bg-[#e4002b]/10 text-[#e4002b] text-sm font-semibold border border-[#e4002b]/20 hover:bg-[#e4002b]/20 transition"
            >
              HR Dashboard
            </Link>
          </div>
        </nav>
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
