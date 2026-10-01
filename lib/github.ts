import "server-only";
import { profile, selectedRepos } from "./data";

/**
 * Live GitHub data, fetched on the server and revalidated hourly.
 * Every call fails soft: when the API is unreachable or rate-limited the UI
 * falls back to static repository links and simply omits live numbers.
 */

const API = "https://api.github.com";
const REVALIDATE = 3600;

type GhUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  html_url: string;
  created_at: string;
};

type GhRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
};

type GhEvent = { created_at: string };

async function gh<T>(path: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "vineet-portfolio",
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(`${API}${path}`, {
      headers,
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type RepoCard = {
  name: string;
  url: string;
  description: string;
  language?: string | null;
  stars?: number;
  pushedAt?: string;
};

export type GithubData = {
  live: boolean;
  user: GhUser | null;
  repos: RepoCard[];
  languages: { name: string; count: number }[];
  /** 91 days of public event counts (oldest → newest), or null if unavailable. */
  activity: { date: string; count: number }[] | null;
  activityTotal: number;
};

export async function getGithubData(): Promise<GithubData> {
  const u = profile.githubUser;
  const [user, repos, ...eventPages] = await Promise.all([
    gh<GhUser>(`/users/${u}`),
    gh<GhRepo[]>(`/users/${u}/repos?per_page=100&sort=pushed`),
    gh<GhEvent[]>(`/users/${u}/events/public?per_page=100&page=1`),
    gh<GhEvent[]>(`/users/${u}/events/public?per_page=100&page=2`),
    gh<GhEvent[]>(`/users/${u}/events/public?per_page=100&page=3`),
  ]);

  const byName = new Map((repos ?? []).map((r) => [r.name.toLowerCase(), r]));
  const cards: RepoCard[] = selectedRepos.map((s) => {
    const r = byName.get(s.name.toLowerCase());
    return {
      name: s.name,
      url: r?.html_url ?? `https://github.com/${u}/${s.name}`,
      description: r?.description || s.blurb,
      language: r?.language,
      stars: r?.stargazers_count,
      pushedAt: r?.pushed_at,
    };
  });

  const langCounts = new Map<string, number>();
  for (const r of repos ?? []) {
    if (r.fork || !r.language) continue;
    langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  }
  const languages = [...langCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  let activity: GithubData["activity"] = null;
  let activityTotal = 0;
  const events = eventPages.flatMap((p) => p ?? []);
  if (eventPages[0]) {
    const days = 91;
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const counts = new Map<string, number>();
    for (const e of events) {
      const d = e.created_at.slice(0, 10);
      counts.set(d, (counts.get(d) ?? 0) + 1);
    }
    activity = Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setUTCDate(today.getUTCDate() - (days - 1 - i));
      const key = d.toISOString().slice(0, 10);
      const count = counts.get(key) ?? 0;
      activityTotal += count;
      return { date: key, count };
    });
  }

  return {
    live: !!user,
    user,
    repos: cards,
    languages,
    activity,
    activityTotal,
  };
}
