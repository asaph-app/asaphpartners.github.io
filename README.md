# asaph partners docs

Documentação pública da API asaph para parceiros (Next.js).

## Env

```bash
cp .env.example .env.local
```

| Variable | Scope | Purpose |
|----------|--------|---------|
| `API_URL` | server | Railway internal URL used to validate JWTs (`GET /partner/test`) |
| `NEXT_PUBLIC_API_URL` | client | Public API base URL shown in the docs |

## Dev

```bash
npm run dev
```

## Deploy

Deploy as a Node server (e.g. Railway) on the same private network as the API so `API_URL` can reach the internal service. Do **not** use static GitHub Pages export — token validation needs the server route.
