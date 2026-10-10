import { PrismaPokemonRepository } from '@infrastructure/database/prisma/prisma-pokemon-repository';
import { PrismaTrainerRepository } from '@infrastructure/database/prisma/prisma-trainer-repository';

const pokemonRepository = new PrismaPokemonRepository();
const trainerRepository = new PrismaTrainerRepository();

export { pokemonRepository, trainerRepository };
