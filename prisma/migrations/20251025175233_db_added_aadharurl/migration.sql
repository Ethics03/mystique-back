/*
  Warnings:

  - You are about to drop the column `collegeId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[aadhaar,eventId]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[aadhaar]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `minSlots` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `aadhaarFileUrl` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idFileUrl` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aadhaarFileUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeIdUrl` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collegeName` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "isLocked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "maxSlots" SET DEFAULT 1,
ALTER COLUMN "minSlots" SET NOT NULL,
ALTER COLUMN "minSlots" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "aadhaarFileUrl" TEXT NOT NULL,
ADD COLUMN     "idFileUrl" TEXT NOT NULL,
ADD COLUMN     "submittedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "collegeId",
ADD COLUMN     "aadhaarFileUrl" TEXT NOT NULL,
ADD COLUMN     "collegeIdUrl" TEXT NOT NULL,
ADD COLUMN     "collegeName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Participant_aadhaar_eventId_key" ON "Participant"("aadhaar", "eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_aadhaar_key" ON "Profile"("aadhaar");
