import {GraphQLError} from "graphql";
import { IncomingHttpHeaders } from "http";
import {Consumer, PrismaClient} from "@prisma/client";
import axios from "axios";

async function keycloakUserInfo(token: string) {
    try {
        const response = await axios.get(`${process.env.KEYCLOAK_URL}/realms/uinar/protocol/openid-connect/userinfo`, {
            headers: {
                Authorization: token
            }
        });
        return response.data.preferred_username
    } catch (error) {
        // console.error(error.response);
        // throwing a `GraphQLError` here allows us to specify an HTTP status code,
        // standard `Error`s will have a 500 status code by default
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }
}

function checkData(data: Consumer) {
    if (!data) {
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }
}

const cekAppApiKey = async (apikey: string | string[], prisma: PrismaClient) => {
    try {
        const consumer = await prisma.consumer.findFirst({
            where: {
                key: apikey as string,
            }
        })
        checkData(consumer)
    } catch (error) {
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        });
    }
}

export async function getUser(headers: IncomingHttpHeaders, prisma: PrismaClient) {
    // return 'tester'
    if (headers.authorization) {
        return keycloakUserInfo(headers.authorization)
    } else if(headers.apikey) {
        await cekAppApiKey(headers.apikey, prisma)
    } else {
        throw new GraphQLError('User is not authenticated', {
            extensions: {
                code: 'UNAUTHENTICATED',
                http: { status: 401 },
            },
        })
    }
}
