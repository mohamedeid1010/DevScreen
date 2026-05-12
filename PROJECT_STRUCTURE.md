# Project Structure Guide

This document explains the current folder structure for the team and clarifies what each folder or file should contain.

## High-level structure

```text
devscreen/
├── AGENTS.md
├── CLAUDE.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── public/
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── callback/page.tsx
    │   │   └── login/page.tsx
    │   ├── candidate/
    │   │   ├── interviews/
    │   │   │   └── [id]/page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── recruiter/
    │   │   ├── jobs/
    │   │   │   ├── [id]/matches/page.tsx
    │   │   │   └── new/page.tsx
    │   │   ├── layout.tsx
    │   │   └── page.tsx
    │   ├── favicon.ico
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   └── ui/
    │       └── button.tsx
    └── lib/
        └── utils.ts
```

## Root-level files

### `AGENTS.md`

Use this file for local agent or workflow instructions used by coding assistants.
Do not place application logic here.

### `CLAUDE.md`

Use this file for assistant-specific references or imported instruction files.
Do not place runtime code here.

### `components.json`

Use this file for `shadcn` component configuration.
It defines aliases, style settings, and component generation behavior.

### `eslint.config.mjs`

Use this file for linting rules.
Add project-wide ESLint configuration here, not inside page files.

### `next-env.d.ts`

This file is generated and managed by Next.js for TypeScript support.
It provides framework-specific type references.
Do not manually rewrite its content unless the setup is broken.

### `tsconfig.json`

Use this file for TypeScript project settings.
Put compiler options, path aliases, strictness rules, and included file patterns here.

### `next.config.mjs`

Use this file for framework-level Next.js configuration.
Examples include feature flags, image config, and build-level options.

### `package.json`

Use this file for scripts, dependencies, and package metadata.
Do not put implementation details here.

### `postcss.config.mjs`

Use this file for PostCSS and Tailwind CSS processing configuration.

### `README.md`

Use this file for the main project overview, setup steps, and local development instructions.

### `public/`

Use this folder for static assets such as images, icons, and files served directly by the browser.
Examples: logos, illustrations, social preview images, and downloadable files.

## `src/` overview

The `src` folder contains all application code.

### `src/app/`

This is the App Router entry point.
Every folder and file here directly affects routing, layouts, and page rendering.

### `src/components/`

Use this folder for reusable UI pieces that are shared across routes.
Examples: buttons, cards, inputs, charts, and layout primitives.

### `src/lib/`

Use this folder for small reusable helper functions, formatting utilities, and shared logic that does not belong to a component.

## `src/app/` routing structure

### `src/app/layout.tsx`

This is the root layout for the entire app.
Put global HTML structure here.
This file should contain:

- The `<html>` and `<body>` shell.
- Global font setup.
- Top-level metadata.
- App-wide providers if the project adds them later.

Do not place page-specific UI here.

### `src/app/globals.css`

This file contains global styles.
Put these kinds of things here:

- Tailwind imports.
- Theme variables.
- Base element styles.
- Shared utility animations.

Do not place one-page-only styling here if it can live in the page component.

### `src/app/favicon.ico`

This is the browser tab icon for the app.

### `src/app/page.tsx`

This is the landing page for `/`.
Put homepage-specific content here, such as:

- Product overview.
- Main calls to action.
- Entry points to recruiter and candidate flows.

## Route groups and route conventions

### `src/app/(auth)/`

This is a route group.
The folder name helps organize auth-related pages, but `(auth)` does not appear in the URL.

Example:

- `src/app/(auth)/login/page.tsx` becomes `/login`
- `src/app/(auth)/callback/page.tsx` becomes `/callback`

Use route groups when you want better organization without changing public URLs.

## Auth routes

### `src/app/(auth)/login/page.tsx`

This is the recruiter login page.
Put authentication entry UI here, such as:

- Email/password form.
- SSO buttons.
- Short explanation of the login flow.
- Links to related auth pages.

