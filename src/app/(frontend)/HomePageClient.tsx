'use client'

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import type { Home } from '@/payload-types'
import { Media } from '@/components/Media'
import { mergeHome } from '@/lib/mergeHome'
import { LABORATORY_FALLBACK_PRODUCTS } from '@/lib/laboratoryFallbackProducts'
import PrecisionLab from './PrecisionLab'
import { CoffeeLabLogo } from './CoffeeLabLogo'
import { LaboratoryStore } from './LaboratoryStore'
import { LanguageToggle } from '@/components/LanguageToggle'
import './styles.css'

/** Default hero when CMS has no `heroBackground` (coffee / coaster photo). */
const HERO_FALLBACK_SRC = '/images/hero-bg-caffe-zapra.png'

function mapScanTemplate(template: string, brewMode: 'espresso' | 'filter') {
  const beam = brewMode === 'espresso' ? '165' : '99'
  const water = brewMode === 'espresso' ? '92.4' : '99'
  return template.replace(/\{beam\}/g, beam).replace(/\{water\}/g, water)
}

export default function HomePageClient({
  home,
  locale,
}: {
  home: Home | null
  locale: 'de' | 'en'
}) {
  const cms = useMemo(() => mergeHome(home), [home])
  const [brewMode, setBrewMode] = useState<'espresso' | 'filter'>('filter')
  const [assemblyMode, setAssemblyMode] = useState<'expert' | 'manual'>('expert')
  const [manualBlend, setManualBlend] = useState({
    originA: 60,
    originB: 20,
    roastLab: 20,
  })
  const blendSectionRef = useRef<HTMLElement>(null)
  const [blendSectionRevealed, setBlendSectionRevealed] = useState(false)

  useLayoutEffect(() => {
    const el = blendSectionRef.current
    if (!el) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBlendSectionRevealed(true)
      return
    }
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    if (rect.top < vh * 0.9 && rect.bottom > vh * 0.08) {
      setBlendSectionRevealed(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBlendSectionRevealed(true)
          io.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    setManualBlend(
      brewMode === 'espresso'
        ? { originA: 60, originB: 20, roastLab: 20 }
        : { originA: 45, originB: 35, roastLab: 20 },
    )
  }, [brewMode])

  const adjustBlend = (key: 'originA' | 'originB' | 'roastLab', delta: number) => {
    setManualBlend((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, prev[key] + delta)),
    }))
  }

  const blendTotal = manualBlend.originA + manualBlend.originB + manualBlend.roastLab
  /** Ring stroke caps at 100%; center can show e.g. 120% */
  const strokePercent = Math.min(100, blendTotal)
  const isBlendComplete = blendTotal >= 100

  const [neuralEmail, setNeuralEmail] = useState('')
  const [neuralNotice, setNeuralNotice] = useState<string | null>(null)

  function submitNeuralFeed(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = neuralEmail.trim()
    if (!email) return

    const recipient =
      process.env.NEXT_PUBLIC_NEURAL_FEED_EMAIL?.trim() || 'hello@coffeelab.com'
    const subject = cms.neuralFeedMailSubject ?? ''
    const body = [cms.neuralFeedMailBodyIntro ?? '', '', `My email: ${email}`].join('\n')

    const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setNeuralNotice(cms.footerFeedSuccess ?? '')
  }

  const laboratoryProducts = useMemo(() => {
    const rows = cms.storeProducts
    if (!rows?.length) return LABORATORY_FALLBACK_PRODUCTS
    return rows.map((p) => ({
      key: p.key,
      title: p.title,
      description: p.description ?? '',
      tags: p.tags?.map((t) => t.label) ?? [],
      rating: p.rating,
      reviews: p.reviews,
      price: p.price,
      image: typeof p.image === 'object' && p.image !== null ? p.image : undefined,
      categories: p.categories,
    }))
  }, [cms.storeProducts])

  const heroBg =
    cms.heroBackground && typeof cms.heroBackground === 'object' && 'url' in cms.heroBackground && cms.heroBackground.url
      ? cms.heroBackground
      : null

  return (
    <main className="home" id="main-content">
      <a className="skipLink" href="#variable-lab">
        {cms.skipLinkLabel}
      </a>
      <section className="hero hero--hasBg">
        <div className="heroBgMedia" aria-hidden="true">
          {heroBg ? (
            <Media resource={heroBg} fill className="heroBgImage" sizes="100vw" priority />
          ) : (
            <Image
              src={HERO_FALLBACK_SRC}
              alt=""
              fill
              className="heroBgImage"
              sizes="100vw"
              priority
            />
          )}
        </div>
        <div className="heroBgOverlay" aria-hidden="true" />
        <header className="topbar">
          <div className="logoWrap">
            <CoffeeLabLogo logo={cms.siteLogo} siteName={cms.siteName} priority />
          </div>

          <div className="navCluster">
            <nav className="nav" aria-label="Primary">
              {(cms.navItems ?? []).map((item) => (
                <a key={item.href + item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="topbarRight">
            <div className="navIcons">
              <a className="iconButton" href="#account" aria-label={cms.accountAriaLabel ?? 'Account'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.3" />
                  <path d="M5.6 18.2c1.7-2.7 4.1-4.1 6.4-4.1s4.7 1.4 6.4 4.1" />
                </svg>
              </a>
              <a className="iconButton cartButton" href="#cart" aria-label={cms.cartAriaLabel ?? 'Cart'}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                  <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
                </svg>
                <span className="cartCount">0</span>
              </a>
            </div>
            <LanguageToggle locale={locale} variant="inline" />
          </div>
        </header>

        <div className="heroContent">
          <p className="kicker">{cms.heroKicker}</p>
          <h1>
            {cms.heroTitleLine1}
            <br />
            <span>{cms.heroTitleLine2}</span>
          </h1>
          <p className="subtitle">
            {cms.heroSubtitle}
            {cms.heroAccentWord1 ? (
              <>
                {' '}
                <span className="accentWord">{cms.heroAccentWord1}</span>
              </>
            ) : null}
            {cms.heroAccentWord2 ? (
              <>
                {' '}
                <span className="accentWord">{cms.heroAccentWord2}</span>
              </>
            ) : null}
          </p>

          <div className="actions">
            <a className="primary" href={cms.heroPrimaryCtaHref ?? '#roastery'}>
              <span className="actionLabel">{cms.heroPrimaryCtaLabel}</span>
            </a>
            <a className="secondary" href={cms.heroSecondaryCtaHref ?? '#archives'}>
              <span className="actionLabel">{cms.heroSecondaryCtaLabel}</span>
            </a>
          </div>
        </div>
      </section>

      <LaboratoryStore
        phase={cms.laboratoryPhase ?? ''}
        title={cms.laboratoryTitle ?? ''}
        intro={cms.laboratoryIntro ?? ''}
        emptyMessage={cms.laboratoryEmptyFilter ?? ''}
        priceLabel={cms.laboratoryPriceLabel ?? ''}
        addToCartAriaTemplate={cms.laboratoryAddToCartAriaTemplate ?? ''}
        filters={cms.storeFilters ?? []}
        products={laboratoryProducts}
        stats={cms.labStats ?? []}
      />

      <section className="protocolStrip" id="variable-lab" aria-label="Extraction protocol controls">
        <div className="calibration">
          <p>{cms.protocolEyebrow}</p>
          <h3>{cms.protocolTitle}</h3>
        </div>

        <div className="brewToggle" aria-label="Brew type">
          <button
            type="button"
            className={brewMode === 'espresso' ? 'active' : ''}
            onClick={() => setBrewMode('espresso')}
          >
            <span className="toggleIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M13.5 2.8 5.8 12h5.3l-0.9 9.2 8-10h-5.1z" />
              </svg>
            </span>
            {cms.brewEspressoLabel}
          </button>
          <button
            className={brewMode === 'filter' ? 'active' : ''}
            type="button"
            onClick={() => setBrewMode('filter')}
          >
            <span className="toggleIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
              </svg>
            </span>
            {cms.brewFilterLabel}
          </button>
        </div>
      </section>

      <section className="geneticSection" id="genetic-blending">
        <div className="geneticTopRow">
          <div className="geneticMedia">
            <p className="mediaTag thermalMediaTag">
              <span className="thermoIcon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 4v9" />
                  <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
                </svg>
              </span>
              {cms.geneticSection?.mediaTag}
            </p>
            <div className="mediaFrame">
              <Media
                resource={cms.geneticSection?.image}
                width={1024}
                height={1024}
                className="mediaFrameImg"
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>

          <div className="geneticContent">
            <p className="phase">{cms.geneticSection?.phase}</p>
            <h2>{cms.geneticSection?.title}</h2>
            <p>{cms.geneticSection?.body}</p>
            <a href={cms.geneticSection?.ctaHref ?? '#archives'}>{cms.geneticSection?.ctaLabel}</a>
          </div>
        </div>

      </section>

      <section className="thermalSection" id="vault">
        <div className="thermalContent">
          <p className="phase">{cms.thermalSection?.phase}</p>
          <h2>{cms.thermalSection?.title}</h2>
          <p>{cms.thermalSection?.body}</p>
          <a href={cms.thermalSection?.ctaHref ?? '#archives'}>{cms.thermalSection?.ctaLabel}</a>
        </div>

        <div className="thermalMedia">
          <p className="mediaTag thermalMediaTag">
            <span className="thermoIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v9" />
                <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
              </svg>
            </span>
            {cms.thermalSection?.mediaTag}
          </p>
          <div className="mediaFrame">
            <Media
              resource={cms.thermalSection?.image}
              width={1024}
              height={1024}
              className="mediaFrameImg"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      <section className="valueSection" id="whitepapers">
        <div className="valueMedia">
          <p className="mediaTag thermalMediaTag">
            <span className="thermoIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v9" />
                <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
              </svg>
            </span>
            {cms.valueSection?.mediaTag}
          </p>
          <div className="mediaFrame">
            <Media
              resource={cms.valueSection?.image}
              width={1024}
              height={1024}
              className="mediaFrameImg"
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </div>
        </div>

        <div className="valueContent">
          <p className="phase">{cms.valueSection?.phase}</p>
          <h2>{cms.valueSection?.title}</h2>
          <p>{cms.valueSection?.body}</p>
          <a href={cms.valueSection?.ctaHref ?? '#archives'}>{cms.valueSection?.ctaLabel}</a>
        </div>
      </section>

      <PrecisionLab brewMode={brewMode} cms={cms} mapScanTemplate={mapScanTemplate} />

      <section
        ref={blendSectionRef}
        className={`blendingSection${blendSectionRevealed ? ' blendSectionRevealed' : ''}`}
      >
        <p className="phase">{cms.blendingPhase}</p>
        <h2>{cms.blendingTitle}</h2>
        <p className="blendingIntro">{cms.blendingIntro}</p>

        <div
          className={`blendingTabs${assemblyMode === 'manual' ? ' blendingTabs--manual' : ''}`}
          role="tablist"
          aria-label="Assembly mode"
        >
          <span className="blendingTabsThumb" aria-hidden="true" />
          <button
            className={assemblyMode === 'expert' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={assemblyMode === 'expert'}
            onClick={() => setAssemblyMode('expert')}
          >
            {cms.blendingTabExpert}
          </button>
          <button
            className={assemblyMode === 'manual' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={assemblyMode === 'manual'}
            onClick={() => setAssemblyMode('manual')}
          >
            {cms.blendingTabManual}
          </button>
        </div>

        {assemblyMode === 'expert' ? (
          <div className="blendCards">
            {(cms.blendingExpertCards ?? []).map((card) => (
              <article className="blendCard" key={card.id ?? card.title}>
                <div className="blendHead">
                  <div>
                    <p>{card.intensityLabel}</p>
                    <h3>{card.title}</h3>
                  </div>
                  <span className="cardIcon" aria-hidden="true">
                    {brewMode === 'filter' ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M13.5 2.8 5.8 12h5.3l-0.9 9.2 8-10h-5.1z" />
                      </svg>
                    )}
                  </span>
                </div>

                <div className="sensory">
                  <small>SENSORY LOG:</small>
                  <em>{brewMode === 'filter' ? card.sensoryFilter : card.sensoryEspresso}</em>
                </div>

                <div className="meta">
                  <div>
                    <small>GENETIC_BASE</small>
                    <span>{card.geneticBase}</span>
                  </div>
                  <div>
                    <small>METHODOLOGY</small>
                    <span>{brewMode === 'filter' ? card.methodologyFilter : card.methodologyEspresso}</span>
                  </div>
                </div>

                <div className="cardFooter">
                  <strong>{card.price}</strong>
                  <button type="button">{card.cta}</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="manualAssemblyPanel">
            <div className="manualLeft">
              <div className="manualHeader">
                <span className="manualIcon" aria-hidden="true">
                  {brewMode === 'filter' ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M3.5 5h17l-6.8 8v5.4l-3.4 1.6V13z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M5.5 4h13v3.2l-1.5 1.8v8.6a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2V9L5.5 7.2z" />
                    </svg>
                  )}
                </span>
                <div>
                  <h3>{cms.manualAssemblerTitle}</h3>
                  <p>
                    {cms.manualAssemblerProtocolPrefix} {brewMode.toUpperCase()}
                  </p>
                </div>
                <button type="button" className="recalibrateBtn">
                  {cms.manualRecalibrate}
                </button>
              </div>

              {(brewMode === 'espresso' ? cms.manualRowsEspresso : cms.manualRowsFilter)?.map((row, idx) => {
                const keys: Array<'originA' | 'originB' | 'roastLab'> = ['originA', 'originB', 'roastLab']
                const key = keys[idx] ?? 'originA'
                return (
                  <div className="blendRow" key={row.id ?? `${row.code}-${idx}`}>
                    <div className="blendRowLabel">
                      <small>{row.code}</small>
                      <span>{row.name}</span>
                    </div>
                    <div className="blendRowControls">
                      <button type="button" onClick={() => adjustBlend(key, -5)}>
                        -
                      </button>
                      <strong>{manualBlend[key]}%</strong>
                      <button type="button" onClick={() => adjustBlend(key, 5)}>
                        +
                      </button>
                    </div>
                    <progress max={100} value={manualBlend[key]} />
                  </div>
                )
              })}
            </div>

            <div className="manualRight">
              <div className="saturationRing" style={{ ['--sat' as string]: `${strokePercent}` }}>
                <span>{blendTotal}%</span>
                <small>{cms.saturationLabel}</small>
              </div>
              <div className="manualStatus">
                <span>{cms.stabilityLabel}</span>
                <strong className={isBlendComplete ? 'ok' : 'warn'}>
                  {isBlendComplete ? cms.stabilityLocked : cms.stabilityCalibrating}
                </strong>
              </div>
              <button
                type="button"
                className={`finalizeBtn ${isBlendComplete ? 'active' : ''}`}
                disabled={!isBlendComplete}
              >
                {cms.finalizeAssembly}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="vaultSection" id="archives">
        <p className="phase">{cms.vaultPhase}</p>
        <h2>{cms.vaultTitle}</h2>
        <p className="vaultIntro">{cms.vaultIntro}</p>

        <div className="vaultGrid">
          {(cms.vaultCards ?? []).map((item) => (
            <article className="vaultCard" key={item.id ?? item.title}>
              <div className="vaultTop">
                <div className="vaultScore">
                  <small>{cms.vaultCuppingLabel}</small>
                  <strong>{item.score}</strong>
                </div>
                <div className="vaultLock" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.5 10V8.5a4.5 4.5 0 0 1 9 0V10" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </div>
                <p>{cms.vaultSpecimenYear}</p>
              </div>

              <div className="vaultBody">
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="vaultMeta">
                  <span>{cms.vaultMetadataLabel}</span>
                  <em>{cms.vaultMetadataValue}</em>
                </div>
                <button type="button">{item.priceButton}</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <div className="footerBrandLogo">
            <CoffeeLabLogo siteName={cms.siteName} logo={cms.siteLogo} />
          </div>
          <p>{cms.footerTagline}</p>
          <p>{cms.footerMission}</p>
        </div>

        <div className="footerLinks">
          <h4>{cms.footerMapTitle}</h4>
          {(cms.footerMapLinks ?? []).map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="footerLinks">
          <h4>{cms.footerOpsTitle}</h4>
          {(cms.footerOpsLinks ?? []).map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="footerFeed">
          <h4>{cms.footerFeedTitle}</h4>
          <p>{cms.footerFeedDescription}</p>
          <form className="feedForm" onSubmit={submitNeuralFeed} aria-label="Neural feed email signup">
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={cms.footerFeedPlaceholder ?? ''}
              value={neuralEmail}
              onChange={(e) => {
                setNeuralEmail(e.target.value)
                setNeuralNotice(null)
              }}
              required
              aria-label="Email address"
            />
            <button type="submit">{cms.footerFeedSubmit}</button>
          </form>
          {neuralNotice ? (
            <p className="feedFormStatus success" role="status">
              {neuralNotice}
            </p>
          ) : null}
          <small>{cms.footerFeedEncryption}</small>
        </div>
      </footer>

      <div className="siteCopyright">
        <p>
          {(cms.footerCopyright ?? '').replace(
            '{year}',
            String(new Date().getFullYear()),
          )}
        </p>
      </div>
    </main>
  )
}
