# Padrões de Segurança — Silver Surf Stock Flow

> Versão 0.1 · Base OWASP Top 10 (2021) · Stack: Vite SPA · Supabase (Auth, Postgres, Storage, RLS)
> Piloto de fábrica. PII: CPF, endereço, telefone, e-mail do cliente.
> Fonte única de verdade neste repo. Checklist DoD antes do merge quando a fatia tocar auth, dados ou QR.

## Princípios

1. Zero trust no cliente. A chave `anon` não é autorização.
2. Defense in depth: RLS **e** checagem no fluxo que muta (hoje o client chama o banco direto; RLS é a borda).
3. Menor privilégio.
4. Fail secure.
5. Segredos fora do código (`.env` / Vercel). Nunca `service_role` no bundle.

## Superfícies e fronteiras

| Superfície | Auth hoje | Regra dura |
| --- | --- | --- |
| `/auth` | Público (login **e cadastro aberto**) | Qualquer um que ache a URL cria conta e lê o estoque/clientes. Débito do piloto. |
| `/`, `/clients`, `/materials`, `/products`, `/accessories` | Sessão (`ProtectedRoute`) | RLS nas tabelas core exige `authenticated`. |
| `/qr-scan/:accessoryId` | **Fora** do `ProtectedRoute` | Tela pública. Mutação depende de RLS no remoto. Migrations locais **não** ligam RLS em `accessories` / `accessory_movements`. |
| Storage `accessories` | Sessão no upload | Bucket e policies precisam existir no projeto remoto. |

## OWASP Top 10 aplicado

| Item | Neste produto |
| --- | --- |
| **A01 Access Control** | RLS nas tabelas core. Cadastro aberto. Sem papéis. QR scan público. Acessórios sem RLS nas migrations locais. |
| **A02 Crypto** | HTTPS na Vercel. Sessão Supabase. CPF e endereço no Postgres: tratar como PII. |
| **A03 Injection** | Client Supabase (parametrizado). Validar inputs (Zod já existe no cadastro de cliente). Sem HTML cru de usuário. |
| **A04 Insecure Design** | Produção deve ser atômica (`process_production`). Baixa de estoque no client (acessório) é race-prone. |
| **A05 Misconfig** | Envs `VITE_SUPABASE_*` (viram bundle). Só URL + anon. Nunca service role. |
| **A06 Components** | Lockfile (`package-lock.json`). Dep nova só com aprovação. |
| **A07 Auth** | Email/senha. Sem rate limit visível no app. Signup habilitado. |
| **A08 Integrity** | Upload de imagem: tipo e 5MB no client. Nome de arquivo aleatório. Conferir MIME no Storage. |
| **A09 Logging** | `console.log` de user/sessão ainda no Layout/Auth. Não logar CPF. |
| **A10 SSRF** | Não há `fetch(url do usuário)`. N/A até existir. |

## Upload / Storage

- Fluxo atual: `src/components/ImageUpload.tsx` → bucket `accessories`.
- Regras: imagem only, max 5MB, path gerado no client.
- Bucket deve ser privado + policy autenticada. Sem URL pública permanente de PII.

## Segredos e ambiente

| Variável | Onde | Vai ao client? |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | `.env` / Vercel | sim (prefixo Vite) |
| `VITE_SUPABASE_ANON_KEY` | `.env` / Vercel | sim (esperado) |
| `service_role` | **nunca neste repo** | não |

Modelo: `.env.example`. Nunca commitar `.env`.

## Fora do escopo atual (piloto)

- Papéis (gestor / chão de fábrica)
- Rate limit de login
- Exportar/excluir LGPD automatizado
- Fechar signup (avaliar em F4)
- RLS de acessórios versionada (F1)

## Checklist de segurança (Definition of Done)

- [ ] RLS ativa nas tabelas tocadas (e policies existem de fato no remoto)
- [ ] Mutação de estoque não fica só no client se puder ir para RPC/transação
- [ ] Entradas validadas na borda (Zod ou equivalente)
- [ ] Sem `service_role` no client
- [ ] Upload: MIME/tamanho; path não previsível
- [ ] Sem CPF/telefone em `console.log` / toast genérico em erro
- [ ] Rota pública (`/qr-scan`) não permite baixa anônima se RLS estiver correta
- [ ] Audit de deps sem crítico aberto sem mitigação (quando a fatia adicionar dep)
