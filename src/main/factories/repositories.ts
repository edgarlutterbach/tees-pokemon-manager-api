import { PgPokemonRepository } from '@infrastructure/database/postgres/pg-pokemon-repository';
import { InMemoryTrainerRepository } from '@infrastructure/database/in-memory-trainer-repository';

const pokemonRepository = new PgPokemonRepository();
const trainerRepository = new InMemoryTrainerRepository();

export { pokemonRepository, trainerRepository };
