'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const LANG_COOKIE = 'payload-lng'

type Locale = 'de' | 'en'

/**
 * Sets Payload’s locale cookie (`payload-lng`) and refreshes the RSC tree so the home global loads in DE or EN.
 * `inline` matches primary nav link styling (bold caps); `segmented` is the bordered control.
 */
export function LanguageToggle({
  locale,
  variant = 'segmented',
}: {
  locale: Locale
  variant?: 'segmented' | 'inline'
}) {
  const router = useRouter()

  const setLocale = (next: Locale) => {
    if (next === locale) return
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  if (variant === 'inline') {
    return (
      <div className="langToggle langToggle--inline" role="group" aria-label="Sprache / Language">
        <button
          type="button"
          className={`langToggleBtn langToggleBtn--inline${locale === 'de' ? ' langToggleBtn--inlineActive' : ''}`}
          onClick={() => setLocale('de')}
          aria-pressed={locale === 'de'}
          aria-label="Deutsch"
        >
          DE
        </button>
        <span className="langToggleSep" aria-hidden="true">
          /
        </span>
        <button
          type="button"
          className={`langToggleBtn langToggleBtn--inline langToggleBtn--inlineNarrow${locale === 'en' ? ' langToggleBtn--inlineActive' : ''}`}
          onClick={() => setLocale('en')}
          aria-pressed={locale === 'en'}
          aria-label="English"
        >
          E
        </button>
      </div>
    )
  }

  return (
    <div className="langToggle" role="group" aria-label="Sprache / Language">
      <button
        type="button"
        className={`langToggleBtn${locale === 'de' ? ' langToggleBtn--active' : ''}`}
        onClick={() => setLocale('de')}
        aria-pressed={locale === 'de'}
        aria-label="Deutsch"
      >
        DE
      </button>
      <button
        type="button"
        className={`langToggleBtn${locale === 'en' ? ' langToggleBtn--active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        aria-label="English"
      >
        E
      </button>
    </div>
  )
}
