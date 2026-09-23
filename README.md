# Portfólio de Caio Viana

Portfólio em React 19, TypeScript, Vite e Tailwind CSS. A experiência é organizada em páginas próprias: Início, Sobre, Projetos, Stack, Experiência e Contato.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Validação local:

```bash
npm run lint
npm run build
```

O projeto mantém `npm run build:gh-pages` para o caminho `/Portfolio/`. `public/404.html` restaura rotas profundas no GitHub Pages e `vercel.json` fornece o rewrite para a Vercel.

## Conteúdo e estrutura

- `src/lib/constants.ts`: ordem narrativa, rotas e links globais.
- `src/data/projects.ts`: dados dos projetos apresentados em rotas próprias.
- `src/data/technologies.ts`: tecnologias e branches consumidas pela Stack Branch Orbit.
- `src/data/experience.ts` e `src/data/education.ts`: dados da trajetória.
- `src/pages/ProjectPage.tsx`: apresentação de um case por vez e navegação entre projetos.
- `src/components/layout/PortfolioLayout.tsx`: shell, foco após navegação e sequência dos capítulos.
- `src/components/navigation/CommandPalette.tsx`: navegação rápida por páginas e projetos com `Ctrl/Cmd+K`.

## Pendências antes da publicação

- O briefing V2 e o currículo local divergem sobre a experiência profissional. A página segue o dado mais recente do briefing (ACS Automação Comercial e Sistemas, desde 2025); compare com o currículo e o LinkedIn atuais antes de publicar.
- O endereço de homologação do JS BOY retornava 404 na checagem registrada anteriormente e foi omitido até nova confirmação.
- Não há screenshots reais dos projetos no repositório. As páginas não mostram imagens genéricas nem textos de placeholder; adicione capturas aprovadas em `public/projects/` e seus textos alternativos nos dados de cada case.
- O e-mail profissional ainda não foi confirmado. Contato mantém LinkedIn, GitHub e currículo até a confirmação.
- O domínio canônico de produção ainda não está definido. Canonical e Open Graph usam a origem atual em runtime; configure a origem definitiva antes de publicar e gere o sitemap com esse domínio.
- O título interno do PDF foi corrigido para `Caio Viana - Currículo`; o conteúdo segue pendente de revisão por causa da divergência profissional.

## Deploy

Nenhuma publicação é feita por esta alteração local. Verifique as rotas profundas, links dos projetos, capturas, metadados e o currículo no ambiente de produção antes de publicar.
