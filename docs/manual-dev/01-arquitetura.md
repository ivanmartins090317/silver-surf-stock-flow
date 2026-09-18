# Arquitetura · Silver Surf Stock Flow

Visão para quem implementa ou dá manutenção. Stack: **Vite SPA**, não Next.js.

---

## Princípios de domínio

1. **Sob encomenda:** o cliente carrega o pedido da prancha (hoje na mesma tabela `clients`).
2. **Receita (BOM):** o gestor define, no produto, quanto de cada insumo a prancha consome (`product_materials`).
3. **Baixa na produção:** botão Produzir chama `process_production` e consome a receita.
4. **QR no insumo** (intenção). Código atual gera QR no **acessório**.
5. **Acessório** é estoque paralelo (loja), fora da BOM.

---

## Mapa de pastas (legado Lovable)

```text
src/
├── App.tsx                 # rotas
├── pages/                  # Dashboard, Auth, Clients, Materials, Products, Accessories, QRScan
├── components/             # UI de domínio + shadcn em ui/
├── hooks/                  # React Query + Auth
└── integrations/supabase/  # client + types gerados
supabase/migrations/        # SQL versionado (incompleto vs types remotos)
docs/                       # memória viva (F0)
specs/                      # contrato por feature
```

Rotas: `/auth` público; `/qr-scan/:accessoryId` público; o restante atrás de `ProtectedRoute`.

---

## Fluxo de produção (happy path hoje)

1. Gestor cadastra materiais e estoque.
2. Cadastra produto + linhas de receita.
3. Clica Produzir N unidades.
4. RPC `process_production` (existe nos types; **não** está nas migrations locais).
5. Se ok, o client incrementa `product_stock`.

Lacuna vs encomenda: produzir sobe estoque de produto acabado; o cliente/pedido não vira ordem de produção.

---

## Superfícies

| Rota | Auth | Papel |
| --- | --- | --- |
| `/auth` | público | login e **signup aberto** |
| `/` | sessão | dashboard |
| `/products` | sessão | modelos + produzir |
| `/materials` | sessão | insumos |
| `/accessories` | sessão | acessórios + QR |
| `/clients` | sessão | cliente + pedido misturados |
| `/qr-scan/:id` | público | baixa manual de acessório |

---

## Banco (núcleo)

`materials` · `products` · `product_materials` · `product_stock` · `stock_movements` · `alerts` · `clients` · `accessories` · `accessory_movements` · `profiles`

Types também listam `production_orders` e a função `process_production`: conferir no remoto na F1.

---

## Comandos

```bash
npm i
npm run dev
npm run typecheck
npm run lint
npm run build
```

Envs: `.env.example` → `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
