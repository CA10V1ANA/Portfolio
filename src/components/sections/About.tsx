export function About() {
  return (
    <section id="about" className="border-y border-border bg-card/50" aria-labelledby="about-title">
      <div className="section-container grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            04 / Sobre
          </p>
          <h2
            id="about-title"
            className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
          >
            Antes do código, o problema.
          </h2>
        </div>
        <div className="space-y-6 text-lg leading-8 text-muted-foreground">
          <p>
            Sou desenvolvedor Full Stack e estudante de Engenharia de Software. Atuo no
            desenvolvimento e na manutenção de sistemas, trabalhando com interfaces web, serviços e
            bancos de dados.
          </p>
          <p>
            Em paralelo à experiência profissional, desenvolvo projetos próprios e soluções para
            contextos reais, como uma plataforma de entregas para a empresa da minha família e
            aplicações criadas para estudar desafios de operação.
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
