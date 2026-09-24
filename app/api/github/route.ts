import { NextResponse } from "next/server";

const USERNAME = "chaitanya-21-12";
const BASE = "https://api.github.com";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    };

    const [userRes, reposRes] = await Promise.all([
      fetch(`${BASE}/users/${USERNAME}`, { headers }),
      fetch(`${BASE}/users/${USERNAME}/repos?per_page=100&sort=pushed`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Top repos by stars
    const topRepos = [...repos]
      .filter((r: Record<string, unknown>) => !r.fork)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.stargazers_count as number) - (a.stargazers_count as number))
      .slice(0, 4)
      .map((r: Record<string, unknown>) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.fork_count,
        language: r.language,
        url: r.html_url,
        updated: r.pushed_at,
      }));

    // Language breakdown
    const langCount: Record<string, number> = {};
    repos
      .filter((r: Record<string, unknown>) => !r.fork && r.language)
      .forEach((r: Record<string, unknown>) => {
        const lang = r.language as string;
        langCount[lang] = (langCount[lang] || 0) + 1;
      });

    const topLanguages = Object.entries(langCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    const totalStars = repos.reduce(
      (acc: number, r: Record<string, unknown>) => acc + ((r.stargazers_count as number) || 0),
      0
    );

    return NextResponse.json({
      avatar: user.avatar_url,
      name: user.name,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      totalStars,
      topRepos,
      topLanguages,
      profileUrl: user.html_url,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
