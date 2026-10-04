import {
  FishShape,
  MascotShape,
  CoralShape,
  ShellShape,
  Starfish,
  Rock,
  Crab,
  Anemone,
} from './Ocean.jsx'

// The reef scene on "Your Reef". 600 x 230 units; the sand line is at y = 200.
// What grows here comes from getReef() in lib/reef.js; everything else is scenery.
const GROUND = 200

// Where each coral grows, in the order they're added
const CORAL_SLOTS = [
  { x: 150, type: 'branch', color: 'var(--coral)', scale: 1 },
  { x: 430, type: 'fan', color: 'var(--coral-peach)', scale: 1 },
  { x: 275, type: 'brain', color: 'var(--coral-pink)', scale: 1 },
  { x: 520, type: 'tube', color: 'var(--seafoam)', scale: 0.9 },
  { x: 70, type: 'fan', color: 'var(--coral-pink)', scale: 0.8 },
  { x: 355, type: 'branch', color: 'var(--sun)', scale: 0.85 },
  { x: 210, type: 'tube', color: 'var(--coral)', scale: 0.75 },
  { x: 480, type: 'brain', color: 'var(--coral-peach)', scale: 0.8 },
]

const FISH_SLOTS = [
  { x: 120, y: 60, color: 'var(--bright-teal)', stripe: '#d4fff8', s: 0.55, dur: 7 },
  { x: 380, y: 45, color: 'var(--sun)', stripe: '#ff9f6b', s: 0.45, dur: 9, flip: true },
  { x: 250, y: 105, color: 'var(--coral-pink)', stripe: '#ffe6ee', s: 0.4, dur: 8 },
  { x: 470, y: 95, color: 'var(--seafoam)', stripe: '#f0fffa', s: 0.5, dur: 10, flip: true },
  { x: 60, y: 120, color: 'var(--coral)', stripe: '#fff1e2', s: 0.35, dur: 6.5 },
  { x: 320, y: 70, color: 'var(--fish-2)', stripe: '#effcff', s: 0.38, dur: 8.5, flip: true },
]

const SHELL_SLOTS = [
  { x: 205, color: '#f2d6c2' },
  { x: 395, color: '#efe1c6' },
  { x: 110, color: '#f5cfc6' },
  { x: 560, color: '#f2d6c2' },
]

const SNOW = Array.from({ length: 14 }, (_, i) => ({
  x: (i * 47 + 13) % 590,
  y: (i * 31 + 9) % 170,
  r: 0.8 + (i % 3) * 0.4,
  d: 9 + (i % 4) * 3,
}))

function Chest() {
  return (
    <g>
      <rect x="-17" y="-16" width="34" height="16" rx="2" fill="#8a5a33" />
      <rect x="-17" y="-16" width="34" height="3" fill="#6f4627" />
      <rect x="-2.5" y="-16" width="5" height="16" fill="var(--sun)" opacity="0.85" />
      <g className="chest-lid">
        <path d="M-17 -16c0-9 6-12 17-12s17 3 17 12z" fill="#9c6a3e" />
        <rect x="-2.5" y="-27" width="5" height="11" fill="var(--sun)" opacity="0.85" />
      </g>
      <circle className="chest-glint" cx="0" cy="-17" r="2" fill="#fff3c4" />
      <g className="chest-bubbles" fill="none" stroke="#fff" strokeWidth="1.2">
        <circle cx="2" cy="-22" r="2.4" />
        <circle cx="-3" cy="-26" r="1.6" />
      </g>
    </g>
  )
}

