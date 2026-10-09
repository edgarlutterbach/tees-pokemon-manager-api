-- Tabela de exemplo da Aula 08
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Pokémons
CREATE TABLE IF NOT EXISTS pokemons (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,
  rarity VARCHAR(20) NOT NULL,
  hp INTEGER NOT NULL CHECK (hp > 0),
  attack INTEGER NOT NULL CHECK (attack > 0),
  defense INTEGER NOT NULL CHECK (defense > 0),
  nickname VARCHAR(100),
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Treinadores
CREATE TABLE IF NOT EXISTS trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  age INTEGER NOT NULL CHECK (age > 0),
  city VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Catálogo inicial
INSERT INTO pokemons (id, name, type, rarity, hp, attack, defense, nickname) VALUES
  ('1',  'Bulbasaur',  'GRASS',   'COMMON',    45,  49,  55,  NULL),
  ('4',  'Charmander', 'FIRE',    'COMMON',    39,  53,  52,  NULL),
  ('5',  'Charmeleon', 'FIRE',    'COMMON',    96,  90,  88,  NULL),
  ('7',  'Squirtle',   'WATER',   'COMMON',    44,  45,  59,  NULL),
  ('50', 'Lugia',      'PSYCHIC', 'LEGENDARY', 203, 159, 103, 'First one')
ON CONFLICT (id) DO NOTHING;