-- AlterTable
ALTER TABLE "dosen" ADD COLUMN     "serdos_bidang_studi" TEXT,
ADD COLUMN     "serdos_nomor_registrasi" VARCHAR(25),
ADD COLUMN     "serdos_sk_sertifikasi" VARCHAR(100),
ADD COLUMN     "serdos_tahun_sertifikasi" SMALLINT;
