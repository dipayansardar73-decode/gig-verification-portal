/*
  Warnings:

  - You are about to drop the column `user` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `govtIdHash` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `lastVerifiedAt` on the `Worker` table. All the data in the column will be lost.
  - You are about to drop the column `policeStation` on the `Worker` table. All the data in the column will be lost.
  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workerId" TEXT,
    "action" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT
);
INSERT INTO "new_AuditLog" ("action", "id", "timestamp", "workerId") SELECT "action", "id", "timestamp", "workerId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
CREATE TABLE "new_Incident" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "category" TEXT,
    CONSTRAINT "Incident_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Incident" ("category", "date", "description", "id", "severity", "source", "type", "workerId") SELECT "category", "date", "description", "id", "severity", "source", "type", "workerId" FROM "Incident";
DROP TABLE "Incident";
ALTER TABLE "new_Incident" RENAME TO "Incident";
CREATE TABLE "new_Worker" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "govId" TEXT,
    "employer" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'LOW',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'VERIFIED',
    "photoUrl" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Worker" ("createdAt", "employer", "id", "name", "phone", "photoUrl", "riskLevel", "riskScore", "role", "status", "updatedAt") SELECT "createdAt", "employer", "id", "name", "phone", "photoUrl", "riskLevel", "riskScore", "role", "status", "updatedAt" FROM "Worker";
DROP TABLE "Worker";
ALTER TABLE "new_Worker" RENAME TO "Worker";
CREATE UNIQUE INDEX "Worker_phone_key" ON "Worker"("phone");
CREATE UNIQUE INDEX "Worker_govId_key" ON "Worker"("govId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
