import { PgPokemonRepository } from '@infrastructure/database/postgres/pg-pokemon-repository';
import { PgTrainerRepository } from '@infrastructure/database/postgres/pg-trainer-repository';

const pokemonRepository = new PgPokemonRepository();
const trainerRepository = new PgTrainerRepository();

export { pokemonRepository, trainerRepository };
