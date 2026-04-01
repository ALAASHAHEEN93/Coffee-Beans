import { cookies } from 'next/headers'

/**
 * Reads Payload admin cookie when present; otherwise defaults to German (site default).
 */
export async function getRequestLocale(): Promise<'de' | 'en'> {
  const c = (await cookies()).get('payload-lng')?.value
  if (c === 'en') return 'en'
  return 'de'
}
