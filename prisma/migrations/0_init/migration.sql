-- CreateEnum
CREATE TYPE "gender_enum" AS ENUM ('L', 'P');

-- CreateEnum
CREATE TYPE "jenis_jabatan_enum" AS ENUM ('DT', 'DS', 'Tendik');

-- CreateTable
CREATE TABLE "bag_uker" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bag_uker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dosen" (
    "id" UUID NOT NULL,
    "pegawai_id" VARCHAR(18) NOT NULL,
    "scopus_id" VARCHAR(11),
    "wos_id" VARCHAR(13),
    "gs_id" VARCHAR(15),
    "orcid_id" VARCHAR(22),
    "nidn" VARCHAR(10),
    "sinta_id" VARCHAR(7),
    "prodi_id" UUID,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dosen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fakultas" (
    "id" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fakultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_remun" (
    "id" VARCHAR(3) NOT NULL,
    "remun" INTEGER NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "grade_remun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan" (
    "id" VARCHAR(3) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jabatan_kemenag" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(100),
    "no_sk" VARCHAR(50),
    "tmt" DATE NOT NULL,
    "unit_kerja" VARCHAR(250),
    "pegawai_id" VARCHAR(18) NOT NULL,
    "bidang_studi" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jabatan_kemenag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "struktur_jabatan" (
    "id" UUID NOT NULL,
    "level_id" UUID NOT NULL,
    "sublevel_id" UUID,
    "grade_id" VARCHAR(3),
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "struktur_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level_jabatan" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "jabatan_id" VARCHAR(3) NOT NULL,
    "sso_role_code" VARCHAR(4) NOT NULL,

    CONSTRAINT "level_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pangkat" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50),
    "gol_ruang" VARCHAR(5),
    "no_sk" VARCHAR(50),
    "tmt" DATE NOT NULL,
    "ket" VARCHAR(100),
    "pegawai_id" VARCHAR(18) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pangkat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pegawai" (
    "id" VARCHAR(18) NOT NULL,
    "nip_lama" VARCHAR(20),
    "nama" VARCHAR(100) NOT NULL,
    "agama" VARCHAR(15),
    "tempat_lahir" VARCHAR(50),
    "tgl_lahir" DATE,
    "jenis_kelamin" "gender_enum",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "no_hp" VARCHAR(50),
    "email_pribadi" VARCHAR(100),
    "alamat_desc" VARCHAR(200),
    "alamat_kota" VARCHAR(50),
    "alamat_prov" VARCHAR(30),
    "alamat_kodepos" VARCHAR(5),
    "created_by" VARCHAR(100) NOT NULL,
    "updated_by" VARCHAR(100) NOT NULL,
    "unit_gaji_id" VARCHAR(5),
    "email_uinar" VARCHAR(50),
    "tmt_pensiun" DATE,
    "tmt_kgb_yad" DATE,
    "tmt_pangkat_yad" DATE,
    "status_aktif_id" SMALLINT NOT NULL,
    "status_peg_id" SMALLINT NOT NULL,
    "status_kawin" VARCHAR(15),
    "tmt_cpns" DATE,
    "usia_pensiun" SMALLINT,
    "jenis_jabatan" "jenis_jabatan_enum",
    "unit_remun_id" VARCHAR(5),
    "struktur_jabatan_id" UUID,

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pendidikan" (
    "id" UUID NOT NULL,
    "nama_sekolah" VARCHAR(100),
    "fakultas" VARCHAR(50),
    "jurusan" VARCHAR(50),
    "tahun_lulus" SMALLINT NOT NULL,
    "jenjang" VARCHAR(50),
    "lokasi_sekolah" VARCHAR(50),
    "akta" VARCHAR(50),
    "pegawai_id" VARCHAR(18) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pendidikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posisi" (
    "id" VARCHAR(7) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posisi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prodi" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "fakultas_id" VARCHAR(5) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prodi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_aktif" (
    "id" SMALLINT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "sso_enabled" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_aktif_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_pegawai" (
    "id" SMALLINT NOT NULL,
    "nama" VARCHAR(15) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "is_sync" BOOLEAN NOT NULL,

    CONSTRAINT "status_pegawai_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subbag_uker" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subbag_uker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sublevel_jabatan" (
    "id" UUID NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sublevel_jabatan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_gaji" (
    "id" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_gaji_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unit_kerja" (
    "id" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unit_kerja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unitkerja_pegawai" (
    "pegawai_id" VARCHAR(18) NOT NULL,
    "struktur_org_id" UUID NOT NULL,
    "is_secondary" BOOLEAN NOT NULL DEFAULT false,
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unitkerja_pegawai_pkey" PRIMARY KEY ("struktur_org_id","pegawai_id")
);

-- CreateTable
CREATE TABLE "struktur_org" (
    "id" UUID NOT NULL,
    "uker_id" VARCHAR(5),
    "bag_id" UUID,
    "subbag_id" UUID,
    "posisi_id" VARCHAR(7) NOT NULL,
    "grade_id" VARCHAR(3),
    "created_by" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by" VARCHAR(100) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "struktur_org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sso_role" (
    "code" VARCHAR(4) NOT NULL,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "sso_role_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "consumer" (
    "id" VARCHAR(12) NOT NULL,
    "key" VARCHAR(32) NOT NULL,

    CONSTRAINT "consumer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bag_uker_nama_key" ON "bag_uker"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "dosen_pegawai_id_key" ON "dosen"("pegawai_id");

-- CreateIndex
CREATE UNIQUE INDEX "fakultas_nama_key" ON "fakultas"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_nama_key" ON "jabatan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "level_jabatan_nama_key" ON "level_jabatan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "posisi_nama_key" ON "posisi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "prodi_nama_fakultas_id_key" ON "prodi"("nama", "fakultas_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_aktif_nama_key" ON "status_aktif"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "status_pegawai_nama_key" ON "status_pegawai"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "subbag_uker_nama_key" ON "subbag_uker"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "sublevel_jabatan_nama_key" ON "sublevel_jabatan"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "unit_gaji_nama_key" ON "unit_gaji"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "unit_kerja_nama_key" ON "unit_kerja"("nama");

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dosen" ADD CONSTRAINT "dosen_prodi_id_fkey" FOREIGN KEY ("prodi_id") REFERENCES "prodi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jabatan_kemenag" ADD CONSTRAINT "jabatan_kemenag_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_jabatan" ADD CONSTRAINT "struktur_jabatan_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_jabatan" ADD CONSTRAINT "struktur_jabatan_level_id_fkey" FOREIGN KEY ("level_id") REFERENCES "level_jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_jabatan" ADD CONSTRAINT "struktur_jabatan_sublevel_id_fkey" FOREIGN KEY ("sublevel_id") REFERENCES "sublevel_jabatan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_jabatan" ADD CONSTRAINT "level_jabatan_jabatan_id_fkey" FOREIGN KEY ("jabatan_id") REFERENCES "jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "level_jabatan" ADD CONSTRAINT "level_jabatan_sso_role_code_fkey" FOREIGN KEY ("sso_role_code") REFERENCES "sso_role"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pangkat" ADD CONSTRAINT "pangkat_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_status_aktif_id_fkey" FOREIGN KEY ("status_aktif_id") REFERENCES "status_aktif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_status_peg_id_fkey" FOREIGN KEY ("status_peg_id") REFERENCES "status_pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_struktur_jabatan_id_fkey" FOREIGN KEY ("struktur_jabatan_id") REFERENCES "struktur_jabatan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_unit_gaji_id_fkey" FOREIGN KEY ("unit_gaji_id") REFERENCES "unit_gaji"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pegawai" ADD CONSTRAINT "pegawai_unit_remun_id_fkey" FOREIGN KEY ("unit_remun_id") REFERENCES "unit_gaji"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendidikan" ADD CONSTRAINT "pendidikan_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prodi" ADD CONSTRAINT "prodi_fakultas_id_fkey" FOREIGN KEY ("fakultas_id") REFERENCES "fakultas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitkerja_pegawai" ADD CONSTRAINT "unitkerja_pegawai_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "pegawai"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitkerja_pegawai" ADD CONSTRAINT "unitkerja_pegawai_struktur_org_id_fkey" FOREIGN KEY ("struktur_org_id") REFERENCES "struktur_org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_bag_id_fkey" FOREIGN KEY ("bag_id") REFERENCES "bag_uker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_grade_id_fkey" FOREIGN KEY ("grade_id") REFERENCES "grade_remun"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_posisi_id_fkey" FOREIGN KEY ("posisi_id") REFERENCES "posisi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_subbag_id_fkey" FOREIGN KEY ("subbag_id") REFERENCES "subbag_uker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "struktur_org" ADD CONSTRAINT "struktur_org_uker_id_fkey" FOREIGN KEY ("uker_id") REFERENCES "unit_kerja"("id") ON DELETE SET NULL ON UPDATE CASCADE;

