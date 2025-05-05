// GitHub API utility functions

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string;
  html_url: string;
  state: "open" | "closed";
  labels: GitHubLabel[];
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
}

/**
 * Fetches GitHub issues from a specified repository
 * @param owner The owner of the repository
 * @param repo The repository name
 * @param state Filter issues by state - 'open', 'closed', or 'all'
 * @returns An array of GitHub issues
 */
export async function fetchGitHubIssues(
  owner: string,
  repo: string,
  state: "open" | "closed" | "all" = "open",
): Promise<GitHubIssue[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues?state=${state}&sort=created&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        // Cache the response for 10 minutes
        next: { revalidate: 600 },
      },
    );

    if (!response.ok) {
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const issues = await response.json();
    return issues as GitHubIssue[];
  } catch (error) {
    console.error("Error fetching GitHub issues:", error);
    return [];
  }
}
