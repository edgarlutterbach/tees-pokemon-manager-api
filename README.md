# PokéManager API

API RESTful para gerenciamento de um catálogo de Pokémons, desenvolvida na disciplina de **Tópicos Especiais em Engenharia de Software** (UFF — Instituto de Ciência e Tecnologia).

O projeto aplica princípios de **Clean Architecture**, com separação explícita entre regras de negócio e detalhes de infraestrutura. Nesta etapa, a persistência é feita em memória, através de um repositório que implementa o contrato definido na camada de Domínio.

---

## Tecnologias

- **Node.js 20+** e **TypeScript 5.9** (modo `strict`)
- **Express 5** como framework HTTP
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
│   ├── errors/             # DomainError e exceções customizadas
│   ├── repositories/       # Contratos de persistência (interfaces)
│   └── services/           # Serviços de domínio
│
├── application/            # Orquestração dos casos de uso
│   ├── dtos/               # Objetos de transferência de dados
│   └── use-cases/          # Um caso de uso por operação
│
├── infrastructure/         # Implementações concretas
│   ├── database/           # Repositórios in-memory
│   └── http/
│       ├── controllers/    # Adaptação HTTP <-> casos de uso
│       └── routes/         # Definição das rotas Express
│
└── main/                   # Composição e inicialização
    ├── config/             # Configuração do Swagger
    ├── factories/          # Injeção de dependências
    └── server.ts           # Ponto de entrada
```

### Responsabilidade de cada camada

| Camada | Papel |
|---|---|
| **Domain** | Define entidades, regras de negócio e os contratos de repositório. Não importa nada das outras camadas. |
| **Application** | Implementa os casos de uso, dependendo apenas das interfaces do Domínio. |
| **Infrastructure** | Fornece as implementações concretas: repositórios, controllers e rotas. |
| **Main** | Monta o grafo de dependências através de factories e sobe o servidor. |

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

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/edgarlutterbach/tees-pokemon-manager-api.git

# 2. Acesse a pasta
cd tees-pokemon-manager-api

# 3. Instale as dependências
npm install

# 4. Suba o servidor em modo de desenvolvimento
npm run dev
```

A API ficará disponível em `http://localhost:3333`.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Gera a documentação e sobe o servidor com hot reload |
| `npm run build` | Gera a documentação, compila para `dist/` e resolve os aliases |
| `npm run lint` | Verifica o código com ESLint e Prettier |
| `npm run lint:fix` | Corrige automaticamente os problemas identificados |
| `npm run swagger` | Regenera apenas o arquivo de especificação OpenAPI |

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
| `GET` | `/api/v1/pokemons` | Lista o catálogo. Aceita o filtro opcional `?type=` |
| `GET` | `/api/v1/pokemons/stats` | Retorna o total de Pokémons e a contagem por tipo |
| `GET` | `/api/v1/pokemons/:id` | Busca um Pokémon pelo identificador |
| `POST` | `/api/v1/pokemons` | Cadastra um novo Pokémon no catálogo |
| `PUT` | `/api/v1/pokemons/:id` | Atualiza os dados de um Pokémon existente |
| `DELETE` | `/api/v1/pokemons/:id` | Remove um Pokémon do catálogo |

### Treinadores

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/v1/trainers` | Cadastra um novo treinador |

### Exemplos

Listar todos os Pokémons do tipo fogo:

```bash
curl "http://localhost:3333/api/v1/pokemons?type=FIRE"
```

Cadastrar um novo Pokémon:

```bash
curl -X POST http://localhost:3333/api/v1/pokemons \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bulbasaur",
    "type": "GRASS",
    "rarity": "COMMON",
    "attack": 49,
    "defense": 49
  }'
```

---

## Observações

Os dados são mantidos **em memória** e são perdidos ao reiniciar o servidor. O catálogo inicial é populado pelas factories em `src/main/factories/`.