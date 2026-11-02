import { Prisma, PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// Mesmo custo do BcryptHashProvider (src/infrastructure/providers).
const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

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

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida no .env`);
  }

  return value;
}

async function seedCatalog(): Promise<void> {
  for (const pokemon of catalog) {
    await prisma.pokemon.upsert({
      where: { id: pokemon.id },
      update: {},
      create: pokemon,
    });
  }

  console.log(`[seed]: ${catalog.length} pokémons garantidos no catálogo.`);
}

async function seedAdmin(): Promise<void> {
  const email = requireEnv('SEED_ADMIN_EMAIL').trim().toLowerCase();
  const password = requireEnv('SEED_ADMIN_PASSWORD');

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `SEED_ADMIN_PASSWORD deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`,
    );
  }

  const admin = await prisma.trainer.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Professor Carvalho',
      email,
      age: 50,
      city: 'Pallet Town',
      password: await hash(password, SALT_ROUNDS),
      role: Role.ADMIN,
    },
  });

  if (admin.role !== Role.ADMIN) {
    throw new Error(
      `O e-mail ${email} já pertence a um treinador sem papel ADMIN. ` +
        'Defina outro SEED_ADMIN_EMAIL ou promova a conta manualmente.',
    );
  }

  console.log(`[seed]: administrador ${email} garantido.`);
}

async function main(): Promise<void> {
  await seedCatalog();
  await seedAdmin();
}

main()
  .catch((error: unknown) => {
    console.error('[seed]: Falha ao popular o banco:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });