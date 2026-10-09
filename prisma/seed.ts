import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const catalog: Prisma.PokemonCreateInput[] = [
  { id: '1', name: 'Bulbasaur', type: 'GRASS', rarity: 'COMMON', hp: 45, attack: 49, defense: 55 },
  { id: '4', name: 'Charmander', type: 'FIRE', rarity: 'COMMON', hp: 39, attack: 53, defense: 52 },
  { id: '5', name: 'Charmeleon', type: 'FIRE', rarity: 'COMMON', hp: 96, attack: 90, defense: 88 },
  { id: '7', name: 'Squirtle', type: 'WATER', rarity: 'COMMON', hp: 44, attack: 45, defense: 59 },
  {
    id: '50',
    name: 'Lugia',
    type: 'PSYCHIC',
    rarity: 'LEGENDARY',
    hp: 203,
    attack: 159,
    defense: 103,
    nickname: 'First one',
  },
];

async function main(): Promise<void> {
  for (const pokemon of catalog) {
    await prisma.pokemon.upsert({
      where: { id: pokemon.id },
      update: {},
      create: pokemon,
    });
  }

  console.log(`[seed]: ${catalog.length} pokémons garantidos no catálogo.`);
}

main()
  .catch((error: unknown) => {
    console.error('[seed]: Falha ao popular o banco:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });