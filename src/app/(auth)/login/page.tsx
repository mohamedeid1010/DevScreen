import Link from "next/link";
import type { Metadata } from "next";
import { BriefcaseBusiness, GitBranch, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Recruiter Login" };

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] px-6 py-8 text-[#f2eae3] sm:px-10 lg:px-12">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl gap-4 lg:grid-cols-[1fr_0.9fr]">
        <Card className="flex flex-col justify-between bg-[#111113]">
          <CardHeader className="p-8 pb-0">
            <Badge className="w-fit px-4 py-2 text-[11px]">
              <Sparkles className="size-3.5" />
              Recruiter access
            </Badge>
            <CardTitle className="mt-6 max-w-xl text-4xl sm:text-5xl">
              GitHub sign-in only.
            </CardTitle>
            <CardDescription className="mt-4 max-w-xl text-lg leading-8">
              Recruiter access in this demo is limited to approved GitHub accounts. Candidate sign-in is not available here.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-8 pt-8">
            <div className="rounded-[22px] border border-[#e4002b1a] bg-[#e4002b0d] px-4 py-3 text-sm text-[#ff6568]">
              Only the recruiter workspace is behind this sign-in screen.
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0c0c0e]">
          <CardHeader className="p-8 pb-0">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#e4002b0d] p-3">
                <BriefcaseBusiness className="size-6 text-[#ff6568]" />
              </div>
              <div>
                <p className="text-sm text-[#a8a29e]">Team workspace</p>
                <CardTitle className="mt-1 text-2xl">Recruiter GitHub access</CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-8">
            <div className="rounded-[22px] border border-[#ffffff12] bg-[#111113] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
              Continue with GitHub to reach the recruiter console. In this demo, only pre-approved recruiter accounts are allowed to proceed.
            </div>

            <div className="mt-6 grid gap-3">
              <Button asChild className="h-12 rounded-xl text-base">
                <Link href="/callback">
                  <GitBranch className="size-4" />
                  Continue with GitHub
                </Link>
              </Button>
            </div>

            <Card className="mt-8 bg-[#111113] shadow-none">
              <CardContent className="p-5">
                <p className="text-sm font-medium text-[#f2eae3]">Access policy</p>
                <p className="mt-2 text-sm leading-6 text-[#a8a29e]">
                  Password sign-in and candidate callback options are disabled. GitHub is the only entry point here, and it leads to the recruiter flow only.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
