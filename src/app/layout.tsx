import React from 'react'

export const metadata = {
  description: 'CoffeeLab — Molecular Roastery',
  title: 'CoffeeLab',
}

/**
 * Pass-through root: do not wrap in <html>/<body> here. The marketing site uses
 * `(frontend)/layout.tsx` for the document; Payload admin uses `@payloadcms/next`
 * `RootLayout`, which renders its own <html>/<body>. Nesting both caused hydration errors.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
