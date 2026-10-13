import { PokemonExternalGateway } from '@domain/gateways/pokemon-external-gateway';
import { NotFoundError } from '@domain/errors/not-found-error';
import { PokedexEntryDTO } from '@application/dtos/pokedex-entry-dto';

export class SearchPokedexUseCase {
  private externalGateway: PokemonExternalGateway;

  constructor(externalGateway: PokemonExternalGateway) {
    this.externalGateway = externalGateway;
  }

  async execute(name: string): Promise<PokedexEntryDTO> {
    const details = await this.externalGateway.findByName(name);

    if (!details) {
      throw new NotFoundError(
        'Pokémon não encontrado na base oficial da PokeAPI',
      );
    }

    return {
      pokedexNumber: details.pokedexNumber,
      name: details.name,
      types: [...details.types],
      spriteUrl: details.spriteUrl,
      baseExperience: details.baseExperience,
      height: details.height,
      weight: details.weight,
      stats: {
        hp: details.hp,
        attack: details.attack,
        defense: details.defense,
      },
    };
  }
}
