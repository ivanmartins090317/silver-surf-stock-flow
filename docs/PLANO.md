# Plano · Silver Surf Stock Flow

Roadmap macro do piloto. Spec por fatia vive em `specs/`. Este arquivo não substitui Spec.

Última revisão: **2026-09-18**

---

## Decisões de domínio (fechadas com o mantenedor)

1. QR identifica **insumo** (não acessório). Código atual ainda gera QR no acessório.
2. Baixa automática da receita acontece na **produção**.
3. Fábrica trabalha sob **encomenda**.
4. Estágio: **piloto**.
5. Papéis (gestor vs chão de fábrica): analisar depois, não bloquear F0–F1.

---

## Fases

| Fase | Objetivo | Status |
| --- | --- | --- |
| **F0** | Harness AI-native + docs vivos + SECURITY | em código nesta entrega |
| **F1** | Banco alinhado ao código: versionar `process_production`, RLS de acessórios/estoque, gaps de alerta | não iniciada (depende do banco ligado) |
| **F2** | Pedido (cliente) ligado à produção daquela prancha | não iniciada |
| **F3** | QR no insumo (entrada/identificação no chão de fábrica) | não iniciada |
| **F4** | Papéis e cadastro fechado (se fizer sentido no piloto) | não iniciada |

Não implementar F1–F4 sem Spec aprovada.

---

## Fora deste plano (por enquanto)

- Migrar para Next.js
- Playwright / fábrica event-driven TLC
- Multi-tenant
- Financeiro completo / NF-e
