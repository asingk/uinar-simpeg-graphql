import {PrismaClient} from '@prisma/client'
import {RopegApi} from "./datasources/ropeg-api";
import {KeycloakApi} from "./datasources/keycloak-api";

export interface Context {
    dataSources: {
        prisma: PrismaClient,
        ropegAPI: RopegApi,
        keycloakAPI: KeycloakApi,
    },
    user: string
}

// const prisma = new PrismaClient({
//     log: ['error'],
// })
//
// export const createContext = async () => ({
//     prisma: prisma
// })