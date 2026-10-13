import axios, { AxiosInstance } from 'axios';
import {
  ExternalPokemonDetails,
  PokemonExternalGateway,
} from '@domain/gateways/pokemon-external-gateway';
import { ServiceUnavailableError } from '@domain/errors/service-unavailable-error';

interface PokeApiPokemonResponse {
  base_experience: number | null;
  height: number;
  weight: number;
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
}

const POKE_API_SLUG = /^[a-z0-9-]+$/;

export class PokeApiAxiosGateway implements PokemonExternalGateway {
  private readonly http: AxiosInstance = axios.create({
    baseURL: 'https://pokeapi.co/api/v2',
    timeout: 3000,
  });

  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    const slug = this.toPokeApiSlug(name);

    if (!POKE_API_SLUG.test(slug)) {
      return null;
    }

    try {
      const { data } = await this.http.get<PokeApiPokemonResponse>(
        `/pokemon/${slug}`,
      );

      return this.toDomain(data);
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      if (error.response?.status === 404) {
        return null;
      }

      console.error(
        `[PokeAPI]: falha na consulta de "${slug}" (código: ${error.code}, status: ${error.response?.status ?? 'sem resposta'})`,
      );

      throw new ServiceUnavailableError(
        'O serviço externo da PokeAPI está temporariamente indisponível. Tente novamente mais tarde',
      );
    }
  }

  private toPokeApiSlug(name: string): string {
    return name.trim().toLowerCase().replace(/\s+/g, '-');
  }

  private toDomain(raw: PokeApiPokemonResponse): ExternalPokemonDetails {
    const officialArtwork = raw.sprites.other?.['official-artwork'];

    return {
      spriteUrl: officialArtwork?.front_default ?? null,
      baseExperience: raw.base_experience ?? null,
      height: raw.height,
      weight: raw.weight,
    };
  }
}
