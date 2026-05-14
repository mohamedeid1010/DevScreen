"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function submitGithubLink(formData: FormData) {
  const urlOrUsername = formData.get("github_url") as string;
  if (!urlOrUsername) return;

  // Extract username from URL or use as is
  let username = urlOrUsername.trim();
  if (username.startsWith("http")) {
    try {
      const url = new URL(username);
      username = url.pathname.replace(/^\/+/, "").split("/")[0];
    } catch {
      // Ignore
    }
  }

  // Set demo session cookie
  const cookieStore = await cookies();
  cookieStore.set("demo_github_username", username, { path: "/", maxAge: 60 * 60 * 24 });

  redirect("/recruiter");
}
