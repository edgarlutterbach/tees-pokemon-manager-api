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
    ConflictError: {
      status: 'error',
      statusCode: 409,
      message: 'Já existe um Pokémon cadastrado com este ID.',
    },
    TrainerBadRequestError: {
      status: 'error',
      statusCode: 400,
      message: 'E-mail inválido.',
    },
    TrainerConflictError: {
      status: 'error',
      statusCode: 409,
      message: 'Já existe um Treinador cadastrado com este e-mail.',
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

const endpointsFiles = [
  path.resolve(__dirname, '../../infrastructure/http/routes/pokemon-routes.ts'),
  path.resolve(__dirname, '../../infrastructure/http/routes/trainer-routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
