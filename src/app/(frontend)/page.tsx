import { getPayload } from 'payload'
import config from '@payload-config'
import { getRequestLocale } from '@/lib/getLocale'
import HomePageClient from './HomePageClient'

export default async function Page() {
  const payload = await getPayload({ config })
  const locale = await getRequestLocale()
  const home = await payload.findGlobal({ slug: 'home', locale, depth: 2 })
  return <HomePageClient home={home} locale={locale} />
}
