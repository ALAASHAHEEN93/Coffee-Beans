'use client'

import React, { useMemo, useState, useEffect } from 'react'

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const TAU = Math.PI * 2
const CENTER = 170
const MAX_RADIUS = 130
const AXES = ['acidity', 'body', 'roast', 'sweetness', 'complexity'] as const
type AxisKey = (typeof AXES)[number]
type BrewMode = 'espresso' | 'filter'

const getPoint = (index: number, radius: number, center = 150, vertices = 5) => {
  const angle = -Math.PI / 2 + (index * TAU) / vertices
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  }
}

const PRESETS: Record<BrewMode, Record<AxisKey, number>> = {
  espresso: {
    acidity: 40,
    body: 85,
    roast: 75,
    sweetness: 80,
    complexity: 60,
  },
  filter: {
    acidity: 80,
    body: 35,
    roast: 45,
    sweetness: 65,
    complexity: 90,
  },
}

export default function PrecisionLab({ brewMode }: { brewMode: BrewMode }) {
  const [profile, setProfile] = useState<Record<AxisKey, number>>({
    acidity: 52,
    body: 39,
    roast: 69,
    sweetness: 48,
    complexity: 73,
  })
  const [draggingAxis, setDraggingAxis] = useState<number | null>(null)

  useEffect(() => {
    setProfile(PRESETS[brewMode])
  }, [brewMode])

  const updateAxis = (axis: AxisKey, value: number) => {
    setProfile((prev) => ({ ...prev, [axis]: clamp(Math.round(value), 0, 100) }))
  }

  const values = [profile.acidity, profile.body, profile.roast, profile.sweetness, profile.complexity]
  const dataPolygon = values
    .map((value, index) => {
      const point = getPoint(index, MAX_RADIUS * (value / 100), CENTER)
      return `${point.x},${point.y}`
    })
    .join(' ')
  const ringPolygons = [30, 60, 90, 120].map((radius) =>
    Array.from({ length: 5 }, (_, i) => {
      const point = getPoint(i, radius, CENTER)
      return `${point.x},${point.y}`
    }).join(' '),
  )

  const handleFromPointer = (clientX: number, clientY: number, axisIndex: number) => {
    const svg = document.getElementById('precision-radar')
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 340
    const y = ((clientY - rect.top) / rect.height) * 340
    const angle = -Math.PI / 2 + (axisIndex * TAU) / 5
    const ux = Math.cos(angle)
    const uy = Math.sin(angle)
    const projected = (x - CENTER) * ux + (y - CENTER) * uy
    const nextValue = (clamp(projected, 0, MAX_RADIUS) / MAX_RADIUS) * 100
    updateAxis(AXES[axisIndex], nextValue)
  }

  return (
    <section className="precisionSection" id="variable-lab">
      <p className="phase">PRECISION LAB</p>
      <h2>Molecular Customization</h2>
      <p className="precisionIntro">
        Tinker with the chemical variables. As an expert, you control the extraction curves for the
        filter profile.
      </p>

      <div className="precisionPanel">
        <div className="precisionLeft">
          <div className="precisionHead">
            <h3>EXTRACTION LAB</h3>
            <span>STATUS: ACTIVE // {brewMode.toUpperCase()}</span>
          </div>

          <label className="metric">
            <div>
              <span>ROAST</span>
              <strong>{profile.roast}%</strong>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              value={profile.roast}
              onChange={(e) => updateAxis('roast', Number(e.target.value))}
              aria-label="Roast level"
            />
          </label>

          <div className="metric">
            <div>
              <span>ACIDITY</span>
              <strong>{profile.acidity}%</strong>
            </div>
            <progress max={100} value={profile.acidity} />
          </div>

          <div className="metric">
            <div>
              <span>BODY</span>
              <strong>{profile.body}%</strong>
            </div>
            <progress max={100} value={profile.body} />
          </div>

          <div className="metric">
            <div>
              <span>SWEETNESS</span>
              <strong>{profile.sweetness}%</strong>
            </div>
            <progress max={100} value={profile.sweetness} />
          </div>

          <div className="metric">
            <div>
              <span>COMPLEXITY</span>
              <strong>{profile.complexity}%</strong>
            </div>
            <progress max={100} value={profile.complexity} />
          </div>

          <div className="matrixBlock">
            <p>
              <span className="dot" /> EXTRACTION MATRIX:
            </p>
            <div className="matrixTags">
              {brewMode === 'espresso' ? (
                <>
                  <span>MAILLARD RICHNESS</span>
                  <span>CARAMELIZED FINISH</span>
                  <span>HIGH VISCOSITY</span>
                </>
              ) : (
                <>
                  <span>CITRIC BRIGHTNESS</span>
                  <span>CARAMELIZED FINISH</span>
                  <span>VOLATILE FLAVORS</span>
                </>
              )}
            </div>
            <button type="button" className="synthesizeBtn">
              SYNTHESIZE FLAVOR PROFILE
            </button>
          </div>
        </div>

        <div className={`precisionRight ${brewMode === 'espresso' ? 'espressoMode' : 'filterMode'}`}>
          <div className="scanStats">
            <span>SCAN_UID: X-992</span>
            <span>BEAM_TEMP: {brewMode === 'espresso' ? 165 : 99}.0°C</span>
            <span>WATER_V: {brewMode === 'espresso' ? '92.4' : '99'}%</span>
          </div>
          <svg
            className="radarChart"
            id="precision-radar"
            viewBox="0 0 340 340"
            aria-label="Live flavor radar chart"
            onPointerMove={(e) => {
              if (draggingAxis !== null) handleFromPointer(e.clientX, e.clientY, draggingAxis)
            }}
            onPointerUp={() => setDraggingAxis(null)}
            onPointerLeave={() => setDraggingAxis(null)}
          >
            {ringPolygons.map((points, idx) => (
              <polygon className="ring" key={idx} points={points} />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                className="axis"
                key={i}
                x1={CENTER}
                y1={CENTER}
                x2={getPoint(i, MAX_RADIUS, CENTER).x}
                y2={getPoint(i, MAX_RADIUS, CENTER).y}
              />
            ))}
            <polygon className="dataFill" points={dataPolygon} />
            {values.map((value, i) => {
              const p = getPoint(i, MAX_RADIUS * (value / 100), CENTER)
              return (
                <circle
                  className="dataHandle"
                  key={`handle-${AXES[i]}`}
                  cx={p.x}
                  cy={p.y}
                  r="6"
                  onPointerDown={(e) => {
                    e.preventDefault()
                    setDraggingAxis(i)
                    handleFromPointer(e.clientX, e.clientY, i)
                  }}
                />
              )
            })}
            <text x={CENTER} y="18" textAnchor="middle">
              Acidity
            </text>
            <text x="266" y="130" textAnchor="middle">
              Body
            </text>
            <text x="224" y="284" textAnchor="middle">
              Roast
            </text>
            <text x="76" y="284" textAnchor="middle">
              Sweetness
            </text>
            <text x="34" y="130" textAnchor="middle">
              Complexity
            </text>
          </svg>
          <label className="targetControl">
            <span>Set Roast Target</span>
            <input
              type="range"
              min={10}
              max={95}
              value={profile.roast}
              onChange={(e) => updateAxis('roast', Number(e.target.value))}
              aria-label="Set roast target"
            />
          </label>
          <p>Flavor profile updates in real-time as roast level changes.</p>
        </div>
      </div>
    </section>
  )
}
