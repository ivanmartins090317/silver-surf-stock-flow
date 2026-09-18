---
name: verifier
description: >-
  Verificador independente de feature no Silver Surf. Lê Spec + diff,
  roda comandos de Done e recusa Done sem evidência arquivo:linha.
  Use ao validar Done, no prompt 05-verificar, ou quando o usuário pedir
  para verificar/julgar a entrega. O autor do patch NÃO usa esta skill
  para se auto-aprovar.
---

# Verifier · Silver Surf

Autor ≠ verificador. Quem implementou não declara Done.

## Entrada

- Spec em `specs/` (aprovada)
- Diff da feature (git)
- Comandos do `AGENTS.md`

Não carregar PRD + 3 specs + SECURITY inteiro. SECURITY só se a fatia tocar auth/RLS/PII/QR.

## Checklist

1. Abrir a Spec. Para cada cenário: atendido / não, com **prova** (comando ou `arquivo:linha`).
2. Rodar:

```bash
npm run typecheck
npm run lint
npm run build
```

`npm test` só se a Spec exigir e o script existir.

3. Docs vivos existem e batem com o que foi entregue? (`implementation`, `manual-dev`, `PENDENCIAS`)
4. Diff de testes **já existentes**: se o patch afrouxou a suite, **recusar**.
5. Mudança fora do escopo da Spec? Listar.
6. Paths críticos tocados sem pedido? Recusar ou marcar review humano obrigatório.
7. Finding sem `arquivo:linha` não publica.

## Pré-patch (quando houver teste novo)

O teste novo deve falhar no HEAD anterior ao patch. Se não falha, o teste não prova nada: recusar.

## Saída

```md
## Resultado
- Autonomia usada:
- Spec:
- Comandos Done: (colar exit)
- Docs vivos (links):
- Segurança (`docs/SECURITY.md`): ok / N/A justificados
- Arquivos alterados:
- Cenários: lista com prova
- Riscos / dúvidas:
- Diff crítico para review humano: sim/não
- Done: sim/não
```

Só `Done: sim` se Spec + comandos + docs vivos estiverem verdes.
