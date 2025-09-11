import {JenisJabatanType, Prisma} from "@prisma/client";
import { MutationResolvers } from "../types";
import { randomUUID } from 'crypto'
import {GraphQLError} from "graphql";

const KEYCLOAK_ROLE_STRUKTURAL = 'STR'
const KEYCLOAK_ROLE_ADMINISTRASI = 'ADM'
const KEYCLOAK_ROLE_DOSEN = 'DSN'
const KEYCLOAK_ROLE_FUNGSIONAL = 'FUNG'

// Use the generated `MutationResolvers` type to type check our mutations!
const mutations: MutationResolvers = {
    async createPegawaiSync(_, {input}, {dataSources, user}) {
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        let keycloakRoles: string[] = []
        let namaTanpaGelar: string
        let dataParam: Prisma.PegawaiCreateInput = {
            id: input.id.trim(),
            nama: '',
            createdBy: user,
            updatedBy: user,
            statusPegawai: {
                connect: {
                    id: 0,
                }
            },
            statusAktif: {
                connect: {
                    id: 1,
                }
            },
            strukturJabatan: {
                connect: {
                    id: input.strukturJabatanId,
                }
            },
            unitGaji: {
                connect: {
                    id: input.unitGajiId,
                }
            },
            unitRemun: {
                connect: {
                    id: input.unitRemunId,
                }
            }
        }

        if (input.strukturOrganisasiId) {
            const strukturUker = await dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: input.strukturOrganisasiId
                },
                select: {
                    posisiId: true,
                    unitKerjaPegawai: {
                        select: {
                            pegawai: {
                                select: {
                                    nama: true
                                }
                            }
                        }
                    }
                }
            })
            if (!strukturUker) {
                return {
                    code: 404,
                    success: false,
                    message: "id posisi unit kerja tidak ditemukan",
                    pegawai: null
                }
            }
            if (strukturUker.posisiId !== 'ST' && strukturUker.unitKerjaPegawai.length > 0) {
                return {
                    code: 409,
                    success: false,
                    message: `jabatan ini sudah diduduki oleh ${strukturUker.unitKerjaPegawai[0].pegawai.nama}`,
                    pegawai: null
                }
            }
            dataParam.unitKerjaPegawai = {
                create: [
                    {
                        strukturOrganisasi: {
                            connect: {
                                id: input.strukturOrganisasiId
                            }
                        },
                        createdBy: user,
                        updatedBy: user
                    }
                ]
            }
        }
        const strukturJabatan = await dataSources.prisma.strukturJabatan.findUnique({
            where: {
                id: input.strukturJabatanId
            },
            select: {
                levelJabatan: {
                    select: {
                        ssoRoleCode: true
                    }
                }
            }
        })
        keycloakRoles.push(strukturJabatan.levelJabatan.ssoRoleCode)
        if (strukturJabatan.levelJabatan.ssoRoleCode === KEYCLOAK_ROLE_DOSEN) {
            if (input.prodiId) {
                dataParam.dosen = {
                    create: {
                        prodi: {
                            connect: {
                                id: input.prodiId
                            }
                        },
                        createdBy: user,
                        updatedBy: user
                    }
                }
            }
        }
        if (strukturJabatan.levelJabatan.ssoRoleCode === KEYCLOAK_ROLE_DOSEN) {
            if(input.strukturOrganisasiId) {
                dataParam.jenisJabatan = JenisJabatanType.DT
                keycloakRoles.push(KEYCLOAK_ROLE_STRUKTURAL)
            } else {
                dataParam.jenisJabatan = JenisJabatanType.DS
            }
        } else {
            if(!input.strukturOrganisasiId) {
                return {
                    code: 403,
                    success: false,
                    message: "Tendik wajib memiliki unit kerja",
                    pegawai: null
                }
            }
            dataParam.jenisJabatan = JenisJabatanType.Tendik
        }
        let token: string
        try {
            const tokenResp = await dataSources.ropegAPI.createToken()
            token = tokenResp.data.token
        } catch (err) {
            return {
                code: err.response.status,
                success: false,
                message: `Gagal create token ropeg: ${err.response.data.error}`,
                pegawai: null
            }
        }
        try {
            const {data: dataProfil} = await dataSources.ropegAPI.getProfilPegawai(token, input.id)
            namaTanpaGelar = dataProfil.NAMA.split(',')[0]
            const pegawaiRopeg = castPegawaiRopeg(dataProfil)
            dataParam = Object.assign(dataParam, pegawaiRopeg)
            const { data: dataPendidikan } = await dataSources.ropegAPI.getPendidikan(token, input.id)
            dataParam.pendidikan = {
                createMany: {
                    data: castPendidikanRopeg(dataPendidikan)
                }
            }
            const { data: dataPekerjaan } = await dataSources.ropegAPI.getPekerjaan(token, input.id)
            dataParam.pangkat = {
                createMany: {
                    data: castPangkatRopeg(dataPekerjaan.pangkat)
                }
            }
            dataParam.jabatanKemenag = {
                createMany: {
                    data: castJabatanRopeg(dataPekerjaan.jabatan)
                }
            }
        } catch (err) {
            return {
                code: err.extensions.response.status,
                success: false,
                message: `Gagal mendapatkan pegawai dari ropeg: ${err.extensions.response.body.errorMessage}`,
                pegawai: null
            }
        }
        try{
            const pegawai = await dataSources.prisma.pegawai.create({
                data: dataParam
            })
            let accessToken: string
            try {
                const tokenResp = await dataSources.keycloakAPI.createToken()
                accessToken = tokenResp.data.access_token
            } catch (err) {
                return {
                    code: err.response.status,
                    success: false,
                    message: `Gagal create token keycloak: ${err.response.data.error}`,
                    pegawai: null
                }
            }
            try {
                await dataSources.keycloakAPI.createUser(input.id.trim(), namaTanpaGelar, accessToken)
                const user = await dataSources.keycloakAPI.getUsers(input.id, accessToken)
                await dataSources.keycloakAPI.resetPassword(user[0].id, input.password, accessToken)
                let userRoles= []
                for (const row of keycloakRoles) {
                    const role = await dataSources.keycloakAPI.getRole(row, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                }
                await dataSources.keycloakAPI.addUserRoles(user[0].id, userRoles, accessToken)
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                    pegawai: null
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses menambahkan pegawai dengan id ${input.id}`,
                pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async createPegawaiNotSync(_, {input}, {dataSources, user}) {
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        let keycloakRoles: string[] = []
        let namaLengkap = input.nama.trim()
        if (input.gelarDepan) {
            namaLengkap = `${input.gelarDepan.trim()} ${namaLengkap}`
        }
        if (input.gelarBelakang) {
            namaLengkap = `${namaLengkap}, ${input.gelarBelakang.trim()}`
        }
        let dataParam: Prisma.PegawaiCreateInput = {
            id: input.id.trim(),
            nama: namaLengkap,
            createdBy: user,
            updatedBy: user,
            statusPegawai: {
                connect: {
                    id: input.statusPegawaiId,
                }
            },
            statusAktif: {
                connect: {
                    id: 1,
                }
            },
            strukturJabatan: {
                connect: {
                    id: input.strukturJabatanId,
                }
            },
            unitGaji: {
                connect: {
                    id: input.unitGajiId,
                }
            },
            unitRemun: {
                connect: {
                    id: input.unitRemunId,
                }
            }
        }

        if (input.strukturOrganisasiId) {
            const strukturUker = await dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: input.strukturOrganisasiId
                },
                select: {
                    posisiId: true,
                    unitKerjaPegawai: {
                        select: {
                            pegawai: {
                                select: {
                                    nama: true
                                }
                            }
                        }
                    }
                }
            })
            if (!strukturUker) {
                return {
                    code: 404,
                    success: false,
                    message: "id posisi unit kerja tidak ditemukan",
                    pegawai: null
                }
            }
            if (strukturUker.posisiId !== 'ST' && strukturUker.unitKerjaPegawai.length > 0) {
                return {
                    code: 409,
                    success: false,
                    message: `jabatan ini sudah diduduki oleh ${strukturUker.unitKerjaPegawai[0].pegawai.nama}`,
                    pegawai: null
                }
            }
            dataParam.unitKerjaPegawai = {
                create: [
                    {
                        strukturOrganisasi: {
                            connect: {
                                id: input.strukturOrganisasiId
                            }
                        },
                        createdBy: user,
                        updatedBy: user
                    }
                ]
            }
        }
        const strukturJabatan = await dataSources.prisma.strukturJabatan.findUnique({
            where: {
                id: input.strukturJabatanId
            },
            select: {
                levelJabatan: {
                    select: {
                        ssoRoleCode: true,
                    }
                }
            }
        })
        if (strukturJabatan.levelJabatan.ssoRoleCode === KEYCLOAK_ROLE_DOSEN) {
            if (!input.prodiId) {
                return {
                    code: 403,
                    success: false,
                    message: "Dosen wajib memiliki prodi",
                    pegawai: null
                }
            }
            dataParam.dosen = {
                create: {
                    prodi: {
                        connect: {
                            id: input.prodiId
                        }
                    },
                    createdBy: user,
                    updatedBy: user
                }
            }
        }
        keycloakRoles.push(strukturJabatan.levelJabatan.ssoRoleCode)
        if (strukturJabatan.levelJabatan.ssoRoleCode === KEYCLOAK_ROLE_DOSEN) {
            if(input.strukturOrganisasiId) {
                dataParam.jenisJabatan = JenisJabatanType.DT
                keycloakRoles.push(KEYCLOAK_ROLE_STRUKTURAL)
            } else {
                dataParam.jenisJabatan = JenisJabatanType.DS
            }
        } else {
            if(!input.strukturOrganisasiId) {
                return {
                    code: 403,
                    success: false,
                    message: "Tendik wajib memiliki unit kerja",
                    pegawai: null
                }
            }
            dataParam.jenisJabatan = JenisJabatanType.Tendik
        }
        const statusPegawai = await dataSources.prisma.statusPegawai.findUnique({
            where: {
                id: input.statusPegawaiId
            },
            select: {
                isSync: true
            }
        })
        if (statusPegawai.isSync) {
            return {
                code: 403,
                success: false,
                message: `id status pegawai sync`,
                pegawai: null,
            }
        }
        try{
            const pegawai = await dataSources.prisma.pegawai.create({
                data: dataParam
            })
            let accessToken: string
            try {
                const tokenResp = await dataSources.keycloakAPI.createToken()
                accessToken = tokenResp.data.access_token
            } catch (err) {
                return {
                    code: err.response.status,
                    success: false,
                    message: `Gagal create token keycloak: ${err.response.data.error}`,
                    pegawai: null
                }
            }
            try {
                await dataSources.keycloakAPI.createUser(input.id.trim(), input.nama.trim(), accessToken)
                const user = await dataSources.keycloakAPI.getUsers(input.id, accessToken)
                await dataSources.keycloakAPI.resetPassword(user[0].id, input.password, accessToken)
                let userRoles= []
                for (const row of keycloakRoles) {
                    const role = await dataSources.keycloakAPI.getRole(row, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                }
                await dataSources.keycloakAPI.addUserRoles(user[0].id, userRoles, accessToken)
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                    pegawai: null
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses menambahkan pegawai dengan id ${input.id}`,
                pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async syncAsn(_, { id}, { dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        let token: string
        let dataParam
        try {
            const tokenResp = await dataSources.ropegAPI.createToken()
            token = tokenResp.data.token
        } catch (err) {
            return {
                code: err.response.status,
                success: false,
                message: `Gagal create token ropeg: ${err.response.data.error}`,
                pegawai: null
            }
        }
        try {
            const {data: dataProfil} = await dataSources.ropegAPI.getProfilPegawai(token, id)
            dataParam = castPegawaiRopeg(dataProfil)
            const { data: dataPendidikan } = await dataSources.ropegAPI.getPendidikan(token, id)
            dataParam.pendidikan = {
                createMany: {
                    data: castPendidikanRopeg(dataPendidikan)
                }
            }
            const { data: dataPekerjaan } = await dataSources.ropegAPI.getPekerjaan(token, id)
            dataParam.pangkat = {
                createMany: {
                    data: castPangkatRopeg(dataPekerjaan.pangkat)
                }
            }
            dataParam.jabatanKemenag = {
                createMany: {
                    data: castJabatanRopeg(dataPekerjaan.jabatan)
                }
            }
            dataParam.updatedBy = user
        } catch (err) {
            return {
                code: err.extensions.response.status,
                success: false,
                message: `Gagal mendapatkan pegawai dari ropeg: ${err.extensions.response.body.errorMessage}`,
                pegawai: null
            }
        }
        try {
            const [_, __, ___, pegawai] = await dataSources.prisma.$transaction([
                // clear riwayat pendidikan
                dataSources.prisma.pendidikan.deleteMany({
                    where: {
                        pegawaiId: id
                    }
                }),
                // clear riwayat pangkat
                dataSources.prisma.pangkat.deleteMany({
                    where: {
                        pegawaiId: id
                    }
                }),
                // clear riwayat jabatan kemenag
                dataSources.prisma.jabatanKemenag.deleteMany({
                    where: {
                        pegawaiId: id
                    }
                }),
                dataSources.prisma.pegawai.update({
                    where: {
                        id: id,
                    },
                    data: dataParam,
                })
            ])
            return {
                code: 200,
                success: true,
                message: `Sukses sync pegawai ${id}`,
                pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async updatePegawaiProfil(_, { id, input}, { dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        const exist = await dataSources.prisma.pegawai.findUnique({
            where: {
                id
            },
            select: {
                statusPegawai: {
                    select: {
                        isSync: true
                    }
                }
            }
        })
        if (!exist) {
            return {
                code: 404,
                success: false,
                message: `pegawai ${id} tidak ditemukan`,
                pegawai: null,
            }
        }
        let data: Prisma.PegawaiUpdateInput = {
            updatedBy: user,
        }
        if (exist.statusPegawai.isSync) {
            data.emailUinar = input.emailUinar
            data.unitGaji = {
                connect: {
                    id: input.unitGajiId
                }
            }
            // data['idUnitGaji'] = input.idUnitGaji
            data.unitRemun = {
                connect: {
                    id: input.unitRemunId
                }
            }
            // data['idUnitRemun'] = input.idUnitRemun
        } else {
            if (!input.nama) {
                return {
                    code: 400,
                    success: false,
                    message: `nama wajib diisi`,
                    pegawai: null,
                }
            }
            data = Object.assign(data, input)
        }
        try {
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id
                },
                data
            })
            return {
                code: 200,
                success: true,
                message: `Sukses update pegawai ${id}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async deletePegawai(_, {id}, {dataSources, user}) {
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        const exist = await dataSources.prisma.pegawai.findUnique({
            where: {
                id
            },
            select: {
                statusPegawai: {
                    select: {
                        isSync: true
                    }
                },
                dosen: true
            }
        })
        if (!exist) {
            return {
                code: 404,
                success: false,
                message: `pegawai ${id} tidak ditemukan`,
                pegawai: null,
            }
        }
        if (exist.statusPegawai.isSync) {
            return {
                code: 401,
                success: false,
                message: `Pegawai ini tidak bisa dihapus`,
                pegawai: null
            }
        }

        try {
            if (exist.dosen) {
                await dataSources.prisma.dosen.delete({
                    where: {
                        pegawaiId: id
                    }
                })
            }
            const pegawai = await dataSources.prisma.pegawai.delete({
                    where: {
                        id
                    },
                })
            let accessToken: string
            try {
                const tokenResp = await dataSources.keycloakAPI.createToken()
                accessToken = tokenResp.data.access_token
            } catch (err) {
                return {
                    code: err.response.status,
                    success: false,
                    message: `Gagal create token keycloak: ${err.response.data.error}`,
                    pegawai: null
                }
            }
            try {
                const user = await dataSources.keycloakAPI.getUsers(id, accessToken)
                await dataSources.keycloakAPI.deleteUser(user[0].id, accessToken)
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                    pegawai: null
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses delete pegawai ${id}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async createJabatanPegawai(_, {strukturJabatanId, pegawaiId}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const jabpeg = await dataSources.prisma.strukturJabatan.findUnique({
                where: {
                    id: strukturJabatanId
                },
                select: {
                    levelJabatan: {
                        select: {
                            ssoRoleCode: true,
                        }
                    }
                }
            })
            const exist = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: pegawaiId
                },
                select: {
                    strukturJabatanId: true,
                    unitKerjaPegawai: true
                }
            })
            if (exist.strukturJabatanId) {
                return {
                    code: 403,
                    success: false,
                    message: 'pegawai ini sudah memiliki jabatan',
                    pegawai: null,
                }
            }
            let keycloakRoles: string[] = [jabpeg.levelJabatan.ssoRoleCode]
            let jenisJabatan: JenisJabatanType
                    if (jabpeg.levelJabatan.ssoRoleCode === KEYCLOAK_ROLE_DOSEN) {
                        if (exist.unitKerjaPegawai.length > 0) {
                            jenisJabatan = JenisJabatanType.DT
                            keycloakRoles.push(KEYCLOAK_ROLE_STRUKTURAL)
                        } else {
                            jenisJabatan = JenisJabatanType.DS
                        }
                    } else {
                        jenisJabatan = JenisJabatanType.Tendik
                    }
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id: pegawaiId
                },
                data: {
                    strukturJabatan: {
                        connect: {
                            id: strukturJabatanId
                        }
                    },
                    jenisJabatan,
                    updatedBy: user,
                },
            })
            let accessToken: string
            try {
                const tokenResp = await dataSources.keycloakAPI.createToken()
                accessToken = tokenResp.data.access_token
            } catch (err) {
                return {
                    code: err.response.status,
                    success: false,
                    message: `Gagal create token keycloak: ${err.response.data.error}`,
                    pegawai: null
                }
            }
            try {
                const user = await dataSources.keycloakAPI.getUsers(pegawaiId, accessToken)
                let userRoles= []
                for (const row of keycloakRoles) {
                    const role = await dataSources.keycloakAPI.getRole(row, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                }
                await dataSources.keycloakAPI.addUserRoles(user[0].id, userRoles, accessToken)
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                    pegawai: null
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses update jabatan pegawai ${pegawaiId}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async deleteJabatanPegawai(_, {pegawaiId, strukturJabatanId}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const exist = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: pegawaiId
                },
                select: {
                    strukturJabatanId: true
                }
            })
            if (exist.strukturJabatanId !== strukturJabatanId) {
                return {
                    code: 404,
                    success: false,
                    message: `jabatan pegawai tidak ditemukan pada pegawai ini`,
                    pegawai: null,
                }
            }
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id: pegawaiId
                },
                data: {
                    strukturJabatan: {
                        disconnect: true,
                    },
                    jenisJabatan: null,
                    updatedBy: user,
                }
            })
            let accessToken: string
            try {
                const tokenResp = await dataSources.keycloakAPI.createToken()
                accessToken = tokenResp.data.access_token
            } catch (err) {
                return {
                    code: err.response.status,
                    success: false,
                    message: `Gagal create token keycloak: ${err.response.data.error}`,
                    pegawai: null
                }
            }
            try {
                const user = await dataSources.keycloakAPI.getUsers(pegawaiId, accessToken)
                let userRoles= []
                const keycloakRoles = [KEYCLOAK_ROLE_ADMINISTRASI, KEYCLOAK_ROLE_DOSEN, KEYCLOAK_ROLE_STRUKTURAL, KEYCLOAK_ROLE_FUNGSIONAL]
                for (const row of keycloakRoles) {
                    const role = await dataSources.keycloakAPI.getRole(row, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                }
                await dataSources.keycloakAPI.deleteUserRoles(user[0].id, userRoles, accessToken)
            } catch (err) {
                return {
                    code: err.extensions.response.status,
                    success: false,
                    message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                    pegawai: null
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses delete jabatan pegawai ${pegawaiId}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async createUnitKerjaPegawai(_, {strukturOrganisasiId, pegawaiId, isSecondary}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posisiUker = await dataSources.prisma.strukturOrganisasi.findUnique({
                where: {
                    id: strukturOrganisasiId
                },
                select: {
                    posisiId: true,
                    unitKerjaPegawai: true,
                }
            })
            if (posisiUker?.posisiId !== 'ST' && posisiUker?.unitKerjaPegawai.length > 0) {
                return {
                    code: 401,
                    success: false,
                    message: `Posisi tersebut pada unit kerja ini sudah ada yang isi`,
                    pegawai: null,
                }
            }
            const exist = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: pegawaiId
                },
                select: {
                    jenisJabatan: true,
                    unitKerjaPegawai: {
                        select: {
                            isSecondary: true
                        }
                    },
                }
            })
            if (!isSecondary) {
                for(let row of exist.unitKerjaPegawai) {
                    if (!row.isSecondary) {
                        return {
                            code: 401,
                            success: false,
                            message: `Pegawai ini sudah memiliki unit kerja utama`,
                            pegawai: null,
                        }
                    }
                }
            }
            let data: Prisma.PegawaiUpdateInput = {}
            if (exist.jenisJabatan === JenisJabatanType.DS) {
                data.jenisJabatan = JenisJabatanType.DT
            }
            data.updatedBy = user
            data.unitKerjaPegawai = {
                create: [
                    {
                        strukturOrganisasi: {
                            connect: {
                                id: strukturOrganisasiId
                            }
                        },
                        createdBy: user,
                        updatedBy: user,
                        isSecondary: isSecondary,
                    }
                ]
            }
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id: pegawaiId
                },
                data
            })
            if (exist.jenisJabatan === JenisJabatanType.DS) {
                let accessToken: string
                try {
                    const tokenResp = await dataSources.keycloakAPI.createToken()
                    accessToken = tokenResp.data.access_token
                } catch (err) {
                    return {
                        code: err.response.status,
                        success: false,
                        message: `Gagal create token keycloak: ${err.response.data.error}`,
                        pegawai: null
                    }
                }
                try {
                    const user = await dataSources.keycloakAPI.getUsers(pegawaiId, accessToken)
                    let userRoles= []
                    const role = await dataSources.keycloakAPI.getRole(KEYCLOAK_ROLE_STRUKTURAL, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                    await dataSources.keycloakAPI.addUserRoles(user[0].id, userRoles, accessToken)
                } catch (err) {
                    return {
                        code: err.extensions.response.status,
                        success: false,
                        message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                        pegawai: null
                    }
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses menambah unit kerja pegawai ${pegawaiId}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async updateUnitKerjaPegawai(_, {pegawaiId, strukturOrganisasiId, isSecondary}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const ukerpeg = await dataSources.prisma.unitKerjaPegawai.update({
                where: {
                    strukturOrganisasiId_pegawaiId: {
                        pegawaiId: pegawaiId,
                        strukturOrganisasiId: strukturOrganisasiId,
                    }
                },
                data: {
                    isSecondary: isSecondary,
                    updatedBy: user,
                },
                select: {
                    pegawai: true,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus unit kerja pegawai ${pegawaiId}`,
                pegawai: ukerpeg.pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async deleteUnitKerjaPegawai(_, {strukturOrganisasiId, pegawaiId}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const exist = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: pegawaiId
                },
                select: {
                    jenisJabatan: true,
                    unitKerjaPegawai: true
                }
            })
            let data: Prisma.PegawaiUpdateInput = {}
            data.unitKerjaPegawai = {
                delete: {
                    strukturOrganisasiId_pegawaiId: {
                        pegawaiId,
                        strukturOrganisasiId,
                    }
                }
            }
            if (exist.jenisJabatan === JenisJabatanType.DT && exist.unitKerjaPegawai.length === 1) {
                data.jenisJabatan = JenisJabatanType.DS
                data.updatedBy = user
            }
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id: pegawaiId
                },
                data,
            })
            if (exist.jenisJabatan === JenisJabatanType.DT && exist.unitKerjaPegawai.length === 1) {
                let accessToken: string
                try {
                    const tokenResp = await dataSources.keycloakAPI.createToken()
                    accessToken = tokenResp.data.access_token
                } catch (err) {
                    return {
                        code: err.response.status,
                        success: false,
                        message: `Gagal create token keycloak: ${err.response.data.error}`,
                        pegawai: null
                    }
                }
                try {
                    const user = await dataSources.keycloakAPI.getUsers(pegawaiId, accessToken)
                    let userRoles= []
                    const role = await dataSources.keycloakAPI.getRole(KEYCLOAK_ROLE_STRUKTURAL, accessToken)
                    userRoles.push({
                        id: role.id,
                        name: role.name,
                    })
                    await dataSources.keycloakAPI.deleteUserRoles(user[0].id, userRoles, accessToken)
                } catch (err) {
                    return {
                        code: err.extensions.response.status,
                        success: false,
                        message: `Error keycloak: ${err.extensions.response.body.errorMessage}`,
                        pegawai: null
                    }
                }
            }
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus unit kerja pegawai ${pegawaiId}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async createGradeRemun(_, {id, remun}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const grade = await dataSources.prisma.gradeRemun.create({
                data: {
                    id: id,
                    remun: remun,
                    createdBy: user,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah grade remun ${id}`,
                gradeRemun: grade,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                gradeRemun: null,
            }
        }
    },

    async updateGradeRemun(_, {id, remun}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const grade = await dataSources.prisma.gradeRemun.update({
                where: {
                    id
                },
                data: {
                    remun: remun,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah grade remun ${id}`,
                gradeRemun: grade,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                gradeRemun: null,
            }
        }
    },

    async deleteGradeRemun(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const grade = await dataSources.prisma.gradeRemun.delete({
                where: {
                    id
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus grade remun ${id}`,
                gradeRemun: grade,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                gradeRemun: null,
            }
        }
    },

    async createLeveljabatan(_, {jabatanId, nama, ssoRole}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const jabatan = await dataSources.prisma.jabatan.update({
                where: {
                    id: jabatanId
                },
                data: {
                    levelJabatan: {
                        create: {
                            nama,
                            ssoRole: {
                                connect: {
                                    code: ssoRole
                                }
                            },
                            createdBy: user,
                            updatedBy: user,
                        }
                    },
                    updatedBy: user,
                },
                include: {
                    levelJabatan: true
                }
            })
            const level = jabatan.levelJabatan.find(row => row.nama === nama)
            return {
                code: 200,
                success: true,
                message: `Sukses menambah level ${nama} pada jabatan ${jabatan.nama}`,
                level: level,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                level: null,
            }
        }
    },

    async updateLevelJabatan(_, {id, nama, ssoRole}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const level = await dataSources.prisma.levelJabatan.update({
                where: {
                    id: id
                },
                data: {
                    nama,
                    ssoRole: {
                        connect: {
                            code: ssoRole
                        }
                    },
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah level jabatan ${nama}`,
                level: level,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                level: null,
            }
        }
    },

    async deleteLevelJabatan(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const level = await dataSources.prisma.levelJabatan.delete({
                where: {
                    id: id
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus level jabatan ${level.nama}`,
                level: level,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                level: null,
            }
        }
    },

    async createSubLevelJabatan(_, {nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const sublevel = await dataSources.prisma.sublevelJabatan.create({
                data: {
                    nama,
                    createdBy: user,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah sublevel ${nama}`,
                sublevel: sublevel,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                sublevel: null,
            }
        }
    },

    async updateSublevelJabatan(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const sublevel = await dataSources.prisma.sublevelJabatan.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah sublevel ${nama}`,
                sublevel: sublevel,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                sublevel: null,
            }
        }
    },

    async deleteSubLevelJabatan(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const sublevel = await dataSources.prisma.sublevelJabatan.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus sublevel ${id}`,
                sublevel: sublevel,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                sublevel: null,
            }
        }
    },

    async createPosisi(_, {id, nama, kategori}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posisi = await dataSources.prisma.posisi.create({
                data: {
                    id,
                    nama,
                    kategori,
                    createdBy: user,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah posisi ${nama}`,
                posisi: posisi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                posisi: null,
            }
        }
    },

    async updatePosisi(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posisi = await dataSources.prisma.posisi.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah posisi ${nama}`,
                posisi: posisi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                posisi: null,
            }
        }
    },

    async deletePosisi(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posisi = await dataSources.prisma.posisi.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus posisi ${id}`,
                posisi: posisi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                posisi: null,
            }
        }
    },

    async createUnitKerja(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitKerja = await dataSources.prisma.unitKerja.create({
                data: {
                    id,
                    nama,
                    createdBy: user,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah unit kerja ${nama}`,
                unitKerja: unitKerja,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitKerja: null,
            }
        }
    },

    async updateUnitKerja(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitKerja = await dataSources.prisma.unitKerja.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah unit kerja ${nama}`,
                unitKerja: unitKerja,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitKerja: null,
            }
        }
    },

    async deleteUnitKerja(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitKerja = await dataSources.prisma.unitKerja.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus unit kerja ${id}`,
                unitKerja: unitKerja,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitKerja: null,
            }
        }
    },

    async createBagianUnitKerja(_, {nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const bagian = await dataSources.prisma.bagianUnitKerja.create({
                data: {
                    nama,
                    createdBy: user,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah bagian unit kerja ${nama}`,
                bagian: bagian,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                bagian: null,
            }
        }
    },

    async updateBagianUnitKerja(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const bagian = await dataSources.prisma.bagianUnitKerja.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah bagian unit kerja ${nama}`,
                bagian: bagian,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                bagian: null,
            }
        }
    },

    async deleteBagianUnitKerja(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const bagian = await dataSources.prisma.bagianUnitKerja.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus bagian unit kerja ${id}`,
                bagian: bagian,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                bagian: null,
            }
        }
    },

    async createSubbagUnitKerja(_, {nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const subbag = await dataSources.prisma.subbagUnitKerja.create({
                data: {
                    nama,
                    createdBy: user,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah subbagian unit kerja ${nama}`,
                subbag: subbag,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                subbag: null,
            }
        }
    },

    async updateSubbagUnitKerja(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const subbag = await dataSources.prisma.subbagUnitKerja.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah subbagian unit kerja ${nama}`,
                subbag: subbag,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                subbag: null,
            }
        }
    },

    async deleteSubbagUnitKerja(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const subbag = await dataSources.prisma.subbagUnitKerja.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus subbagian unit kerja ${id}`,
                subbag: subbag,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                subbag: null,
            }
        }
    },

    async createStrukturOrganisasi(_, {input}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const isExist = await dataSources.prisma.strukturOrganisasi.findFirst({
                where: {
                    unitKerjaId: input.unitKerjaId || null,
                    bagianId: input.bagianId || null,
                    subbagId: input.subbagId || null,
                    posisiId: input.posisiId
                }
            })
            if (isExist) {
                return {
                    code: 409,
                    success: false,
                    message: `struktur unit kerja ini sudah ada`,
                    strukturOrganisasi: null,
                }
            }
            let data: Prisma.StrukturOrganisasiCreateInput = {
                posisi: {
                    connect: {
                        id: input.posisiId
                    }
                },
                createdBy: user,
                updatedBy: user,
            }
            if (input.unitKerjaId) {
                data.unitKerja = {
                    connect: {
                        id: input.unitKerjaId,
                    }
                }
            }
            if (input.bagianId) {
                data.bagianUnitKerja = {
                    connect: {
                        id: input.bagianId,
                    }
                }
            }
            if (input.subbagId) {
                data.subbagUnitKerja = {
                    connect: {
                        id: input.subbagId,
                    }
                }
            }
            if (input.grade) {
                data.gradeRemun = {
                    connect: {
                        id: input.grade
                    }
                }
            }
            const posuker = await dataSources.prisma.strukturOrganisasi.create({
                data: data,
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah posisi unit kerja ${posuker.id}`,
                strukturOrganisasi: posuker,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                strukturOrganisasi: null,
            }
        }
    },

    async updateStrukturOrganisasi(_, {id, grade}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posuker = await dataSources.prisma.strukturOrganisasi.update({
                where: {
                    id
                },
                data: {
                    gradeRemun: {
                        connect: {
                            id: grade
                        }
                    },
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah posisi unit kerja ${id}`,
                strukturOrganisasi: posuker,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                strukturOrganisasi: null,
            }
        }
    },

    async deleteStrukturOrganisasi(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const posuker = await dataSources.prisma.strukturOrganisasi.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus posisi unit kerja ${id}`,
                posisiUnitKerja: posuker,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                posisiUnitKerja: null,
            }
        }
    },

    async upsertDosen(_, {pegawaiId, input}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const exist = await dataSources.prisma.pegawai.findUnique({
                where: {
                    id: pegawaiId
                },
                select: {
                    strukturJabatan: {
                        select: {
                            levelJabatan: {
                                select: {
                                    ssoRoleCode: true
                                }
                            }
                        }
                    },
                    dosen: true,
                }
            })
            if (!exist?.strukturJabatan || exist.strukturJabatan.levelJabatan.ssoRoleCode !== KEYCLOAK_ROLE_DOSEN) {
                return {
                    code: 403,
                    success: false,
                    message: "Pegawai ini bukan dosen!",
                    dosen: null
                }
            }
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id: pegawaiId
                },
                data: {
                    dosen: {
                        upsert: {
                            update: {
                                prodi: {
                                    connect: {
                                        id: input.prodiId,
                                    }
                                },
                                orcidId: input.orcidId,
                                sintaId: input.sintaId,
                                scopusId: input.scopusId,
                                wosId: input.wosId,
                                gsId: input.gsId,
                                updatedBy: user,
                            },
                            create: {
                                prodi: {
                                    connect: {
                                        id: input.prodiId,
                                    }
                                },
                                orcidId: input.orcidId,
                                sintaId: input.sintaId,
                                scopusId: input.scopusId,
                                wosId: input.wosId,
                                gsId: input.gsId,
                                createdBy: user,
                                updatedBy: user,
                            }
                        }
                    },
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah dosen ${pegawaiId}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async updatePegawaiStatusPegawai(_, {id, statusPegawaiId}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id
                },
                data: {
                    statusPegawai: {
                        connect: {
                            id: statusPegawaiId,
                        }
                    },
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah status pegawai ${pegawai.nama}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async updatePegawaiStatusAktif(_, {id, statusAktifId}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const pegawai = await dataSources.prisma.pegawai.update({
                where: {
                    id
                },
                data: {
                    statusAktif: {
                        connect: {
                            id: statusAktifId,
                        }
                    },
                    updatedBy: user,
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah status aktif pegawai ${pegawai.nama}`,
                pegawai: pegawai,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                pegawai: null,
            }
        }
    },

    async createFakultas(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const fakultas = await dataSources.prisma.fakultas.create({
                data: {
                    id,
                    nama,
                    createdBy: user,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah fakultas ${fakultas.nama}`,
                fakultas: fakultas,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                fakultas: null,
            }
        }
    },

    async updateFakultas(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const fakultas = await dataSources.prisma.fakultas.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah fakultas ${fakultas.nama}`,
                fakultas: fakultas,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                fakultas: null,
            }
        }
    },

    async deleteFakultas(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const fakultas = await dataSources.prisma.fakultas.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus fakultas ${fakultas.nama}`,
                fakultas: fakultas,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                fakultas: null,
            }
        }
    },

    async createProdi(_, {fakultasId, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const fakultas = await dataSources.prisma.fakultas.update({
                where: {
                    id: fakultasId,
                },
                data: {
                    updatedBy: user,
                    prodi: {
                        create: {
                            nama,
                            createdBy: user,
                            updatedBy: user,
                        }
                    }
                },
                select: {
                    prodi: true
                }
            })
            const prodi = fakultas.prodi.find(row => row.nama === nama)
            return {
                code: 200,
                success: true,
                message: `Sukses menambah prodi ${prodi.nama}`,
                prodi: prodi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                prodi: null,
            }
        }
    },

    async updateProdi(_, {id, nama}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const prodi = await dataSources.prisma.prodi.update({
                where: {
                    id
                },
                data: {
                    nama,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah prodi ${prodi.nama}`,
                prodi: prodi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                prodi: null,
            }
        }
    },

    async deleteProdi(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const prodi = await dataSources.prisma.prodi.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus prodi ${prodi.nama}`,
                prodi: prodi,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                prodi: null,
            }
        }
    },

    async createUnitGaji(_, {id, nama, kodeAnakSatker}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitGaji = await dataSources.prisma.unitGaji.create({
                data: {
                    id,
                    nama,
                    kodeAnakSatker,
                    createdBy: user,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah unit gaji ${unitGaji.nama}`,
                unitGaji: unitGaji,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitGaji: null,
            }
        }
    },

    async updateUnitGaji(_, {id, nama, kodeAnakSatker}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitGaji = await dataSources.prisma.unitGaji.update({
                where: {
                    id
                },
                data: {
                    nama,
                    kodeAnakSatker,
                    updatedBy: user,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah unit gaji ${unitGaji.nama}`,
                unitGaji: unitGaji,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitGaji: null,
            }
        }
    },

    async deleteUnitGaji(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const unitGaji = await dataSources.prisma.unitGaji.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus unit gaji ${unitGaji.nama}`,
                unitGaji: unitGaji,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                unitGaji: null,
            }
        }
    },

    async createStatusAktif(_, {nama, ssoEnabled, isActive}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const statusAktif = await dataSources.prisma.statusAktif.create({
                data: {
                    nama,
                    ssoEnabled,
                    isActive,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah status aktif ${statusAktif.nama}`,
                statusAktif: statusAktif,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                statusAktif: null,
            }
        }
    },

    async updateStatusAktif(_, {id, nama, ssoEnabled, isActive}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const statusAktif = await dataSources.prisma.statusAktif.update({
                where: {
                    id
                },
                data: {
                    nama,
                    ssoEnabled,
                    isActive,
                },
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah status aktif ${statusAktif.nama}`,
                statusAktif: statusAktif,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                statusAktif: null,
            }
        }
    },

    async deleteStatusAktif(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const statusAktif = await dataSources.prisma.statusAktif.delete({
                where: {
                    id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus status aktif ${statusAktif.nama}`,
                statusAktif: statusAktif,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                statusAktif: null,
            }
        }
    },

    async createStrukturJabatan(_, {input}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        const isExist = await dataSources.prisma.strukturJabatan.findFirst({
            where: {
                levelJabatanId: input.levelId,
                sublevelJabatanId: input.sublevelId || null,
            }
        })
        if (isExist) {
            return {
                code: 409,
                success: false,
                message: `struktur jabatan ini sudah ada`,
                strukturJabatan: null,
            }
        }
        let data: Prisma.StrukturJabatanCreateInput = {
            levelJabatan: {
                connect: {
                    id: input.levelId
                }
            },
            createdBy: user,
            updatedBy: user,
        }
        if (input.sublevelId) {
            data.sublevelJabatan = {
                connect: {
                    id: input.sublevelId
                }
            }
        }
        if (input.grade) {
            data.gradeRemun = {
                connect: {
                    id: input.grade
                }
            }
        }
        try {
            const strukturJabatan = await dataSources.prisma.strukturJabatan.create({
                data: data
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menambah struktur jabatan`,
                strukturJabatan: strukturJabatan,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                strukturJabatan: null,
            }
        }
    },

    async updateStrukturJabatan(_, {id, grade}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const strukturJabatan = await dataSources.prisma.strukturJabatan.update({
                where: {
                    id: id
                },
                data: {
                    gradeRemun: {
                        connect: {
                            id: grade
                        }
                    },
                    updatedBy: user
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses mengubah struktur jabatan`,
                strukturJabatan: strukturJabatan,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                strukturJabatan: null,
            }
        }
    },

    async deleteStrukturJabatan(_, {id}, {dataSources, user}){
        if (!user) {
            throw new GraphQLError('User is not authenticated', {
                extensions: {
                    code: 'UNAUTHENTICATED',
                    http: { status: 401 },
                },
            });
        }
        try {
            const strukturJabatan = await dataSources.prisma.strukturJabatan.delete({
                where: {
                    id: id
                }
            })
            return {
                code: 200,
                success: true,
                message: `Sukses menghapus struktur jabatan`,
                strukturJabatan: strukturJabatan,
            }
        } catch (err) {
            return {
                code: 400,
                success: false,
                message: `Error prisma: ${err.message}`,
                strukturJabatan: null,
            }
        }
    }
};

const castPegawaiRopeg = (dataProfil) => {
    let dataParam: Prisma.PegawaiCreateInput | Prisma.PegawaiUpdateInput = {}
    dataParam.nama = dataProfil.NAMA_LENGKAP
    switch (dataProfil.STATUS_PEGAWAI) {
        case 'PNS':
            dataParam.statusPegawai = {
                connect: {
                    id: 1
                }
            }
            break
        case 'CPNS':
            dataParam.statusPegawai = {
                connect: {
                    id: 2
                }
            }
            break
        case 'PPPK':
            dataParam.statusPegawai = {
                connect: {
                    id: 5
                }
            }
            break
        default:
            return {
                code: 404,
                success: false,
                message: `Status pegawai ropeg tidak ditemukan: ${dataProfil.STATUS_PEGAWAI}`,
                pegawai: null
            }
    }
    dataParam.nipLama = dataProfil.NIP
    dataParam.agama = dataProfil.AGAMA
    dataParam.tempatLahir = dataProfil.TEMPAT_LAHIR
    dataParam.tglLahir = new Date(dataProfil.TANGGAL_LAHIR.split(" ")[0])
    dataParam.emailPribadi = dataProfil.EMAIL
    dataParam.noHp = dataProfil.TELEPON
    dataParam.alamatDesc1 = dataProfil.ALAMAT_1
    dataParam.alamatDesc2 = dataProfil.ALAMAT_2
    // if (dataProfil.ALAMAT_1 && dataProfil.ALAMAT_2) {
    //     dataParam.alamatDesc = dataProfil.ALAMAT_1 + dataProfil.ALAMAT_2
    // } else if (dataProfil.ALAMAT_1) {
    //     dataParam.alamatDesc = dataProfil.ALAMAT_1
    // } else if (dataProfil.ALAMAT_2) {
    //     dataParam.alamatDesc = dataProfil.ALAMAT_2
    // }
    switch (dataProfil.JENIS_KELAMIN) {
        case 0:
            dataParam.jenisKelamin = 'P'
            break
        case 1:
            dataParam.jenisKelamin = 'L'
            break
        default:
            break
    }
    dataParam.alamatKota = dataProfil.KAB_KOTA
    dataParam.alamatProv = dataProfil.PROVINSI
    dataParam.alamatKodepos = dataProfil.KODE_POS
    if(dataProfil.TMT_CPNS) {
        const split = dataProfil.TMT_CPNS.split("-")
        const reformatted = `${split[2]}-${split[1]}-${split[0]}`
        dataParam.tmtCpns = new Date(reformatted)
    }
    dataParam.tmtKgbYad = new Date(dataProfil.tmt_kgb_yad)
    dataParam.tmtPangkatYad = new Date(dataProfil.tmt_pangkat_yad)
    dataParam.tmtPensiun = new Date(dataProfil.TMT_PENSIUN)
    dataParam.statusKawin = dataProfil.STATUS_KAWIN
    return dataParam
}

const castPendidikanRopeg= (dataPendidikan): Prisma.PendidikanCreateManyPegawaiInput => {
    return dataPendidikan.map(row => {
        return {
            id: randomUUID(),
            namaSekolah: row.NAMA_SEKOLAH,
            fakultas: row.FAKULTAS_PENDIDIKAN,
            jurusan: row.JURUSAN,
            tahunLulus: +row.TAHUN_LULUS,
            jenjang: row.JENJANG_PENDIDIKAN,
            lokasiSekolah: row.LOKASI_SEKOLAH,
            akta: row.AKTA
        }
    })
}

const castPangkatRopeg = (pangkat): Prisma.PangkatCreateManyPegawaiInput => {
    return pangkat.map(row => {
        return {
            id: randomUUID(),
            nama: row.PANGKAT,
            golonganRuang: row.GOL_RUANG,
            noSk: row.NO_SK,
            tmt: new Date(row.TMT_SK),
            ket: row.KETERANGAN,
        }
    })
}

const castJabatanRopeg = (jabatan): Prisma.JabatanKemenagCreateManyPegawaiInput => {
    return jabatan.map(row => {
        return {
            id: randomUUID(),
            nama: row.JABATAN,
            noSk: row.NO_SK,
            tmt: new Date(row.TMT_SK),
            unitKerja: row.KETERANGAN_SATUAN_KERJA,
            bidangStudi: row.BIDANG_STUDI,
        }
    })
}

export default mutations;
