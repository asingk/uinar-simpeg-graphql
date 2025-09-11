/*
  Warnings:

  - Made the column `kode_anak_satker` on table `unit_gaji` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "unit_gaji" ALTER COLUMN "kode_anak_satker" SET NOT NULL;
