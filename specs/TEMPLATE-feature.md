# Spec: <Nome da Feature>

- Status: `draft` | `aprovada` | `em_implementacao` | `done`
- Data: YYYY-MM-DD
- Autonomia: `tight` | `medium` | `loose`
- Tamanho: `small` | `medium` | `large`
- Projeto: Silver Surf Stock Flow
- Pedido original:

## 1. Objetivo

Em 1–3 frases: qual resultado de negócio essa feature entrega.

## 2. Fora de escopo

Liste o que NÃO entra agora.

## 3. Atores e pré-condições

- Quem usa:
- O que precisa existir antes:

## 4. Comportamento esperado (cenários)

Linguagem de domínio. Evite leakage técnico (`POST /api/...`, nome de tabela, nome de classe).

Adjetivo ("rápido", "claro") não é critério. Prefira EARS quando ajudar: `WHEN <condição> THE SYSTEM SHALL <comportamento observável>`.

Cada cenário precisa de **Prova**: comando/teste cujo exit code decide, ou TC manual nomeado (enquanto não houver Vitest).

### Cenário 1: <caminho feliz>

- Dado:
- Quando:
- Então:
- Prova:

### Cenário 2: <erro / borda>

- Dado:
- Quando:
- Então:
- Prova:

### Cenário 3: <outro caso importante>

- Dado:
- Quando:
- Então:
- Prova:

## 5. Regras de negócio

- Regra 1:
- Regra 2:

## 6. Critérios de Done desta feature

- [ ] Todos os cenários acima passam (prova verde)
- [ ] `npm run typecheck` passa
- [ ] `npm run lint` passa
- [ ] `npm run build` passa
- [ ] Testes da feature passam (se a Spec exigir Vitest)
- [ ] Checklist aplicável de `docs/SECURITY.md` (N/A justificado)
- [ ] Docs vivos atualizados (`implementation`, `manual-dev`, `PENDENCIAS`)
- [ ] Nenhuma mudança fora do escopo sem aprovação

## 7. Escopo de arquivos permitido

- Pode editar:
  - `src/...` (restringir à fatia)
- Não pode editar sem pedido:
  - `src/hooks/useAuth.tsx`
  - `src/integrations/supabase/**`
  - `supabase/migrations/**`
  - `.env*`

## 8. Riscos e dúvidas abertas

-

## 9. Aprovação humana

- Aprovado por:
- Data:
- Observações:
