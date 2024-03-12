-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_balances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "transferId" TEXT,
    "holderId" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME,
    CONSTRAINT "balances_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "transfers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "balances_holderId_fkey" FOREIGN KEY ("holderId") REFERENCES "clients" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_balances" ("amount", "created_at", "holderId", "id", "transferId", "updated_at") SELECT "amount", "created_at", "holderId", "id", "transferId", "updated_at" FROM "balances";
DROP TABLE "balances";
ALTER TABLE "new_balances" RENAME TO "balances";
CREATE UNIQUE INDEX "balances_transferId_key" ON "balances"("transferId");
CREATE UNIQUE INDEX "balances_holderId_key" ON "balances"("holderId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
