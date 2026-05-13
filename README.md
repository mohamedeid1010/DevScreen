This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Copy `.env.example` to `.env.local` and fill in the required keys before starting the app.

This app reads environment variables from `.env.local`. The `_env` file in the repository is not loaded automatically by Next.js.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

If you set `PORT` in `.env.local`, use that port instead.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## GitHub Auth Setup

GitHub is the only supported sign-in method in this app. The OAuth flow starts in `src/app/auth/github/route.ts` and returns to `/callback`.

1. Create a GitHub OAuth App in your GitHub developer settings.
2. Set the GitHub app homepage to your local app origin, such as `http://localhost:3000`.
3. Set the GitHub app authorization callback URL to your Supabase callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`.
4. In Supabase Dashboard, open Authentication > Providers > GitHub, turn it on, and save the GitHub client ID and secret.
5. In Supabase Authentication redirect URLs, add your app callback URL, such as `http://localhost:3000/callback`.
6. Add any production callback URL you plan to use later, such as `https://your-domain.com/callback`.

## Auth Troubleshooting

- If you see `oauth_provider_disabled`, GitHub is not enabled yet in Supabase.
- If you see `oauth_redirect_not_allowed`, Supabase is rejecting your app callback URL.
- If you see `oauth_provider_misconfigured`, the GitHub client ID or secret in Supabase is incomplete or invalid.
- If login succeeds but the user profile is not saved, verify `SUPABASE_SERVICE_ROLE_KEY` and make sure the `profiles` table exists.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
