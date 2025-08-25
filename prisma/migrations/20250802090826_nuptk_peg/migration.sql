/*
  Warnings:

  - You are about to drop the column `nuptk` on the `dosen` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dosen" DROP COLUMN "nuptk";

-- AlterTable
ALTER TABLE "pegawai" ADD COLUMN     "nuptk" VARCHAR(16);
