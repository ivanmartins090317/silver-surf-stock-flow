---
name: close-phase
description: >-
  Checklist para fechar fase ou spec no Silver Surf: atualizar
  docs/implementation, docs/manual-dev e docs/state/PENDENCIAS.md após
  implementação técnica. Use ao concluir feature, fechar fase, "finalize
  a implementação" ou antes de marcar spec como pronta.
---

# Fechamento de fase · Silver Surf

Piloto de fábrica de pranchas. Documentar em **pt-BR**. Sem travessão "—" na copy.

## Quando usar

- Spec aprovada implementada
- Usuário pede para fechar a fase / finalizar a implementação
- **Antes** de reportar a entrega como concluída

## Pré-requisito técnico

```bash
npm run typecheck
npm run lint
npm run build
# npm test          # se a Spec exigir
# npm run db:push   # se migration (só com aprovação)
```

## Checklist de documentação (obrigatório)

1. **`docs/implementation/F{N}-*.md`** + índice `docs/implementation/README.md`
2. **`docs/manual-dev/{NN}-fase-{N}-*.md`** + índice `docs/manual-dev/README.md`
3. **`docs/state/PENDENCIAS.md`**: `[x]` código, `[ ]` homologação manual
4. Limpar ou atualizar `docs/state/ATUAL.md`

## Ordem

1. Evidências técnicas
2. Implementation + README
3. Manual-dev + README
4. PENDENCIAS.md + ATUAL.md
5. Reportar links ao humano
6. **Não** declarar Done sozinho: apontar para a skill `verifier`

## Não fazer

- Alterar Spec sem pedido explícito
- Marcar homologação manual como feita se não rodou
- Sobrescrever `.env`

## Modelos

- `docs/implementation/F0-harness-ai-native.md`
- `docs/manual-dev/02-fase-0-harness.md`
- Kit vault: `10 Dev/Referencias/workflow-ai-native/docs-vivos/`
