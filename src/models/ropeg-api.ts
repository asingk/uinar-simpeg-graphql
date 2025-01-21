interface RopegResponseModel {
    status: string
    code: number
    title: string
}

export type ProfilPegawaiResponseModel = RopegResponseModel & {
    data: ProfilPegawaiModel
}

type ProfilPegawaiModel = {
    NIP: string
    NIP_BARU: string
    NAMA: string
    NAMA_LENGKAP: string
    AGAMA: string
    TEMPAT_LAHIR: string
    TANGGAL_LAHIR: string
    JENIS_KELAMIN: number
    EMAIL: string
    TELEPON: string
    ALAMAT_1: string
    ALAMAT_2: string
    KAB_KOTA: string
    PROVINSI: string
    KODE_POS: string
    TMT_CPNS: string
    tmt_kgb_yad: string
    tmt_pangkat_yad: string
    USIA_PENSIUN: string
    TMT_PENSIUN: string
    STATUS_PEGAWAI: string
    STATUS_KAWIN: string
}

export type PendidikanResponseModel = RopegResponseModel & {
    data: PendidikanModel[]
}

type PendidikanModel = {
    NIP: string
    NAMA_SEKOLAH: string
    FAKULTAS_PENDIDIKAN: string
    JURUSAN: string
    TAHUN_LULUS: string
    JENJANG_PENDIDIKAN: string
    LOKASI_SEKOLAH: string
    AKTA: string
}

export type PekerjaanResponseModel = RopegResponseModel & {
    data: PekerjaanModel
}

type PekerjaanModel = {
    pangkat: PangkatModel[]
    jabatan: JabatanModel[]
}

type PangkatModel = {
    NIP: string
    PANGKAT: string
    GOL_RUANG: string
    NO_SK: string
    TMT_SK: string
    KETERANGAN: string
}

type JabatanModel = {
    NIP: string
    JABATAN: string
    BIDANG_STUDI: string
    NO_SK: string
    TMT_SK: string
    KETERANGAN_SATUAN_KERJA: string
}