### `src/app/(auth)/callback/page.tsx`

This is the GitHub OAuth callback page for candidates.
Put post-authentication status UI here, such as:

- Success state.
- Sync status.
- Imported profile summary.
- Navigation to the candidate portal.

## Recruiter area

### `src/app/recruiter/`

This folder contains all recruiter-facing routes.
Everything here should support hiring team workflows.

### `src/app/recruiter/layout.tsx`

This is the shared recruiter layout.
Put recruiter-wide shell UI here, such as:

- Sidebar.
- Top navigation.
- Shared status badges.
- Layout containers.

Keep route-specific content out of this file.

### `src/app/recruiter/page.tsx`

This is the main recruiter dashboard at `/recruiter`.
Put overview content here, such as:

- Open roles summary.
- Match pipeline stats.
- Activity feed.
- Shortcuts to create jobs or review matches.

### `src/app/recruiter/jobs/new/page.tsx`

This page is for job creation.
Put role-authoring UI here, such as:

- Role title and location fields.
- Seniority and manager info.
- Required skills.
- Scoring weights.
- Interview generation preferences.

If the team later adds a true multi-step flow, this is still the correct route for it.

### `src/app/recruiter/jobs/[id]/matches/page.tsx`

This is the dynamic match-results page for one job.
`[id]` represents the job identifier.

Put job-specific results here, such as:

- Ranked candidates.
- Match scores.
- Animated score visualizations.
- Strength and risk summaries.
- Role-specific review guidance.

Use this file when the content changes based on the selected job.

## Candidate area

### `src/app/candidate/`

This folder contains all candidate-facing routes.
Everything here should support the candidate's profile and interview preparation experience.

### `src/app/candidate/layout.tsx`

This is the shared candidate layout.
Put candidate-wide shell UI here, such as:

- Portal navigation.
- Shared profile status.
- Reusable layout wrappers.
- Cross-page actions related to the candidate journey.

### `src/app/candidate/page.tsx`

This is the main candidate profile page at `/candidate`.
Put candidate summary content here, such as:

- Profile overview.
- Skill radar chart.
- Career highlights.
- Readiness indicators.
- Links to interview preparation pages.

### `src/app/candidate/interviews/[id]/page.tsx`

This is the dynamic interview-preparation page.
`[id]` represents the interview track, role, or scenario identifier.

Put AI-generated interview content here, such as:

- Question panels.
- Rubrics.
- Interview flow suggestions.
- Role-specific preparation guidance.

Use this page when the question set depends on the selected interview path.

## Shared non-route code

### `src/components/ui/button.tsx`

This file contains the reusable button component.
Put shared button behavior here, such as:

- Variants.
- Sizes.
- Shared styles.
- Slot/asChild support.

Do not place page content here.

### `src/lib/utils.ts`

This file contains small utility helpers.
Use it for reusable functions like class merging, formatting helpers, or lightweight shared logic.

## Team rules for adding new files

1. Put route-specific UI in the nearest `page.tsx` file.
2. Put shared route shell UI in `layout.tsx`.
3. Put reusable visual components in `src/components/`.
4. Put small helper functions in `src/lib/`.
5. Use route groups like `(auth)` only for organization, not for public URL changes.
6. Use dynamic folders like `[id]` when the route depends on a specific entity.
7. Keep global styles in `globals.css` and avoid moving page-specific styling there unless it is truly shared.

## URL map

The current folder structure produces these main routes:

- `/`
- `/login`
- `/callback`
- `/recruiter`
- `/recruiter/jobs/new`
- `/recruiter/jobs/:id/matches`
- `/candidate`
- `/candidate/interviews/:id`

## Recommended ownership split

- Use `src/app/` for route entry points and layouts.
- Use `src/components/` for reusable UI.
- Use `src/lib/` for helpers.
- Use `public/` for static assets.
- Use root config files for tool and framework setup only.
