import { Pokemon } from '@domain/entities/pokemon';
import { PokemonType } from '@domain/entities/pokemon-type';
import { PokemonRarity } from '@domain/entities/pokemon-rarity';
import { PokemonRepositoryContract } from '@domain/repositories/pokemon-repository-contract';
import { postgresPool } from './connection';

interface PokemonRow {
  id: string;
  name: string;
  type: string;
  rarity: string;
  hp: number;
  attack: number;
  defense: number;
  nickname: string | null;
  level: number;
}

interface CountRow {
  total: string;
}

const SELECT_COLUMNS =
  'id, name, type, rarity, hp, attack, defense, nickname, level';

export class PgPokemonRepository implements PokemonRepositoryContract {
  async create(pokemon: Pokemon): Promise<void> {
    const query = `
      INSERT INTO pokemons (id, name, type, rarity, hp, attack, defense, nickname, level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.rarity,
      pokemon.hp,
      pokemon.attack,
      pokemon.defense,
      pokemon.nickname ?? null,
      pokemon.level,
    ]);
  }

  async findAll(): Promise<Pokemon[]> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons ORDER BY name`;
    const result = await postgresPool.query<PokemonRow>(query);

    return result.rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<Pokemon | null> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons WHERE id = $1`;
    const result = await postgresPool.query<PokemonRow>(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.toEntity(result.rows[0]);
  }

  async findByType(type: string): Promise<Pokemon[]> {
    const query = `SELECT ${SELECT_COLUMNS} FROM pokemons WHERE LOWER(type) = LOWER($1)`;
    const result = await postgresPool.query<PokemonRow>(query, [type]);

    return result.rows.map((row) => this.toEntity(row));
  }

  async searchByName(term: string): Promise<Pokemon[]> {
    const query = `
      SELECT ${SELECT_COLUMNS} FROM pokemons
      WHERE name ILIKE $1
      ORDER BY name
    `;
    const result = await postgresPool.query<PokemonRow>(query, [
      `%${this.escapeLikePattern(term)}%`,
    ]);

    return result.rows.map((row) => this.toEntity(row));
  }

  async count(): Promise<number> {
    const query = `SELECT COUNT(*) AS total FROM pokemons`;
    const result = await postgresPool.query<CountRow>(query);

    return Number(result.rows[0].total);
  }

  async update(pokemon: Pokemon): Promise<void> {
    const query = `
      UPDATE pokemons
      SET name = $2, type = $3, rarity = $4, hp = $5,
          attack = $6, defense = $7, nickname = $8, level = $9
      WHERE id = $1
    `;
    await postgresPool.query(query, [
      pokemon.id,
      pokemon.name,
      pokemon.type,
      pokemon.rarity,
      pokemon.hp,
      pokemon.attack,
      pokemon.defense,
      pokemon.nickname ?? null,
      pokemon.level,
    ]);
  }

  async updateLevel(id: string, newLevel: number): Promise<void> {
    const query = `UPDATE pokemons SET level = $2 WHERE id = $1`;
    await postgresPool.query(query, [id, newLevel]);
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM pokemons WHERE id = $1`;
    await postgresPool.query(query, [id]);
  }

  private escapeLikePattern(term: string): string {
    return term.replace(/[\\%_]/g, '\\$&');
  }

  private toEntity(row: PokemonRow): Pokemon {
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
