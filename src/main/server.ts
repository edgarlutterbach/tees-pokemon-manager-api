import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    next();
});

app.use(express.json());

// Enum

enum PokemonType {
   FIRE = "FIRE",
   GRASS = "GRASS",
   WATER = "WATER",
   ELECTRIC = "ELECTRIC",
   PSYCHIC = "PSYCHIC",
}

enum PokemonRarity {
    COMMON = "COMMON",
    RARE = "RARE",
    LEGENDARY = "LEGENDARY",
}


// Interfaces

interface PokemonBattleStats {
    attack: number;
    defense: number;
    hp: number;
}

interface Pokemon extends PokemonBattleStats {
    id: string;
    name: string;
    type: PokemonType;
    rarity: PokemonRarity;
    nickname?: string;
}

let pokemons: Pokemon[] = [
  { id: '1', name: 'Bulbasaur', type: PokemonType.GRASS, rarity: PokemonRarity.COMMON, hp: 45, attack: 49, defense: 55 },
  { id: '4', name: 'Charmander', type: PokemonType.FIRE, rarity: PokemonRarity.COMMON, hp: 39, attack: 53, defense: 52 },
  { id: '7', name: 'Squirtle', type: PokemonType.WATER, rarity: PokemonRarity.COMMON, hp: 44, attack: 45, defense: 59 },
  { id: '5', name: 'Charmeleon', type: PokemonType.FIRE, rarity: PokemonRarity.COMMON, hp: 96, attack: 90, defense: 88 },
  { id: '50', name: 'Lugia', type: PokemonType.PSYCHIC, rarity: PokemonRarity.LEGENDARY, nickname: 'First one', hp: 203, attack: 159, defense: 103},
];

// domain/services

type AttackerStats = Pick<Pokemon, 'attack'>;
type DefenderStats = Pick<Pokemon, 'defense' | 'hp'>;

const MIN_DAMAGE = 0;

function calculatePokemonDamage(attacker: AttackerStats, defender: DefenderStats): string{
    const baseDamage = Math.max(MIN_DAMAGE, attacker.attack - defender.defense)
    const totalHpRemaining = Math.max(0, defender.hp - baseDamage);

    return "HP restante: " + totalHpRemaining;
}

// application/use-cases

// Rota de estatísticas gerais da API (Status 200 OK)

app.get('/api/v1/pokemons/stats', (req: Request, res: Response) => {
    const totalPokemons = pokemons.length;

    const typesCount = pokemons.reduce((acumulador, pokemon) => {
        acumulador[pokemon.type] = (acumulador[pokemon.type] ?? 0) + 1;
        return acumulador;
    }, {} as Record<PokemonType, number>);

    return res.status(200).json({
        totalPokemons,
        typesCount
    });
});

// Lista todos os pokémons cadastrados e aplicar filtros (Status 200 OK)

app.get('/api/v1/pokemons', (req: Request, res: Response) => {
    const { type } = req.query;

    if(type) {
        const filteredPokemons = pokemons.filter(
          (p) => p.type.toLowerCase() === String(type).toLowerCase()
        );

        return res.status(200).json(filteredPokemons);
    }

    return res.status(200).json(pokemons);
});


// Busca um pokémon pelo ID (Status 200 OK ou 404 Not Found)

app.get('/api/v1/pokemons/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const pokemon = pokemons.find(
        (p) => p.id === id
    );

    if(!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' })
    }

    return res.status(200).json(pokemon);
});

// Cadastra um novo pokémon (Status 201 Created ou 400 Bad Request)

app.post('/api/v1/pokemons', (req: Request, res: Response) => {
    const { id, name, type, rarity, nickname, hp, attack, defense } = req.body;

    if(!id || !name || !type || !rarity || !hp || !attack || !defense) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: id, name, type, rarity, hp, attack e defense são necessários.' });
    }

    if(!Object.values(PokemonType).includes(type.toUpperCase() as PokemonType)) {
        return res.status(400).json({ error: 'Tipo de pokémon informado inválido!' })
    }

    if(!Object.values(PokemonRarity).includes(rarity.toUpperCase() as PokemonRarity)) {
        return res.status(400).json({ error: 'Raridade de pokémon informado inválida!' })
    }

    const pokemonExists = pokemons.some(
        (p) => p.id === id
    );
    if(pokemonExists) {
        return res.status(400).json({ error: 'Pokémon com este ID já existe.' });
    }

    // Verificar como transformar o type para uppercase e passar no construtor

    const newPokemon: Pokemon = {
        id,
        name,
        type,
        rarity,
        nickname,
        hp: Number(hp),
        attack: Number(attack),
        defense: Number(defense)
    };
    pokemons.push(newPokemon);

    return res.status(201).json({
        message: 'Pokémon cadastrado com sucesso!',
        data: newPokemon
    });
});

// Remover um pokémon pelo ID (Status 200 OK ou 400 Bad Request)

app.delete('/api/v1/pokemons/:id', (req: Request, res: Response) => {
    const { id } = req.params;

    const pokemon = pokemons.find(
        (p) => p.id === id
    );

    if(!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' })
    }

    pokemons = pokemons.filter((p) => p.id !== id);
    
    return res.status(200).json({
        message: 'Pokémon excluído com sucesso!',
        data: pokemons
    });
});

// Atualizar um pokémon pelo ID (Status 200 OK ou 400 Bad Request)

app.put('/api/v1/pokemons/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type, rarity, nickname, hp, attack, defense } = req.body;

    const pokemon = pokemons.find(
        (p) => p.id === id
    );

    if(!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' })
    }

    pokemons = pokemons.map((p) =>
        p.id == id ? { ...p,
            name: name ?? p.name,
            type: type ?? p.type,
            rarity: rarity ?? p.rarity,
            nickname: nickname ?? p.nickname,
            hp: hp !== undefined ? Number(hp) : p.hp,
            attack: attack !== undefined ? Number(attack) : p.attack,
            defense: defense !== undefined ? Number(defense) : p.defense
        } : p
    );

    const pokemonAtualizado = pokemons.find((p) => p.id === id);

    return res.status(200).json({
        message: 'Pokémon editado com sucesso!',
        data: pokemonAtualizado
    });
});

const PORT = 3333;

app.listen(PORT, () => {
    console.log(`⚡️ [server]: API rodando em http://localhost:${PORT}`);
})