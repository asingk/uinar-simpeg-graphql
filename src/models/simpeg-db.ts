export type PegawaiModel = {
    id: string
    nama: string
    nipLama: string
    agama: string
    tempatLahir: string
    tglLahir: Date
    jenisKelamin: string
    statusKawin: string
    tmtPensiun: Date
    usiaPensiun: number
    tmtKgbYad: Date
    statusPegawaiId: number
    alamatDesc: string
    alamatKota: string
    alamatProv: string
    alamatKodepos: string
    noHp: string
    emailPribadi: string
    emailUinar: string
    unitGajiId: string
    unitRemunId: string
    createdBy: string
    createdAt: Date
    updatedBy: string
    updatedAt: Date
    statusAktifId: number
    strukturJabatanId: string
    jenisJabatan: string
}

export type StrukturJabatanModel = {
    id: string
    levelJabatanId: string
    sublevelJabatanId: string
    gradeId: string
}

export type StrukturLevelJabatanModel = {
    id: string
    nama: string
    ssoRoleCode: string
}

export type LevelJabatanModel = {
    id: string
    nama: string
    jabatanId: string
    ssoRoleCode: string
}

export type StrukturOrganisasiModel = {
    id: string
    unitKerjaId: string
    bagianId: string
    subbagId: string
    posisiId: string
    gradeId: string
}

export type JabatanLevelModel = {
    id: string
    nama: string
}

export type FakultasModel = {
    id: string
    nama: string
}

export type DosenModel = {
    id: string
    pegawaiId: string
    prodiId: string
    scopusId: string
    wosId: string
    gsId: string
    orcidId: string
    nidn: string
    sintaId: string
}

export type ProdiJabatanDosenModel = {
    id: string
    nama: string
    fakultasId: string
}

export type UnitKerjaPegawaiModel = {
    id: string
    unitKerjaId: string
    bagianId: string
    subbagId: string
    posisiId: string
    gradeId: string
    isSecondary: boolean
}
