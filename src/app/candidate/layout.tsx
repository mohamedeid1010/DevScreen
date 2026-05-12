import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  Compass,
  GitBranch,
  LayoutPanelTop,
  UserRound,
} from "lucide-react";

const navItems = [
  { href: "/candidate", label: "Code Vector", icon: UserRound },
  { href: "/candidate/interviews/frontend-systems", label: "Interview Panel", icon: BrainCircuit },
  { href: "/recruiter", label: "Recruiter view", icon: LayoutPanelTop },
];

type CandidateLayoutProps = Readonly<{ children: ReactNode }>;

export default function CandidateLayout({ children }: CandidateLayoutProps) {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f2eae3]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">

        <aside className="border-b border-[#ffffff12] bg-[#0c0c0e] p-6 lg:w-72 lg:border-b-0 lg:border-r lg:p-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="rounded-xl bg-[#f2eae3] p-2.5 text-[#09090b]">
              <Compass className="size-5" />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-[#a8a29e]">
                Candidate
              </p>
              <p className="text-base font-semibold text-[#f2eae3]">Signal Portal</p>
            </div>
          </Link>

          <div className="mt-8 rounded-2xl border border-[#ac4bff1a] bg-[#ac4bff0d] p-4">
            <p className="font-mono text-xs text-[#a8a29e]">Code Intelligence Score</p>
            <p className="mt-1.5 font-mono text-3xl font-bold text-[#ac4bff]">88.4%</p>
            <p className="mt-2 text-xs leading-5 text-[#a8a29e]">
              NLP-extracted from 23 repos · 1,847 files · last sync 4m ago
            </p>
          </div>

          <nav className="mt-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-[#a8a29e] transition hover:border-[#ffffff12] hover:bg-[#17171a] hover:text-[#f2eae3]"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="size-4" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="size-3.5 text-[#a8a29e]/50" />
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl border border-[#ffffff12] bg-[#111113] p-4">
            <div className="flex items-center gap-2 text-xs text-[#a8a29e]">
              <GitBranch className="size-3.5" />
              GitHub OAuth active
            </div>
            <p className="mt-2.5 font-mono text-sm text-[#f2eae3]">github.com/norasalem</p>
            <p className="mt-1.5 text-xs leading-5 text-[#a8a29e]">
              Repos and commit patterns feed directly into AI-generated interview questions.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-[#ffffff12] bg-[#09090b]/85 px-6 py-4 backdrop-blur lg:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-mono text-xs text-[#a8a29e]">Candidate Portal</p>
                <h1 className="text-lg font-semibold tracking-tight text-[#f2eae3]">
                  Code Intelligence Vector System
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full border border-[#ffffff12] bg-[#111113] px-3 py-1.5 font-mono text-xs text-[#a8a29e]">
                  GitHub synced
                </div>
                <div className="rounded-full border border-[#ac4bff1a] bg-[#ac4bff0d] px-3 py-1.5 font-mono text-xs text-[#ac4bff]">
                  2 interviews ready
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
