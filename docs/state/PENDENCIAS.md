# Pendências · Silver Surf Stock Flow

Fonte viva do que **ainda falta implementar ou validar**. Atualizar ao concluir cada fase.

Última revisão: **2026-09-18**

---

## Fase 0 · Fechamento operacional

Código do harness entregue (`docs/implementation/F0-harness-ai-native.md`).

- [ ] Confirmar no Cursor que a rule always-on e o `AGENTS.md` carregam
- [x] `npm run typecheck` verde (2026-09-18)
- [ ] `npm run lint` verde (7 erros de legado: any / interface vazia / require no Tailwind)
- [ ] `npm run build` verde (falta `.env` com `VITE_SUPABASE_*`)
- [ ] Envs + banco ligados (humano)

---

## Fase 0 · Implementação

Referência: `docs/PLANO.md` · `AGENTS.md`

- [x] `AGENTS.md` + rule + spec template com Prova
- [x] Docs vivos + SECURITY + PLANO
- [x] Skills `close-phase` e `verifier`
- [x] Prompts 01–05 + checklist
- [x] Script `typecheck`

---

## Fase 1 · Banco alinhado ao código

Só depois das envs. Spec obrigatória.

- [ ] Versionar `process_production` nas migrations (hoje só nos types)
- [ ] Conferir `production_orders` no remoto vs local
- [ ] RLS em `accessories`, `accessory_movements`, `product_stock`
- [ ] Trigger de alerta de acessório não usar FK de `materials`
- [ ] Dashboard: total de clientes (hoje usa lista recente, máx. 5)

---

## Fase 2 · Encomenda → produção

- [ ] Ligar cliente/pedido ao produto e à baixa na produção
- [ ] Produzir para a encomenda, não só para estoque de prancha pronta

---

## Fase 3 · QR no insumo

- [ ] QR no material (intenção de domínio)
- [ ] Decidir o que fazer com o QR de acessório (manter, mover, ou os dois)

---

## Fase 4 · Papéis (analisar)

- [ ] Fechar signup público?
- [ ] Gestor vs chão de fábrica?

---

## Dívida técnica transversal

- [ ] `npm run lint` no legado (7 erros: `CreateProductModal`, `ProductionModal`, `useAuth`, `command.tsx`, `textarea.tsx`, `tailwind.config.ts`)
- [ ] Remover `console.log` de sessão/user em Layout, Auth, hooks
- [ ] `useProducts` inner join esconde produto sem `product_stock`
- [ ] `CreateProductModal` cria `product_stock` duas vezes
- [ ] Edição de produto não edita a receita (BOM)
- [ ] Observações do modal de produção não são gravadas
- [ ] Sem Vitest (adicionar na primeira Spec que exigir teste)
- [ ] Entrada de compra de insumo (não só CRUD do cadastro)
