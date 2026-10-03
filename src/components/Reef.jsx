import { FishShape } from './Ocean.jsx'

// The reef scene on "Your Reef". 600 x 230 units; the sand line is at y = 200.
const GROUND = 200

// Where each coral grows, in the order they're added
const CORAL_SLOTS = [
  { x: 150, type: 'branch', color: 'var(--coral)', scale: 1 },
  { x: 430, type: 'fan', color: 'var(--coral-peach)', scale: 1 },
  { x: 275, type: 'brain', color: 'var(--coral-pink)', scale: 1 },
  { x: 520, type: 'tube', color: 'var(--coral)', scale: 0.9 },
  { x: 70, type: 'fan', color: 'var(--coral-pink)', scale: 0.8 },
  { x: 355, type: 'branch', color: 'var(--coral-peach)', scale: 0.85 },
  { x: 210, type: 'tube', color: 'var(--coral-pink)', scale: 0.75 },
  { x: 480, type: 'brain', color: 'var(--coral)', scale: 0.8 },
]

const FISH_SLOTS = [
  { x: 120, y: 60, color: 'var(--fish-1)', s: 0.55, dur: 7 },
  { x: 380, y: 45, color: 'var(--fish-3)', s: 0.45, dur: 9, flip: true },
  { x: 250, y: 105, color: 'var(--fish-2)', s: 0.4, dur: 8 },
  { x: 470, y: 95, color: 'var(--fish-1)', s: 0.5, dur: 10, flip: true },
  { x: 60, y: 120, color: 'var(--fish-3)', s: 0.35, dur: 6.5 },
  { x: 320, y: 70, color: 'var(--fish-2)', s: 0.38, dur: 8.5, flip: true },
]

const SHELL_SLOTS = [
  { x: 205, color: '#f2d6c2' },
  { x: 395, color: '#efe1c6' },
  { x: 110, color: '#f5cfc6' },
  { x: 560, color: '#f2d6c2' },
]

function Coral({ type, color }) {
  switch (type) {
    case 'branch':
      return (
        <g fill="none" stroke={color} strokeWidth="7" strokeLinecap="round">
          <path d="M0 0V-58" />
          <path d="M0 -20C-14 -26-20 -38-20 -54" />
          <path d="M0 -30C12 -36 18 -46 18 -62" />
          <path d="M-20 -40C-28 -44-30 -50-31 -58" strokeWidth="5" />
          <path d="M18 -48C24 -52 27 -58 28 -66" strokeWidth="5" />
        </g>
      )
    case 'fan':
      return (
        <g>
          <path d="M0 0C-34 -10-40 -52-22 -66 0 -78 24 -72 34 -54 42 -36 26 -8 0 0z" fill={color} opacity="0.85" />
          <g stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" fill="none">
            <path d="M0 0L-20 -56" />
            <path d="M0 0L0 -68" />
            <path d="M0 0L22 -56" />
            <path d="M-10 -28C-2 -32 6 -32 14 -28" />
            <path d="M-16 -46C-4 -52 8 -52 22 -46" />
          </g>
        </g>
      )
    case 'brain':
      return (
        <g>
          <path d="M-30 0C-32 -28-14 -40 0 -40 14 -40 32 -28 30 0z" fill={color} />
          <path
            d="M-22 -8c4-8 8 0 12-8s8 0 12-8 8 0 12-8M-14 -22c4-6 8 0 12-6s8 0 12-6"
            fill="none"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )
    default: // tube
      return (
        <g fill={color}>
          <rect x="-20" y="-44" width="11" height="44" rx="5.5" />
          <rect x="-6" y="-62" width="12" height="62" rx="6" />
          <rect x="9" y="-34" width="11" height="34" rx="5.5" />
          <g fill="#fff" opacity="0.4">
            <ellipse cx="-14.5" cy="-40" rx="3" ry="1.8" />
            <ellipse cx="0" cy="-58" rx="3.2" ry="1.9" />
            <ellipse cx="14.5" cy="-30" rx="3" ry="1.8" />
          </g>
        </g>
      )
  }
}

function Shell({ color }) {
  return (
    <g>
      <path d="M0 0C-11 0-13 -9-9 -14-5 -19 5 -19 9 -14 13 -9 11 0 0 0z" fill={color} />
      <g stroke="#c9a68e" strokeWidth="1" fill="none" opacity="0.8">
        <path d="M0 0V-17" />
        <path d="M0 0L-6 -15" />
        <path d="M0 0L6 -15" />
      </g>
    </g>
  )
}

export default function Reef({ reef }) {
  const label = `Your reef has ${reef.coral} coral, ${reef.fish} fish, and ${reef.shells} ${reef.shells === 1 ? 'shell' : 'shells'}.`
  return (
    <svg className="reef" viewBox="0 0 600 230" role="img" aria-label={label}>
      <defs>
        <linearGradient id="reef-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--reef-water-top)" }} />
          <stop offset="1" style={{ stopColor: "var(--reef-water-bottom)" }} />
        </linearGradient>
      </defs>
      <rect width="600" height="230" fill="url(#reef-water)" />

      {/* light rays */}
      <g fill="#fff" opacity="0.18">
        <path d="M90 0h40L70 200H40z" />
        <path d="M330 0h28L300 200h-26z" />
      </g>

      {/* seaweed is always there so a new reef isn't completely bare */}
      <g className="reef-seaweed" fill="none" strokeLinecap="round" strokeWidth="6">
        <path className="sway" d="M22 205C12 180 32 160 20 135S28 105 24 92" stroke="var(--seaweed)" />
        <path className="sway slow" d="M36 205C30 188 44 175 36 158" stroke="var(--seaweed-2)" />
        <path className="sway slow" d="M582 205C572 182 592 165 580 140S586 116 584 106" stroke="var(--seaweed-2)" />
      </g>

      {/* sand */}
      <path d="M0 196C80 188 150 202 240 196S420 186 500 194 580 198 600 194V230H0z" fill="var(--sand)" />
      <path d="M0 212C100 206 180 216 300 210S500 206 600 212V230H0z" fill="var(--sand-dark)" opacity="0.5" />

      {CORAL_SLOTS.slice(0, reef.coral).map((c, i) => (
        <g key={`c${i}`} transform={`translate(${c.x} ${GROUND}) scale(${c.scale})`}>
          <g className="grow" style={{ animationDelay: `${i * 0.08}s` }}>
            <Coral type={c.type} color={c.color} />
          </g>
        </g>
      ))}

      {SHELL_SLOTS.slice(0, reef.shells).map((s, i) => (
        <g key={`s${i}`} transform={`translate(${s.x} ${GROUND + 8})`}>
          <Shell color={s.color} />
        </g>
      ))}

      {FISH_SLOTS.slice(0, reef.fish).map((f, i) => (
        <g key={`f${i}`} transform={`translate(${f.x} ${f.y})`}>
          <g className="reef-fish" style={{ animationDuration: `${f.dur}s` }}>
            <g transform={f.flip ? `scale(${-f.s} ${f.s}) translate(-64 0)` : `scale(${f.s})`}>
              <FishShape color={f.color} />
            </g>
          </g>
        </g>
      ))}

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
