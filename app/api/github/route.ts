import { NextResponse } from "next/server";

const BASE = "https://api.github.com";

export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Use authenticated /user endpoint to get private repo count too
    const [userRes, reposRes] = await Promise.all([
      fetch(`${BASE}/user`, { headers }),
      fetch(`${BASE}/user/repos?per_page=100&sort=pushed&affiliation=owner`, { headers }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Total repos = public + private
    const totalRepos = (user.public_repos || 0) + (user.total_private_repos || 0);

    // Top repos by stars (include private but don't link them)
    const topRepos = [...repos]
      .filter((r: Record<string, unknown>) => !r.fork)
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (b.stargazers_count as number) - (a.stargazers_count as number))
      .slice(0, 4)
      .map((r: Record<string, unknown>) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        language: r.language,
        isPrivate: r.private,
        url: r.private ? null : r.html_url,
      }));

    // Language breakdown (across all repos including private)
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
      privateRepos: user.total_private_repos || 0,
      totalRepos,
      totalStars,
      topRepos,
      topLanguages,
      profileUrl: user.html_url,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
