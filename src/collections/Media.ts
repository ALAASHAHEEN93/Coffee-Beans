import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: () => true,
  },
  admin: {
    group: 'Media',
    description: 'All images for the site. Files are stored in Vercel Blob in production.',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Short description for screen readers and SEO (required).',
      },
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Optional caption shown with the image where the layout supports it.',
      },
    },
  ],
}
