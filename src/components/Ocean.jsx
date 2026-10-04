import { useEffect, useRef } from 'react'

// Hand-drawn SVG sea life for the underwater theme.
// Every decorative root is marked data-ocean and aria-hidden. All motion is CSS
// (see index.css) and switches off for prefers-reduced-motion.

/* ------------------------------------------------------------------ */
/* Fish                                                                */
/* ------------------------------------------------------------------ */

// A round, friendly fish drawn in a 64 x 35 box, facing right.
// `flat` draws a plain silhouette for distant fish.
export function FishShape({ color, stripe, flat = false }) {
  return (
    <g>
      <path
        d="M17 17.5 6 7.5c-1.6-1.4-3.6-.4-3.2 1.6L5 17.5l-2.2 8.4c-.4 2 1.6 3 3.2 1.6z"
        fill={color}
        opacity={flat ? 1 : 0.9}
      />
      <path d="M30 6c3-5 11-6.5 15-3.5L42 7z" fill={color} opacity={flat ? 1 : 0.85} />
      <ellipse cx="38" cy="17.5" rx="24" ry="15" fill={color} />
      {!flat && (
        <>
          <path d="M18 21c6 7 22 10 36 4-6 6-13 8-20 7-8-1-13-5-16-11z" fill="#fff" opacity="0.22" />
          {stripe && (
            <path d="M30 4.6c-3.6 8-3.6 18 0 25.8" stroke={stripe} strokeWidth="4.5" fill="none" opacity="0.9" />
          )}
          <ellipse cx="36" cy="21" rx="5.5" ry="3" fill="#fff" opacity="0.28" transform="rotate(-20 36 21)" />
          <circle cx="51" cy="14" r="5" fill="#fff" />
          <circle cx="52.2" cy="14.4" r="2.9" fill="#12303b" />
          <circle cx="53.3" cy="13" r="1.05" fill="#fff" />
          <circle cx="50" cy="21.5" r="2.2" fill="#ff8f80" opacity="0.35" />
          <path d="M59.2 19.6q1.4 1 2.6.1" stroke="#12303b" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      )}
    </g>
  )
}

export function Fish({ color = 'var(--fish-1)', stripe, size = 34, flip = false, flat = false, className = '' }) {
  return (
    <svg
      className={`fish-svg ${className}`}
      width={size}
      height={size * 0.55}
      viewBox="0 0 64 35"
      overflow="visible"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <FishShape color={color} stripe={stripe} flat={flat} />
    </svg>
  )
}

// A loose group of small fish that travel together.
const SCHOOL_SPOTS = [
  [0, 18], [22, 5], [24, 31], [46, 16], [68, 4], [70, 29], [92, 17],
]
export function School({ color = 'var(--seafoam)', size = 80, count = 7, flip = false }) {
  return (
    <svg
      className="fish-svg school"
      width={size}
      height={size * 0.42}
      viewBox="0 0 120 50"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      {SCHOOL_SPOTS.slice(0, count).map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <g className="school-fish" style={{ animationDelay: `${i * -0.37}s` }}>
            <g transform="scale(0.36)">
              <FishShape color={color} flat />
              <circle cx="51" cy="14" r="4" fill="#fff" opacity="0.9" />
            </g>
          </g>
        </g>
      ))}
    </svg>
  )
}

// Spikes for the pufferfish, placed around the body circle.
const PUFFER_SPIKES = Array.from({ length: 11 }, (_, i) => {
  const a = ((-160 + i * 29) * Math.PI) / 180
  const p = (r, d) => `${(34 + r * Math.cos(a + d)).toFixed(1)} ${(28 + r * Math.sin(a + d)).toFixed(1)}`
  return `M${p(18, -0.12)}L${p(24.5, 0)}L${p(18, 0.12)}z`
}).join('')

