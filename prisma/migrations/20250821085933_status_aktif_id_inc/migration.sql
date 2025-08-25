-- AlterTable
CREATE SEQUENCE status_aktif_id_seq;
ALTER TABLE "status_aktif" ALTER COLUMN "id" SET DEFAULT nextval('status_aktif_id_seq');
ALTER SEQUENCE status_aktif_id_seq OWNED BY "status_aktif"."id";
