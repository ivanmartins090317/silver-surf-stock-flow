# Silver Surf Stock Flow

Painel de gestão da fábrica de pranchas (piloto): insumos, receita por modelo, produção com baixa automática, clientes sob encomenda, acessórios.

**Modernxlab Generated Project.** Stack: Vite + React + TypeScript + Supabase (não Next.js).

**Agentes / workflow:** leia `AGENTS.md`. Plano em `docs/PLANO.md`. Manual em `docs/manual-dev/`. Specs em `specs/`.

## Desenvolvimento local

Requisito: Node.js e npm.

```sh
git clone <YOUR_GIT_URL>
cd silver-surf-stock-flow
npm i
npm run dev
```

Copie `.env.example` para `.env` e preencha as variáveis do Supabase.

## Stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
- Supabase
- Vercel

## Deploy

O app é um SPA na Vercel (`vercel.json` com rewrite). Domínio de produção: [silver-surf-stock-flow.vercel.app](https://silver-surf-stock-flow.vercel.app).

Domínio customizado: Vercel → Project → Settings → Domains.
