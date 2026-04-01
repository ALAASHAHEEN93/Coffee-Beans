/**
 * Syncs the `home` global (de → en) and uploads images from `public/images/` into Media.
 * Sequential writes only (MongoDB Atlas M0 friendly).
 *
 * Run: pnpm seed:home
 */
import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HOME_DEFAULTS } from '@/lib/homeDefaults'
import { HOME_SEED_DE } from '@/lib/homeSeedDe'
import { LABORATORY_FALLBACK_PRODUCTS } from '@/lib/laboratoryFallbackProducts'

const ctx = { skipRevalidate: true, disableRevalidate: true, skipAutoTranslate: true } as const

function stitchIds<T extends { id?: string | null }>(
  saved: T[] | null | undefined,
  template: T[] | null | undefined,
): T[] | undefined {
  if (!template?.length) return template
  return template.map((row, i) => ({
    ...row,
    id: saved?.[i]?.id ?? row.id,
  })) as T[]
}

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  relFromProjectRoot: string,
  altDe: string,
  altEn: string,
): Promise<string | undefined> {
  const full = path.join(process.cwd(), relFromProjectRoot)
  if (!fs.existsSync(full)) {
    console.warn(`[seed] skip (file missing): ${relFromProjectRoot}`)
    return undefined
  }
  const created = await payload.create({
    collection: 'media',
    data: { alt: altDe },
    filePath: full,
    overrideAccess: true,
    context: ctx,
    locale: 'de',
  })
  await payload.update({
    collection: 'media',
    id: created.id,
    locale: 'en',
    data: { alt: altEn },
    overrideAccess: true,
    context: ctx,
  })
  console.log('[seed] media', relFromProjectRoot, '→', created.id)
  return created.id
}

/** Same order as LABORATORY_FALLBACK_PRODUCTS keys 1–6 (Featured Specimens). */
const PRODUCT_IMAGE_FILES = [
  'public/images/featured-specimens/01-signature-house-blend.png',
  'public/images/featured-specimens/02-ethiopian-yirgacheffe.png',
  'public/images/featured-specimens/03-dark-matter-espresso.png',
  'public/images/featured-specimens/04-colombia-pink-bourbon.png',
  'public/images/featured-specimens/05-kenya-aa-nyeri.png',
  'public/images/featured-specimens/06-sumatra-mandheling.png',
] as const

