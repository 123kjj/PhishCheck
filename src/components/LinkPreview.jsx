import { useState } from 'react'

// Looks like a link inside a message, but never navigates anywhere.
// Hovering or tapping shows the real destination, like checking a link
// before you click it.
export default function LinkPreview({ label, href, variant = 'inline' }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)
  const show = open || hover

  return (
    <span className={`link-preview ${variant}`}>
      <button
        type="button"
        className={variant === 'button' ? 'msg-button' : 'msg-link'}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onBlur={() => setOpen(false)}
        aria-expanded={show}
      >
        {label}
      </button>
      {show && (
        <span className="link-tooltip" role="status">
          Goes to: <strong>{href}</strong>
        </span>
      )}
    </span>
  )
}
