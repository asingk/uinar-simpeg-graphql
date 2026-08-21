import express from 'express';
import http from 'http';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { readFileSync } from 'fs';
import resolvers from "./resolvers/index.js";
import { Context } from "./context.js";
import { resolvers as scalarResolvers, typeDefs as scalarTypeDefs } from 'graphql-scalars';
import { PrismaClient } from "@prisma/client";
import { RopegApi } from "./datasources/ropeg-api.js";
import { getUser } from "./utils.js";
import { KeycloakApi } from "./datasources/keycloak-api.js";
import { fetchPegawaiDrhData, generateDrhPdf } from "./services/drh-pdf.js";

const prisma = new PrismaClient({
    log: ['error'],
});

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer<Context>({
    typeDefs: [
        ...scalarTypeDefs,
        typeDefs,
    ],
    resolvers: {
        ...scalarResolvers,
        ...resolvers,
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(cors());

// Handler untuk download PDF Daftar Riwayat Hidup (DRH) Pegawai
const handleDrhDownload: express.RequestHandler = async (req, res) => {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) {
        res.status(400).json({ error: 'NIP / ID Pegawai diperlukan' });
        return;
    }

    // Mendukung autentikasi via Header (Authorization, apikey) atau Query parameter (token, apikey)
    const authHeaders = {
        ...req.headers,
        authorization: (req.headers.authorization || (req.query.token ? `Bearer ${req.query.token}` : undefined)) as string | undefined,
        apikey: (req.headers.apikey || req.query.apikey) as string | undefined,
    };

    try {
        await getUser(authHeaders, prisma);
    } catch (authError: any) {
        res.status(401).json({
            error: 'User is not authenticated',
            message: authError?.message || 'Unauthorized',
        });
        return;
    }

    try {
        const pegawaiData = await fetchPegawaiDrhData(prisma, id);
        if (!pegawaiData) {
            res.status(404).json({ error: `Pegawai dengan ID ${id} tidak ditemukan` });
            return;
        }

        const pdfDoc = generateDrhPdf(pegawaiData);
        const safeNama = (pegawaiData.nama || 'pegawai').replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `DRH_${id}_${safeNama}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

        pdfDoc.pipe(res);
        pdfDoc.end();
    } catch (err: any) {
        console.error('Error generating DRH PDF:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Gagal membuat file PDF', details: err?.message });
        }
    }
};

// Route endpoints untuk download PDF DRH
app.get('/api/pegawai/:id/drh', handleDrhDownload);

// Apollo GraphQL Middleware
app.use(
    '/',
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => {
            const { cache } = server;
            const user = await getUser(req.headers, prisma);
            return {
                dataSources: {
                    prisma: prisma,
                    ropegAPI: new RopegApi({ cache }),
                    keycloakAPI: new KeycloakApi({ cache }),
                },
                user,
            };
        },
    }),
);

const PORT = process.env.PORT || 4000;
await new Promise<void>((resolve) => httpServer.listen({ port: Number(PORT) }, resolve));

console.log(`🚀  Server ready at: http://localhost:${PORT}/`);
