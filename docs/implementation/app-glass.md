# Visual glass do login a Clientes

| Campo | Valor |
| --- | --- |
| **Status** | código entregue · homologação manual parcial |
| **Spec** | `specs/2026-09-18-app-glass.md` |
| **Autonomia** | `medium` no geral; `tight` na tela de acesso (só chrome) |
| **Data** | 2026-09-18 |

## Objetivo

Espalhar o material de vidro do Dashboard para a tela de acesso, Produtos, Materiais, Acessórios e Clientes. Fluxo operacional igual.

## Entregue

- Cartão compartilhado (`Card`) passou a usar `glass-panel`. QR e busca de produto herdam o material.
- Atmosfera escura no casco (`Layout`). Dashboard perdeu a atmosfera duplicada.
- Tela de acesso no tema escuro da fábrica, com atmosfera própria e cartão de vidro. `signIn` / `signUp` iguais.
- Listagens com título e botão de novo item no tema escuro; vazio e carregamento legíveis; tabela de Acessórios no mesmo vidro.
- Cenário 7 de `specs/dashboard-glass.md` marcado como obsoleto.
- Contrato visual em `src/lib/app-glass.ts` com testes em Vitest.

## Fora desta entrega (correto)

- Sem mudança de login, cadastro, CRUD, produção, QR ou destaque de cliente
- Sem limpar `console.log` da lista de clientes
- Sem schema, RLS, `.env`, commit, push ou deploy
- Sem editar `useAuth`, `ProtectedRoute` ou integrations

## Evidências técnicas

| Comando | Resultado |
| --- | --- |
| `npm test` | OK (5 testes em `src/lib/app-glass.test.ts`) |
| `npm run typecheck` | OK (exit 0) |
| `npm run lint` | 7 erros de legado (inalterados). Nenhum erro novo desta fatia. |
| `npm run build` | OK (exit 0) |

## Homologação no browser (sessão de implementação)

Feito com sessão já autenticada em `http://localhost:8080`:

- Acesso: fundo `rgb(21, 24, 30)`, sem `bg-gray-50`, cartão `glass-panel`, cadastro no mesmo material
- Erros de acesso: "Email ou senha incorretos"; "As senhas não coincidem."; "A senha deve ter pelo menos 6 caracteres."
- Produtos, Materiais, Clientes: atmosfera no casco + cartões de vidro
- Acessórios: vazio "Nenhum acessório cadastrado" em vidro (não havia item para tabela/cartões)
- Dashboard: 1 atmosfera, 0 atmosfera legado, 5 KPIs, sem wrapper de vidro na página
- QR `/qr-scan/not-found`: cartão de vidro, botão Voltar para Acessórios igual
- Aside desktop: atmosfera `left: 256px` aberto, `left: 0` fechado
- Transparência reduzida: `backdrop-filter: none` e fundo opaco em Produtos e no acesso

Pendente no humano: vista tabela/cartões com acessório cadastrado; QR válido; smoke criar/editar/excluir.

## Manual do dev

[`docs/manual-dev/03-app-glass.md`](../manual-dev/03-app-glass.md)
