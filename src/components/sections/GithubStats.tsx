import { FaCodeBranch, FaGithub, FaStar, FaUsers } from 'react-icons/fa';
import { SectionTitle } from '@/components/shared/SectionTitle';
import { Reveal } from '@/components/shared/Reveal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGithubData } from '@/hooks/useGithubData';
import { GITHUB_USERNAME } from '@/lib/constants';

const STAT_CARDS = [
  { key: 'public_repos', label: 'Repositórios', icon: FaCodeBranch },
  { key: 'followers', label: 'Seguidores', icon: FaUsers },
  { key: 'stars', label: 'Stars Recebidas', icon: FaStar },
] as const;

export function GithubStats() {
  const { user, repos, loading, error } = useGithubData(GITHUB_USERNAME);

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  const statValues: Record<string, number> = {
    public_repos: user?.public_repos ?? 0,
    followers: user?.followers ?? 0,
    stars: totalStars,
  };

  return (
    <section id="github" className="section-container" aria-label="Estatísticas do GitHub">
      <SectionTitle
        eyebrow="GitHub"
        title="Minha Atividade no GitHub"
        description="Dados em tempo real consumidos diretamente da API pública do GitHub."
      />

      {error && (
        <Reveal>
          <p className="mx-auto max-w-md text-center text-sm text-destructive">{error}</p>
        </Reveal>
      )}

      <Reveal>
        <Card className="mx-auto mb-10 max-w-3xl border-white/10">
          <CardContent className="flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-center">
            <Avatar className="h-24 w-24 border border-white/10">
              <AvatarImage src={user?.avatar_url} alt={user?.name ?? GITHUB_USERNAME} />
              <AvatarFallback className="text-2xl">
                {loading ? '' : GITHUB_USERNAME.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-display text-xl font-semibold">{user?.name ?? 'Carregando…'}</h3>
              <p className="text-sm text-muted-foreground">@{GITHUB_USERNAME}</p>
              {user?.bio && <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>}
            </div>

            <Button asChild>
              <a
                href={user?.html_url ?? `https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub className="h-4 w-4" />
                Ver perfil
              </a>
            </Button>
          </CardContent>
        </Card>
      </Reveal>

      <div className="mb-14 grid gap-6 sm:grid-cols-3">
        {STAT_CARDS.map((stat, index) => (
          <Reveal key={stat.key} delay={index * 0.1}>
            <Card className="text-center transition-all hover:-translate-y-1 hover:border-primary/40">
              <CardContent className="flex flex-col items-center gap-3 p-6">
                <stat.icon className="h-6 w-6 text-primary" />
                <span className="font-display text-3xl font-bold">
                  {loading ? '—' : statValues[stat.key]}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Card className="overflow-hidden border-white/10">
            <CardContent className="p-4">
              <img
                src={`https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&theme=dark&hide_border=true&bg_color=00000000&title_color=c084fc&icon_color=22d3ee&text_color=e5e7eb`}
                alt="Estatísticas do GitHub"
                loading="lazy"
                className="w-full"
              />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal delay={0.1}>
          <Card className="overflow-hidden border-white/10">
            <CardContent className="p-4">
              <img
                src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&theme=dark&hide_border=true&bg_color=00000000&title_color=c084fc&text_color=e5e7eb`}
                alt="Linguagens mais utilizadas"
                loading="lazy"
                className="w-full"
              />
            </CardContent>
          </Card>
        </Reveal>

        <Reveal className="lg:col-span-2">
          <Card className="overflow-hidden border-white/10">
            <CardContent className="p-4">
              <img
                src={`https://streak-stats.demolab.com?user=${GITHUB_USERNAME}&theme=dark&hide_border=true&background=00000000&ring=c084fc&fire=22d3ee&currStreakLabel=e5e7eb`}
                alt="Streak de contribuições no GitHub"
                loading="lazy"
                className="w-full"
              />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
