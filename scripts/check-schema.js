// Test the fixed similarity calculation by calling the API
async function main() {
  // Delete the existing application first
  const delRes = await fetch("http://localhost:3000/api/applications/ec97d971-73a6-46f4-acd1-8b4f5e1a1883", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "rejected" }),
  });
  console.log("Patched old app status:", delRes.status);

  // Re-submit application for mohamedeid1010 to the same job
  const res = await fetch("http://localhost:3000/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_id: "ec1b743e-349f-475f-84b6-2781ab39b9d1",
      github_username: "mohamedeid1010",
      full_name: "Mohamed Eid",
      email: "test@example.com",
    }),
  });
  const data = await res.json();
  console.log("\nNew application result:");
  console.log("Status:", res.status);
  console.log("Similarity Score:", data.similarity_score);
  console.log("Skill Breakdown:", JSON.stringify(data.skill_breakdown));
}

main().catch(console.error);
