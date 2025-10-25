/*
  Warnings:

  - You are about to drop the column `aadhaar` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Profile_aadhaar_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "aadhaar";
