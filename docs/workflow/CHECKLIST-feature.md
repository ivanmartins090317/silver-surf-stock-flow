# Checklist: 1 feature (uso diário)

## Antes de pedir código

- [ ] Feature nomeada
- [ ] Autonomia definida (`tight` / `medium` / `loose`)
- [ ] Tamanho (`small` / `medium` / `large`)
- [ ] `docs/state/ATUAL.md` atualizado
- [ ] Research feito (uma spec; sem SECURITY inteiro se a fatia não for auth)
- [ ] Plano curto feito
- [ ] Spec criada em `specs/` (cada cenário com **Prova**)
- [ ] Spec aprovada por mim

## Durante a implementação

- [ ] Agente só mexeu no escopo permitido
- [ ] Paths críticos só com pedido explícito
- [ ] Código por feature, não layers distantes
- [ ] Teste (quando houver) nasce da Spec e falhou no pré-patch
- [ ] Suite legado não foi "ajustada" para ficar verde

## Done

- [ ] Cenários da Spec em verde (prova)
- [ ] `npm run typecheck` / `lint` / `build`
- [ ] `npm test` se a Spec exigir
- [ ] Docs vivos atualizados
- [ ] Verifier (não o autor) leu Spec + evidência
- [ ] Relatório final no formato do `AGENTS.md`

## Review

- [ ] Se `medium/loose` e verde: conferi Spec vs resultado
- [ ] Se `tight` / crítico / falhou: li o diff
- [ ] Finding com `arquivo:linha`
- [ ] Commit/PR só se eu pedir