// Pufferfish. Inflates a little on hover where it's interactive (.puffer-live).
export function Pufferfish({ size = 56, flip = false, className = '' }) {
  return (
    <svg
      className={`puffer ${className}`}
      width={size}
      height={size * 0.875}
      viewBox="0 0 64 56"
      overflow="visible"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <g className="puffer-body">
        <path d="M14 28 4 20c-1.4-1.2-3 0-2.4 1.6L4 28l-2.4 6.4c-.6 1.6 1 2.8 2.4 1.6z" fill="#f2b33d" />
        <path className="puffer-spikes" d={PUFFER_SPIKES} fill="#e9a53a" />
        <circle cx="34" cy="28" r="19" fill="#f6c453" />
        <ellipse cx="34" cy="37" rx="14" ry="8" fill="#fff4d6" />
        <g fill="#e0a33a" opacity="0.7">
          <circle cx="25" cy="20" r="1.7" />
          <circle cx="31" cy="14.5" r="1.3" />
          <circle cx="38" cy="17" r="1.5" />
          <circle cx="22" cy="27" r="1.2" />
        </g>
        <ellipse cx="29" cy="31" rx="4.5" ry="3" fill="#f2b33d" transform="rotate(-15 29 31)" />
        <circle cx="44" cy="23" r="5.6" fill="#fff" />
        <circle cx="45.3" cy="23.6" r="3.1" fill="#12303b" />
        <circle cx="46.5" cy="22" r="1.1" fill="#fff" />
        <circle cx="45" cy="31.5" r="2.4" fill="#ff8f80" opacity="0.4" />
        <circle cx="52.3" cy="30" r="1.7" fill="#c46f2e" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Mascot: the little coral fish that shows up on every page           */
/* ------------------------------------------------------------------ */

const PUPIL = {
  ahead: [0, 0],
  left: [-2.2, 0.3],
  down: [0.3, 1.8],
  'down-left': [-1.8, 1.6],
  up: [0.6, -1.8],
}

// moods: idle | curious | happy | oops | worried
export function MascotShape({ mood = 'idle', look = 'ahead' }) {
  const [px, py] = PUPIL[look] || PUPIL.ahead
  const happy = mood === 'happy'
  return (
    <g className="mascot-shape">
      <path d="M16 24 5 13c-1.6-1.6-3.8-.6-3.3 1.6L5 24l-3.3 9.4c-.5 2.2 1.7 3.2 3.3 1.6z" fill="#f6c453" />
      <path d="M27 8.5C31 1.5 43 0 49 5.5L45 9z" fill="#f6c453" />
      <path d="M33 40c2 4.5 7 6 10 4l-2-5z" fill="#f6c453" />
      <ellipse cx="38" cy="24" rx="24" ry="18" fill="#f0936f" />
      <path d="M30 7.4c-4.5 10.5-4.5 22.5 0 33.2" stroke="#fde7d2" strokeWidth="5" fill="none" />
      <path d="M17 29c7 9 25 12 38 4-6 7-14 9.5-21 8.5-8-1-14-5.5-17-12.5z" fill="#fff" opacity="0.18" />
      <ellipse className="mascot-fin" cx="35" cy="29" rx="6.5" ry="3.6" fill="#ffb48f" transform="rotate(-18 35 29)" />
      <circle cx="51" cy="19" r="6.6" fill="#fff" />
      {happy ? (
        <path d="M47.4 20.2q3.6-4.6 7.2 0" stroke="#12303b" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <g className="mascot-pupil" transform={`translate(${px} ${py})`}>
          <circle cx="52" cy="19.5" r={mood === 'worried' ? 2.8 : 3.7} fill="#12303b" />
          <circle cx="53.4" cy="17.8" r="1.3" fill="#fff" />
        </g>
      )}
      <circle cx="50" cy="28.5" r="2.7" fill="#ff7f6e" opacity={happy ? 0.6 : 0.42} />
      {happy && <path d="M57 26.5q3 3 6 0" stroke="#7a3b25" strokeWidth="1.5" fill="none" strokeLinecap="round" />}
      {mood === 'oops' && <circle cx="59.5" cy="28" r="1.6" fill="#7a3b25" />}
      {mood === 'worried' && <path d="M57 28.5q3-1.4 5.5.2" stroke="#7a3b25" strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      {(mood === 'idle' || mood === 'curious') && (
        <path d="M58 26.5q2 1.6 4 0" stroke="#7a3b25" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}
    </g>
  )
}

export function Mascot({ mood = 'idle', look = 'ahead', size = 56, flip = false, className = '' }) {
  return (
    <span className={`mascot mood-${mood} ${className}`} data-ocean aria-hidden="true">
      <span className="mascot-motion">
        <svg
          width={size}
          height={size * 0.67}
          viewBox="0 0 72 48"
          overflow="visible"
          style={flip ? { transform: 'scaleX(-1)' } : undefined}
        >
          <MascotShape mood={mood} look={look} />
        </svg>
      </span>
    </span>
  )
}

// A small puff of bubbles. Re-mount it (change its key) to play it again.
export function BubbleBurst({ className = '' }) {
  return (
    <span className={`bubble-burst ${className}`} data-ocean aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`burst-bubble b${i}`} />
      ))}
    </span>
  )
}

