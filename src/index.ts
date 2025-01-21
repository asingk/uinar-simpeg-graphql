import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import resolvers from "./resolvers/index.js";
import { Context } from "./context.js";
import { resolvers as scalarResolvers, typeDefs as scalarTypeDefs } from 'graphql-scalars'
import {PrismaClient} from "@prisma/client";
import {RopegApi} from "./datasources/ropeg-api.js";
import {getUser} from "./utils.js";
import {KeycloakApi} from "./datasources/keycloak-api.js";

const prisma = new PrismaClient({
    log: ['error'],
})

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer<Context>({
    typeDefs: [
        ...scalarTypeDefs,
        typeDefs
    ],
    resolvers: {
        ...scalarResolvers,
        ...resolvers
    },
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    context: async ({req}) => {
        const { cache } =  server
        // Try to retrieve a user with the token
        const user = await getUser(req.headers, prisma)
        return {
            dataSources: {
                prisma: prisma,
                ropegAPI: new RopegApi({ cache }),
                keycloakAPI: new KeycloakApi({cache}),
            },
            user
        }
    }
});

console.log(`🚀  Server ready at: ${url}`);
