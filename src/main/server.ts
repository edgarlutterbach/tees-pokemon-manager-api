import express, { Request, Response, NextFunction } from 'express';

const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

    next();
});

app.use(express.json())

interface Pokemon {
    id: string;
    name: string;
    type: string;
    hp: number;
}

let pokemons: Pokemon[] = [
  { id: '1', name: 'Bulbasaur', type: 'Grass', hp: 45 },
  { id: '4', name: 'Charmander', type: 'Fire', hp: 39 },
  { id: '7', name: 'Squirtle', type: 'Water', hp: 44 },
];

//? Lista todos os pokémons cadastrados e aplicar filtros (Status 200 OK)

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


//? Busca um pokémon pelo ID (Status 200 OK ou 404 Not Found)

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

//? Cadastra um novo pokémon (Status 201 Created ou 400 Bad Request)

app.post('/api/v1/pokemons', (req: Request, res: Response) => {
    const { id, name, type, hp } = req.body;

    if(!id || !name || !type || !hp) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes: id, name, type e hp são necessários.' });
    }

    const pokemonExists = pokemons.some(
        (p) => p.id === id
    );
    if(pokemonExists) {
        return res.status(400).json({ error: 'Pokémon com este ID já existe.' });
    }

    const newPokemon: Pokemon = {id, name, type, hp: Number(hp)};
    pokemons.push(newPokemon);

    return res.status(201).json({
        message: 'Pokémon cadastrado com sucesso!',
        data: newPokemon
    });
});

//? Remover um pokémon pelo ID

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

//? Atualizar um pokémon pelo ID
app.put('/api/v1/pokemons/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, type, hp } = req.body;

    const pokemon = pokemons.find(
        (p) => p.id === id
    );

    if(!pokemon) {
        return res.status(404).json({ error: 'Pokémon não encontrado no catálogo.' })
    }

    pokemons = pokemons.map((p) =>
        p.id == id ? { ...p, name: name ?? p.name, type: type ?? p.type, hp: hp !== undefined ? Number(hp) : p.hp} : p
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