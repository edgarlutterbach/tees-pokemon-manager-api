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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Cole apenas o token retornado por POST /api/v1/sessions, sem o prefixo Bearer.',
      },
    },
  },
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
    {
      name: 'Sessions',
      description: 'Autenticação de Treinadores',
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
      role: 'USER',
    },
    CreateTrainerDto: {
      $name: 'Ash Ketchum',
      $email: 'ash@pokemon.com',
      $age: 10,
      $city: 'Pallet Town',
      $password: 'pikachu123',
    },
    UpdatePokemonLevelValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'level',
          message: 'O nível deve ser no máximo 100',
        },
      ],
    },
    PokemonIdValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'id',
          message: 'O parâmetro id deve ter no máximo 50 caracteres',
        },
      ],
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
    UpdateTrainerRoleDto: {
      $role: 'ADMIN',
    },
    UpdatedTrainerRole: {
      message: 'Papel do treinador atualizado com sucesso!',
      data: { $ref: '#/definitions/Trainer' },
    },
    UpdateTrainerRoleValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'role',
          message: 'O campo role deve ser um dos valores: USER, ADMIN',
        },
      ],
    },
    CapturePokemonDto: {
      $name: 'charmander',
      nickname: 'Chama',
    },
    CapturedPokemon: {
      message: 'Pokémon capturado com sucesso!',
      data: {
        id: '9b1f3c2e-7d4a-4f6b-8e2c-5a1d3f7b9c0e',
        name: 'Charmander',
        type: 'FIRE',
        rarity: 'RARE',
        hp: 39,
        attack: 52,
        defense: 43,
        nickname: 'Chama',
        level: 1,
        trainerId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
        spriteUrl:
          'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
        baseExperience: 62,
        height: 6,
        weight: 85,
      },
    },
    CapturePokemonValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'name',
          message: 'O campo name é obrigatório',
        },
      ],
    },
    TeamFullError: {
      status: 'error',
      statusCode: 409,
      message:
        'O treinador já possui o limite máximo de 6 Pokémons em seu time',
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
    AuthenticateTrainerDto: {
      $email: 'ash@pokemon.com',
      $password: 'pikachu123',
    },
    Session: {
      message: 'Login realizado com sucesso!',
      data: {
        trainer: { $ref: '#/definitions/Trainer' },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
    SessionValidationError: {
      status: 'error',
      statusCode: 400,
      message: 'Dados de entrada inválidos',
      details: [
        {
          field: 'password',
          message: 'O campo password é obrigatório',
        },
      ],
    },
    UnauthorizedError: {
      status: 'error',
      statusCode: 401,
      message: 'Token JWT inválido ou expirado',
    },
    ForbiddenError: {
      status: 'error',
      statusCode: 403,
      message: 'Você não tem permissão para acessar este recurso',
    },
    InvalidCredentialsError: {
      status: 'error',
      statusCode: 401,
      message: 'E-mail ou senha inválidos',
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
  path.resolve(__dirname, '../../infrastructure/http/routes/session-routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
