/*
  - All Functions
  -- fetchUserProfile(username: string)
  -- fetchUserRepos(username: string)
  -- fetchLanguageStats(username: string)
  -- fetchCommitActivity(username: string)
  -- fetchRepoCode(username: string, repoName: string, branch: string = "main")
  -- fetchFullGitHubProfile(username: string)
*/

import "dotenv/config";
import { Octokit } from "octokit";
import { getCachedProfile, setCachedProfile } from "./github-cache.service";

/**
 * GitHub Service — uses Octokit to retrieve all user data and repository code
 * for downstream analysis by the AI pipeline.
 */

const SUPPORTED_EXTENSIONS = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".go", ".rs",
  ".rb", ".php", ".cs", ".cpp", ".c", ".swift", ".kt", ".dart",
  ".vue", ".svelte", ".astro",
]);

const MAX_FILE_SIZE_BYTES = 100_000;     // skip files larger than 100 KB
const MAX_FILES_PER_REPO  = 30;          // cap per repo to stay within rate limits
const MAX_REPOS_TO_SCAN   = 10;          // only scan the top repos
const profileCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
let shouldSkipGitHubAuth = false;

function normalizeGitHubToken(token: string | null | undefined) {
  if (!token) {
    return null;
  }

  const normalizedToken = token.trim().replace(/^['"]|['"]$/g, "");
  const loweredToken = normalizedToken.toLowerCase();

  if (
    normalizedToken.length === 0 ||
    loweredToken === "your_github_token" ||
    loweredToken.startsWith("your_") ||
    loweredToken.startsWith("replace_") ||
    loweredToken.includes("placeholder")
  ) {
    return null;
  }

  return normalizedToken;
}

function isGitHubBadCredentialsError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const status = "status" in error ? (error as { status?: unknown }).status : undefined;
  const message = "message" in error ? (error as { message?: unknown }).message : undefined;
  const normalizedMessage = typeof message === "string" ? message.toLowerCase() : "";

  return status === 401 || normalizedMessage.includes("bad credentials");
}

function getOctokit() {
  const token = shouldSkipGitHubAuth ? null : normalizeGitHubToken(process.env.GITHUB_TOKEN);

  if (!token) {
    return new Octokit();
  }

  return new Octokit({ auth: token });
}

function getOctokitForToken(token: string | null | undefined) {
  const normalizedToken = normalizeGitHubToken(token);

  if (!normalizedToken) {
    return getOctokit();
  }

  return new Octokit({ auth: normalizedToken });
}

async function fetchLiveGitHubProfile(username: string, authToken?: string | null) {
  const octokit = getOctokitForToken(authToken);
  const [profile, repos, languages, commitActivity] = await Promise.all([
    fetchUserProfile(username, octokit),
    fetchUserRepos(username, octokit),
    fetchLanguageStats(username, octokit),
    fetchCommitActivity(username, octokit),
  ]);

  // Fetch code from top 3 repos for deep analysis
  const codeByRepo: Record<string, any[]> = {};
  const topRepos = repos.slice(0, 3);

  await Promise.all(
    topRepos.map(async (repo: any) => {
      const files = await fetchRepoCode(username, repo.name, repo.defaultBranch, octokit);
      codeByRepo[repo.name] = files;
    }),
  );

  const analyzableFileCount = Object.values(codeByRepo).reduce(
    (count, files) => count + files.length,
    0,
  );

  if (analyzableFileCount === 0) {
    throw new Error("This GitHub user has no analyzable public code.");
  }

  const result = {
    profile,
    repos,
    languages,
    commitActivity,
    codeByRepo,
  };

  profileCache.set(username, { data: result, ts: Date.now() });

  try {
    await setCachedProfile(username, result);
  } catch {
    // DB cache write failed — in-memory cache still works
  }

  return result;
}

/**
 * Fetch the public profile for a GitHub user.
 */
export async function fetchUserProfile(username: string, octokit = getOctokit()) {
  const { data } = await octokit.rest.users.getByUsername({ username });

  return {
    login:      data.login,
    name:       data.name,
    bio:        data.bio,
    company:    data.company,
    location:   data.location,
    blog:       data.blog,
    avatarUrl:  data.avatar_url,
    publicRepos: data.public_repos,
    followers:  data.followers,
    following:  data.following,
    createdAt:  data.created_at,
    updatedAt:  data.updated_at,
  };
}

/**
 * Fetch repositories for a user, sorted by most recently pushed.
 */
export async function fetchUserRepos(username: string, octokit = getOctokit()) {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    sort: "pushed",
    per_page: MAX_REPOS_TO_SCAN,
    type: "owner",
  });

  return data
    .filter((repo: any) => !repo.fork)
    .map((repo: any) => ({
      name:           repo.name,
      fullName:       repo.full_name,
      description:    repo.description,
      language:       repo.language,
      stars:          repo.stargazers_count,
      forks:          repo.forks_count,
      topics:         repo.topics || [],
      defaultBranch:  repo.default_branch,
      updatedAt:      repo.updated_at,
      pushedAt:       repo.pushed_at,
      htmlUrl:        repo.html_url,
      size:           repo.size,
    }));
}

