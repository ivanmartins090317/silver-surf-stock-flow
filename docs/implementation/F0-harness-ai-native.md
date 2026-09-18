# Fase 0 · Harness AI-native

| Campo | Valor |
| --- | --- |
| **Status** | concluída (código) · homologação do fluxo com o humano |
| **Plano** | `docs/PLANO.md` § F0 |
| **Spec** | bootstrap do kit (sem spec de produto; contrato em `AGENTS.md`) |

## Objetivo

Deixar o repositório operando como o workflow Ivan (research → spec → implementar → prova → docs vivos), com os hábitos de verificação do workshop TLC 2026-09-17. Sem mudar regra de negócio da fábrica nesta fase.

## Entregue

### Harness

| Área | Arquivos |
| --- | --- |
| Constituição | `AGENTS.md` |
| Rule always-on | `.cursor/rules/project-general.mdc` |
| Spec | `specs/TEMPLATE-feature.md` (cenário + **Prova**) |
| Skills | `.cursor/skills/close-phase/SKILL.md`, `.cursor/skills/verifier/SKILL.md` |
| Prompts | `docs/workflow/prompts/01` a `05` |
| Checklist | `docs/workflow/CHECKLIST-feature.md` |

### Docs vivos

| Área | Arquivos |
| --- | --- |
| Plano / segurança | `docs/PLANO.md`, `docs/SECURITY.md` |
| Implementation | este arquivo + índice |
| Manual | `docs/manual-dev/01-arquitetura.md` |
| State | `ATUAL.md`, `PENDENCIAS.md`, `LESSONS.md` |

### Qualidade do harness

- Script `npm run typecheck` (`tsc --noEmit --project tsconfig.app.json`)
- Ponte no `README.md`

### Fora desta fase (correto)

- Não alterou páginas, hooks, schema ou QR
- Não instalou Vitest / Playwright / skills TLC completas
- Não versionou `process_production` (F1)

## Evidências de Done

| Comando | Resultado |
| --- | --- |
| `npm run typecheck` | OK (exit 0) |
| `npm run lint` | Falhou: 7 erros já existentes no legado (any, empty interface, require no Tailwind). Esta fase não corrigiu produto. |
| `npm run build` | Falhou: sem `VITE_SUPABASE_*` no `.env` (guarda em `vite.config.ts`). Humano vai ligar as envs. |

## Manual do dev

[`docs/manual-dev/01-arquitetura.md`](../manual-dev/01-arquitetura.md) · [`docs/manual-dev/02-fase-0-harness.md`](../manual-dev/02-fase-0-harness.md)
