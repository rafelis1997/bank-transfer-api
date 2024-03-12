/*
  Warnings:

  - A unique constraint covering the columns `[holderId]` on the table `balances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "balances_holderId_key" ON "balances"("holderId");
