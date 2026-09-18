# Fase 0 · Harness AI-native

| Status | Spec |
| --- | --- |
| concluída (código) · homologação do fluxo com o humano | contrato em `AGENTS.md` |

## O que esta fase entrega

- Constituição do agente (`AGENTS.md`) alinhada ao kit workflow-ai-native e ao workshop 2026-09-17 (prova, uma spec por sessão, autor ≠ verificador, auto-sizing).
- Docs vivos vazios de produto, mas já no formato certo.
- SECURITY.md honesto sobre a SPA + RLS.

Não entrega: Vitest, correção de QR, `process_production` nas migrations, papéis.

---

## Como trabalhar uma feature daqui pra frente

1. Colar `docs/workflow/prompts/01-research.md` (preencher o nome da feature).
2. Plano (`02`) → Spec (`03`) → aprovação humana.
3. Implementar (`04`) só depois.
4. Fechar docs (skill `close-phase`).
5. Pedir verificação (skill `verifier` ou prompt `05`).

Checklist diário: `docs/workflow/CHECKLIST-feature.md`.

---

## Homologação desta fase

- [ ] Abrir o repo no Cursor e confirmar que a rule always-on carrega
- [ ] Confirmar que `AGENTS.md` aparece no contexto
- [ ] Rodar `npm run typecheck`, `lint`, `build`

---

## Próxima fase

F1 (banco alinhado): [`docs/state/PENDENCIAS.md`](../state/PENDENCIAS.md)

Registro: [`docs/implementation/F0-harness-ai-native.md`](../implementation/F0-harness-ai-native.md)
