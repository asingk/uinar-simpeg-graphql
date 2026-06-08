/*
  Warnings:

  - You are about to drop the column `remun` on the `grade_remun` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[grade]` on the table `grade_remun` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "grade_remun" DROP COLUMN "remun",
ADD COLUMN     "p1" INTEGER,
ADD COLUMN     "p2" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "grade_remun_grade_key" ON "grade_remun"("grade");
