import React from 'react'
import './styles.css'

/**
 * Document shell for the marketing site only. Payload routes use their own layout
 * and must not inherit a second <html>/<body> from here.
 * suppressHydrationWarning avoids false hydration errors when browser extensions
 * inject attributes on <html>/<body> before React hydrates.
 */
export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <main>{children}</main>
      </body>
    </html>
  )
}
