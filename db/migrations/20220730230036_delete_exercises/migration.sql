/*
  Warnings:

  - You are about to drop the column `exercises` on the `Workout` table. All the data in the column will be lost.
  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_workoutId_fkey";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "exercises";

-- DropTable
DROP TABLE "Exercise";
