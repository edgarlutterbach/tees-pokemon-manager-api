import { Prisma, Pokemon as PokemonModel } from '@prisma/client';
import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';
import { PokemonRarity } from '@domain/entities/pokemon-rarity';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { prisma } from './client';

type PokemonData = Omit<Prisma.PokemonCreateInput, 'id' | 'createdAt'>;

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

  async findByType(type: string): Promise<Pokemon[]> {
    const rows = await prisma.pokemon.findMany({
      where: {
        type: { equals: this.escapeLikePattern(type), mode: 'insensitive' },
      },
    });

    return rows.map((row) => this.toEntity(row));
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
    });
  }
}
