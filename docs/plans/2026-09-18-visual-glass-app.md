# Plano: visual glass do login a Clientes

- Status: `aprovado`
- Data: 2026-09-18
- Autonomia: `medium` no geral, `tight` em `src/pages/Auth.tsx`
- Tamanho: `large`
- Feature: espalhar o visual glass do Dashboard para Auth, Produtos, Materiais, Acessórios e Clientes
- Spec: `specs/2026-09-18-app-glass.md` (`draft`, aguardando aprovação)

Este arquivo é o plano curto. Sem código até a Spec ser aprovada.

## Decisões fechadas

- Uma spec só nesta sessão: Auth + Produtos + Materiais + Acessórios + Clientes.
- Promover glass no `Card` compartilhado (`src/components/ui/card.tsx`). QR (`/qr-scan`) e `ProductSearch` herdam o visual.
- Modais (Dialog) ficam como estão, salvo se algum usar `Card`.
- Só visual. Sem tocar `useAuth`, RLS, schema, `.env`, commit ou push.

## O que já existe para reusar

Tokens e classes em `src/index.css`: `--glass-*`, `.glass-panel`, `.glass-kpi`, `.dashboard-atmosphere` (já acompanha aside aberto/fechado) e `prefers-reduced-transparency`.

O Dashboard não usa `Card`. Usa `glass-panel` / `glass-kpi` direto. Promover o `Card` não duplica o Dashboard.

Auth ainda é tema claro legado (`bg-gray-50`, `text-gray-900`). Se só o `Card` virar vidro, o login quebra. Auth precisa de chrome escuro e atmosfera própria. Ele fica fora do `Layout`.

A spec `specs/dashboard-glass.md` cenário 7 (outras telas sem glass) deixa de valer. A spec nova marca esse cenário como sucessor.

## Abordagem (depois da Spec aprovada)

1. Escrever `specs/app-glass.md` com cenários e Prova. Atualizar `docs/state/ATUAL.md`. Parar para aprovação da Spec.
2. Promover glass no `Card` e subir a atmosfera para o `Layout`. Remover o duplicado do Dashboard. Conferir que o Dashboard não fica com vidro duplo.
3. Auth só visual (fundo escuro, card glass). Review humano do diff de `Auth.tsx`.
4. Alinhar títulos, empty/loading e contraste das quatro listagens. Wrapper `glass-panel` na tabela de Acessórios.
5. Homologar QR e ProductSearch como herança do `Card`. Aside aberto/fechado numa listagem.
6. `npm run typecheck`, `lint` e `build`. Docs vivos só se o humano pedir fechamento formal.

## Arquivos

Criar:

- `specs/app-glass.md`

Alterar:

- `src/components/ui/card.tsx`
- `src/index.css` (só se a atmosfera precisar de nome/classe compartilhada)
- `src/components/Layout.tsx`
- `src/pages/Index.tsx` (tirar atmosfera duplicada)
- `src/pages/Auth.tsx` (path crítico, só chrome)
- `src/pages/Products.tsx`, `Materials.tsx`, `Accessories.tsx`, `Clients.tsx` (título e loading)
- `src/components/ProductsList.tsx`, `MaterialsList.tsx`, `AccessoriesList.tsx`, `ClientsList.tsx` (empty, contraste, tabela)
- `docs/state/ATUAL.md`
- `specs/dashboard-glass.md` (cenário 7 obsoleto)

Herança, só verificar:

- `src/pages/QRScan.tsx`
- `src/components/ProductSearch.tsx`

## Fora de escopo

- Lógica de login, cadastro, CRUD, produção, highlight de cliente
- Modais/dialogs, `useAuth`, `src/integrations/supabase/**`, migrations
- NotFound, F1 a F4, dependência nova, commit, push, deploy
- Redesign de tipografia e forms além do necessário para o fundo escuro do Auth
- Limpar `console.log` de `ClientsList` (PII; só com pedido)

## Paths críticos

Sim: `src/pages/Auth.tsx`. Autonomia `tight`. Diff só de visual. Sem mudar `signIn` / `signUp`.

Não nesta fatia: `useAuth`, `ProtectedRoute`, integrations, migrations, `.env`, `vercel.json`.

## Segurança

Visual only. Checklist de `docs/SECURITY.md`: N/A justificado, com a regra "não alterar lógica de `/auth` nem de `/qr-scan`". QR entra na prova visual porque herda o `Card`.

## Provas previstas

1. TC-GLASS-AUTH: login e cadastro no fundo escuro; entrar e ver o Dashboard.
2. TC-GLASS-LISTS: Produtos, Materiais, Acessórios e Clientes com atmosfera, cards glass e empty/loading legíveis.
3. TC-GLASS-ACC: Acessórios em tabela e em cards no mesmo material.
4. Transparência reduzida: DevTools `prefers-reduced-transparency: reduce` em Auth e numa listagem.
5. TC-GLASS-QR: `/qr-scan/:id` inválido e um válido, se houver; card glass, fluxo igual.
6. TC-GLASS-ASIDE: fechar e abrir o aside numa listagem; a atmosfera acompanha.
7. Smoke: criar/editar/excluir e KPIs do Dashboard. Comandos: `npm run typecheck`, `lint`, `build`.

## Riscos

- Auth é a única tela clara. O risco principal é contraste do formulário, não o `Card`.
- Promover `Card` muda QR e buscas juntos. Por isso entram na prova.
- Porta de mão única: o cenário 7 do Dashboard (sem vazamento visual) deixa de ser verdadeiro.

## Aprovação

- Plano: aprovado
- Spec: `specs/2026-09-18-app-glass.md` em `draft`, aguardando aprovação
- Código: proibido até a Spec ser aprovada
