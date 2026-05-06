'use client'

import React, { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn, ZoomOut } from 'lucide-react'

const geoUrl =
  'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface RegulatoryBody {
  country: string
  coordinates: [number, number]
  regulatoryBody: string
  description: string
}

const regulatoryBodies: RegulatoryBody[] = [
  { country: 'United States', coordinates: [-95.7, 37], regulatoryBody: 'FDA', description: 'Food and Drug Administration' },
  { country: 'United Kingdom', coordinates: [-0.12, 51.5], regulatoryBody: 'MHRA', description: 'Medicines & Healthcare Products Regulatory Agency' },
  { country: 'European Union', coordinates: [4.35, 50.85], regulatoryBody: 'EMA', description: 'European Medicines Agency' },
  { country: 'Japan', coordinates: [139.65, 35.67], regulatoryBody: 'PMDA', description: 'Pharmaceuticals & Medical Devices Agency' },
  { country: 'China', coordinates: [116.4, 39.9], regulatoryBody: 'NMPA', description: 'National Medical Products Administration' },
  { country: 'India', coordinates: [77.2, 28.6], regulatoryBody: 'CDSCO', description: 'Central Drugs Standard Control Organization' },
]

export default function RegulatoryWorldMap() {
  const [hovered, setHovered] = useState<string | null>(null)
  const [locked, setLocked] = useState<string | null>(null)

  const [position, setPosition] = useState({
    coordinates: [0, 20] as [number, number],
    zoom: 1,
  })

  const active = locked || hovered

  const smoothZoom = (delta: number) => {
    setPosition((p) => ({
      ...p,
      zoom: Math.min(Math.max(p.zoom + delta, 1), 4),
    }))
  }

  return (
    <div className="relative w-full h-[520px] overflow-hidden rounded-xl">

      {/* Zoom */}
      <div className="absolute right-4 top-4 z-50 flex flex-col gap-2">
        {[{ d: 0.4, icon: ZoomIn }, { d: -0.4, icon: ZoomOut }].map(({ d, icon: Icon }) => (
          <button
            key={d}
            onClick={() => smoothZoom(d)}
            className="bg-background rounded-md p-2 shadow"
          >
            <Icon size={16} />
          </button>
        ))}
      </div>

      <ComposableMap
        projectionConfig={{ scale: 170 }}
        style={{ background: '#b7ddff' }} // OCEAN
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={setPosition}
          transitionDuration={500}
        >

          {/* LAND */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isActive = regulatoryBodies.some(
                  (b) =>
                    active === b.regulatoryBody &&
                    geo.properties.NAME === b.country
                )

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isActive ? '#4ade80' : '#86efac'} // STRONG GREEN
                    stroke="var(--border)"
                    strokeWidth={0.6}
                    style={{
                      default: {
                        outline: 'none',
                      },
                    }}
                  />
                )
              })
            }
          </Geographies>

          {/* MARKERS */}
          {regulatoryBodies.map((body) => (
            <Marker
              key={body.regulatoryBody}
              coordinates={body.coordinates}
              onMouseEnter={() => !locked && setHovered(body.regulatoryBody)}
              onMouseLeave={() => !locked && setHovered(null)}
              onClick={() =>
                setLocked(locked === body.regulatoryBody ? null : body.regulatoryBody)
              }
            >
              <motion.g whileHover={{ scale: 1.2 }}>

                <motion.circle
                  r={14}
                  fill="rgba(239,68,68,.25)"
                  animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                <circle r={5} fill="#ef4444" />

              </motion.g>

              {/* Tooltip */}
              <AnimatePresence>
                {active === body.regulatoryBody && (
                  <foreignObject x={-110} y={-130} width={220} height={120}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="rounded-md bg-popover px-3 py-2 shadow text-xs text-popover-foreground"
                    >
                      <p className="font-semibold text-red-600">{body.regulatoryBody}</p>
                      <p>{body.country}</p>
                      <p className="text-muted-foreground">{body.description}</p>
                    </motion.div>
                  </foreignObject>
                )}
              </AnimatePresence>

            </Marker>
          ))}

        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
