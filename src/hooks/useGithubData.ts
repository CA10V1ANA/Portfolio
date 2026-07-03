import { useEffect, useState } from 'react';
import axios from 'axios';
import type { GithubRepo, GithubUser } from '@/types';

interface GithubData {
  user: GithubUser | null;
  repos: GithubRepo[];
  languages: { name: string; count: number }[];
  loading: boolean;
  error: string | null;
}

export function useGithubData(username: string): GithubData {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [userRes, reposRes] = await Promise.all([
          axios.get<GithubUser>(`https://api.github.com/users/${username}`),
          axios.get<GithubRepo[]>(
            `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
          ),
        ]);

        if (cancelled) return;
        setUser(userRes.data);
        setRepos(reposRes.data.filter((repo) => !repo.fork));
      } catch {
        if (!cancelled) setError('Não foi possível carregar os dados do GitHub no momento.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [username]);

  const languageCounts = repos.reduce<Record<string, number>>((acc, repo) => {
    if (repo.language) acc[repo.language] = (acc[repo.language] ?? 0) + 1;
    return acc;
  }, {});

  const languages = Object.entries(languageCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return { user, repos, languages, loading, error };
}
