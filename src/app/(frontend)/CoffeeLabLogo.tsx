import Image from 'next/image'

export type CoffeeLabLogoProps = {
  className?: string
  priority?: boolean
  /** Intrinsic dimensions for Next/Image (layout scales via CSS) */
  width?: number
  height?: number
}

/**
 * Brand wordmark — same asset as the hero top bar (`/images/logo.png`).
 */
export function CoffeeLabLogo({
  className,
  priority,
  width = 508,
  height = 102,
}: CoffeeLabLogoProps) {
  return (
    <Image
      src="/images/logo.png"
      alt="CoffeeLab"
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes="(max-width: 800px) min(70vw, 250px), 260px"
    />
  )
}
