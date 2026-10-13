import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'PokeManager API',
    description:
      'API de gerenciamento de Pokémons e Treinadores — disciplina Tópicos Especiais em Engenharia de Software (UFF)',
  },
  host: 'localhost:3333',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    { name: 'Pokemons', description: 'Endpoints de gerenciamento de Pokémons' },
    {
      name: 'Trainers',
      description: 'Endpoints de gerenciamento de Treinadores',
    },
    {
      name: 'Pokedex',
      description: 'Consultas diretas à PokéAPI oficial',
    },
  ],
  definitions: {
    Pokemon: {
      id: '25',
      name: 'Pikachu',
      type: 'ELECTRIC',
      rarity: 'RARE',
      hp: 35,
      attack: 55,
      defense: 40,
      nickname: 'Pika',
      level: 25,
      trainerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      spriteUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      baseExperience: 112,
      height: 4,
      weight: 60,
    },
    CreatedPokemon: {
      message: 'Pokémon cadastrado com sucesso!',
      data: { $ref: '#/definitions/Pokemon' },
    },
    PaginatedPokemons: {
      data: [{ $ref: '#/definitions/Pokemon' }],
      meta: {
        page: 1,
        limit: 10,
        total: 45,
      },
    },
    CreatePokemonDto: {
      $id: '25',
      $name: 'Pikachu',
      $type: 'ELECTRIC',
      $rarity: 'RARE',
      $hp: 35,
      $attack: 55,
      $defense: 40,
      nickname: 'Pika',
      level: 25,
      trainerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    },
    UpdatePokemonDto: {
      name: 'Raichu',
      type: 'ELECTRIC',
      rarity: 'RARE',
      hp: 50,
      attack: 65,
      defense: 45,
      nickname: 'Rai',
    },
    UpdatePokemonLevelDto: {
      $level: 25,
    },
    Trainer: {
      id: '3f2b8c1e-6a4d-4e7b-9c2a-1d5e8f7a6b3c',
      name: 'Ash Ketchum',
      email: 'ash@pokemon.com',
      age: 10,
      city: 'Pallet Town',
    },
    CreateTrainerDto: {
      $name: 'Ash Ketchum',
      $email: 'ash@pokemon.com',
      $age: 10,
      $city: 'Pallet Town',
    },
    BadRequestError: {
      status: 'error',
      statusCode: 400,
      message: 'Level deve ser um número inteiro entre 1 e 100.',
    },
    NotFoundError: {
      status: 'error',
      statusCode: 404,
      message: 'Pokémon não encontrado no catálogo.',
    },
    PokeApiNotFoundError: {
      status: 'error',
      statusCode: 404,
      message: 'Pokémon não encontrado na base oficial da PokeAPI',
    },
    ServiceUnavailableError: {
      status: 'error',
      statusCode: 503,
      message:
        'O serviço externo da PokeAPI está temporariamente indisponível. Tente novamente mais tarde',
    },
    ConflictError: {
      status: 'error',
      statusCode: 409,
      message: 'Já existe um Pokémon cadastrado com este ID.',
    },
    TrainerConflictError: {
      status: 'error',
      statusCode: 409,
      message: 'Já existe um registro cadastrado com este e-mail.',
    },
    TrainerNotFoundError: {
      status: 'error',
      statusCode: 404,
      message: 'Treinador não encontrado no banco de dados',
    },
    TrainerIdValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'id',
          message: 'O parâmetro id deve ser um UUID válido',
        },
      ],
    },
    TrainerTeam: {
      data: [{ $ref: '#/definitions/Pokemon' }],
      meta: {
        trainerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        total: 1,
        maxSize: 6,
      },
    },
    TrainerScopedValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'trainerId',
          message: 'O parâmetro trainerId deve ser um UUID válido',
        },
      ],
    },
    SearchPokemonsResult: {
      term: 'pika',
      totalMatches: 1,
      totalCatalog: 6,
      data: [{ $ref: '#/definitions/Pokemon' }],
    },
    ListPokemonsValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'minLevel',
          message: 'O parâmetro minLevel deve ser um número inteiro',
        },
      ],
    },
    CreatePokemonValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'trainerId',
          message: 'O campo trainerId deve ser um UUID válido',
        },
      ],
    },
    UpdatePokemonValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'name',
          message: 'O campo name deve ser um texto',
        },
      ],
    },
    CreateTrainerValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'email',
          message: 'Formato de e-mail inválido',
        },
      ],
    },
    PokedexEntry: {
      pokedexNumber: 25,
      name: 'pikachu',
      types: ['ELECTRIC'],
      spriteUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
      baseExperience: 112,
      height: 4,
      weight: 60,
      stats: {
        hp: 35,
        attack: 55,
        defense: 40,
      },
    },
    PokedexSearchValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'name',
          message: 'O parâmetro name é obrigatório',
        },
      ],
    },
    SearchBadRequestError: {
      status: 'error',
      statusCode: 400,
      message: 'O parâmetro name é obrigatório para a busca.',
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

const endpointsFiles = [
  path.resolve(__dirname, '../../infrastructure/http/routes/pokemon-routes.ts'),
  path.resolve(__dirname, '../../infrastructure/http/routes/trainer-routes.ts'),
  path.resolve(__dirname, '../../infrastructure/http/routes/pokedex-routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
