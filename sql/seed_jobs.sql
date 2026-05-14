-- Seed jobs for DevScreen platform
-- Run this in Supabase SQL Editor

INSERT INTO jobs (title, company, type, location, description, requirements, salary_range) VALUES
(
  'Senior Frontend Engineer',
  'DevScreen Inc.',
  'full-time',
  'Remote',
  'We are looking for a Senior Frontend Engineer to lead the development of our next-generation AI recruitment dashboard. You will work on building responsive, performant web applications using modern frameworks and collaborate closely with our AI and backend teams.',
  'Required: 4+ years experience with React/Next.js, TypeScript, state management (Redux/Zustand), responsive design, REST/GraphQL APIs. Nice-to-have: WebSocket/real-time, data visualization (D3/Recharts), testing (Jest/Playwright), CI/CD experience.',
  '$120,000 - $160,000'
),
(
  'Backend Engineer — AI Pipeline',
  'DevScreen Inc.',
  'full-time',
  'Remote / Hybrid (Cairo)',
  'Join our core team building the AI analysis pipeline that powers DevScreen. You will design and maintain the backend services that process GitHub data, run AST analysis, generate embeddings, and orchestrate LLM-based evaluations at scale.',
  'Required: 3+ years with Node.js/TypeScript, PostgreSQL, REST API design, experience with ML/AI pipelines or vector databases. Nice-to-have: Python, Docker, Kubernetes, Supabase, embedding models, LangChain.',
  '$100,000 - $140,000'
),
(
  'Full-Stack Engineering Intern',
  'DevScreen Inc.',
  'internship',
  'Remote',
  'A 3-month paid internship for aspiring full-stack developers. You will contribute to real features on the DevScreen platform, learn about AI-driven recruitment tools, and work alongside senior engineers. Great opportunity to build your portfolio.',
  'Required: Familiarity with JavaScript/TypeScript, basic React knowledge, Git workflows, eagerness to learn. Nice-to-have: Next.js, SQL/PostgreSQL, any AI/ML exposure, open-source contributions.',
  'Stipend: $2,000/month'
),
(
  'DevOps & Infrastructure Engineer',
  'DevScreen Inc.',
  'contract',
  'Remote',
  'We need a DevOps engineer to set up and maintain our CI/CD pipelines, containerization, monitoring, and cloud infrastructure. You will ensure our AI pipeline runs reliably at scale and optimize deployment workflows.',
  'Required: 3+ years with Docker, CI/CD (GitHub Actions/GitLab CI), cloud platforms (AWS/GCP/Vercel), Linux administration, monitoring (Grafana/Datadog). Nice-to-have: Kubernetes, Terraform, Supabase Edge Functions.',
  '$110,000 - $150,000'
),
(
  'UI/UX Designer — Product',
  'DevScreen Inc.',
  'full-time',
  'Remote',
  'Design the next evolution of DevScreen''s recruitment platform. Create intuitive, beautiful interfaces for both candidates and HR professionals. Work with data visualizations, dashboards, and complex user flows.',
  'Required: 3+ years product design experience, Figma proficiency, strong portfolio showing dashboard/data-heavy UIs, understanding of design systems. Nice-to-have: Motion design, front-end development skills (HTML/CSS), experience with developer tools.',
  '$90,000 - $130,000'
);