async function main() {
  const payload = await getPayload({ config })

  const siteLogoId = await uploadMedia(
    payload,
    'public/images/logo.png',
    'CoffeeLab Wortmarke',
    'CoffeeLab wordmark',
  )

  const heroBgId = await uploadMedia(
    payload,
    'public/images/hero-bg-main.png',
    'Hero Hintergrund',
    'Hero background',
  )

  const geneticImgId = await uploadMedia(
    payload,
    'public/images/section-two-product.png',
    'Genetische Sourcing-Sektion',
    'Genetic sourcing section',
  )

  const thermalImgId = await uploadMedia(
    payload,
    'public/images/section-three-roaster.png',
    'Thermische Präzision',
    'Thermal precision',
  )

  const valueImgId = await uploadMedia(
    payload,
    'public/images/section-four-final.png',
    'Transparenz-Sektion',
    'Transparency section',
  )

  const productMediaIds: (string | undefined)[] = []
  for (let i = 0; i < PRODUCT_IMAGE_FILES.length; i++) {
    const rel = PRODUCT_IMAGE_FILES[i]
    const p = LABORATORY_FALLBACK_PRODUCTS[i]
    const title = p?.title ?? `Product ${i + 1}`
    const id = await uploadMedia(
      payload,
      rel,
      `${title} – Produktfoto`,
      `${title} – product photo`,
    )
    productMediaIds.push(id)
  }

  const storeProductsSeed = LABORATORY_FALLBACK_PRODUCTS.map((p, i) => ({
    key: p.key,
    title: p.title,
    description: p.description,
    rating: p.rating,
    reviews: p.reviews,
    price: p.price,
    categories: p.categories,
    ...(productMediaIds[i] ? { image: productMediaIds[i] } : {}),
    tags: p.tags.map((label) => ({ label })),
  }))

  const deData = {
    ...HOME_DEFAULTS,
    ...HOME_SEED_DE,
    siteName: 'CoffeeLab',
    ...(siteLogoId ? { siteLogo: siteLogoId } : {}),
    ...(heroBgId ? { heroBackground: heroBgId } : {}),
    geneticSection: {
      ...HOME_DEFAULTS.geneticSection,
      ...HOME_SEED_DE.geneticSection,
      ...(geneticImgId ? { image: geneticImgId } : {}),
    },
    thermalSection: {
      ...HOME_DEFAULTS.thermalSection,
      ...HOME_SEED_DE.thermalSection,
      ...(thermalImgId ? { image: thermalImgId } : {}),
    },
    valueSection: {
      ...HOME_DEFAULTS.valueSection,
      ...HOME_SEED_DE.valueSection,
      ...(valueImgId ? { image: valueImgId } : {}),
    },
    ...(storeProductsSeed.length ? { storeProducts: storeProductsSeed } : {}),
  }

  await payload.updateGlobal({
    slug: 'home',
    locale: 'de',
    data: deData,
    overrideAccess: true,
    context: ctx,
  })

  const saved = await payload.findGlobal({ slug: 'home', locale: 'de', depth: 2 })

  const enStoreProducts = saved.storeProducts?.map((row, i) => {
    const p = LABORATORY_FALLBACK_PRODUCTS[i]
    if (!p || !row) return row
    return {
      id: row.id,
      key: p.key,
      title: p.title,
      description: p.description,
      rating: p.rating,
      reviews: p.reviews,
      price: p.price,
      categories: p.categories,
      image: row.image,
      tags: row.tags?.map((t, ti) => ({
        id: t.id,
        label: p.tags[ti] ?? '',
      })),
    }
  })

  const enData = {
    ...HOME_DEFAULTS,
    siteName: 'CoffeeLab',
    ...(siteLogoId ? { siteLogo: siteLogoId } : {}),
    ...(heroBgId ? { heroBackground: heroBgId } : {}),
    geneticSection: {
      ...HOME_DEFAULTS.geneticSection,
      ...(geneticImgId ? { image: geneticImgId } : {}),
    },
    thermalSection: {
      ...HOME_DEFAULTS.thermalSection,
      ...(thermalImgId ? { image: thermalImgId } : {}),
    },
    valueSection: {
      ...HOME_DEFAULTS.valueSection,
      ...(valueImgId ? { image: valueImgId } : {}),
    },
    navItems: stitchIds(saved.navItems, HOME_DEFAULTS.navItems),
    storeFilters: stitchIds(saved.storeFilters, HOME_DEFAULTS.storeFilters),
    labStats: stitchIds(saved.labStats, HOME_DEFAULTS.labStats),
    matrixTagsEspresso: stitchIds(saved.matrixTagsEspresso, HOME_DEFAULTS.matrixTagsEspresso),
    matrixTagsFilter: stitchIds(saved.matrixTagsFilter, HOME_DEFAULTS.matrixTagsFilter),
    scanStats: stitchIds(saved.scanStats, HOME_DEFAULTS.scanStats),
    blendingExpertCards: stitchIds(saved.blendingExpertCards, HOME_DEFAULTS.blendingExpertCards),
    manualRowsEspresso: stitchIds(saved.manualRowsEspresso, HOME_DEFAULTS.manualRowsEspresso),
    manualRowsFilter: stitchIds(saved.manualRowsFilter, HOME_DEFAULTS.manualRowsFilter),
    vaultCards: stitchIds(saved.vaultCards, HOME_DEFAULTS.vaultCards),
    footerMapLinks: stitchIds(saved.footerMapLinks, HOME_DEFAULTS.footerMapLinks),
    footerOpsLinks: stitchIds(saved.footerOpsLinks, HOME_DEFAULTS.footerOpsLinks),
    ...(enStoreProducts?.length ? { storeProducts: enStoreProducts } : {}),
  }

  await payload.updateGlobal({
    slug: 'home',
    locale: 'en',
    data: enData,
    overrideAccess: true,
    context: ctx,
  })

  console.log('[seed] home global synced: CoffeeLab (de + en), images wired where files exist.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
