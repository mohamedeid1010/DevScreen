"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const TYPED_WORDS = [
  "GitHub Analysis",
  "Skill Matching",
  "AI Interviews",
  "Smart Filtering",
];

function useTypingEffect(words: string[], speed = 80, pause = 2000) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];

    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplay(word.slice(0, charIdx + 1));
          if (charIdx + 1 === word.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIdx((c) => c + 1);
          }
        } else {
          setDisplay(word.slice(0, charIdx));
          if (charIdx === 0) {
            setDeleting(false);
            setWordIdx((w) => (w + 1) % words.length);
          } else {
            setCharIdx((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

function AnimatedCounter({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-bold text-[#e4002b] font-mono">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm text-[#a8a29e] mt-1">{label}</div>
    </div>
  );
}

const FEATURES = [
  {
    icon: "🔍",
    title: "GitHub Deep Analysis",
    desc: "We clone repos, walk ASTs, and analyze code structure — not just star counts.",
  },
  {
    icon: "🧠",
    title: "AI-Powered Matching",
    desc: "Gemini 2.5 Flash evaluates candidate code against your job requirements.",
  },
  {
    icon: "📊",
    title: "Skill Radar Charts",
    desc: "Visual skill breakdowns across frontend, backend, testing, DevOps & more.",
  },
  {
    icon: "🎯",
    title: "80% Smart Filter",
    desc: "HR sees only candidates above the match threshold. No noise, just signal.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Analyze",
    desc: "Submit a GitHub profile. Our pipeline fetches repos, parses ASTs, generates embeddings.",
  },
  {
    num: "02",
    title: "Match",
    desc: "Cosine similarity compares code embeddings against job requirements.",
  },
  {
    num: "03",
    title: "Evaluate",
    desc: "Gemini AI produces a fit assessment, strengths, watchouts, and interview questions.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "DevScreen cut our technical screening time by 70%. The AI-generated interview questions are incredibly specific to each candidate's actual code.",
    name: "Sarah Chen",
    role: "VP of Engineering, TechCorp",
  },
  {
    quote:
      "Finally, a tool that looks at real code instead of résumé keywords. We hired 3 engineers in one month using DevScreen's pipeline.",
    name: "Marcus Johnson",
    role: "CTO, StartupLab",
  },
  {
    quote:
      "The skill radar charts made it so easy to compare candidates side by side. We instantly knew who to interview first.",
    name: "Aisha Patel",
    role: "Head of Talent, CloudScale",
  },
];

export default function HomePage() {
  const typed = useTypingEffect(TYPED_WORDS);

  return (
    <div className="space-y-0 -mx-6 -mt-8">
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-[#e4002b]/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-10 right-[15%] w-96 h-96 bg-[#e4002b]/10 rounded-full blur-[140px] animate-pulse [animation-delay:1s]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#e4002b]/30 bg-[#e4002b]/10 text-[#e4002b] text-xs font-semibold uppercase tracking-wider mb-4">
            AI-Powered Recruitment Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            Hire developers by
            <br />
            <span className="text-[#e4002b]">their code</span>, not their CV
          </h1>

          <p className="text-lg sm:text-xl text-[#a8a29e] max-w-2xl mx-auto leading-relaxed">
            DevScreen analyzes GitHub repositories with AST parsing, code embeddings,
            and Gemini AI to deliver{" "}
            <span className="text-[#f2eae3] font-medium">
              {typed}
              <span className="animate-pulse text-[#e4002b]">|</span>
            </span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/candidate"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#e4002b] text-white font-semibold text-base hover:bg-[#c80025] transition-all hover:shadow-[0_0_30px_rgba(228,0,43,0.3)]"
            >
              I&apos;m a Candidate →
            </Link>
            <Link
              href="/hr"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#ffffff18] bg-[#111113] text-[#f2eae3] font-semibold text-base hover:border-[#e4002b]/50 hover:bg-[#17171a] transition-all"
            >
              HR Dashboard →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-y border-[#ffffff12] bg-[#0c0c0e]/80 backdrop-blur-sm px-6 py-10">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-8">
          <AnimatedCounter target={500} label="Profiles Analyzed" />
          <AnimatedCounter target={98} label="Accuracy Rate %" />
          <AnimatedCounter target={3} label="× Faster Hiring" />
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="px-6 py-20 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-[#a8a29e] text-lg">
              Three steps from GitHub profile to hire/no-hire decision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="relative rounded-xl border border-[#ffffff12] bg-[#111113] p-6 group hover:border-[#e4002b]/30 transition-all"
              >
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-[#e4002b]/50 to-transparent" />
                )}
                <div className="text-4xl font-bold text-[#e4002b]/20 font-mono group-hover:text-[#e4002b]/40 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold mt-3 text-[#f2eae3]">{step.title}</h3>
                <p className="text-sm text-[#a8a29e] mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="px-6 py-20 bg-[#0c0c0e]/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for Modern Recruiting
            </h2>
            <p className="mt-3 text-[#a8a29e] text-lg">
              Every feature designed to surface the best developers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 hover:border-[#e4002b]/30 hover:bg-[#14141a] transition-all group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#f2eae3]">{f.title}</h3>
                <p className="text-sm text-[#a8a29e] mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trusted by Engineering Teams
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl border border-[#ffffff12] bg-[#111113] p-6 flex flex-col"
              >
                <p className="text-sm text-[#d8d0ca] leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-4 pt-4 border-t border-[#ffffff08]">
                  <div className="text-sm font-semibold text-[#f2eae3]">{t.name}</div>
                  <div className="text-xs text-[#a8a29e]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="px-6 py-20 bg-gradient-to-b from-transparent via-[#e4002b]/5 to-transparent">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Ready to find your next great hire?
          </h2>
          <p className="text-[#a8a29e] text-lg">
            Start analyzing candidates in seconds. No setup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/analyze"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#e4002b] text-white font-semibold text-base hover:bg-[#c80025] transition-all hover:shadow-[0_0_30px_rgba(228,0,43,0.3)]"
            >
              Try a Free Analysis →
            </Link>
            <Link
              href="/hr"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-[#ffffff18] bg-[#111113] text-[#f2eae3] font-semibold text-base hover:border-[#e4002b]/50 transition-all"
            >
              View HR Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-[#ffffff12] px-6 py-8 text-center text-xs text-[#6b6670]">
        <p>© {new Date().getFullYear()} DevScreen — AI-Powered Recruitment Platform</p>
        <p className="mt-1">
          Built with Next.js · Gemini AI · Supabase · CodeBERT Embeddings
        </p>
      </footer>
    </div>
  );
}
