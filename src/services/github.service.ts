// Octokit, repos, commits, code fetching

/*
  - All Functions
  -- getGitHubUser(username: string)
  -- getGitHubRepos(username: string, perPage: number = 30)
  -- getRepoDetails(owner: string, repo: string)
  -- getComprehensiveUserProfile(username: string)
  -- getRepoCode(owner: string, repo: string, branch: string = "main")
*/

import "dotenv/config";
import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getGitHubUser = async (username: string) => {
  try {
    const response = await octokit.rest.users.getByUsername({
      username,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching user ${username}:`, error.message);
    throw new Error(`Failed to fetch GitHub user: ${error.message}`);
  }
};

export const getGitHubRepos = async (
  username: string,
  perPage: number = 30,
) => {
  try {
    const response = await octokit.rest.repos.listForUser({
      username,
      per_page: perPage,
      sort: "updated",
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching repos for ${username}:`, error.message);
    throw new Error(`Failed to fetch GitHub repos: ${error.message}`);
  }
};

export const getRepoDetails = async (owner: string, repo: string) => {
  try {
    const response = await octokit.rest.repos.get({
      owner,
      repo,
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching repo ${owner}/${repo}:`, error.message);
    throw new Error(`Failed to fetch repository details: ${error.message}`);
  }
};

export const getComprehensiveUserProfile = async (username: string) => {
  try {
    const { data: profile } = await octokit.rest.users.getByUsername({
      username,
    });

    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      per_page: 100,
      sort: "updated",
    });

    const repositoriesData = await Promise.all(
      repos.map(async (repo: any) => {
        let languages = {};
        try {
          const { data } = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          languages = data;
        } catch (err: any) {
          console.warn(
            `[Warn] Could not fetch languages for ${repo.name}: ${err.message}`,
          );
        }

        let recentCommits: any[] = [];
        try {
          const { data } = await octokit.rest.repos.listCommits({
            owner: username,
            repo: repo.name,
            per_page: 5,
          });

          recentCommits = data.map((commitData: any) => ({
            sha: commitData.sha,
            message: commitData.commit.message,
            date: commitData.commit.author?.date,
            authorName: commitData.commit.author?.name,
            url: commitData.html_url,
          }));
        } catch (err: any) {
          console.warn(
            `[Warn] Could not fetch commits for ${repo.name}: ${err.message}`,
          );
        }

        return {
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          isFork: repo.fork,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          primaryLanguage: repo.language,
          languages,
          recentCommits,
        };
      }),
    );

    return {
      profile: {
        login: profile.login,
        name: profile.name,
        avatarUrl: profile.avatar_url,
        bio: profile.bio,
        company: profile.company,
        location: profile.location,
        email: profile.email,
        blog: profile.blog,
        publicRepos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        url: profile.html_url,
      },
      repositories: repositoriesData,
    };
  } catch (error: any) {
    console.error(
      `Error compiling comprehensive data for ${username}:`,
      error.message,
    );
    throw new Error(
      `Failed to fetch comprehensive GitHub data: ${error.message}`,
    );
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getRepoCode = async (
  owner: string,
  repo: string,
  branch: string = "main",
) => {
  try {
    const { data: treeData } = await octokit.rest.git.getTree({
      owner,
      repo,
      tree_sha: branch,
      recursive: "true",
    });

    const allowedExtensions = [
      // Web
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".html",
      ".css",
      ".scss",
      ".sass",
      ".less",
      ".vue",
      ".svelte",
      // Backend / Native
      ".py",
      ".java",
      ".c",
      ".cpp",
      ".h",
      ".hpp",
      ".cs",
      ".go",
      ".rs",
      ".php",
      ".rb",
      ".swift",
      ".kt",
      ".dart",
      ".m",
      ".mm",
      // Scripts
      ".sh",
      ".bash",
      ".bat",
      ".ps1",
      // Configs / Data
      ".json",
      ".xml",
      ".yaml",
      ".yml",
      ".toml",
      ".ini",
      ".env",
      ".config",
      // Docs / Text
      ".md",
      ".txt",
      ".csv",
      ".rtf",
    ];

    const filteredFiles = (treeData.tree || []).filter((item: any) => {
      if (item.type !== "blob") return false;
      if (!item.path) return false;

      // Still ignore heavy dependencies and build folders to prevent rate limit crashes
      if (
        item.path.includes("node_modules/") ||
        item.path.includes("dist/") ||
        item.path.includes("build/") ||
        item.path.includes(".next/")
      )
        return false;

      const filename = item.path.split("/").pop() || "";
      const lowerFilename = filename.toLowerCase();

      // Check if it ends with an allowed extension
      const hasAllowedExtension = allowedExtensions.some((ext) =>
        lowerFilename.endsWith(ext),
      );

      // Also allow common text files that don't have extensions
      const isKnownTextFile = [
        "dockerfile",
        "makefile",
        "license",
        "gemfile",
      ].includes(lowerFilename);

      return hasAllowedExtension || isKnownTextFile;
    });

    const repoContent: Record<string, string> = {};

    console.log(
      `Fetching ${filteredFiles.length} files from ${owner}/${repo}...`,
    );

    for (const file of filteredFiles) {
      if (!file.path) continue;

      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: branch,
        });

        if (
          !Array.isArray(fileData) &&
          fileData.type === "file" &&
          fileData.content
        ) {
          const decodedContent = Buffer.from(
            fileData.content,
            "base64",
          ).toString("utf-8");
          repoContent[file.path] = decodedContent;
        }

        await delay(200);
      } catch (err: any) {
        console.warn(
          `[Warn] Could not fetch content for ${file.path}: ${err.message}`,
        );
      }
    }

    return repoContent;
  } catch (error: any) {
    console.error(
      `Error fetching repo code for ${owner}/${repo}:`,
      error.message,
    );
    throw new Error(`Failed to fetch repo code: ${error.message}`);
  }
};
