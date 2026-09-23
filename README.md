# Portfólio de Caio Viana

Portfólio em React 19, TypeScript, Vite e Tailwind CSS. A interface apresenta projetos como casos de engenharia, uma visão interativa da stack, experiência, formação e caminhos de contato.

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

O repositório também mantém `npm run build:gh-pages` para o caminho `/Portfolio/`. O workflow em `.github/workflows/deploy.yml` publica o GitHub Pages a partir de `main`; `vercel.json` configura o build da Vercel. Nenhuma publicação faz parte desta mudança local.

## Conteúdo e estrutura

- `src/data/projects.ts`: quatro casos em destaque e projetos menores, com status e links.
- `src/data/technologies.ts`: tecnologias e contexto de uso exibidos na Stack.
- `src/data/experience.ts` e `src/data/education.ts`: dados da trajetória.
- `src/components/shared/ProjectCase.tsx`: layout alternado dos casos e estado sem imagem.
- `src/components/navigation/CommandPalette.tsx`: navegação rápida por clique ou `Ctrl/Cmd+K`.
- `src/index.css`: tokens visuais e estilos globais.

### Adicionar capturas dos projetos

1. Coloque as capturas reais em `public/projects/`, preferencialmente em WebP ou AVIF com proporção próxima de 16:10.
2. Em `src/data/projects.ts`, preencha `image` com o caminho absoluto público, por exemplo `/projects/js-boy.webp`, e `imageAlt` com uma descrição útil da tela.
3. Execute `npm run build` e confira desktop e mobile. Se um arquivo não carregar, o case volta ao estado de imagem indisponível.

Enquanto as capturas não forem fornecidas, cada case mostra um espaço reservado identificado. A interface não usa mockups ou imagens de repositório como substitutos.

## Pendências de conteúdo antes da publicação

- Confirmar status e links atuais dos projetos e o repositório público do DevPilot, caso exista. A URL de homologação do JS BOY indicada no briefing respondeu 404 em 22/09/2026 e não aparece no case.
- Completar o case do IF Make com problema, decisões e participação de Caio.
- Confirmar período e stack da experiência profissional. O currículo local e o briefing diferem nesse ponto; a interface usa apenas informações compatíveis entre eles.
- Confirmar e-mail profissional e revisar o PDF em `public/Caio-Viana-Curriculo.pdf`. O contato no site usa GitHub e LinkedIn até essa confirmação.
- Definir URL canônica do portfólio e conferir a imagem de compartilhamento em produção.

## Acessibilidade

A página usa links e botões nativos, foco visível, navegação por teclado e suporte a `prefers-reduced-motion`. A Stack pausa o ciclo automático após seleção manual; com movimento reduzido, a seleção permanece manual.
