/*
  Warnings:

  - Added the required column `password` to the `trainers` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "trainers" ADD COLUMN     "password" VARCHAR(255) NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