export default function Reef({ reef }) {
  const label = `Your reef has ${reef.coral} coral, ${reef.fish} fish, and ${reef.shells} ${reef.shells === 1 ? 'shell' : 'shells'}.`
  return (
    <svg className="reef" viewBox="0 0 600 230" role="img" aria-label={label} data-ocean>
      <defs>
        <linearGradient id="reef-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--dark-teal)' }} />
          <stop offset="0.55" style={{ stopColor: 'var(--deep-ocean)' }} />
          <stop offset="1" style={{ stopColor: 'var(--deep-navy)' }} />
        </linearGradient>
      </defs>
      <rect width="600" height="230" fill="url(#reef-water)" />

      {/* light from the surface */}
      <g fill="#bff5ee" opacity="0.08">
        <path d="M90 0h40L70 200H40z" />
        <path d="M330 0h28L300 200h-26z" />
        <path d="M500 0h18L470 200h-16z" />
      </g>

      {/* far-off reef for depth */}
      <g opacity="0.9">
        {[[40, 'branch', 0.7], [240, 'fan', 0.6], [400, 'tube', 0.6], [560, 'fan', 0.75]].map(([x, t, s]) => (
          <g key={x} transform={`translate(${x} 198) scale(${s})`}>
            <CoralShape type={t} color="#0d5362" />
          </g>
        ))}
      </g>

      {/* drifting specks */}
      <g fill="#cdeff0" className="reef-snow">
        {SNOW.map((p, i) => (
          <circle key={i} className="snow" cx={p.x} cy={p.y} r={p.r} style={{ animationDuration: `${p.d}s`, animationDelay: `${-i * 1.3}s` }} />
        ))}
      </g>

      {/* seaweed is always there so a new reef isn't completely bare */}
      <g className="reef-seaweed" fill="none" strokeLinecap="round" strokeWidth="6">
        <path className="sway" d="M22 205C12 180 32 160 20 135S28 105 24 92" stroke="var(--seaweed-bright)" />
        <path className="sway slow" d="M36 205C30 188 44 175 36 158" stroke="var(--seaweed-2)" />
        <path className="sway slow" d="M582 205C572 182 592 165 580 140S586 116 584 106" stroke="var(--seaweed-bright)" />
      </g>

      {/* a shy fish that peeks out from behind the rock */}
      <g transform="translate(560 168)">
        <g className="peek-fish">
          <g transform="scale(-0.34 0.34) translate(-64 0)">
            <FishShape color="var(--sun)" stripe="#ff9f6b" />
          </g>
        </g>
      </g>

      {/* sand */}
      <path d="M0 196C80 188 150 202 240 196S420 186 500 194 580 198 600 194V230H0z" fill="var(--sand)" />
      <path d="M0 212C100 206 180 216 300 210S500 206 600 212V230H0z" fill="var(--sand-dark)" opacity="0.6" />

      {/* scenery that's always there */}
      <g transform={`translate(318 ${GROUND + 2})`}><Chest /></g>
      <g transform={`translate(572 ${GROUND + 1})`}><Rock w={58} h={30} color="#5c7f86" /></g>
      <g transform={`translate(566 ${GROUND - 27}) rotate(12) scale(.8)`}><Starfish color="var(--coral)" /></g>
      <g transform={`translate(28 ${GROUND + 3})`}><Rock w={44} h={18} color="#6f9097" /></g>
      <g transform={`translate(245 ${GROUND + 4}) scale(.7)`}><Anemone color="var(--coral-pink)" /></g>

      {CORAL_SLOTS.slice(0, reef.coral).map((c, i) => (
        <g key={`c${i}`} transform={`translate(${c.x} ${GROUND}) scale(${c.scale})`}>
          <g className="grow" style={{ animationDelay: `${i * 0.08}s` }}>
            <CoralShape type={c.type} color={c.color} />
          </g>
        </g>
      ))}

      {SHELL_SLOTS.slice(0, reef.shells).map((s, i) => (
        <g key={`s${i}`} transform={`translate(${s.x} ${GROUND + 8})`}>
          <ShellShape color={s.color} />
        </g>
      ))}

      <g transform={`translate(180 ${GROUND + 14}) scale(.9)`}><Crab /></g>

      {FISH_SLOTS.slice(0, reef.fish).map((f, i) => (
        <g key={`f${i}`} transform={`translate(${f.x} ${f.y})`}>
          <g className="reef-fish" style={{ animationDuration: `${f.dur}s` }}>
            <g transform={f.flip ? `scale(${-f.s} ${f.s}) translate(-64 0)` : `scale(${f.s})`}>
              <FishShape color={f.color} stripe={f.stripe} />
            </g>
          </g>
        </g>
      ))}

      {/* the PhishCheck fish lives here too */}
      <g className="reef-mascot" transform="translate(210 26)">
        <g className="reef-mascot-turn">
          <g transform="scale(.62)">
            <MascotShape mood="idle" />
          </g>
        </g>
      </g>

      {reef.bubbles && (
        <g className="reef-bubbles" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.9">
          <circle className="rise" cx="160" cy="130" r="4" />
          <circle className="rise d2" cx="168" cy="140" r="2.5" />
          <circle className="rise d3" cx="440" cy="120" r="3.5" />
          <circle className="rise d4" cx="290" cy="150" r="3" />
        </g>
      )}
    </svg>
  )
}