/**
 * Aggregate language statistics across all repos.
 */
export async function fetchLanguageStats(username: string, octokit = getOctokit()) {
  const repos = await fetchUserRepos(username, octokit);
  const totals: Record<string, number> = {};

  await Promise.all(
    repos.slice(0, MAX_REPOS_TO_SCAN).map(async (repo: any) => {
      try {
        const { data } = await octokit.rest.repos.listLanguages({
          owner: username,
          repo: repo.name,
        });
        for (const [lang, bytes] of Object.entries(data)) {
          totals[lang] = (totals[lang] || 0) + (bytes as number);
        }
      } catch {
        // private or empty repos — skip silently
      }
    }),
  );

  const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0) || 1;

  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: Math.round((bytes / grandTotal) * 1000) / 10,
    }));
}

/**
 * Fetch recent commit activity for a user (last 90 days from top repos).
 */
export async function fetchCommitActivity(username: string, octokit = getOctokit()) {
  const repos = await fetchUserRepos(username, octokit);
  const commits: any[] = [];

  const since = new Date();
  since.setDate(since.getDate() - 90);

  await Promise.all(
    repos.slice(0, 6).map(async (repo: any) => {
      try {
        const { data } = await octokit.rest.repos.listCommits({
          owner: username,
          repo: repo.name,
          author: username,
          since: since.toISOString(),
          per_page: 20,
        });

        for (const commit of data) {
          commits.push({
            repo: repo.name,
            sha: commit.sha.slice(0, 7),
            message: commit.commit.message.split("\n")[0],
            date: commit.commit.author?.date,
          });
        }
      } catch {
        // skip repos we can't read
      }
    }),
  );

  return commits.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/**
 * Walk a repo tree and pull the content of supported source files.
 */
export async function fetchRepoCode(username: string, repoName: string, branch: string = "main", octokit = getOctokit()) {
  const files: any[] = [];

  try {
    const { data: tree } = await octokit.rest.git.getTree({
      owner: username,
      repo: repoName,
      tree_sha: branch,
      recursive: "true",
    });

    const candidates = tree.tree.filter((node: any) => {
      if (node.type !== "blob") return false;
      if (!node.path) return false;
      if (node.size && node.size > MAX_FILE_SIZE_BYTES) return false;
      const ext = node.path.slice(node.path.lastIndexOf("."));
      return SUPPORTED_EXTENSIONS.has(ext);
    });

    const toFetch = candidates.slice(0, MAX_FILES_PER_REPO);

    await Promise.all(
      toFetch.map(async (node: any) => {
        try {
          const { data } = await octokit.rest.git.getBlob({
            owner: username,
            repo: repoName,
            file_sha: node.sha as string,
          });

          const content =
            data.encoding === "base64"
              ? Buffer.from(data.content, "base64").toString("utf-8")
              : data.content;

          files.push({
            path: node.path,
            size: node.size,
            content,
          });
        } catch {
          // skip unreadable blobs
        }
      }),
    );
  } catch {
    // repo may be empty or branch doesn't exist
  }

  return files;
}

/**
 * Full pipeline: gather everything the analysis services need.
 */
export async function fetchFullGitHubProfile(
  username: string,
  forceRefresh = false,
  options: { authToken?: string | null } = {},
) {
  const authToken = options.authToken ?? null;

  if (!forceRefresh) {
    const cached = profileCache.get(username);

    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      const dbCached = await getCachedProfile(username);

      if (dbCached) {
        profileCache.set(username, { data: dbCached.data, ts: Date.now() });
        return dbCached.data;
      }
    } catch {
      // DB cache unavailable — fall through to live fetch
    }
  }

  try {
    return await fetchLiveGitHubProfile(username, authToken);
  } catch (error) {
    if (!isGitHubBadCredentialsError(error) || shouldSkipGitHubAuth) {
      throw error;
    }

    shouldSkipGitHubAuth = true;
    console.warn("Configured GITHUB_TOKEN was rejected by GitHub. Falling back to unauthenticated GitHub requests.");

    return fetchLiveGitHubProfile(username, authToken);
  }
}
