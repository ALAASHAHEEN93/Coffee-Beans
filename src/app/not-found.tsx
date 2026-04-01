/**
 * Global 404: the root layout is a pass-through (no <html>), so this file must
 * render a full document for unknown URLs that do not match `(frontend)` or `(payload)`.
 */
export default function NotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', margin: 0, padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>404</h1>
        <p>This page could not be found.</p>
      </body>
    </html>
  )
}
