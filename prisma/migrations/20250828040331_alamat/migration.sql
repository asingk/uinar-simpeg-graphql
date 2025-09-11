/*
  Warnings:

  - You are about to drop the column `alamat_desc` on the `pegawai` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pegawai" DROP COLUMN "alamat_desc",
ADD COLUMN     "alamat_desc_1" TEXT,
ADD COLUMN     "alamat_desc_2" TEXT;
