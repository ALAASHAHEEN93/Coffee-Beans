'use client'

import type { Media as MediaType } from '@/payload-types'
import Image from 'next/image'
import React, { useState } from 'react'
import { Media } from '@/components/Media'

export type CoffeeLabLogoProps = {
  className?: string
  priority?: boolean
  width?: number
  height?: number
  siteName: string
  logo?: MediaType | string | null
}

/** Public fallback when no CMS upload yet — same path as before (`public/images/logo.png`). */
const LOGO_FALLBACK_SRC = '/images/logo.png'

/**
 * 1) CMS `siteLogo` (Vercel Blob / API) when set in Payload.
 * 2) Local wordmark at `/images/logo.png` if the file exists.
 * 3) Text fallback if the image fails to load.
 */
export function CoffeeLabLogo({
  className,
  priority,
  width = 508,
  height = 102,
  siteName,
  logo,
}: CoffeeLabLogoProps) {
  const [fallbackFailed, setFallbackFailed] = useState(false)

  const hasCmsUrl = typeof logo === 'object' && logo !== null && 'url' in logo && logo.url

  if (hasCmsUrl) {
    return (
      <Media
        resource={logo}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes="(max-width: 800px) min(70vw, 250px), 260px"
        alt={siteName}
      />
    )
  }

  if (!fallbackFailed) {
    return (
      <Image
        src={LOGO_FALLBACK_SRC}
        alt={siteName}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes="(max-width: 800px) min(70vw, 250px), 260px"
        onError={() => setFallbackFailed(true)}
      />
    )
  }

  return (
    <span className={`brandWordmark ${className ?? ''}`} style={{ fontWeight: 700, letterSpacing: '0.04em' }}>
      {siteName}
    </span>
  )
}