// "Caught a phish": a line drops in with a little envelope-fish on the hook.
export function CatchMoment() {
  return (
    <div className="catch" data-ocean aria-hidden="true">
      <svg className="catch-rig" width="64" height="104" viewBox="0 0 64 104" overflow="visible">
        <line x1="32" y1="-200" x2="32" y2="48" stroke="#5f7f88" strokeWidth="1.4" />
        <path d="M32 48v9a6 6 0 0 1-12 0v-2" fill="none" stroke="#4d6a73" strokeWidth="2.4" strokeLinecap="round" />
        <g className="catch-phish">
          {/* envelope "phish" with a tail */}
          <path d="M14 76l-9-6v14z" fill="#9db3b9" />
          <rect x="13" y="62" width="36" height="25" rx="4" fill="#e9f0f2" stroke="#9db3b9" strokeWidth="1.6" />
          <path d="M14 64l17 12 17-12" fill="none" stroke="#9db3b9" strokeWidth="1.6" strokeLinejoin="round" />
          <circle cx="42" cy="72" r="2.6" fill="#fff" stroke="#9db3b9" strokeWidth="1" />
          <circle cx="42.6" cy="72.3" r="1.3" fill="#31505a" />
          <path d="M22 57.5c3-2 8-2 10 .5" stroke="#4d6a73" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      <span className="catch-bubbles">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`burst-bubble b${i}`} />
        ))}
      </span>
      <span className="catch-school">
        <School color="#3fae9a" size={70} />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reef pieces (shared so the same coral style appears everywhere)     */
/* ------------------------------------------------------------------ */

