# DigitaKids

Plataforma educacional em português brasileiro para crianças aprenderem a digitar com os dez dedos. Combina aulas progressivas, orientação no teclado ABNT2, conquistas, ranking e corridas multiplayer com o tema visual “Catar Milho”.

## Índice

- [Funcionalidades](#funcionalidades)
- [Tecnologias e arquitetura](#tecnologias-e-arquitetura)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Como executar](#como-executar)
- [Comandos de desenvolvimento](#comandos-de-desenvolvimento)
- [Rotas e API](#rotas-e-api)
- [Banco de dados](#banco-de-dados)
- [Segurança e limitações](#segurança-e-limitações)
- [Solução de problemas](#solução-de-problemas)

## Funcionalidades

### Conta e perfil

- Entrada por apelido e avatar, sem cadastro por e-mail ou senha.
- Código de recuperação no formato `XXXX-XXXX`, apresentado na criação da conta.
- Recuperação do acesso pelo código ao entrar de outro endereço IP.
- Perfil com pontuação, nível, sequência de dias, desempenho e medalhas.
- Contagem dos dias de prática no fuso `America/Sao_Paulo`.

Guarde o código de recuperação: ele é exibido uma vez e o servidor armazena somente seu HMAC, não o código original.

### Aulas de digitação

- Trilha de 15 aulas, liberadas progressivamente após obter ao menos uma estrela na aula anterior.
- Teclado ABNT2 com orientação de dedos e acompanhamento dos acertos e erros.
- Métricas de velocidade em palavras por minuto (PPM/WPM), precisão e equilíbrio entre as mãos.
- Modo “sem olhar” disponível a partir da quinta aula.
- Estrelas de 0 a 3; é necessário atingir pelo menos 90% de precisão para ganhar uma estrela. Duas e três estrelas exigem também metas crescentes de velocidade e precisão.
- Pontos por desempenho; repetir uma aula sem melhorar rende menos pontos.
- Resultados e pontuação validados no servidor.

O cálculo básico de velocidade usa cinco caracteres por palavra. A precisão considera os toques corretos sobre o total de toques corretos e erros. As regras compartilhadas ficam em [`lib/typing-core`](lib/typing-core).

### Níveis

| Nível | Pontuação mínima |
| --- | ---: |
| Aprendiz | 0 |
| Digitador | 200 |
| Ninja do Teclado | 800 |
| Mestre das Teclas | 2.000 |

Os nomes dos níveis são independentes dos mascotes usados nas ilustrações.

### Corridas multiplayer

- Salas para 2 a 8 jogadores, acessadas por código de cinco caracteres.
- Anfitrião, confirmação de prontidão, contagem regressiva e progresso em tempo real.
- Catálogo inicial de 60 textos, resultados e opção de jogar novamente.
- Comunicação por Socket.IO em `/api/socket.io`.
- Prazo de até 20 minutos para manter o jogador após desconexão e expirar salas vazias. Sair explicitamente remove o jogador sem aguardar esse prazo.
- Reconexão do cliente com nova tentativa de entrada na sala.
- Limite de cinco minutos por corrida e encerramento até um minuto após o primeiro término.

**Diferença importante:** nas aulas, a validação ensina a posição física das teclas ABNT2. Nas corridas, considera o caractere produzido, evitando rejeitar uma letra correta por causa de Caps Lock, por exemplo.

### Ranking geral

- Inclui todas as contas cadastradas, inclusive jogadores com zero pontos.
- Abas de pontos acumulados e velocidade; a velocidade usa o melhor resultado de aula, ou zero quando não há resultado.
- Paginação de 20 jogadores e atualização automática a cada 30 segundos na tela.
- Posição global do jogador conectado disponível mesmo fora da página exibida.
- Desempate pelo identificador da conta em ordem crescente, correspondendo à ordem de cadastro.

## Tecnologias e arquitetura

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript 5.9, Vite 7 e Tailwind CSS 4 |
| Navegação e dados | Wouter e TanStack React Query |
| Componentes e animações | Radix UI, Lucide e Framer Motion |
| API | Node.js 24, Express 5 e logs estruturados com Pino |
| Tempo real | Socket.IO 4 |
| Persistência | PostgreSQL, Drizzle ORM e Drizzle Kit |
| Contratos e validação | OpenAPI, Orval e Zod |
| Organização | Monorepositório com pnpm workspaces |
| Testes do núcleo | Executor de testes do Node.js via `tsx` |

O navegador acessa a interface e a API pela mesma origem:

```text
Navegador
   |
   +-- /                  -> interface React
   +-- /api/*             -> API Express -> PostgreSQL
   +-- /api/socket.io/*    -> Socket.IO -> salas no processo da API
```

O pacote `typing-core` compartilha regras entre navegador e servidor. O contrato OpenAPI gera o cliente React e os esquemas de validação da API. A API calcula a pontuação e persiste os resultados.

## Estrutura do repositório

```text
artifacts/
  web/                 Interface principal do DigitaKids
    src/pages/         Entrada, início, aulas, corrida, ranking e perfil
    src/components/    Componentes visuais e de interação
    src/hooks/         Sessão e comunicação da interface
  api-server/          API HTTP e servidor Socket.IO
    src/routes/        Autenticação, aulas, ranking, perfil e saúde
    src/lib/           Sessões, identidade, medalhas, seeds e corridas
  mockup-sandbox/      Ambiente auxiliar de prévias de componentes
  fase1-video/         Vídeo de apresentação, separado do jogo
lib/
  typing-core/         Motor ABNT2, métricas, níveis, aulas e textos
  db/                  Conexão PostgreSQL e esquema Drizzle
  api-spec/            Contrato OpenAPI e configuração do Orval
  api-client-react/    Cliente HTTP e hooks gerados
  api-zod/             Tipos e validadores gerados
scripts/               Scripts auxiliares do workspace
```

Os artefatos de prévia de componentes e vídeo não são necessários para jogar.

## Pré-requisitos

- Node.js **24**, versão usada na configuração do projeto.
- pnpm **10**; o projeto exige pnpm e possui `pnpm-lock.yaml`.
- PostgreSQL disponível; o ambiente do projeto está configurado com PostgreSQL 16.
- Navegador moderno e teclado físico, preferencialmente ABNT2, para realizar as aulas.
- Fora do ambiente com roteamento gerenciado, um proxy reverso para unir interface, API e Socket.IO na mesma origem.

## Variáveis de ambiente

| Variável | Uso | Obrigatoriedade |
| --- | --- | --- |
| `DATABASE_URL` | String de conexão PostgreSQL, usada pela API e pelo Drizzle Kit | Obrigatória |
| `SESSION_SECRET` | Segredo para assinar sessões e proteger a recuperação de conta | Obrigatória para autenticação |
| `IP_SALT` | Sal usado no hash do IP; se ausente, é derivado de `SESSION_SECRET` | Opcional |
| `PORT` | Porta do processo iniciado; use portas diferentes para API e interface | Obrigatória em cada serviço |
| `BASE_PATH` | Caminho-base do Vite; use `/` para a interface principal | Obrigatória para a interface |
| `NODE_ENV` | Ambiente de execução; `production` ativa cookies seguros | Conforme o ambiente |
| `LOG_LEVEL` | Nível dos logs da API; padrão `info` | Opcional |

Não publique credenciais no repositório. Mantenha `SESSION_SECRET` e `IP_SALT` estáveis: alterá-los invalida sessões ou afeta o reconhecimento de contas e códigos de recuperação.

Os exemplos abaixo assumem que `DATABASE_URL` e `SESSION_SECRET` já foram fornecidos ao ambiente. A API não carrega automaticamente um arquivo `.env`; apenas criar esse arquivo não disponibiliza as variáveis ao processo.

## Como executar

Execute os comandos a partir da raiz do repositório.

### 1. Instalar as dependências

```bash
pnpm install --frozen-lockfile
```

### 2. Preparar um banco de desenvolvimento

Com `DATABASE_URL` configurada e o PostgreSQL acessível:

```bash
pnpm --filter @workspace/db run push
```

Esse comando sincroniza o esquema Drizzle com o banco selecionado. **Confira o destino antes de executar e revise qualquer solicitação de alteração destrutiva.** Não use como procedimento automático de atualização de produção.

Na inicialização, a API executa os seeds de aulas, textos de corrida e catálogo de medalhas. Não é necessário cadastrar esses conteúdos manualmente. Se um seed falhar, consulte os logs: a API pode continuar ouvindo a porta mesmo sem ter preparado todo o conteúdo.

### 3. Iniciar a API

Em um terminal com as variáveis de banco e sessão disponíveis:

```bash
PORT=8080 pnpm --filter @workspace/api-server run dev
```

O comando compila a API e inicia o servidor em desenvolvimento. Ele **não é um watcher**: após alterar o código do servidor, interrompa e execute novamente.

Para verificar se o servidor HTTP responde:

```bash
curl http://localhost:8080/api/healthz
```

Esse endpoint não substitui a conferência dos logs e dos fluxos que dependem do banco.

### 4. Iniciar a interface

Em outro terminal:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/web run dev
```

O Vite atualiza a interface durante o desenvolvimento. Porém, **acessar somente a porta 5173 não basta**: a configuração atual não inclui proxy de `/api` para a API.

### 5. Acessar interface e API pela mesma origem

No projeto já configurado, use os serviços da interface e da API e abra a prévia principal. O roteamento do ambiente encaminha `/api` ao servidor.

Para executar localmente fora desse ambiente, configure um proxy reverso. Exemplo de bloco `server` em uma configuração Nginx existente, dentro de `http`:

```nginx
server {
    listen 3000;
    server_name localhost;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }

    location / {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 120s;
    }
}
```

O exemplo pressupõe API na porta 8080, Vite na 5173 e Nginx instalado e iniciado separadamente. Abra **`http://localhost:3000`**. O proxy preserva o prefixo `/api` e permite WebSocket tanto para as corridas quanto para a atualização do Vite.

Em desenvolvimento HTTP, mantenha a API em `NODE_ENV=development`. Com `NODE_ENV=production`, o cookie de sessão exige HTTPS.

### Compilação e execução da API em produção

```bash
# Compilar os dois serviços principais
pnpm --filter @workspace/api-server run build
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/web run build

# Iniciar a API compilada, com banco e segredo disponíveis
NODE_ENV=production PORT=8080 pnpm --filter @workspace/api-server run start
```

A interface compilada fica em `artifacts/web/dist/public` e a API em `artifacts/api-server/dist`. Em produção, sirva os arquivos estáticos com fallback para `index.html` nas rotas da interface, encaminhe `/api` à API e habilite HTTPS e WebSocket. A API não serve automaticamente a interface.

Para inspecionar o build da interface localmente, existe `PORT=5173 BASE_PATH=/ pnpm --filter @workspace/web run serve`. Esse comando é uma prévia do Vite, não um servidor de produção; o encaminhamento de `/api` continua necessário.

## Comandos de desenvolvimento

| Objetivo | Comando |
| --- | --- |
| Instalar dependências pelo lockfile | `pnpm install --frozen-lockfile` |
| Sincronizar o esquema no banco de desenvolvimento | `pnpm --filter @workspace/db run push` |
| Regenerar cliente, tipos e validadores | `pnpm --filter @workspace/api-spec run codegen` |
| Testar motor e regras de digitação | `pnpm --filter @workspace/typing-core run test` |
| Verificar tipos das bibliotecas | `pnpm run typecheck:libs` |
| Verificar tipos da interface | `pnpm --filter @workspace/web run typecheck` |
| Verificar tipos da API | `pnpm --filter @workspace/api-server run typecheck` |
| Verificar tipos de todo o workspace | `pnpm run typecheck` |
| Verificar tipos e compilar todo o workspace | `pnpm run build` |

Os comandos globais abrangem também os artefatos auxiliares, não apenas o jogo. Os testes de `typing-core` verificam as regras compartilhadas; não substituem testes de integração da API ou testes de navegador.

Ao alterar [`lib/api-spec/openapi.yaml`](lib/api-spec/openapi.yaml), rode o codegen. Não edite manualmente os arquivos nas pastas `generated`.

## Rotas e API

### Telas da interface

As telas do jogo exigem uma sessão; sem ela, a aplicação apresenta a entrada.

| Rota | Tela |
| --- | --- |
| `/` | Início e resumo do jogador |
| `/aulas` | Trilha de aulas |
| `/aulas/:id` | Exercício de digitação |
| `/corridas` | Criação e entrada em corridas |
| `/sala/:codigo` | Sala de espera, corrida e resultados |
| `/ranking` | Classificação geral |
| `/perfil` | Perfil, desempenho e medalhas |

### Endpoints HTTP

Todos os caminhos abaixo já incluem o prefixo `/api`.

| Método | Caminho | Finalidade |
| --- | --- | --- |
| GET | `/api/healthz` | Saúde do servidor HTTP |
| POST | `/api/auth/entrar` | Criar conta, entrar ou recuperar acesso |
| GET | `/api/auth/eu` | Consultar jogador da sessão |
| POST | `/api/auth/sair` | Encerrar sessão |
| GET | `/api/licoes` | Listar aulas e progresso |
| POST | `/api/licoes/:id/resultado` | Validar e registrar resultado |
| GET | `/api/ranking?tipo=pontos&pagina=1` | Ranking paginado; `tipo` aceita `pontos` ou `velocidade` |
| GET | `/api/perfil` | Consultar perfil e conquistas |

Campos, respostas e erros estão definidos no [contrato OpenAPI](lib/api-spec/openapi.yaml).

### Eventos de tempo real

No caminho `/api/socket.io`, os principais eventos são:

- `sala:criar`, `sala:entrar` e `sala:sair`;
- `sala:pronto`, `sala:iniciar` e `sala:jogar-de-novo`;
- `corrida:progresso` e `sala:estado`.

Tipos, nomes e regras compartilhadas estão em [`lib/typing-core/src/corrida.ts`](lib/typing-core/src/corrida.ts). A conexão usa a sessão do jogador.

## Banco de dados

O esquema está em [`lib/db/src/schema`](lib/db/src/schema):

| Grupo | Tabelas |
| --- | --- |
| Jogadores | `users` |
| Ensino | `lessons`, `lesson_results` |
| Corridas | `race_texts`, `rooms`, `races`, `race_results` |
| Conquistas | `achievements`, `user_achievements` |

Contas, resultados e conquistas são persistidos no PostgreSQL. Apesar da existência de registros de salas no banco, **o estado ativo das salas e conexões fica na memória do processo da API**.

Faça backup antes de mudanças de esquema em bancos com dados reais. O comando `push-force` existe no pacote de banco, mas não deve ser usado como rotina: pode aplicar alterações sem a confirmação interativa.

## Segurança e limitações

- Sessão em cookie `dk_sessao`, assinado, `HttpOnly`, `SameSite=Lax` e com duração de 30 dias; em produção, também `Secure`.
- Identificação de retorno por hash do IP, não autenticação por e-mail, senha ou provedor externo. Mudança de rede pode exigir o código de recuperação.
- Código de recuperação protegido por HMAC e comparação segura; cinco erros de código podem bloquear novas tentativas por 15 minutos.
- Limites de requisição em rotas sensíveis e validação de apelidos e dados recebidos.
- Guardas no motor contra eventos sintéticos e repetição de tecla; verificações de progresso e velocidade no servidor das corridas. Essas medidas não representam garantia completa contra fraude.
- O proxy deve substituir corretamente `X-Forwarded-For` e evitar acesso público direto à API que permita falsificar esse cabeçalho, pois ele é usado na identificação por IP.
- As salas não sobrevivem a reinícios da API. Após um reinício, os participantes precisam criar outra sala.
- O estado das salas não é compartilhado entre réplicas. Múltiplas instâncias sem uma solução de estado compartilhado podem fazer um participante não encontrar a sala criada em outro processo.
- Algumas proteções de tentativas e limites também são mantidas em memória e reiniciam com o processo.
- As corridas não têm operação offline. Participantes devem acessar o mesmo ambiente e o mesmo processo responsável pela sala.

## Solução de problemas

| Sintoma | O que conferir |
| --- | --- |
| Erro de `PORT` ou `BASE_PATH` | Forneça as variáveis exigidas no comando do respectivo serviço |
| Banco indisponível ou tabelas inexistentes | Confira `DATABASE_URL`, disponibilidade do PostgreSQL e sincronização do esquema |
| Aulas ou textos não aparecem | Consulte os erros dos seeds no log da inicialização da API |
| Interface abre, mas a entrada falha | Verifique `/api/healthz`, encaminhamento de `/api` e `SESSION_SECRET` |
| Cookie não é mantido em teste local | Não use `NODE_ENV=production` sobre HTTP e acesse tudo pela mesma origem |
| Conta pede recuperação em outra rede | Use o código recebido na criação da conta |
| Sala não encontrada | Confira código, ambiente, reinício da API, expiração e uso de múltiplas instâncias |
| Corrida não conecta | Verifique sessão, encaminhamento de `/api/socket.io` e suporte a WebSocket |
| Letra correta não avança na aula | Confira layout ABNT2 e tecla física; aulas e corridas têm critérios diferentes |
| Alteração na API não aparece | Reinicie a API; seu comando `dev` não observa alterações automaticamente |
| Cliente não reflete mudanças no contrato | Execute novamente o codegen do OpenAPI |
