-- DropForeignKey
ALTER TABLE "struktur_jabatan" DROP CONSTRAINT "struktur_jabatan_grade_id_fkey";

-- DropForeignKey
ALTER TABLE "struktur_org" DROP CONSTRAINT "struktur_org_grade_id_fkey";

-- AlterTable
ALTER TABLE "grade_remun" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "struktur_jabatan" ADD CONSTRAINT "struktur_jabatan_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE SET NULL ON UPDATE CASCADE;