export function CoralShape({ type, color }) {
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
          <path d="M0 0C-34 -10-40 -52-22 -66 0 -78 24 -72 34 -54 42 -36 26 -8 0 0z" fill={color} opacity="0.9" />
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

export function ShellShape({ color = '#f2d6c2' }) {
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

export function Starfish({ color = '#f28b6b' }) {
  return (
    <g>
      <path
        d="M0 -13 3.6 -4.6 12.4 -4 5.7 1.8 7.7 10.5 0 5.8 -7.7 10.5 -5.7 1.8 -12.4 -4 -3.6 -4.6z"
        fill={color}
        stroke={color}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <g fill="#fff" opacity="0.5">
        <circle cx="0" cy="-6" r="1" />
        <circle cx="5" cy="-2" r="1" />
        <circle cx="-5" cy="-2" r="1" />
        <circle cx="3" cy="4" r="1" />
        <circle cx="-3" cy="4" r="1" />
      </g>
    </g>
  )
}

export function Rock({ color = '#0f4a57', w = 60, h = 26 }) {
  return (
    <path
      d={`M${-w / 2} 0C${-w / 2} ${-h * 0.7} ${-w * 0.2} ${-h} 0 ${-h} ${w * 0.25} ${-h} ${w / 2} ${-h * 0.6} ${w / 2} 0z`}
      fill={color}
    />
  )
}

// A tiny crab that scuttles sideways now and then.
export function Crab() {
  return (
    <g className="crab">
      <g stroke="#c95a44" strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M-6 -2-11 3M-4 -1-8 5M6 -2 11 3M4 -1 8 5" />
        <path d="M-3 -8V-12M3 -8V-12" />
      </g>
      <circle cx="-3" cy="-12.5" r="1.8" fill="#fff" />
      <circle cx="3" cy="-12.5" r="1.8" fill="#fff" />
      <circle cx="-3" cy="-12.3" r="0.9" fill="#12303b" />
      <circle cx="3" cy="-12.3" r="0.9" fill="#12303b" />
      <ellipse cx="0" cy="-4" rx="9" ry="6" fill="#ee7b62" />
      <path d="M-9 -7c-5-1-7-5-5-7 2 1 4 2 5 4" fill="#ee7b62" />
      <path d="M9 -7c5-1 7-5 5-7-2 1-4 2-5 4" fill="#ee7b62" />
    </g>
  )
}

export function Anemone({ color = '#f497b0' }) {
  return (
    <g>
      <g className="anemone" fill="none" stroke={color} strokeWidth="3.4" strokeLinecap="round">
        <path d="M-8 0C-12 -10-16 -14-18 -22" />
        <path d="M-4 0C-6 -12-6 -18-8 -27" />
        <path d="M0 0C0 -12 1 -20 0 -29" />
        <path d="M4 0C6 -12 7 -18 9 -26" />
        <path d="M8 0C12 -10 15 -14 18 -21" />
      </g>
      <ellipse cx="0" cy="0" rx="11" ry="4" fill={color} opacity="0.8" />
    </g>
  )
}

export function Seaweed({ height = 90, color = 'var(--seaweed)', className = '' }) {
  return (
    <svg className={`seaweed ${className}`} width="28" height={height} viewBox={`0 0 28 ${height}`} aria-hidden="true">
      <path
        d={`M14 ${height} C 4 ${height * 0.75}, 24 ${height * 0.55}, 13 ${height * 0.35} S 18 ${height * 0.1}, 14 2`}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Seaweed as an SVG path inside a scene: x/bottom position, height h
function Weed({ x, y, h, color, slow }) {
  return (
    <path
      className={`sway${slow ? ' slow' : ''}`}
      d={`M${x} ${y}C${x - 10} ${y - h * 0.25} ${x + 10} ${y - h * 0.45} ${x - 1} ${y - h * 0.65}S${x + 4} ${y - h * 0.9} ${x} ${y - h}`}
      fill="none"
      stroke={color}
      strokeWidth="6"
      strokeLinecap="round"
    />
  )
}

// Far-off reef outline for depth (same coral shapes, flat and faded)
export function CoralSilhouettes({ color, className = '' }) {
  const items = [
    [60, 'fan', 0.9], [150, 'branch', 0.8], [250, 'brain', 0.7], [370, 'tube', 0.75],
    [500, 'branch', 0.6], [640, 'fan', 0.75], [760, 'brain', 0.8], [880, 'tube', 0.6],
    [990, 'branch', 0.85], [1110, 'fan', 0.7],
  ]
  return (
    <svg
      className={`coral-silhouettes ${className}`}
      viewBox="0 0 1200 80"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      {items.map(([x, type, s]) => (
        <g key={x} transform={`translate(${x} 82) scale(${s})`}>
          <CoralShape type={type} color={color} />
        </g>
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Moving layers                                                       */
/* ------------------------------------------------------------------ */

// One swimming creature in a lane. `park` is where it rests when motion is reduced.
function Swimmer({ lane, index }) {
  const {
    kind = 'fish', dir = 'right', dur = 60, delay = 0, layer = 'mid',
    top, bottom, size = 30, color, stripe, park = '30%', wideOnly, hideStill,
  } = lane
  const flip = dir === 'left'
  let creature
  if (kind === 'school') creature = <School color={color} size={size} flip={flip} />
  else if (kind === 'puffer') creature = <Pufferfish size={size} flip={flip} />
  else creature = <Fish color={color} stripe={stripe} size={size} flip={flip} flat={kind === 'silhouette'} />
  return (
    <div
      className={`swim swim-${dir} layer-${layer}${wideOnly ? ' wide-only' : ''}${hideStill ? ' hide-still' : ''}`}
      style={{ top, bottom, animationDuration: `${dur}s`, animationDelay: `${delay}s`, '--park': park }}
    >
      <div className="bob" style={{ animationDelay: `${index * -1.3}s`, animationDuration: `${4 + (index % 3)}s` }}>
        {creature}
      </div>
    </div>
  )
}

function Lanes({ lanes, className = '' }) {
  return (
    <div className={`lanes ${className}`}>
      {lanes.map((lane, i) => (
        <Swimmer key={i} lane={lane} index={i} />
      ))}
    </div>
  )
}

// Slowly drifting specks ("marine snow") for depth
export function Particles({ count = 16, tone = 'deep' }) {
  return (
    <div className={`particles particles-${tone}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 92}%`,
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            animationDuration: `${14 + (i % 5) * 3}s`,
            animationDelay: `${-i * 1.7}s`,
          }}
        />
      ))}
    </div>
  )
}

function Bubbles({ items }) {
  return items.map((b, i) => (
    <span
      key={i}
      className={`bubble layer-${b.layer || 'mid'}`}
      style={{
        left: b.left,
        bottom: b.bottom,
        width: b.size,
        height: b.size,
        animationDuration: `${b.duration}s`,
        animationDelay: `${b.delay}s`,
      }}
    />
  ))
}

/* ------------------------------------------------------------------ */
/* Scenes                                                              */
/* ------------------------------------------------------------------ */

const HERO_LANES = [
  { kind: 'school', top: '12px', dir: 'right', dur: 95, delay: -30, layer: 'far', color: '#86b9c2', size: 74, park: '58%' },
  { kind: 'fish', top: '20px', dir: 'left', dur: 62, delay: -10, layer: 'mid', color: 'var(--fish-1)', stripe: '#d8f3f6', size: 26, park: '86%' },
  { kind: 'fish', bottom: '30px', dir: 'right', dur: 36, delay: -14, layer: 'near', color: 'var(--fish-3)', stripe: '#ffe3c9', size: 54, park: '70%' },
  { kind: 'school', bottom: '74px', dir: 'left', dur: 50, delay: -35, layer: 'mid', color: '#3f9fb0', size: 64, park: '24%' },
  { kind: 'silhouette', bottom: '56px', dir: 'left', dur: 74, delay: -50, layer: 'far', color: '#86b9c2', size: 22, park: '44%' },
]

// Lanes that only run behind the example card on wide screens
const HERO_RIGHT_LANES = [
  { kind: 'fish', top: '30%', dir: 'left', dur: 24, delay: -8, layer: 'mid', color: 'var(--fish-2)', stripe: '#effcff', size: 26, park: '80%', wideOnly: true },
  { kind: 'silhouette', top: '64%', dir: 'right', dur: 38, delay: -22, layer: 'far', color: '#86b9c2', size: 20, park: '10%', wideOnly: true },
]

const HERO_BUBBLES = [
  { left: '7%', bottom: '24px', size: 9, duration: 11, delay: -2, layer: 'near' },
  { left: '8.6%', bottom: '24px', size: 5, duration: 13, delay: -7, layer: 'mid' },
  { left: '47%', bottom: '24px', size: 4, duration: 16, delay: -4, layer: 'far' },
  { left: '71%', bottom: '24px', size: 10, duration: 12, delay: -9, layer: 'near' },
  { left: '72.6%', bottom: '24px', size: 5, duration: 10, delay: -1, layer: 'mid' },
  { left: '93%', bottom: '24px', size: 6, duration: 15, delay: -6, layer: 'far' },
]

// Background for the home page hero (the bright surface water).
export function OceanScene() {
  return (
    <div className="ocean-scene" data-ocean aria-hidden="true">
      <CoralSilhouettes className="hero-distant" color="#a9d5da" />
      <Lanes lanes={HERO_LANES} />
      <Lanes lanes={HERO_RIGHT_LANES} className="lanes-right" />
      <Particles count={10} tone="light" />
      <Bubbles items={HERO_BUBBLES} />
      <div className="seaweed-group left">
        <Seaweed height={96} />
        <Seaweed height={64} color="var(--seaweed-2)" className="slow" />
      </div>
      <div className="seaweed-group right">
        <Seaweed height={70} color="var(--seaweed-2)" className="slow" />
        <Seaweed height={104} />
      </div>
    </div>
  )
}

const BAND_LANES = [
  { kind: 'school', top: '7%', dir: 'left', dur: 110, delay: -40, layer: 'far', color: '#16707c', size: 96, park: '48%' },
  { kind: 'silhouette', top: '34%', dir: 'right', dur: 70, delay: -12, layer: 'far', color: '#16707c', size: 30, park: '8%', hideStill: true },
  { kind: 'silhouette', top: '66%', dir: 'left', dur: 82, delay: -55, layer: 'far', color: '#16707c', size: 24, park: '52%', hideStill: true },
  { kind: 'fish', top: '22%', dir: 'right', dur: 46, delay: -20, layer: 'mid', color: 'var(--coral)', stripe: '#fff1e2', size: 36, park: '30%' },
  { kind: 'fish', top: '47%', dir: 'left', dur: 38, delay: -5, layer: 'mid', color: 'var(--sun)', stripe: '#ff9f6b', size: 30, park: '88%' },
  { kind: 'school', top: '57%', dir: 'right', dur: 55, delay: -40, layer: 'mid', color: 'var(--seafoam)', size: 84, park: '60%', hideStill: true },
  { kind: 'fish', bottom: '22px', dir: 'left', dur: 32, delay: -12, layer: 'near', color: 'var(--bright-teal)', stripe: '#d4fff8', size: 72, park: '78%' },
  { kind: 'fish', bottom: '70px', dir: 'right', dur: 41, delay: -28, layer: 'near', color: 'var(--coral-pink)', stripe: '#ffe6ee', size: 34, park: '16%' },
]

const BAND_BUBBLES = [
  { left: '4%', bottom: '0px', size: 8, duration: 13, delay: -3, layer: 'near' },
  { left: '5.5%', bottom: '0px', size: 4, duration: 15, delay: -9, layer: 'far' },
  { left: '38%', bottom: '0px', size: 6, duration: 17, delay: -5, layer: 'mid' },
  { left: '63%', bottom: '0px', size: 5, duration: 14, delay: -11, layer: 'far' },
  { left: '88%', bottom: '0px', size: 9, duration: 12, delay: -2, layer: 'near' },
  { left: '89.6%', bottom: '0px', size: 5, duration: 16, delay: -7, layer: 'mid' },
]

// Background for the deeper section of the home page.
export function DeepScene() {
  return (
    <div className="deep-scene" data-ocean aria-hidden="true">
      <div className="light-rays" />
      <Lanes lanes={BAND_LANES} />
      <Particles count={26} tone="deep" />
      <Bubbles items={BAND_BUBBLES} />
    </div>
  )
}

// A small fish that drifts toward the cursor (only with a mouse, never with reduced motion).
export function CursorFish({ areaRef }) {
  const fishRef = useRef(null)
  useEffect(() => {
    const area = areaRef.current
    const el = fishRef.current
    if (!area || !el) return undefined
    let x = area.clientWidth * 0.82
    let y = 40
    let tx = x
    let ty = y
    let facing = -1
    let raf = 0
    const place = () => {
      el.style.transform = `translate(${x}px, ${y}px) scaleX(${facing})`
    }
    place()
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia?.('(pointer: fine)').matches
    if (reduce || !finePointer) return undefined

    const step = () => {
      const dx = tx - x
      const dy = ty - y
      x += dx * 0.022
      y += dy * 0.022
      if (Math.abs(dx) > 4) facing = dx > 0 ? 1 : -1
      place()
      raf = Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5 ? requestAnimationFrame(step) : 0
    }
    const onMove = (e) => {
      const r = area.getBoundingClientRect()
      // trail a little behind and below the cursor, never on top of it
      tx = Math.max(0, Math.min(r.width - 40, e.clientX - r.left - 70 * (e.clientX - r.left > x ? 1 : -1)))
      ty = Math.max(0, Math.min(r.height - 30, e.clientY - r.top + 24))
      if (!raf) raf = requestAnimationFrame(step)
    }
    area.addEventListener('pointermove', onMove)
    return () => {
      area.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [areaRef])

  return (
    <div className="cursor-fish" ref={fishRef} data-ocean aria-hidden="true">
      <Fish color="var(--bright-teal)" stripe="#e2fffb" size={30} />
    </div>
  )
}

// Fish that swim behind the content on the inner pages, getting deeper page by page.
const PAGE_LANES = {
  shallow: [
    { kind: 'silhouette', top: '9%', dir: 'right', dur: 80, delay: -20, layer: 'far', color: '#a6cfd6', size: 26, park: '90%' },
    { kind: 'fish', top: '36%', dir: 'left', dur: 55, delay: -8, layer: 'mid', color: 'var(--fish-2)', stripe: '#effcff', size: 26, park: '4%' },
    { kind: 'school', top: '68%', dir: 'right', dur: 90, delay: -50, layer: 'far', color: '#9ccad1', size: 84, park: '88%' },
  ],
  mid: [
    { kind: 'school', top: '5%', dir: 'left', dur: 100, delay: -30, layer: 'far', color: '#168592', size: 96, park: '86%' },
    { kind: 'fish', top: '27%', dir: 'right', dur: 42, delay: -18, layer: 'mid', color: 'var(--coral)', stripe: '#fff1e2', size: 34, park: '3%' },
    { kind: 'silhouette', top: '49%', dir: 'left', dur: 75, delay: -40, layer: 'far', color: '#168592', size: 30, park: '90%' },
    { kind: 'fish', top: '70%', dir: 'left', dur: 50, delay: -6, layer: 'mid', color: 'var(--sun)', stripe: '#ff9f6b', size: 28, park: '92%' },
    { kind: 'puffer', top: '86%', dir: 'right', dur: 95, delay: -60, layer: 'mid', size: 40, park: '2%' },
  ],
  deep: [
    { kind: 'silhouette', top: '7%', dir: 'right', dur: 90, delay: -20, layer: 'far', color: '#0d5363', size: 34, park: '4%' },
    { kind: 'fish', top: '31%', dir: 'left', dur: 48, delay: -10, layer: 'mid', color: 'var(--bright-teal)', stripe: '#d4fff8', size: 32, park: '92%' },
    { kind: 'school', top: '56%', dir: 'right', dur: 70, delay: -35, layer: 'mid', color: 'var(--seafoam)', size: 74, park: '2%' },
    { kind: 'fish', top: '80%', dir: 'left', dur: 60, delay: -25, layer: 'mid', color: 'var(--coral-pink)', stripe: '#ffe6ee', size: 28, park: '93%' },
  ],
}

export function PageFish({ zone }) {
  const lanes = PAGE_LANES[zone]
  if (!lanes) return null
  return (
    <div className={`page-fish page-fish-${zone}`} data-ocean aria-hidden="true">
      {zone === 'deep' && <div className="light-rays" />}
      <Lanes lanes={lanes} />
      {zone !== 'shallow' && <Particles count={zone === 'deep' ? 30 : 18} tone="deep" />}
    </div>
  )
}

// The sea floor at the bottom of every page, with a different arrangement per page.
const FLOOR = 'M0 150V128c60-8 120 4 190-2s130-14 210-6 150 10 230 2 140-12 220-4 150 8 220 0 100-6 130-2V150z'

function SeabedItems({ zone }) {
  switch (zone) {
    case 'surface':
      return (
        <>
          <Weed x={90} y={132} h={92} color="var(--seaweed-bright)" />
          <g transform="translate(130 130)"><CoralShape type="fan" color="var(--coral)" /></g>
          <g transform="translate(190 132) scale(.85)"><CoralShape type="branch" color="var(--coral-peach)" /></g>
          <Weed x={235} y={132} h={64} color="var(--seaweed-2)" slow />
          <g transform="translate(275 132)"><Starfish /></g>
          <g transform="translate(470 132)"><Anemone /></g>
          <g transform="translate(540 132)"><Rock w={64} h={24} color="#0d4251" /></g>
          <g transform="translate(548 112) rotate(15)"><Starfish color="var(--sun)" /></g>
          <g transform="translate(615 132) scale(.9)"><CoralShape type="brain" color="var(--coral-pink)" /></g>
          <g transform="translate(675 132) scale(.8)"><CoralShape type="tube" color="var(--seafoam)" /></g>
          <g transform="translate(720 134)"><ShellShape color="#f5cfc6" /></g>
          <Weed x={760} y={132} h={80} color="var(--seaweed-bright)" slow />
          <g transform="translate(990 132)"><Rock w={80} h={30} color="#0d4251" /></g>
          <g transform="translate(1050 132) scale(.9)"><CoralShape type="branch" color="var(--coral-pink)" /></g>
          <Weed x={1110} y={132} h={100} color="var(--seaweed-bright)" />
        </>
      )
    case 'shallow':
      return (
        <>
          <Weed x={120} y={132} h={88} color="var(--seaweed-bright)" />
          <g transform="translate(170 132)"><Rock w={70} h={26} color="#0d4251" /></g>
          <g transform="translate(400 132) scale(.85)"><CoralShape type="tube" color="var(--coral-peach)" /></g>
          <Weed x={445} y={132} h={60} color="var(--seaweed-2)" slow />
          <g transform="translate(560 132)"><Rock w={90} h={34} color="#0d4251" /></g>
          <g transform="translate(615 132)"><Rock w={50} h={20} color="#114b5a" /></g>
          <g transform="translate(690 134)"><Crab /></g>
          <g transform="translate(760 134)"><ShellShape /></g>
          <Weed x={800} y={132} h={84} color="var(--seaweed-bright)" slow />
          <g transform="translate(920 132)"><CoralShape type="fan" color="var(--coral-pink)" /></g>
          <g transform="translate(1080 132)"><Starfish /></g>
        </>
      )
    case 'mid':
      return (
        <>
          <Weed x={80} y={132} h={96} color="var(--seaweed-bright)" />
          <g transform="translate(300 132)"><CoralShape type="brain" color="var(--coral)" /></g>
          <g transform="translate(360 132) scale(.9)"><CoralShape type="fan" color="var(--coral-peach)" /></g>
          <g transform="translate(470 132)"><Rock w={60} h={22} color="#0d4251" /></g>
          <g transform="translate(560 132)"><Anemone color="var(--seafoam)" /></g>
          <g transform="translate(640 134)"><Starfish color="var(--sun)" /></g>
          <g transform="translate(720 132) scale(.85)"><CoralShape type="branch" color="var(--coral-pink)" /></g>
          <Weed x={770} y={132} h={70} color="var(--seaweed-2)" slow />
          <g transform="translate(1000 132)"><Rock w={84} h={30} color="#0d4251" /></g>
          <Weed x={1120} y={132} h={90} color="var(--seaweed-bright)" slow />
        </>
      )
    default: // deep
      return (
        <>
          <Weed x={200} y={132} h={80} color="var(--seaweed-bright)" />
          <g transform="translate(260 132)"><Rock w={80} h={28} color="#0b3a47" /></g>
          <g transform="translate(560 132)"><Anemone /></g>
          <g transform="translate(620 132)"><Rock w={56} h={22} color="#0b3a47" /></g>
          <g transform="translate(680 134)"><ShellShape color="#efe1c6" /></g>
          <g transform="translate(940 132)"><Rock w={70} h={26} color="#0b3a47" /></g>
          <Weed x={990} y={132} h={92} color="var(--seaweed-bright)" slow />
        </>
      )
  }
}

export function Seabed({ zone }) {
  return (
    <div className={`seabed seabed-${zone}`} data-ocean aria-hidden="true">
      <div className="seabed-wave" />
      <svg className="seabed-svg" viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice">
        <g transform="translate(0 40)" opacity="0.7">
          <CoralSilhouettes color="#0a4150" />
        </g>
        <g className="seabed-distant">
          {[[300, 'fan'], [840, 'branch'], [1150, 'brain']].map(([x, t]) => (
            <g key={x} transform={`translate(${x} 132) scale(.8)`}>
              <CoralShape type={t} color="#0b4553" />
            </g>
          ))}
        </g>
        <path d={FLOOR} fill="var(--midnight)" />
        <SeabedItems zone={zone} />
      </svg>
    </div>
  )
}

// Two softly moving wave layers at the bottom of the hero.
export function Waves() {
  return (
    <div className="waves" data-ocean aria-hidden="true">
      <div className="wave wave-back" />
      <div className="wave wave-front" />
    </div>
  )
}
