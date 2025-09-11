/*
  Warnings:

  - A unique constraint covering the columns `[kode_anak_satker]` on the table `unit_gaji` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "unit_gaji" ADD COLUMN     "kode_anak_satker" CHAR(2);

-- CreateIndex
CREATE UNIQUE INDEX "unit_gaji_kode_anak_satker_key" ON "unit_gaji"("kode_anak_satker");
