/*
  Warnings:

  - You are about to drop the column `distance` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `reps` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `rest` on the `Exercise` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "distance",
DROP COLUMN "interval",
DROP COLUMN "reps",
DROP COLUMN "rest";
