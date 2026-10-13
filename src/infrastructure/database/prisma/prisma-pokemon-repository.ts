import { Prisma, Pokemon as PokemonModel } from '@prisma/client';
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';
import { PokemonRarity } from '@domain/entities/pokemon-rarity';
import {
  PaginatedPokemons,
  Pagination,
  PokemonFilters,
  PokemonRepositoryContract,
} from '@domain/repositories/pokemon-repository-contract';
import { prisma } from './client';

type PokemonData = Omit<Prisma.PokemonUncheckedCreateInput, 'id' | 'createdAt'>;

export class PrismaPokemonRepository implements PokemonRepositoryContract {
  async create(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.create({
      data: { id: pokemon.id, ...this.toPersistence(pokemon) },
    });
  }

  async findAll(): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({ orderBy: { name: 'asc' } });

    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<Pokemon | null> {
    const row = await prisma.pokemon.findUnique({ where: { id } });

    return row ? this.toEntity(row) : null;
  }

  async findByFilters(
    { type, minLevel, maxLevel }: PokemonFilters,
    { page, limit }: Pagination,
  ): Promise<PaginatedPokemons> {
    const where: Prisma.PokemonWhereInput = {
      type,
      level: { gte: minLevel, lte: maxLevel },
    };

    const [rows, total] = await prisma.$transaction(
      [
        prisma.pokemon.findMany({
          where,
          orderBy: [{ name: 'asc' }, { id: 'asc' }],
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.pokemon.count({ where }),
      ],
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );

    return { items: rows.map((row) => this.toEntity(row)), total };
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: {
        name: {
          contains: this.escapeLikePattern(term),
          mode: 'insensitive',
        },
      },
      orderBy: { name: 'asc' },
    });

    return rows.map((row) => this.toEntity(row));
  }

  async count(): Promise<number> {
    return prisma.pokemon.count();
  }

  async countByTrainerId(trainerId: string): Promise<number> {
    return prisma.pokemon.count({ where: { trainerId } });
  }

  async update(pokemon: Pokemon): Promise<void> {
    await prisma.pokemon.update({
      where: { id: pokemon.id },
      data: this.toPersistence(pokemon),
    });
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    await prisma.pokemon.update({
      where: { id },
      data: { level: newLevel },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.pokemon.delete({ where: { id } });
  }

  private escapeLikePattern(term: string): string {
    return term.replace(/[\\%_]/g, '\\$&');
  }

  private toPersistence(pokemon: Pokemon): PokemonData {
    return {
      name: pokemon.name,
      type: pokemon.type,
      rarity: pokemon.rarity,
      hp: pokemon.hp,
      attack: pokemon.attack,
      defense: pokemon.defense,
      nickname: pokemon.nickname ?? null,
      level: pokemon.level,
      trainerId: pokemon.trainerId ?? null,
      spriteUrl: pokemon.spriteUrl ?? null,
      baseExperience: pokemon.baseExperience ?? null,
      height: pokemon.height ?? null,
      weight: pokemon.weight ?? null,
    };
  }

  private toEntity(row: PokemonModel): Pokemon {
    return new Pokemon({
      id: row.id,
      name: row.name,
      type: row.type as PokemonType,
      rarity: row.rarity as PokemonRarity,
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      nickname: row.nickname ?? undefined,
      level: row.level,
      trainerId: row.trainerId ?? undefined,
      spriteUrl: row.spriteUrl ?? undefined,
      baseExperience: row.baseExperience ?? undefined,
      height: row.height ?? undefined,
      weight: row.weight ?? undefined,
    });
  }
}
