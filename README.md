# PokéManager API

API RESTful para gerenciamento de Pokémons e Treinadores, desenvolvida na disciplina de **Tópicos Especiais em Engenharia de Software** (UFF — Instituto de Ciência e Tecnologia).

O projeto aplica princípios de **Clean Architecture**, com separação explícita entre regras de negócio e detalhes de infraestrutura. Nesta etapa, a persistência passa a ser feita em **PostgreSQL** através do **Prisma ORM**, todas as requisições são validadas com **Zod** e a API se integra à **PokéAPI** oficial para consultar Pokémons e permitir que Treinadores os capturem para seus times.

---

## Tecnologias

- **Node.js 20+** e **TypeScript 5.9** (modo `strict`)
- **Express 5** como framework HTTP
- **PostgreSQL 17** e **Prisma ORM 6** para persistência
- **Zod 4** para validação de corpo, parâmetros e query string
- **Axios** para integração com a [PokéAPI](https://pokeapi.co)
- **Docker** e **Docker Compose** para subir a API, o banco e o Adminer
- **Swagger UI** e **swagger-autogen** para documentação OpenAPI
- **ESLint** e **Prettier** para padronização de código
- **tsx** para execução em desenvolvimento
- **tsc-alias** para resolução dos path aliases no build

---

## Arquitetura

O código é organizado em quatro camadas, com dependências apontando sempre para dentro — a camada de Domínio não conhece nenhuma das outras.

```
src/
├── domain/                 # Regras de negócio puras, sem dependências externas
│   ├── entities/           # Pokemon, Trainer, PokemonType, PokemonRarity
│   ├── errors/             # AppError e exceções customizadas
│   ├── gateways/           # Contrato de acesso à PokéAPI
│   ├── repositories/       # Contratos de persistência (interfaces)
│   └── services/           # Regras de domínio, como a classificação de raridade
│
├── application/            # Orquestração dos casos de uso
│   ├── dtos/               # Objetos de transferência de dados
│   └── use-cases/          # Um caso de uso por operação
│
├── infrastructure/         # Implementações concretas
│   ├── database/           # Repositórios in-memory
│   │   └── prisma/         # Prisma Client, repositórios e mapeamento de erros
│   ├── gateways/           # PokéAPI via Axios e versão simulada em memória
│   ├── services/           # Serviços auxiliares
│   └── http/
│       ├── controllers/    # Adaptação HTTP <-> casos de uso
│       ├── errors/         # Erros específicos da camada HTTP
│       ├── middlewares/    # Validação com Zod e tratamento global de erros
│       ├── routes/         # Definição das rotas Express
│       └── schemas/        # Schemas Zod das requisições
│
└── main/                   # Composição e inicialização
    ├── config/             # Configuração do Swagger
    ├── factories/          # Injeção de dependências (repositórios, gateway e controllers)
    └── server.ts           # Ponto de entrada

prisma/
├── migrations/             # Histórico versionado do esquema do banco
├── schema.prisma           # Modelos Pokemon e Trainer
└── seed.ts                 # Carga inicial do catálogo
```

### Responsabilidade de cada camada

| Camada | Papel |
|---|---|
| **Domain** | Define entidades, regras de negócio, exceções e os contratos de repositório e de gateway. Não importa nada das outras camadas. |
| **Application** | Implementa os casos de uso, dependendo apenas das interfaces do Domínio. |
| **Infrastructure** | Fornece as implementações concretas: repositórios Prisma, gateway da PokéAPI, controllers, rotas, schemas e middlewares. |
| **Main** | Monta o grafo de dependências através de factories e sobe o servidor. |

### Inversão de dependência na prática

Os casos de uso recebem as implementações por construtor e conhecem apenas os contratos do Domínio:

| Contrato (Domain) | Implementação em uso | Alternativa disponível |
|---|---|---|
| `PokemonRepositoryContract` | `PrismaPokemonRepository` | `InMemoryPokemonRepository` |
| `TrainerRepositoryContract` | `PrismaTrainerRepository` | `InMemoryTrainerRepository` |
| `PokemonExternalGateway` | `PokeApiAxiosGateway` | `InMemoryPokemonGateway` |

A troca dos repositórios em memória pelo Prisma foi feita apenas em `src/main/factories/repositories.ts`, sem alterações nas camadas de Domínio e Aplicação. Da mesma forma, o gateway é escolhido em `src/main/factories/gateways.ts`, conforme a variável `USE_EXTERNAL_API`.

### Path aliases

Imports que cruzam fronteiras de camada usam aliases configurados no `tsconfig.json`:

```typescript
import { Pokemon } from '@domain/entities/pokemon';
import { ListPokemonsUseCase } from '@application/use-cases/list-pokemons-use-case';
```

Imports internos a uma mesma camada permanecem relativos.

---

## Como executar

### Pré-requisitos

- Node.js 20 ou superior
- npm
- Docker e Docker Compose

### Variáveis de ambiente

Copie o arquivo de exemplo e ajuste os valores, se necessário:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta HTTP da API (padrão: `3333`) |
| `NODE_ENV` | Ambiente de execução |
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Credenciais e nome do banco criado pelo contêiner |
| `POSTGRES_PORT` | Porta do PostgreSQL exposta na máquina local |
| `DATABASE_URL` | String de conexão usada pelo Prisma |
| `USE_EXTERNAL_API` | `true` consulta a PokéAPI oficial; `false` usa a versão simulada em memória |

### Opção 1: desenvolvimento local

O banco roda no Docker e a API roda na máquina, com hot reload.

```bash
# 1. Clone o repositório
git clone https://github.com/edgarlutterbach/tees-pokemon-manager-api.git

# 2. Acesse a pasta
cd tees-pokemon-manager-api

# 3. Configure as variáveis de ambiente
cp .env.example .env

# 4. Instale as dependências (gera também o Prisma Client)
npm install

# 5. Suba apenas o banco de dados
docker compose up -d db

# 6. Aplique as migrations
npx prisma migrate deploy

# 7. Popule o catálogo inicial
npx prisma db seed

# 8. Suba o servidor em modo de desenvolvimento
npm run dev
```

### Opção 2: aplicação completa via Docker

```bash
cp .env.example .env
docker compose up -d --build
```

O contêiner da API aplica as migrations automaticamente antes de iniciar. A carga inicial do catálogo deve ser executada a partir da máquina local, com `npm install` e `npx prisma db seed`, pois a imagem de produção não contém as dependências de desenvolvimento.

### Serviços disponíveis

| Serviço | Endereço |
|---|---|
| API | `http://localhost:3333` |
| Documentação Swagger | `http://localhost:3333/api/docs` |
| Adminer (cliente web do banco) | `http://localhost:8080` |

No Adminer, utilize o sistema **PostgreSQL**, o servidor **db** e as credenciais definidas no `.env`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Gera a documentação e sobe o servidor com hot reload |
| `npm run build` | Gera a documentação, compila para `dist/` e resolve os aliases |
| `npm run lint` | Verifica o código com ESLint e Prettier |
| `npm run lint:fix` | Corrige automaticamente os problemas identificados |
| `npm run swagger` | Regenera apenas o arquivo de especificação OpenAPI |

### Comandos do Prisma

| Comando | Descrição |
|---|---|
| `npx prisma migrate deploy` | Aplica as migrations pendentes |
| `npx prisma migrate dev` | Cria uma nova migration a partir de alterações no `schema.prisma` |
| `npx prisma db seed` | Executa o `prisma/seed.ts` |
| `npx prisma generate` | Regenera o Prisma Client |
| `npx prisma studio` | Abre uma interface web para navegar pelos dados |

---

## Documentação

Com o servidor em execução, a documentação interativa fica disponível em:

**http://localhost:3333/api/docs**

A especificação é gerada automaticamente a partir das anotações nas rotas, executada antes de cada `dev` e `build`.

---

## Endpoints

### Pokémons

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/v1/pokemons` | Lista o catálogo de forma paginada. Aceita `?type=`, `?minLevel=`, `?maxLevel=`, `?page=` e `?limit=` |
| `GET` | `/api/v1/pokemons/stats` | Retorna o total de Pokémons e a contagem por tipo |
| `GET` | `/api/v1/pokemons/:id` | Busca um Pokémon pelo identificador |
| `POST` | `/api/v1/pokemons` | Cadastra um Pokémon no catálogo, enriquecido com dados da PokéAPI. Aceita `trainerId` opcional |
| `PUT` | `/api/v1/pokemons/:id` | Atualiza os dados de um Pokémon existente |
| `PATCH` | `/api/v1/pokemons/:id/level` | Atualiza apenas o nível de um Pokémon |
| `DELETE` | `/api/v1/pokemons/:id` | Remove um Pokémon do catálogo |

### Treinadores

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/v1/trainers` | Cadastra um novo treinador. O e-mail é único |
| `DELETE` | `/api/v1/trainers/:id` | Remove um treinador. Seus Pokémons permanecem no catálogo, sem treinador |
| `POST` | `/api/v1/trainers/:trainerId/captures` | Captura um Pokémon pelo nome, com dados obtidos da PokéAPI |
| `GET` | `/api/v1/trainers/:trainerId/team` | Lista o time atual do treinador, na ordem de captura |

### Pokédex

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/v1/pokedex/search?name=` | Consulta um Pokémon diretamente na PokéAPI, sem acesso ao banco |

### Exemplos

Consultar um Pokémon na PokéAPI:

```bash
curl "http://localhost:3333/api/v1/pokedex/search?name=pikachu"
```

Cadastrar um novo treinador:

```bash
curl -X POST http://localhost:3333/api/v1/trainers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ash Ketchum",
    "email": "ash@pallet.com",
    "age": 10,
    "city": "Pallet"
  }'
