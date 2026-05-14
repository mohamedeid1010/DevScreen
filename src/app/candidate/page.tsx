import Link from "next/link";

export default function CandidatePortal() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Portal</h1>
        <p className="mt-2 text-[#a8a29e]">
          Get analyzed, browse open positions, and apply with your GitHub profile.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Get Analyzed */}
        <Link
          href="/analyze"
          className="rounded-xl border border-[#ffffff12] bg-[#111113] p-8 hover:border-[#e4002b]/30 transition-all group"
        >
          <div className="text-3xl mb-3">🔬</div>
          <h2 className="text-xl font-bold text-[#f2eae3] group-hover:text-[#e4002b] transition-colors">
            Get Analyzed
          </h2>
          <p className="text-sm text-[#a8a29e] mt-2 leading-relaxed">
            Run the full AI pipeline on your GitHub profile. See your strengths,
            skill breakdown, and fit assessment for any role.
          </p>
          <span className="inline-block mt-4 text-sm text-[#e4002b] font-semibold">
            Start Analysis →
          </span>
        </Link>

        {/* Browse Jobs */}
        <Link
          href="/candidate/jobs"
          className="rounded-xl border border-[#ffffff12] bg-[#111113] p-8 hover:border-[#e4002b]/30 transition-all group"
        >
          <div className="text-3xl mb-3">💼</div>
          <h2 className="text-xl font-bold text-[#f2eae3] group-hover:text-[#e4002b] transition-colors">
            Browse Open Positions
          </h2>
          <p className="text-sm text-[#a8a29e] mt-2 leading-relaxed">
            Explore available jobs and internships. See your match percentage for
            each role before applying.
          </p>
          <span className="inline-block mt-4 text-sm text-[#e4002b] font-semibold">
            View Jobs →
          </span>
        </Link>
      </div>

      {/* Tip */}
      <div className="rounded-xl border border-[#e4002b]/20 bg-[#e4002b]/5 p-5">
        <p className="text-sm text-[#d8d0ca]">
          <strong className="text-[#e4002b]">💡 Pro Tip:</strong> Run an analysis
          on your GitHub profile first. When you apply for a job, the system will
          automatically calculate your match score based on your code.
        </p>
      </div>
    </div>
  );
}
