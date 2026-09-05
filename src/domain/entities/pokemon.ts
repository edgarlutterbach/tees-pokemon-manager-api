import { PokemonType } from './pokemon-type';
import { PokemonRarity } from './pokemon-rarity';
import { InvalidPokemonAttributesError } from '../errors/invalid-pokemon-attributes-error';

interface PokemonProps {
    id: string;
    name: string;
    type: PokemonType;
    rarity: PokemonRarity;
    hp: number;
    attack: number;
    defense: number;
    nickname?: string;
}

export class Pokemon {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _type: PokemonType;
    private readonly _rarity: PokemonRarity;
    private readonly _hp: number;
    private readonly _attack: number;
    private readonly _defense: number;
    private readonly _nickname?: string;

    constructor(props: PokemonProps) {
        if (props.hp <= 0) {
            throw new InvalidPokemonAttributesError('HP deve ser maior que zero.');
        }
        if (props.attack <= 0) {
            throw new InvalidPokemonAttributesError('Attack deve ser maior que zero.');
        }
        if (props.defense <= 0) {
            throw new InvalidPokemonAttributesError('Defense deve ser maior que zero.');
        }

        this._id = props.id;
        this._name = props.name;
        this._type = props.type;
        this._rarity = props.rarity;
        this._hp = props.hp;
        this._attack = props.attack;
        this._defense = props.defense;
        this._nickname = props.nickname;
    }

    get id(): string { 
        return this._id; 
    }
    
    get name(): string { 
        return this._name; 
    }
    
    get type(): PokemonType { 
        return this._type; 
    }
    
    get rarity(): PokemonRarity { 
        return this._rarity; 
    }
    
    get hp(): number { 
        return this._hp; 
    }
    
    get attack(): number { 
        return this._attack; 
    }
    
    get defense(): number { 
        return this._defense; 
    }
    
    get nickname(): string | undefined { 
        return this._nickname; 
    }
}