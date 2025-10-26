/*
  Warnings:

  - You are about to drop the column `aadhaar` on the `Participant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Participant_aadhaar_eventId_key";

-- AlterTable
ALTER TABLE "Participant" DROP COLUMN "aadhaar";
