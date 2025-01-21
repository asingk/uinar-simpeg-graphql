import { Resolvers } from "../types";
import Query from "./queries.js";
import Mutation from "./mutations.js";

// Note this "Resolvers" type isn't strictly necessary because we are already
// separately type checking our queries and resolvers. However, the "Resolvers"
// generated types is useful syntax if you are defining your resolvers
// in a single file.
const resolvers: Resolvers = {
    Query,
    Mutation,
    Pegawai: {
        statusPegawai: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).statusPegawai()
        },
        alamat: (parent, _, __) => {
            if(parent.alamatDesc || parent.alamatKota || parent.alamatProv || parent.alamatKodepos) {
                return {
                    deskripsi: parent.alamatDesc,
                    kabKota: parent.alamatKota,
                    provinsi: parent.alamatProv,
                    kodePos: parent.alamatKodepos
                }
            } else {
                return null
            }
        },
        kontak: (parent, _, __) => {
            if(parent.noHp || parent.emailUinar || parent.emailPribadi) {
                return {
                    noHp: parent.noHp,
                    emailUinar: parent.emailUinar,
                    emailPribadi: parent.emailPribadi,
                }
            } else {
                return null
            }
        },
        riwayatPendidikan: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pendidikan.findMany({
                where: {
                    pegawaiId: id
                },
                orderBy: {
                    tahunLulus: 'desc'
                }
            })
        },
        riwayatPangkat: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pangkat.findMany({
                where: {
                    pegawaiId: id
                },
                orderBy: {
                    tmt: 'desc'
                }
            })
        },
        riwayatJabatanKemenag: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.jabatanKemenag.findMany({
                where: {
                    pegawaiId: id
                },
                orderBy: {
                    tmt: 'desc'
                }
            })
        },
        unitGaji: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).unitGaji()
        },
        unitRemun: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).unitRemun()
        },
        statusAktif: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).statusAktif()
        },
        dosen: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).dosen()
        },
        jabatanSaatIni: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).strukturJabatan()
        },
        unitKerjaSaatIni: async ({ id }, _, { dataSources }) => {
            const posuker = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: id
                }
            }).unitKerjaPegawai({
                select: {
                    isSecondary: true,
                    strukturOrganisasi: true
                }
            })
            return posuker.map(r => {
                return {
                    ...r.strukturOrganisasi,
                    isSecondary: r.isSecondary,
                }
            })
        }
    },
    StrukturJabatan: {
        level: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturJabatan.findUnique({
                where: {
                    id: id
                }
            }).levelJabatan()
        },
        sublevel: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturJabatan.findUnique({
                where: {
                    id: id
                }
            }).sublevelJabatan()
        },
        grade: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturJabatan.findUnique({
                where: {
                    id: id
                }
            }).gradeRemun()
        }
    },
    LevelJabatan: {
        jabatan: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.levelJabatan.findUnique({
                where: {
                    id: id
                }
            }).jabatan()
        },
        ssoRole: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.levelJabatan.findUnique({
                where: {
                    id: id
                }
            }).ssoRole()
        }
    },
    StrukturLevelJabatan: {
        ssoRole: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.levelJabatan.findUnique({
                where: {
                    id: id
                }
            }).ssoRole()
        }
    },
    StrukturOrganisasi: {
        unitKerja: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).unitKerja()
        },
        bagian: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).bagianUnitKerja()
        },
        subbag: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).subbagUnitKerja()
        },
        posisi: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).posisi()
        },
        grade: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                },
            }).gradeRemun()
        },
        pegawai: async ({ id }, _, { dataSources }) => {
            const ukerpeg = await dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                },
            }).unitKerjaPegawai({
                select: {
                    pegawai: true,
                }
            })
            return ukerpeg.map(ukerpeg => ukerpeg.pegawai)
        }
    },
    UnitKerjaPegawai: {
        unitKerja: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).unitKerja()
        },
        bagian: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).bagianUnitKerja()
        },
        subbag: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).subbagUnitKerja()
        },
        posisi: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).posisi()
        },
        grade: ({ id }, _, { dataSources }) => {
            return dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: id
                }
            }).gradeRemun()
        },
    },
    JabatanLevel: {
        level: async ({ id }, _, { dataSources }) => {
            return dataSources.prisma.jabatan.findUnique({
                where: {
                    id: id
                }
            }).levelJabatan()
        }
    },

    Fakultas: {
        prodi: async ({ id }, _, { dataSources }) => {
            return dataSources.prisma.fakultas.findUnique({
                where: {
                    id: id
                },
            }).prodi()
        }
    },

    Dosen: {
        prodi: ({id}, _, {dataSources}) => {
            return dataSources.prisma.dosen.findUnique({
                where: {
                    id: id
                }
            }).prodi()
        }
    },

    ProdiJabatanDosen: {
        fakultas: ({id}, _, {dataSources}) => {
            return dataSources.prisma.prodi.findUnique({
                where: {
                    id: id
                }
            }).fakultas()
        }
    }
};

export default resolvers;
