import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

/**
 * Payload plugins (Vercel Blob for media). Referenced from `payload.config.ts`.
 * When `BLOB_READ_WRITE_TOKEN` is unset (e.g. local dev), the adapter stays disabled
 * and uploads fall back to local storage.
 */
export const payloadPlugins = [
  vercelBlobStorage({
    enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
    token: process.env.BLOB_READ_WRITE_TOKEN,
    collections: {
      media: {
        prefix: 'media',
        disablePayloadAccessControl: true,
      },
    },
  }),
]
