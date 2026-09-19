# Spec: Dashboard clean com glass Apple

- Status: `em_implementacao`
- Data: 2026-09-18
- Autonomia: `medium`
- Tamanho: `medium`
- Projeto: Silver Surf Stock Flow
- Pedido original: deixar o Dashboard mais limpo, com cards glass estilo Apple, seguindo o exemplo visual (KPIs, tabela de clientes recentes e cartões de alerta de estoque).

## 1. Objetivo

O operador vê o Dashboard com superfícies de vidro sutis, KPIs leves, clientes recentes em tabela e alertas de estoque legíveis no tema escuro. O restante do app não muda de visual.

## 2. Fora de escopo

- Alterar o `Card` compartilhado
- Redesign de Produtos, Materiais, Clientes, Acessórios, Auth, QR e aside
- Schema, RLS, dependência nova
- Devolver o botão Sair ao header

## 3. Atores e pré-condições

- Quem usa: operador autenticado
- O que precisa existir antes: sessão válida; dados de produtos, materiais, acessórios, clientes e alertas já existentes no banco

## 4. Comportamento esperado (cenários)

### Cenário 1: KPIs glass clicáveis

- Dado: o operador está no Dashboard
- Quando: ele clica em cada um dos 5 totais
- Então: Produtos, Materiais, Acessórios, Clientes e Alertas de Estoque levam às rotas atuais (`/products`, `/materials`, `/accessories`, `/clients`, `/materials`)
- Prova: TC-DASH-01 (manual). Clicar cada KPI e confirmar a rota.

### Cenário 2: Tabela de clientes recentes

- Dado: existem clientes cadastrados
- Quando: o Dashboard renderiza a seção Clientes Recentes
- Então: até 5 recentes aparecem numa tabela com colunas Nome do Cliente, ID, Data do Pedido e Valor Total, dentro de uma superfície só; clicar a linha abre `/clients?highlight=<id>`
- Prova: TC-DASH-02 (manual). Conferir colunas, até 5 linhas e o clique.

### Cenário 3: Lista vazia de clientes

- Dado: não há clientes
- Quando: o Dashboard renderiza Clientes Recentes
- Então: a tabela mostra “Nenhum cliente cadastrado ainda”
- Prova: TC-DASH-03 (manual ou estado vazio). Texto visível.

### Cenário 4: Alertas de estoque legíveis

- Dado: há material ou acessório abaixo ou no mínimo, ou alerta não lido
- Quando: o Dashboard renderiza Alertas de Estoque
- Então: o crítico usa ícone X e texto vermelho claro; o aviso usa triângulo e texto âmbar; não usa `red-700` nem `orange-700`; o crítico oferece “Ver estoque”
- Prova: TC-DASH-04 (manual). Ler o alerta no tema escuro.

### Cenário 5: Sem alertas

- Dado: estoque ok e nenhum alerta aberto
- Quando: o Dashboard renderiza Alertas de Estoque
- Então: mostra “Nenhum alerta no momento”
- Prova: TC-DASH-05 (manual). Texto visível.

### Cenário 6: Transparência reduzida

- Dado: o sistema pede transparência reduzida
- Quando: o Dashboard renderiza
- Então: as superfícies glass ficam opacas, sem blur, e o texto permanece visível
- Prova: TC-DASH-06. DevTools `prefers-reduced-transparency: reduce`.

### Cenário 7: Sem vazamento visual (obsoleto)

- Status: **obsoleto** após `specs/2026-09-18-app-glass.md`. A sucessora espalha o vidro e a atmosfera para acesso, Produtos, Materiais, Acessórios e Clientes.
- Dado: o patch do Dashboard está aplicado
- Quando: o operador abre Produtos, Materiais, Clientes, Acessórios e Auth
- Então: essas telas mantêm o visual anterior (sem glass nem atmosfera)
- Prova: TC-DASH-07 (manual). Abrir cada rota e comparar com o padrão legado de cards.

## 5. Regras de negócio

- O glass e a atmosfera existem só no Dashboard.
- O total de clientes no KPI é o total cadastrado, não o recorte dos 5 recentes.
- Material ou acessório com estoque abaixo do mínimo é crítico; no mínimo ou alerta unido da lista de alertas é aviso.
- Copy sem travessão.

## 6. Critérios de Done desta feature

- [ ] Todos os cenários acima passam (prova verde)
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] `npm run build` passa
- [ ] Testes da feature passam (se a Spec exigir Vitest): N/A, prova manual
- [ ] Checklist aplicável de `docs/SECURITY.md` (N/A justificado: sem auth, RLS, upload, QR público ou PII novo)
- [ ] Docs vivos atualizados: só se o humano pedir Done formal
- [ ] Nenhuma mudança fora do escopo sem aprovação

## 7. Escopo de arquivos permitido

- Pode editar:
  - `src/index.css`
  - `src/pages/Index.tsx`
  - `src/components/DashboardStatCard.tsx`
  - `src/components/DashboardRecentClients.tsx`
  - `src/components/DashboardStockAlerts.tsx`
  - `specs/dashboard-glass.md`
  - `docs/state/ATUAL.md`
- Não pode editar sem pedido:
  - `src/components/ui/card.tsx`
  - `src/hooks/useAuth.tsx`
  - `src/integrations/supabase/**`
  - `supabase/migrations/**`
  - `.env*`

## 8. Riscos e dúvidas abertas

- Contraste sobre vidro precisa ser visto no browser.
- Sem sessão no browser da IDE, TCs autenticados podem ficar pendentes.

## 9. Aprovação humana

- Aprovado por: plano da sessão + exemplo visual enviado pelo humano
- Data: 2026-09-18
- Observações: layout do exemplo (KPIs, tabela, cartões de alerta). Material glass só no Dashboard.
