"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipboardList, Sparkles } from "lucide-react";
import { useDemoSession } from "@/components/demo/demo-session-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DemoJobDraft } from "@/lib/demo-data";

const outputs = [
  "The matches screen opens on the new role slug.",
  "The featured candidate can change with the brief.",
  "The candidate lane follows the same role automatically.",
];

type NewJobFormFieldsProps = {
  currentTitle: string;
  initialJob: DemoJobDraft;
  isReady: boolean;
  onSave: ReturnType<typeof useDemoSession>["saveJobDraft"];
};

function NewJobFormFields({ currentTitle, initialJob, isReady, onSave }: NewJobFormFieldsProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialJob.title);
  const [location, setLocation] = useState(initialJob.location);
  const [seniority, setSeniority] = useState(initialJob.seniority);
  const [hiringManager, setHiringManager] = useState(initialJob.hiringManager);
  const [roleBrief, setRoleBrief] = useState(initialJob.roleBrief);
  const [mustHaveTechnologies, setMustHaveTechnologies] = useState(initialJob.mustHaveTechnologies);
  const [interviewBrief, setInterviewBrief] = useState(initialJob.interviewBrief);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextSession = onSave({
      title,
      location,
      seniority,
      hiringManager,
      roleBrief,
      mustHaveTechnologies,
      interviewBrief,
    });

    router.push(`/recruiter/jobs/${nextSession.job.slug}/matches`);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="space-y-4">
        <div className="rounded-2xl border border-[#ffffff12] bg-[#111113] p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f99c0033] bg-[#f99c000d] px-4 py-2 text-sm text-[#f99c00]">
            <Sparkles className="size-4" />
            Shared demo session
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#f2eae3] sm:text-4xl">
            Write the role once.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#a8a29e]">
            Save this form and the same role will drive matches and candidate context.
          </p>
        </div>

        <form className="space-y-6 rounded-2xl border border-[#ffffff12] bg-[#0c0c0e] p-6" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-[#00bb7f1a] bg-[#00bb7f0d] p-4 text-sm leading-6 text-[#7ef0c8]">
            This is the only input step you need before opening matches.
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Role title
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Hiring location
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Seniority level
              <select
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={seniority}
                onChange={(event) => setSeniority(event.target.value)}
              >
                <option className="bg-[#111113]">Mid</option>
                <option className="bg-[#111113]">Senior</option>
                <option className="bg-[#111113]">Lead</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Hiring manager
              <input
                className="h-12 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={hiringManager}
                onChange={(event) => setHiringManager(event.target.value)}
                type="text"
              />
            </label>
          </div>

          <label className="block space-y-2 text-sm font-medium text-[#a8a29e]">
            Role brief
            <textarea
              className="min-h-40 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
              value={roleBrief}
              onChange={(event) => setRoleBrief(event.target.value)}
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Must-have technologies
              <textarea
                className="min-h-32 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={mustHaveTechnologies}
                onChange={(event) => setMustHaveTechnologies(event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-[#a8a29e]">
              Interview brief
              <textarea
                className="min-h-32 w-full rounded-xl border border-[#ffffff12] bg-[#111113] px-4 py-4 text-base text-[#f2eae3] outline-none transition focus:border-[#f99c0040]"
                value={interviewBrief}
                onChange={(event) => setInterviewBrief(event.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="h-11 rounded-xl px-5" type="submit">
              Save and open shared matches
            </Button>
          </div>

          <p className="text-xs leading-5 text-[#a8a29e]">
            {isReady
              ? `Current role: ${currentTitle}. Saving will replace it.`
              : "Loading the current demo session..."}
          </p>
        </form>
      </section>

      <aside className="space-y-4">
        <Card className="bg-[#111113] shadow-none">
          <CardHeader className="p-6 pb-0">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#f99c001a] p-3">
                <ClipboardList className="size-5 text-[#f99c00]" />
              </div>
              <div>
                <p className="text-sm text-[#a8a29e]">What happens next</p>
                <CardTitle className="text-2xl text-[#f2eae3]">One save updates three screens</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 p-6 pt-6">
            {outputs.map((item) => (
              <div key={item} className="rounded-xl border border-[#ffffff0a] bg-[#0c0c0e] px-4 py-4 text-sm leading-6 text-[#a8a29e]">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

export function NewJobFormView() {
  const { isReady, saveJobDraft, session } = useDemoSession();

  return (
    <NewJobFormFields
      key={session.job.slug}
      currentTitle={session.job.title}
      initialJob={session.job}
      isReady={isReady}
      onSave={saveJobDraft}
    />
  );
}