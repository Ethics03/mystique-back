/*
  Warnings:

  - You are about to drop the column `minSlots` on the `Event` table. All the data in the column will be lost.
  - Added the required column `maxTeamSize` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minTeamSize` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "minSlots",
ADD COLUMN     "filledSlots" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxTeamSize" INTEGER NOT NULL,
ADD COLUMN     "minTeamSize" INTEGER NOT NULL,
ALTER COLUMN "maxSlots" DROP DEFAULT;
