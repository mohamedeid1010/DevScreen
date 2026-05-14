import type { ReactNode } from "react";
import Link from "next/link";

export default function HRLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-8 min-h-[70vh]">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[#ffffff12] pr-6">
        <div className="text-sm font-semibold text-[#f2eae3] mb-4 uppercase tracking-wider">
          HR Portal
        </div>
        <nav className="space-y-1">
          {[
            { href: "/hr", label: "Dashboard" },
            { href: "/hr/candidates", label: "Candidates" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-lg text-sm text-[#a8a29e] hover:text-[#f2eae3] hover:bg-[#ffffff08] transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
