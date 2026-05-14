const { createClient } = require("@supabase/supabase-js");
require("dotenv/config");

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function main() {
  // Check if jobs already exist
  const { data: existing } = await sb.from("jobs").select("id");
  if (existing && existing.length > 0) {
    console.log(`Jobs table already has ${existing.length} rows. Skipping seed.`);
    return;
  }

  const jobs = [
    {
      title: "Senior Frontend Engineer",
      company: "DevScreen Inc.",
      type: "full-time",
      location: "Remote",
      description: "We are looking for a Senior Frontend Engineer to lead the development of our next-generation AI recruitment dashboard. You will work on building responsive, performant web applications using modern frameworks and collaborate closely with our AI and backend teams.",
      requirements: "Required: 4+ years experience with React/Next.js, TypeScript, state management (Redux/Zustand), responsive design, REST/GraphQL APIs. Nice-to-have: WebSocket/real-time, data visualization (D3/Recharts), testing (Jest/Playwright), CI/CD experience.",
      salary_range: "$120,000 - $160,000",
    },
    {
      title: "Backend Engineer — AI Pipeline",
      company: "DevScreen Inc.",
      type: "full-time",
      location: "Remote / Hybrid (Cairo)",
      description: "Join our core team building the AI analysis pipeline that powers DevScreen. You will design and maintain the backend services that process GitHub data, run AST analysis, generate embeddings, and orchestrate LLM-based evaluations at scale.",
      requirements: "Required: 3+ years with Node.js/TypeScript, PostgreSQL, REST API design, experience with ML/AI pipelines or vector databases. Nice-to-have: Python, Docker, Kubernetes, Supabase, embedding models, LangChain.",
      salary_range: "$100,000 - $140,000",
    },
    {
      title: "Full-Stack Engineering Intern",
      company: "DevScreen Inc.",
      type: "internship",
      location: "Remote",
      description: "A 3-month paid internship for aspiring full-stack developers. You will contribute to real features on the DevScreen platform, learn about AI-driven recruitment tools, and work alongside senior engineers. Great opportunity to build your portfolio.",
      requirements: "Required: Familiarity with JavaScript/TypeScript, basic React knowledge, Git workflows, eagerness to learn. Nice-to-have: Next.js, SQL/PostgreSQL, any AI/ML exposure, open-source contributions.",
      salary_range: "Stipend: $2,000/month",
    },
    {
      title: "DevOps & Infrastructure Engineer",
      company: "DevScreen Inc.",
      type: "contract",
      location: "Remote",
      description: "We need a DevOps engineer to set up and maintain our CI/CD pipelines, containerization, monitoring, and cloud infrastructure. You will ensure our AI pipeline runs reliably at scale and optimize deployment workflows.",
      requirements: "Required: 3+ years with Docker, CI/CD (GitHub Actions/GitLab CI), cloud platforms (AWS/GCP/Vercel), Linux administration, monitoring (Grafana/Datadog). Nice-to-have: Kubernetes, Terraform, Supabase Edge Functions.",
      salary_range: "$110,000 - $150,000",
    },
    {
      title: "UI/UX Designer — Product",
      company: "DevScreen Inc.",
      type: "full-time",
      location: "Remote",
      description: "Design the next evolution of DevScreen's recruitment platform. Create intuitive, beautiful interfaces for both candidates and HR professionals. Work with data visualizations, dashboards, and complex user flows.",
      requirements: "Required: 3+ years product design experience, Figma proficiency, strong portfolio showing dashboard/data-heavy UIs, understanding of design systems. Nice-to-have: Motion design, front-end development skills (HTML/CSS), experience with developer tools.",
      salary_range: "$90,000 - $130,000",
    },
  ];

  const { data, error } = await sb.from("jobs").insert(jobs).select("id, title");
  if (error) {
    console.error("Seed error:", error.message);
  } else {
    console.log("Seeded jobs:", JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
