// Small hand-drawn SVG pieces for the underwater theme.
// All motion is CSS (see index.css) and switches off for prefers-reduced-motion.

// The fish drawing as an SVG group (64 x 35 units), so it can be placed inside other SVGs.
export function FishShape({ color }) {
  return (
    <g>
      <path d="M14 17.5 2 6c-1.2-1.1-2.6 0-2 1.4l4 10.1-4 10.1c-.6 1.4.8 2.5 2 1.4z" fill={color} opacity="0.85" />
      <path d="M12 17.5C18 6 30 2 42 3.5 54 5 62 11 63 17.5 62 24 54 30 42 31.5 30 33 18 29 12 17.5z" fill={color} />
      <path d="M32 5.5c3-4 9-5.5 12-4l-2 4z" fill={color} opacity="0.8" />
      <path d="M48 11c-2.5 4-2.5 9 0 13" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="54.5" cy="15" r="2.2" fill="#fff" />
      <circle cx="55" cy="15" r="1.1" fill="#16343f" />
    </g>
  )
}

export function Fish({ color = 'var(--fish-1)', size = 34, flip = false, className = '' }) {
  return (
    <svg
      className={`fish-svg ${className}`}
      width={size}
      height={size * 0.55}
      viewBox="0 0 64 35"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <FishShape color={color} />
    </svg>
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

const FISH = [
  { top: '5%', size: 28, color: 'var(--fish-1)', duration: 58, delay: -12, dir: 'right' },
  { top: '86%', size: 24, color: 'var(--fish-2)', duration: 72, delay: -40, dir: 'left' },
  { top: '78%', size: 34, color: 'var(--fish-3)', duration: 64, delay: -48, dir: 'right' },
  { top: '9%', size: 16, color: 'var(--fish-2)', duration: 84, delay: -20, dir: 'left' },
]

const BUBBLES = [
  { left: '8%', size: 8, duration: 11, delay: -2 },
  { left: '9.5%', size: 5, duration: 13, delay: -7 },
  { left: '46%', size: 6, duration: 14, delay: -4 },
  { left: '71%', size: 9, duration: 12, delay: -9 },
  { left: '72.5%', size: 5, duration: 10, delay: -1 },
  { left: '93%', size: 7, duration: 15, delay: -6 },
]

// Background for the home page hero. Purely decorative.
export function OceanScene() {
  return (
    <div className="ocean-scene" aria-hidden="true">
      {FISH.map((f, i) => (
        <div
          key={i}
          className={`swim swim-${f.dir}`}
          style={{ top: f.top, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s` }}
        >
          <div className="bob" style={{ animationDelay: `${i * -1.3}s` }}>
            <Fish size={f.size} color={f.color} flip={f.dir === 'left'} />
          </div>
        </div>
      ))}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
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

// Two softly moving wave layers, used at the bottom of the hero and top of the footer.
export function Waves({ flip = false }) {
  return (
    <div className={`waves${flip ? ' waves-flip' : ''}`} aria-hidden="true">
      <div className="wave wave-back" />
      <div className="wave wave-front" />
    </div>
  )
}
