'use client'

import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'
import React from 'react'

function resolveUrl(resource: MediaType | string | null | undefined): string | null {
  if (!resource) return null
  if (typeof resource === 'string') {
    return resource.startsWith('/') ? resource : null
  }
  if (typeof resource === 'object' && resource !== null && 'url' in resource && resource.url) {
    return resource.url
  }
  return null
}

function resolveAlt(resource: MediaType | string | null | undefined, fallback: string): string {
  if (typeof resource === 'object' && resource !== null && 'alt' in resource && resource.alt) {
    const a = resource.alt
    if (typeof a === 'string') return a
  }
  return fallback
}

export type MediaProps = {
  resource?: MediaType | string | number | null
  /** Used when `resource` is unresolved or missing alt */
  alt?: string
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  width?: number
  height?: number
}

/**
 * Renders a Payload media upload (`url` from CMS) or a static file under `/public` when `resource` is a path string starting with `/`.
 * If there is no resolvable image, renders a neutral placeholder block.
 */
export function Media({
  resource,
  alt = '',
  className,
  priority,
  fill,
  sizes,
  width = 800,
  height = 600,
}: MediaProps) {
  if (typeof resource === 'number') {
    return (
      <div
        className={className}
        style={{ background: 'rgba(120,120,120,0.15)', minHeight: 120, minWidth: 120 }}
        aria-hidden
      />
    )
  }

  if (typeof resource === 'string' && !resource.startsWith('/')) {
    return (
      <div
        className={className}
        style={{ background: 'rgba(120,120,120,0.15)', minHeight: 120, minWidth: 120 }}
        aria-hidden
      />
    )
  }

  const url = resolveUrl(resource)
  if (!url) {
    return (
      <div
        className={className}
        style={{ background: 'rgba(120,120,120,0.12)', minHeight: 120, minWidth: 120 }}
        aria-hidden
      />
    )
  }

  const altText = typeof resource === 'string' ? alt || '' : resolveAlt(resource, alt)

  if (fill) {
    return (
      <Image
        src={url}
        alt={altText}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src={url}
      alt={altText}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
