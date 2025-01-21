import { QueryResolvers } from "../types";
import {Prisma} from "@prisma/client";

// Use the generated `QueryResolvers` type to type check our queries!
const queries: QueryResolvers = {
    // Our third argument (`contextValue`) has a type here, so we
    // can check the properties within our resolver's shared context value.
    daftarPegawai: async (_, args, { dataSources }) => {
        const take = ('take' in args && args.take <= 100) ? args.take : 100;
        const or: Prisma.PegawaiWhereInput | {} = args.filter?.searchString
            ? {
                OR: [
                    { nama: { contains: args.filter.searchString, mode: 'insensitive' } },
                    { id: { contains: args.filter.searchString } },
                ],
            }
            : {};

        const where = {
            ...or,
            statusAktifId: { in: args.filter?.daftarStatusAktifId },
            statusPegawaiId: { in: args.filter?.daftarStatusPegawaiId },
            jenisJabatan: { in: args.filter?.jenisJabatan }
        }

        const [pegawai, count] = await dataSources.prisma.$transaction([
            dataSources.prisma.pegawai.findMany({
                where,
                skip: args?.skip as number | undefined,
                take,
                orderBy: args?.orderBy as
                    | Prisma.Enumerable<Prisma.PegawaiOrderByWithRelationInput>
                    | undefined,
            }),
            dataSources.prisma.pegawai.count({ where })
        ])
        const id = `daftar-pegawai:${JSON.stringify(args)}`;
        return {
            id,
            count,
            pegawai,
        }
    },

    pegawai: (_, { id }, { dataSources }) => {
        return dataSources.prisma.pegawai.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarJabatan: (_, __, { dataSources }) => {
        return dataSources.prisma.jabatan.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    jabatan: (_, { id }, { dataSources }) => {
        return dataSources.prisma.jabatan.findUnique({
            where: {
                id: id
            }
        })
    },

    levelJabatan: (_, {id}, {dataSources}) => {
        return dataSources.prisma.levelJabatan.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarSublevelJabatan(_, __, {dataSources}){
        return dataSources.prisma.sublevelJabatan.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    sublevelJabatan(_, {id}, {dataSources}){
        return dataSources.prisma.sublevelJabatan.findUnique({
            where: {
                id
            }
        })
    },

    daftarStrukturJabatan(_, {levelId, sublevelId}, {dataSources}){
        return dataSources.prisma.strukturJabatan.findMany({
            where: {
                levelJabatanId: levelId,
                sublevelJabatanId: sublevelId,
            },
        })
    },

    strukturJabatan(_, {id}, {dataSources}){
        return dataSources.prisma.strukturJabatan.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarUnitKerja: (_, __, { dataSources }) => {
        return dataSources.prisma.unitKerja.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    unitKerja: (_, { id }, { dataSources }) => {
        return dataSources.prisma.unitKerja.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarBagianUnitKerja: (_, __, { dataSources }) => {
        return dataSources.prisma.bagianUnitKerja.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    bagianUnitKerja: (_, { id }, { dataSources }) => {
        return dataSources.prisma.bagianUnitKerja.findUnique({
            where: {
                id: id,
            },
        })
    },

    daftarSubbagUnitKerja: (_, __, { dataSources }) => {
        return dataSources.prisma.subbagUnitKerja.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    subbagUnitKerja: (_, { id }, { dataSources }) => {
        return dataSources.prisma.subbagUnitKerja.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarStrukturOrganisasi(_, {unitKerjaId, bagianId, subbagId}, {dataSources}){
        return dataSources.prisma.strukturOrganisasi.findMany({
            where: {
                unitKerjaId,
                bagianId,
                subbagId,
            },
            orderBy: [
                { unitKerjaId: {sort: 'asc', nulls: 'first' } },
                { bagianId: {sort: 'asc', nulls: 'first'} },
                { subbagId: {sort: 'asc', nulls: 'first'} },
                { gradeRemun: { remun: 'desc' } },
            ],
        })
    },

    daftarUnitGaji: (_, __, { dataSources }) => {
        return dataSources.prisma.unitGaji.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    unitGaji: (_, { id }, { dataSources }) => {
        return dataSources.prisma.unitGaji.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarFakultas: (_, __, { dataSources }) => {
        return dataSources.prisma.fakultas.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    fakultas: (_, { id }, { dataSources }) => {
        return dataSources.prisma.fakultas.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarStatusAktif: (_ , __, { dataSources }) => {
        return dataSources.prisma.statusAktif.findMany()
    },

    daftarStatusPegawai: (_, __, { dataSources }) => {
        return dataSources.prisma.statusPegawai.findMany()
    },

    statusPegawai: (_, { id }, { dataSources }) => {
        return dataSources.prisma.statusPegawai.findUnique({
            where: {
                id: id,
            }
        })
    },

    daftarGradeRemun: (_, __, { dataSources }) => {
        return dataSources.prisma.gradeRemun.findMany({
            orderBy: {
                remun: 'asc'
            }
        })
    },

    gradeRemun: (_, { id }, { dataSources }) => {
        return dataSources.prisma.gradeRemun.findUnique({
            where: {
                id: id
            }
        })
    },

    daftarPosisi: (_, __, { dataSources }) => {
        return dataSources.prisma.posisi.findMany({
            orderBy: {
                nama: 'asc'
            }
        })
    },

    daftarSsoRole: (_, __, { dataSources }) => {
        return dataSources.prisma.ssoRole.findMany({
            orderBy: {
                code: 'asc'
            }
        })
    }
};

export default queries;
