export function About() {
  return (
    <section id="about" className="page-section border-y border-border bg-card/50" aria-labelledby="about-title">
      <div className="section-container grid min-h-[65svh] gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-center lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            02 / Sobre
          </p>
          <h1
            id="about-title"
            className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Antes do código, o problema.
          </h1>
        </div>
        <div className="space-y-6 text-lg leading-8 text-muted-foreground">
          <p>
            Sou desenvolvedor Full Stack e estudante de Engenharia de Software. Minha atuação passa
            por sistemas corporativos, projetos criados para problemas reais e diferentes camadas de
            uma aplicação.
          </p>
          <p>
            Tenho interesse em backend, frontend, arquitetura e produto. No JS BOY, por exemplo,
            desenvolvo uma plataforma de gestão de entregas para uma operação familiar.
          </p>
          <p>
            Gosto de entender o problema antes de escolher a tecnologia e acompanhar o caminho da
            solução, da modelagem à experiência final de quem usa o produto.
          </p>
        </div>
      </div>
    </section>
  );
}
