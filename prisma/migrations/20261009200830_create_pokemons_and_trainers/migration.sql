-- CreateTable
CREATE TABLE "pokemons" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "rarity" VARCHAR(20) NOT NULL,
    "hp" INTEGER NOT NULL,
    "attack" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "nickname" VARCHAR(100),
    "level" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "age" INTEGER NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trainers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trainers_email_key" ON "trainers"("email");

-- Restrições CHECK (não representáveis no schema.prisma)
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_hp_check" CHECK ("hp" > 0);
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_attack_check" CHECK ("attack" > 0);
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_defense_check" CHECK ("defense" > 0);
ALTER TABLE "pokemons" ADD CONSTRAINT "pokemons_level_check" CHECK ("level" BETWEEN 1 AND 100);
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_age_check" CHECK ("age" > 0);