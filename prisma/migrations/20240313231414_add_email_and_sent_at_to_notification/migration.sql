/*
  Warnings:

  - Added the required column `email` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "sent_at" TIMESTAMP(3);
