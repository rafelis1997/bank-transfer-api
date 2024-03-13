/*
  Warnings:

  - The `type` column on the `clients` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "COMPANY_TYPE" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- AlterTable
ALTER TABLE "clients" DROP COLUMN "type",
ADD COLUMN     "type" "COMPANY_TYPE" NOT NULL DEFAULT 'INDIVIDUAL';
