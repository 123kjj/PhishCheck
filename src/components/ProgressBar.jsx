export default function ProgressBar({ value, label }) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className="bar"
      role="progressbar"
      aria-label={label}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="bar-fill" style={{ width: `${clamped}%` }} />
    </div>
  )
}
