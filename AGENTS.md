# AGENTS.md

Constituição do **Silver Surf Stock Flow** para agentes de IA. Contrato read-only: o agente **não altera** este arquivo sem aprovação explícita.

Idioma de trabalho e respostas: **português (pt-BR)**. Copy de produto: nunca usar o travessão "—".

**O que é:** painel de gestão de fábrica de pranchas (piloto). Controle de insumos, receita por modelo (BOM), produção com baixa automática, clientes sob encomenda, acessórios e QR.

**Como a fábrica opera (decisões fechadas):**

| Decisão | Valor |
| --- | --- |
| Pedido | Sob **encomenda** (cliente = pedido da prancha) |
| Baixa de insumo | Na **produção**, pela receita do modelo |
| QR | Deve identificar o **insumo** (hoje está no acessório: débito conhecido) |
| Papéis | Ainda não. Analisar depois |
| Estágio | Piloto. Pode evoluir o modelo |

Docs de referência (não carregar todos de uma vez): `docs/PLANO.md`, `docs/SECURITY.md`, `docs/manual-dev/01-arquitetura.md`, `docs/state/`.

---

## Stack

- **App:** Vite · React 18 · TypeScript · React Router · Tailwind · shadcn/ui · TanStack Query
- **Backend:** Supabase (Auth, Postgres, Storage, RLS). Chamadas no client com a chave `anon`. A defesa real é RLS.
- **QR:** lib `qrcode` no client
- **Hosting:** Vercel (`vercel.json` SPA rewrite)
- **Testes:** hoje **não há** Vitest. Quando a Spec exigir teste, adicionar Vitest (domínio puro). Sem Playwright no piloto. Homologação de UI é manual.
- **Package manager:** npm

**Não migrar para Next.js** sem pedido explícito. Este repo é SPA Vite.

---

## Estrutura preferida

Código atual (legado Lovable): páginas em `src/pages/`, hooks em `src/hooks/`, SQL em `supabase/migrations/`.

Alvo ao evoluir (package by feature, fatia vertical):

```text
src/features/<dominio>/     # materials | products | production | clients | accessories | auth
specs/                      # contrato antes do código
docs/
  PLANO.md
  SECURITY.md
  implementation/           # o que foi entregue
  manual-dev/               # como funciona
  state/                    # ATUAL, PENDENCIAS, LESSONS
  workflow/                 # prompts e checklist
```

- Preferir Deep Modules (interface estreita, lógica junta)
- Nomes grepáveis (evitar `utils2`, `helper`, `dataProcessor`)
- Arquivo > ~300 linhas: dividir por domínio
- Sem mocks em dev/prod (só testes)
- UI em pt-BR; schema DB em inglês

---

## Pode

- Criar e editar arquivos da **feature atual** (e testes da Spec aprovada)
- Atualizar `docs/state/`, e no Done `docs/implementation/` + `docs/manual-dev/`
- Rodar `npm run typecheck`, `npm run lint`, `npm run build` (e `npm test` quando existir)
- Ler o restante do repo para contexto
- Propor mudanças fora do escopo (sem aplicar até aprovação)

## Não pode

- Alterar este `AGENTS.md` sem pedido explícito
- Alterar Spec **aprovada** em `specs/` sem pedido explícito
- Alterar `docs/SECURITY.md` / `docs/PLANO.md` sem pedido (exceto `docs/state/` e registros de Done)
- Mexer em **paths críticos** sem pedido explícito
- Criar migration / mudar schema / RLS sem aprovação
- Adicionar dependência nova sem aprovação
- Sobrescrever `.env*` sem confirmação explícita
- `git push`, merge em `main`, deploy, commit sem o humano pedir
- Instalar Playwright, Next.js, microserviço ou catálogo TLC inteiro

---

## Paths críticos (autonomia tight)

Só com pedido explícito + Spec aprovada + review humano:

- `src/hooks/useAuth.tsx`, `src/components/ProtectedRoute.tsx`, `src/pages/Auth.tsx`
- `src/integrations/supabase/**`
- `supabase/migrations/**`
- RPC `process_production` (quando versionada no SQL)
- `.env*`, `vercel.json`, CI/CD
- Este `AGENTS.md` e Specs já aprovadas

---

## Autonomia por tarefa

