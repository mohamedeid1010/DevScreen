import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { SiteShell } from "@/components/navigation/site-shell";
import { createClient } from "@/utils/supabase/server";
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
    default: "DevScreen Demo",
    template: "%s | DevScreen Demo",
  },
  description:
    "Frontend-only hiring demo with a shared recruiter, candidate, and interview flow.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background"
      >
        <AuthSessionProvider initialUser={data.user ?? null}>
          <SiteShell>{children}</SiteShell>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
