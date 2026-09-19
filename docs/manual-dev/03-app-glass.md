# Visual glass do login a Clientes

| Status | Spec |
| --- | --- |
| código entregue · homologação manual parcial | `specs/2026-09-18-app-glass.md` |

## Como funciona

A atmosfera escura vive no casco das telas internas (`Layout` + classe `app-atmosphere`). A tela de acesso fica fora desse casco e tem a mesma atmosfera por conta própria.

Os cartões compartilham o material `glass-panel` via `Card`. Com `prefers-reduced-transparency: reduce`, o vidro vira superfície opaca, sem desfoque.

O Dashboard continua com KPIs `glass-kpi` e painéis próprios. Não envolve a página num segundo vidro.

Contrato de classes e copy de vazio/carregamento: `src/lib/app-glass.ts`.

## Onde olhar

| Superfície | Arquivo |
| --- | --- |
| Casco / atmosfera | `src/components/Layout.tsx`, `src/index.css` |
| Cartão compartilhado | `src/components/ui/card.tsx` |
| Acesso (só chrome) | `src/pages/Auth.tsx` |
| Dashboard sem duplicata | `src/pages/Index.tsx` |
| Listagens | `src/pages/Products.tsx`, `Materials.tsx`, `Accessories.tsx`, `Clients.tsx` e as listas |
| Herança | `src/pages/QRScan.tsx`, `src/components/ProductSearch.tsx` |

## Como homologar

1. TC-GLASS-AUTH: `/auth` no fundo escuro; login válido chega ao Dashboard; aba Cadastro no mesmo vidro.
2. TC-GLASS-AUTH-ERR: senha errada; senhas diferentes; senha com menos de 6 caracteres. Textos atuais.
3. TC-GLASS-LISTS: Produtos, Materiais, Acessórios e Clientes com atmosfera, cartões de vidro, título e botão de novo item legíveis.
4. TC-GLASS-EMPTY: vazio e "Carregando ..." visíveis no fundo escuro.
5. TC-GLASS-ACC: em Acessórios, alternar Tabela e Cards (precisa de pelo menos um acessório).
6. TC-GLASS-REDUCE: DevTools `prefers-reduced-transparency: reduce` no acesso e numa listagem.
7. TC-GLASS-QR: `/qr-scan/:id` inválido e um válido, se houver acessório.
8. TC-GLASS-SEARCH: campo Buscar produto (modais de cliente) com resultado e "Nenhum produto encontrado".
9. TC-GLASS-ASIDE: no desktop, fechar e abrir o menu numa listagem; a atmosfera acompanha.
10. TC-GLASS-DASH: Dashboard sem segunda camada de vidro; totais e cliques iguais.
11. TC-GLASS-SMOKE: criar, editar ou excluir um item e ler os totais.

## Segurança

N/A justificado: só visual. Sem alterar regra de `/auth` nem de `/qr-scan`. Sem schema, RLS, upload ou dado pessoal novo.

Registro: [`docs/implementation/app-glass.md`](../implementation/app-glass.md)