No início de cada feature, declarar um nível:

- `tight`: reviso plano, Spec e diff
- `medium`: reviso Spec e resultado dos testes/comandos
- `loose`: reviso só Done

**Default: `medium`.** Paths críticos sempre `tight`.

---

## Tamanho da feature (auto-sizing)

Não forçar Design + `tasks.md` de 20 itens.

| Escopo | Spec | Design / tasks | Execute |
| --- | --- | --- | --- |
| Small (≤3 arquivos, sem schema) | uma página curta | pula | implementa + verifica |
| Medium | spec com cenários + prova | inline no plano | implementa + verifica |
| Large (schema, auth, produção) | spec com IDs | plano curto obrigatório | por fatia vertical |

---

## Fluxo obrigatório por feature

1. **Research** (sem código). Atualizar `docs/state/ATUAL.md`.
2. **Plano curto** (sem código). Esperar aprovação se `tight`/`medium`.
3. **Spec** em `specs/` → **esperar aprovação humana**.
4. **Implementar** só o que a Spec pede.
5. **Atualizar docs vivos** (`implementation`, `manual-dev`, `PENDENCIAS`). Skill: `.cursor/skills/close-phase/SKILL.md`.
6. **Verificar Done** (comandos + prova da Spec). Preferir skill `.cursor/skills/verifier/SKILL.md` (autor ≠ verificador).
7. Parar e reportar evidências.

Prompts copy-paste: `docs/workflow/prompts/`. Checklist: `docs/workflow/CHECKLIST-feature.md`.

### Contexto (sessão)

- **Uma spec por sessão.** Vizinha: grep pontual, não abrir 3 specs + SECURITY inteiro "por precaução".
- `docs/SECURITY.md` só quando a fatia tocar auth, RLS, upload, QR público ou PII (CPF).
- Sessão nova por feature (ou por fatia). Exploração suja não entra na sessão que implementa.

### Segurança do agente

Não ligar na mesma sessão: dados da conta/PII + conteúdo não confiável da web + canal de saída amplo (e-mail, webhook, push). Trifecta letal.

---

## Verificação (prova, não sentimento)

O gargalo é **provar** que o código está certo. Quem constrói não declara Done sozinho.

1. **Teste nasce do cenário da Spec**, não do arquivo que o agente acabou de escrever. Cada cenário tem uma linha **Prova** (comando cujo exit code decide, ou TC manual nomeado).
2. **Pré-patch:** teste novo deve falhar no código de antes do patch. Se passar, o teste não testa nada: reescrever.
3. **Não "ajustar" teste legado** para ficar verde. Diff em `*.test.ts` / `*.spec.ts` já existente = red flag no review.
4. Finding de review sem `arquivo:linha` não publica.
5. Falha recorrente do agente: uma linha em `docs/state/LESSONS.md`. Não é diário.

Vitest ainda não está no `package.json`. Até existir: prova = `typecheck` + `lint` + `build` + TCs manuais da Spec. Não afrouxar critério; não inventar Playwright.

---

## DoD de documentação (obrigatório ao fechar fase)

Após evidências técnicas, atualizar:

| Documento | Conteúdo |
| --- | --- |
| `docs/implementation/F{N}-*.md` | O que foi entregue |
| `docs/manual-dev/{NN}-fase-{N}-*.md` | Como funciona e homologar |
| `docs/state/PENDENCIAS.md` | Implementado vs homologação |
| Índices `docs/implementation/README.md` e `docs/manual-dev/README.md` | Status |

---

## Done (definição objetiva)

Só declarar Done quando **TODOS** passarem:

```bash
npm run typecheck
npm run lint
npm run build
```

E, quando a Spec exigir testes automatizados:

```bash
npm test
```

Também:

- Cenários da Spec em verde (comando ou TC manual)
- Checklist aplicável de `docs/SECURITY.md` (N/A justificado)
- Nenhuma mudança fora do escopo sem aprovação
- Docs vivos atualizados
- Relatório no formato abaixo

## Como reportar ao final

```md
## Resultado
- Autonomia usada:
- Spec:
- Comandos Done:
- Docs vivos (links):
- Segurança (`docs/SECURITY.md`): ok / N/A justificados
- Arquivos alterados:
- Riscos / dúvidas:
- Diff crítico para review humano: sim/não
```
