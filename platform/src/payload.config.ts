import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";
import { collections } from "./collections";
import { SiteSettings } from "./globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const useS3 = !!process.env.S3_BUCKET;

export default buildConfig({
  serverURL: process.env.PUBLIC_URL,
  secret: process.env.PAYLOAD_SECRET || "",
  admin: {
    user: "users",
    meta: { titleSuffix: " · RRPL admin" },
    importMap: { baseDir: path.resolve(dirname) },
  },
  collections,
  globals: [SiteSettings],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Schema changes go through migrations in production: `npm run migrate:create` then `npm run migrate`.
    push: process.env.NODE_ENV !== "production",
  }),
  sharp,
  cors: (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  csrf: (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean),
  upload: { limits: { fileSize: 8 * 1024 * 1024 } },
  plugins: useS3
    ? [
        s3Storage({
          collections: { media: true, "complaint-files": { prefix: "complaints" } },
          bucket: process.env.S3_BUCKET!,
          config: {
            region: process.env.S3_REGION ?? "ap-south-1",
            endpoint: process.env.S3_ENDPOINT || undefined,
            credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
          },
        }),
      ]
    : [],
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
