# DigitaKids

Jogo para crianças aprenderem a digitar com as dez dedos (pt-BR).

## Estrutura
- artifacts/web: React + Vite + Tailwind
- artifacts/api-server: Express (API)
- lib/db: tabelas (Drizzle + PostgreSQL)
- lib/api-spec: contrato OpenAPI

## Variáveis de ambiente
- DATABASE_URL: conexão PostgreSQL
- SESSION_SECRET: assina a sessão (cookie HttpOnly)
- IP_SALT (opcional): sal do hash SHA-256 do IP; se ausente, é derivado de SESSION_SECRET

## Rodar
- pnpm --filter @workspace/db run push (cria/atualiza as tabelas)
- pnpm --filter @workspace/api-spec run codegen (regenera o cliente da API)
