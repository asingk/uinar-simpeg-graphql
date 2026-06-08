/*
  Warnings:

  - The primary key for the `grade_remun` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `grade_id` column on the `struktur_jabatan` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `grade_id` column on the `struktur_org` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `grade` to the `grade_remun` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `grade_remun` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- ============================================
-- STEP 1: Tambah kolom UUID baru di semua tabel
-- ============================================
ALTER TABLE "grade_remun" ADD COLUMN "new_id" UUID DEFAULT gen_random_uuid();
ALTER TABLE "struktur_jabatan" ADD COLUMN "new_grade_id" UUID;
ALTER TABLE "struktur_org" ADD COLUMN "new_grade_id" UUID;

-- ============================================
-- STEP 2: Isi UUID untuk semua baris yang ada
-- ============================================
UPDATE "grade_remun" SET "new_id" = gen_random_uuid();

-- ============================================
-- STEP 3: Map foreign key lama ke UUID baru
-- Isi new_grade_id di struktur_jabatan dan struktur_org berdasarkan grade_id lama
-- ============================================
UPDATE "struktur_jabatan" sj
SET "new_grade_id" = gr."new_id"
FROM "grade_remun" gr
WHERE sj."grade_id" = gr."id";

UPDATE "struktur_org" so
SET "new_grade_id" = gr."new_id"
FROM "grade_remun" gr
WHERE so."grade_id" = gr."id";

-- ============================================
-- STEP 4: Drop FK dan PK lama
-- ============================================
ALTER TABLE "struktur_jabatan" DROP CONSTRAINT "struktur_jabatan_grade_id_fkey";
ALTER TABLE "struktur_org" DROP CONSTRAINT "struktur_org_grade_id_fkey";
ALTER TABLE "grade_remun" DROP CONSTRAINT "grade_remun_pkey";

-- ============================================
-- STEP 5: Rename kolom id lama → grade
-- ============================================
ALTER TABLE "grade_remun" RENAME COLUMN "id" TO "grade";
ALTER TABLE "struktur_jabatan" RENAME COLUMN "grade_id" TO "grade";
ALTER TABLE "struktur_org" RENAME COLUMN "grade_id" TO "grade";

-- ============================================
-- STEP 6: Rename kolom UUID baru → id / grade_id
-- ============================================
ALTER TABLE "grade_remun" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "struktur_jabatan" RENAME COLUMN "new_grade_id" TO "grade_id";
ALTER TABLE "struktur_org" RENAME COLUMN "new_grade_id" TO "grade_id";

-- ============================================
-- STEP 7: Set NOT NULL dan tambah constraint
-- ============================================
ALTER TABLE "grade_remun" ALTER COLUMN "id" SET NOT NULL;
ALTER TABLE "grade_remun" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
ALTER TABLE "grade_remun" ALTER COLUMN "grade" SET NOT NULL;

-- ============================================
-- STEP 8: Tambah PK dan FK baru
-- ============================================
ALTER TABLE "grade_remun" ADD CONSTRAINT "grade_remun_pkey" PRIMARY KEY ("id");
ALTER TABLE "struktur_jabatan" ADD CONSTRAINT "struktur_jabatan_grade_id_fkey"
    FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_grade_id_fkey"
    FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- STEP 9: Hapus kolom FK lama yang sudah tidak dipakai
ALTER TABLE "struktur_jabatan" DROP COLUMN "grade";
ALTER TABLE "struktur_org" DROP COLUMN "grade";