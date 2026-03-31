import React from 'react'
import Image from 'next/image'
import './styles.css'

export default async function HomePage() {
  return (
    <main className="home">
      <section className="hero">
        <header className="topbar">
          <div className="logoWrap">
            <Image src="/images/logo.png" alt="CoffeeLab logo" width={508} height={102} priority />
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
              INITIALIZE_SYSTEM
            </a>
            <a className="secondary" href="#archives">
              SECURE_ARCHIVES
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