```

Capturar um Pokémon para o time do treinador:

```bash
curl -X POST http://localhost:3333/api/v1/trainers/<id-do-treinador>/captures \
  -H "Content-Type: application/json" \
  -d '{
    "name": "charmander",
    "nickname": "Chama"
  }'
```

Listar o time do treinador:

```bash
curl "http://localhost:3333/api/v1/trainers/<id-do-treinador>/team"
```

Listar a primeira página de Pokémons do tipo fogo:

```bash
curl "http://localhost:3333/api/v1/pokemons?type=FIRE&page=1&limit=10"
```

---

## Regras de negócio

- **Limite do time:** um treinador pode ter no máximo **6 Pokémons**. Uma captura acima desse limite retorna `409`, e a regra vale também para o cadastro manual com `trainerId`.
- **Identificação da captura:** cada Pokémon capturado recebe um UUID gerado pela API. Assim, dois treinadores podem ter a mesma espécie, e um treinador pode ter mais de um exemplar dela.
- **Tipo:** a captura usa o tipo principal da PokéAPI (`slot` 1). Charizard (`FIRE`/`FLYING`), por exemplo, é salvo como `FIRE`. A API aceita os **18 tipos oficiais**.
- **Raridade:** definida a partir dos dados da espécie na PokéAPI, conforme a tabela abaixo.
- **Nível:** deve ser um número inteiro entre **1** e **100**. Pokémons capturados começam no nível 1.
- **Atributos:** `hp`, `attack` e `defense` devem ser inteiros maiores que zero.
- **E-mail do treinador:** é normalizado para minúsculas e não pode se repetir.

| Critério na espécie | Raridade | Exemplos |
|---|---|---|
| `is_legendary` ou `is_mythical` | `LEGENDARY` | Mewtwo, Mew |
| `capture_rate` até 45 | `RARE` | Charmander, Snorlax, Dragonite |
| `capture_rate` acima de 45 | `COMMON` | Pikachu, Raichu |

O `capture_rate` é a dificuldade oficial de captura, de 0 a 255: quanto menor, mais difícil capturar.

---

## Integração com a PokéAPI

A integração é feita pelo contrato `PokemonExternalGateway`, implementado pelo `PokeApiAxiosGateway`. Todas as consultas têm timeout de **3 segundos**.

| Uso | Recursos consultados | Dados aproveitados |
|---|---|---|
| `GET /pokedex/search` | `/pokemon/{name}` | Número da Pokédex, tipos, atributos base, arte oficial, experiência base, altura e peso |
| `POST /trainers/:trainerId/captures` | `/pokemon/{name}` e `/pokemon-species/{species}` | Os mesmos dados da busca, mais a raridade derivada da espécie |
| `POST /pokemons` e `PUT /pokemons/:id` | `/pokemon/{name}` | `spriteUrl`, `baseExperience`, `height` (decímetros) e `weight` (hectogramas) |

A consulta à espécie usa o nome que vem na resposta de `/pokemon`, pois formas alternativas (como `deoxys-normal`) só existem em `/pokemon-species` pelo nome da espécie (`deoxys`).

| Situação | Resposta da API |
|---|---|
| Nome inexistente na PokéAPI | `404` |
| PokéAPI fora do ar ou sem resposta em 3 segundos | `503` |

Com `USE_EXTERNAL_API=false`, a API utiliza uma versão simulada em memória, que reconhece apenas **Bulbasaur**, **Charmander**, **Pikachu** e **Raichu**, com os mesmos dados oficiais. Esse modo permite executar o projeto sem acesso à internet.

---

## Validação e tratamento de erros

Todas as rotas que recebem dados de entrada validam corpo, parâmetros de rota e query string com schemas Zod antes de chegar aos controllers. Quando mais de um campo é inválido, todos os problemas são devolvidos na mesma resposta.

Todas as exceções passam por um middleware global, e os erros seguem um formato único:

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Dados de entrada inválidos",
  "details": [
    { "field": "trainerId", "message": "O parâmetro trainerId deve ser um UUID válido" },
    { "field": "name", "message": "O campo name é obrigatório" }
  ]
}
```

| Código | Origem |
|---|---|
| `400` | Falha de validação Zod, JSON malformado ou relacionamento inexistente |
| `404` | Recurso não encontrado no banco ou na PokéAPI |
| `409` | Registro duplicado ou time do treinador completo |
| `503` | PokéAPI indisponível |
| `500` | Erro inesperado, registrado no console sem expor detalhes ao cliente |

Erros conhecidos do Prisma (`P2002`, `P2003` e `P2025`) são convertidos nas exceções de domínio correspondentes.

---

## Decisões de projeto

| Decisão | Justificativa |
|---|---|
| Contrato `PokemonExternalGateway` em `infrastructure/gateways/` | A especificação sugere `IPokeApiGateway` em `infrastructure/providers/`. O nome e o local seguem o enunciado da Aula 12 e o padrão `Contract` já usado nos repositórios, sem o prefixo `I`. |
| Captura com UUID, sem tabela própria | A coluna `id` comporta o UUID, então não foi preciso criar uma migration. O catálogo manual continua aceitando identificadores informados pelo usuário. |
| Enum ampliado para os 18 tipos | Sem isso, Pokémons dos tipos `NORMAL`, `GHOST` ou `ROCK`, entre outros, não poderiam ser capturados. A coluna `type` é texto, então não houve migration. |
| Raridade como serviço de domínio | A regra não depende de HTTP nem de banco e fica isolada em `domain/services`, pronta para testes unitários. |
| Vaga no time verificada antes da PokéAPI | Com o time completo, a captura retorna `409` sem fazer requisições externas. |
| Busca da Pokédex sem converter tipos para o enum | A resposta devolve os tipos exatamente como a PokéAPI informa, sem descartar nenhum. |

---

## Observações

- Os dados são persistidos no volume Docker `pgdata` e sobrevivem à reinicialização dos contêineres. Para apagar o banco, execute `docker compose down -v`.
- Os repositórios e o gateway em memória continuam no projeto e podem ser usados em testes, sem depender do banco ou da internet.