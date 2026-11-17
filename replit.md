# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

- Corridas conferem o caractere produzido; aulas mantêm a conferência da tecla física ABNT2. Motivo: a corrida não deve rejeitar uma letra correta por uso de Caps Lock ou outra posição de tecla, enquanto as aulas ensinam posições dos dedos.

## Product

DigitaKids: jogo em pt-BR para aprender a digitar (tema "Catar Milho"). Entrada por apelido, trilha de 15 aulas com teclado ABNT2, estrelas e pontos. Níveis: Aprendiz, Digitador, Ninja do Teclado, Mestre das Teclas.

## User preferences

- Salas de corrida devem aguardar até 20 minutos após desconexão antes de expirar.

## Gotchas

- A lógica de digitação (mapa ABNT2, WPM, precisão, estrelas, textos das lições) vive em `lib/typing-core`; servidor e navegador usam o mesmo código. Testes: `pnpm --filter @workspace/typing-core run test`.
- As 15 lições são gravadas no banco na inicialização da API (`seed-licoes.ts`), a partir de `lib/typing-core/src/licoes.ts`.
- Corridas: Socket.IO no servidor da API (`/api/socket.io`), salas em memória (`lib/corridas`), contrato compartilhado em `lib/typing-core/src/corrida.ts`. Os 60 textos são gravados na primeira execução.
- Sequência de dias e medalhas: contadas por dia civil em America/Sao_Paulo (`lib/sequencia.ts`); medalhas são conferidas no banco após cada lição e corrida (`lib/medalhas.ts`, catálogo gravado na inicialização). Mudou o catálogo? O perfil já mostra a lista nova.
- Recuperação de conta: o apelido é preso ao hash do IP. Conta nova recebe um código XXXX-XXXX (mostrado uma vez, guardado só como HMAC em `users.recovery_hash`). De outro IP, `/auth/entrar` exige `codigo` (409 sem, 403 errado, 429 após 5 erros). Contas antigas ganham código na primeira entrada pelo mesmo IP.
- Depois de mudar o OpenAPI: `pnpm --filter @workspace/api-spec run codegen`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
