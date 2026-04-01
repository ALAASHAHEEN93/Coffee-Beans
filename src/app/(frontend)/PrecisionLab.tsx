'use client'

import type { Home } from '@/payload-types'
import React, { useEffect, useState } from 'react'

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

type Props = {
  brewMode: BrewMode
  cms: Home
  mapScanTemplate: (template: string, brewMode: BrewMode) => string
}

export default function PrecisionLab({ brewMode, cms, mapScanTemplate }: Props) {
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

  const axisLabels = [
    cms.axisAcidity,
    cms.axisBody,
    cms.axisRoast,
    cms.axisSweetness,
    cms.axisComplexity,
  ]

  const matrixTags =
    brewMode === 'espresso' ? cms.matrixTagsEspresso ?? [] : cms.matrixTagsFilter ?? []

  return (
    <section className="precisionSection" id="precision-lab">
      <p className="phase">{cms.precisionPhase}</p>
      <h2>{cms.precisionTitle}</h2>
      <p className="precisionIntro">{cms.precisionIntro}</p>

      <div className="precisionPanel">
        <div className="precisionLeft">
          <div className="precisionHead">
            <h3>{cms.precisionPanelTitle}</h3>
            <span>
              {cms.precisionStatusPrefix} {brewMode.toUpperCase()}
            </span>
          </div>

          <label className="metric">
            <div>
              <span>{cms.axisRoast}</span>
              <strong>{profile.roast}%</strong>
            </div>
            <input
              type="range"
              min={10}
              max={95}
              value={profile.roast}
              onChange={(e) => updateAxis('roast', Number(e.target.value))}
              aria-label={cms.axisRoast ?? 'Roast'}
            />
          </label>

          <div className="metric">
            <div>
              <span>{cms.axisAcidity}</span>
              <strong>{profile.acidity}%</strong>
            </div>
            <progress max={100} value={profile.acidity} />
          </div>

          <div className="metric">
            <div>
              <span>{cms.axisBody}</span>
              <strong>{profile.body}%</strong>
            </div>
            <progress max={100} value={profile.body} />
          </div>

          <div className="metric">
            <div>
              <span>{cms.axisSweetness}</span>
              <strong>{profile.sweetness}%</strong>
            </div>
            <progress max={100} value={profile.sweetness} />
          </div>

          <div className="metric">
            <div>
              <span>{cms.axisComplexity}</span>
              <strong>{profile.complexity}%</strong>
            </div>
            <progress max={100} value={profile.complexity} />
          </div>

          <div className="matrixBlock">
            <p>
              <span className="dot" /> {cms.matrixHeading}
            </p>
            <div className="matrixTags">
              {matrixTags.map((t) => (
                <span key={t.id ?? t.text}>{t.text}</span>
              ))}
            </div>
            <button type="button" className="synthesizeBtn">
              {cms.synthesizeButton}
            </button>
          </div>
        </div>

        <div className={`precisionRight ${brewMode === 'espresso' ? 'espressoMode' : 'filterMode'}`}>
          <div className="scanStats">
            {(cms.scanStats ?? []).map((row, i) => (
              <span key={row.id ?? i}>{mapScanTemplate(row.template, brewMode)}</span>
            ))}
          </div>
          <svg
            className="radarChart"
            id="precision-radar"
            viewBox="0 0 340 340"
            aria-label={cms.radarAriaLabel ?? ''}
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
              {axisLabels[0]}
            </text>
            <text x="266" y="130" textAnchor="middle">
              {axisLabels[1]}
            </text>
            <text x="224" y="284" textAnchor="middle">
              {axisLabels[2]}
            </text>
            <text x="76" y="284" textAnchor="middle">
              {axisLabels[3]}
            </text>
            <text x="34" y="130" textAnchor="middle">
              {axisLabels[4]}
            </text>
          </svg>
          <label className="targetControl">
            <span>{cms.roastSliderLabel}</span>
            <input
              type="range"
              min={10}
              max={95}
              value={profile.roast}
              onChange={(e) => updateAxis('roast', Number(e.target.value))}
              aria-label={cms.roastSliderLabel ?? ''}
            />
          </label>
          <p>{cms.flavorNote}</p>
        </div>
      </div>
    </section>
  )
}
