'use client'

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import PrecisionLab from './PrecisionLab'
import { CoffeeLabLogo } from './CoffeeLabLogo'
import './styles.css'

export default function HomePage() {
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
    const subject = 'CoffeeLab // Neural feed subscription'
    const body = [
      'Please notify me about extraction logs and sensory data streams.',
      '',
      `My email: ${email}`,
    ].join('\n')

    const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setNeuralNotice('Opening your email app — send the message to subscribe.')
  }

  return (
    <main className="home" id="main-content">
      <a className="skipLink" href="#variable-lab">
        Skip to main content
      </a>
      <section className="hero">
        <header className="topbar">
          <div className="logoWrap">
            <CoffeeLabLogo priority />
          </div>

          <nav className="nav">
            <a href="#variable-lab">VARIABLE LAB</a>
            <a href="#genetic-blending">GENETIC BLENDING</a>
            <a href="#vault">THE VAULT</a>
            <a href="#whitepapers">WHITEPAPERS</a>
          </nav>

          <div className="navIcons">
            <a className="iconButton" href="#account" aria-label="Account">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.3" />
                <path d="M5.6 18.2c1.7-2.7 4.1-4.1 6.4-4.1s4.7 1.4 6.4 4.1" />
              </svg>
            </a>
            <a className="iconButton cartButton" href="#cart" aria-label="Cart">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6.2 7.5h11l-1.4 7.2H8z" />
                <path d="M8.6 7.5 9.8 5h3.5l1.2 2.5" />
              </svg>
              <span className="cartCount">0</span>
            </a>
          </div>
        </header>

        <div className="heroContent">
          <p className="kicker">LAB PROTOCOL // ACTIVE</p>
          <h1>
            MOLECULAR
            <br />
            <span>ROASTERY</span>
          </h1>
          <p className="subtitle">
            Explore the biological frontier of <span className="accentWord">Espresso</span> and{' '}
            <span className="accentWord">Filter</span> extraction via digital synthesis.
          </p>

          <div className="actions">
            <a className="primary" href="#roastery">
              <span className="actionLabel">INITIALIZE_SYSTEM</span>
            </a>
            <a className="secondary" href="#archives">
              <span className="actionLabel">SECURE_ARCHIVES</span>
            </a>
          </div>
        </div>
      </section>

      <section className="protocolStrip" id="variable-lab" aria-label="Extraction protocol controls">
        <div className="calibration">
          <p>EXTRACTION PROTOCOL</p>
          <h3>System Calibration</h3>
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
            ESPRESSO
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
            FILTER
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
              32% PROFIT RE-INJECTION
            </p>
            <div className="mediaFrame">
              <Image
                src="/images/section-two-product.png"
                alt="Coffee product showcase"
                width={1024}
                height={1024}
              />
            </div>
          </div>

          <div className="geneticContent">
            <p className="phase">PHASE_01</p>
            <h2>Direct Genetic Sourcing</h2>
            <p>
              We analyze the DNA of every micro-lot. Our direct relationships ensure farmers receive 3x
              the standard market rate, securing the future of high-altitude specialty beans.
            </p>
            <a href="#archives">INITIALIZE_ARCHIVE</a>
          </div>
        </div>

      </section>

      <section className="thermalSection" id="vault">
        <div className="thermalContent">
          <p className="phase">PHASE_02</p>
          <h2>Thermal Roasting Precision</h2>
          <p>
            Our Loring smart-roasters capture 1,200 data points per second. We hit the exact chemical
            transition point where acidity transforms into complex sweetness.
          </p>
          <a href="#archives">INITIALIZE_ARCHIVE</a>
        </div>

        <div className="thermalMedia">
          <p className="mediaTag thermalMediaTag">
            <span className="thermoIcon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 4v9" />
                <path d="M9 14.5a3 3 0 1 0 6 0V7a3 3 0 1 0-6 0z" />
              </svg>
            </span>
            0.05°C VARIANCE LIMIT
          </p>
          <div className="mediaFrame">
            <Image
              src="/images/section-three-roaster.png"
              alt="Roasting machine in lab"
              width={1024}
              height={1024}
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
            100% COST TRANSPARENCY
          </p>
          <div className="mediaFrame">
            <Image
              src="/images/section-four-final.png"
              alt="Cafe shelf products"
              width={1024}
              height={1024}
            />
          </div>
        </div>

        <div className="valueContent">
          <p className="phase">PHASE_03</p>
          <h2>Transparent Value Index</h2>
          <p>
            No marketing fluff. We open-source our costs. You see the bean price, the logistics, and
            the roasting energy. Fair pricing, scientifically calculated.
          </p>
          <a href="#archives">INITIALIZE_ARCHIVE</a>
        </div>
      </section>

      <PrecisionLab brewMode={brewMode} />

      <section
        ref={blendSectionRef}
        className={`blendingSection${blendSectionRevealed ? ' blendSectionRevealed' : ''}`}
      >
        <p className="phase">GENETIC FUSION</p>
        <h2>The Blending Chamber</h2>
        <p className="blendingIntro">Synthesis of rare micro-lots optimized for clarity of terroir.</p>

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
            EXPERT CURATION
          </button>
          <button
            className={assemblyMode === 'manual' ? 'active' : ''}
            type="button"
            role="tab"
            aria-selected={assemblyMode === 'manual'}
            onClick={() => setAssemblyMode('manual')}
          >
            MANUAL ASSEMBLY
          </button>
        </div>

        {assemblyMode === 'expert' ? (
          <div className="blendCards">
            <article className="blendCard">
              <div className="blendHead">
                <div>
                  <p>ETHEREAL INTENSITY</p>
                  <h3>Prism Clarity</h3>
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
                <em>
                  {brewMode === 'filter'
                    ? '"Tea-like body, jasmine florals, white peach acidity."'
                    : '"Dense crema, chocolate backbone, concentrated sweetness."'}
                </em>
              </div>

              <div className="meta">
                <div>
                  <small>GENETIC_BASE</small>
                  <span>Ethiopia Yirgacheffe (Washed)</span>
                </div>
                <div>
                  <small>METHODOLOGY</small>
                  <span>{brewMode === 'filter' ? 'FILTER EXTRACTION' : 'ESPRESSO EXTRACTION'}</span>
                </div>
              </div>

              <div className="cardFooter">
                <strong>$28.00</strong>
                <button type="button">INITIALIZE_TRANSMISSION</button>
              </div>
            </article>

            <article className="blendCard">
              <div className="blendHead">
                <div>
                  <p>VIBRANT INTENSITY</p>
                  <h3>Neon Horizon</h3>
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
                <em>
                  {brewMode === 'filter'
                    ? '"Vibrant berry notes, sparkling acidity, honey finish."'
                    : '"Heavy body, caramelized sugars, long syrupy finish."'}
                </em>
              </div>

              <div className="meta">
                <div>
                  <small>GENETIC_BASE</small>
                  <span>Kenya Nyeri + Colombia Pink Bourbon</span>
                </div>
                <div>
                  <small>METHODOLOGY</small>
                  <span>{brewMode === 'filter' ? 'FILTER EXTRACTION' : 'ESPRESSO EXTRACTION'}</span>
                </div>
              </div>

              <div className="cardFooter">
                <strong>$25.00</strong>
                <button type="button">INITIALIZE_TRANSMISSION</button>
              </div>
            </article>
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
                  <h3>GENETIC ASSEMBLER</h3>
                  <p>PROTOCOL: MANUAL_OVERRIDE // {brewMode.toUpperCase()}</p>
                </div>
                <button type="button" className="recalibrateBtn">
                  RECALIBRATE
                </button>
              </div>

              {(
                brewMode === 'espresso'
                  ? [
                      ['MOGIANA // SPECIMEN', 'Brazilian Santos', 'originA'],
                      ['MALABAR // SPECIMEN', 'Indian Monsooned', 'originB'],
                      ['LAB SELECT // SPECIMEN', 'Dark Roast Blend', 'roastLab'],
                    ]
                  : [
                      ['GUJI // SPECIMEN', 'Ethiopian Heirloom', 'originA'],
                      ['GEISHA // SPECIMEN', 'Panama Geisha', 'originB'],
                      ['LAB SELECT // SPECIMEN', 'Light Roast Blend', 'roastLab'],
                    ]
              ).map(([label, name, key]: [string, string, 'originA' | 'originB' | 'roastLab']) => (
                <div className="blendRow" key={key}>
                  <div className="blendRowLabel">
                    <small>{label}</small>
                    <span>{name}</span>
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
              ))}
            </div>

            <div className="manualRight">
              <div className="saturationRing" style={{ ['--sat' as string]: `${strokePercent}` }}>
                <span>{blendTotal}%</span>
                <small>SATURATION</small>
              </div>
              <div className="manualStatus">
                <span>STABILITY_CHECK</span>
                <strong className={isBlendComplete ? 'ok' : 'warn'}>
                  {isBlendComplete ? 'SYSTEM_LOCKED' : 'CALIBRATING...'}
                </strong>
              </div>
              <button
                type="button"
                className={`finalizeBtn ${isBlendComplete ? 'active' : ''}`}
                disabled={!isBlendComplete}
              >
                FINALIZE ASSEMBLY
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="vaultSection" id="archives">
        <p className="phase">SENSORY DECOUPLING</p>
        <h2>Classified Vault</h2>
        <p className="vaultIntro">
          Zero branding. Zero expectations. Just the pure biological response to the roast.
        </p>

        <div className="vaultGrid">
          {[
            {
              score: '91.5',
              title: 'PROTOCOL X-771',
              label: 'EXPERIMENTAL FERMENTATION',
              desc: 'A profile that challenges the biological limits of perception. High thermal variability during roast.',
            },
            {
              score: '89.0',
              title: 'PROTOCOL X-442',
              label: 'ANAEROBIC MICROLOT',
              desc: 'Sourced from a secret high-altitude plot. Identity hidden to prevent expectation bias.',
            },
            {
              score: '92.2',
              title: 'PROTOCOL X-901',
              label: 'CARBONIC MACERATION',
              desc: 'The pinnacle of our laboratory efforts. Pure molecular expression of terroir.',
            },
          ].map((item) => (
            <article className="vaultCard" key={item.title}>
              <div className="vaultTop">
                <div className="vaultScore">
                  <small>CUPPING SCORE</small>
                  <strong>{item.score}</strong>
                </div>
                <div className="vaultLock" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.5 10V8.5a4.5 4.5 0 0 1 9 0V10" />
                    <rect x="5" y="10" width="14" height="10" rx="2" />
                  </svg>
                </div>
                <p>SPECIMEN // 2026</p>
              </div>

              <div className="vaultBody">
                <small>{item.label}</small>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="vaultMeta">
                  <span>METADATA:</span>
                  <em>ENCRYPTED_FOR_RESEARCHERS</em>
                </div>
                <button type="button">SECURE_SAMPLE // $32.00</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="siteFooter">
        <div className="footerBrand">
          <div className="footerBrandLogo">
            <CoffeeLabLogo />
          </div>
          <p>MOLECULAR ROASTERY // STATION_772</p>
          <p>
            A decentralized collective of roasters and data scientists. Redefining extraction through
            radical transparency and digital precision.
          </p>
        </div>

        <div className="footerLinks">
          <h4>SYSTEM_MAP</h4>
          <a href="#variable-lab">VARIABLE LAB</a>
          <a href="#genetic-blending">GENETIC BLENDING</a>
          <a href="#vault">THE VAULT</a>
          <a href="#whitepapers">WHITEPAPERS</a>
        </div>

        <div className="footerLinks">
          <h4>OPERATIONS</h4>
          <a href="#logistics">LOGISTICS</a>
          <a href="#exchange">EXCHANGES</a>
          <a href="#collective">COLLECTIVE</a>
          <a href="#terminal">TERMINAL</a>
        </div>

        <div className="footerFeed">
          <h4>NEURAL_FEED</h4>
          <p>Receive extraction logs &amp; sensory data streams</p>
          <form className="feedForm" onSubmit={submitNeuralFeed} aria-label="Neural feed email signup">
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="sample@mail.com"
              value={neuralEmail}
              onChange={(e) => {
                setNeuralEmail(e.target.value)
                setNeuralNotice(null)
              }}
              required
              aria-label="Email address"
            />
            <button type="submit">SECURE</button>
          </form>
          {neuralNotice ? (
            <p className="feedFormStatus success" role="status">
              {neuralNotice}
            </p>
          ) : null}
          <small>ENCRYPTION ACTIVE</small>
        </div>
      </footer>

      <div className="siteCopyright">
        <p>© {new Date().getFullYear()} CoffeeLab. All rights reserved.</p>
      </div>
    </main>
  )
}
