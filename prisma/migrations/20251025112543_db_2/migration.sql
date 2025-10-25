-- CreateEnum
CREATE TYPE "RegistrationType" AS ENUM ('CONTINGENT', 'PRINCIPAL');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "registrationType" "RegistrationType";
