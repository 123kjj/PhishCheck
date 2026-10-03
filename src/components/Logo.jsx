// A fish hook inside a rounded tile — the "phish" in PhishCheck.
export default function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo-mark">
      <rect width="32" height="32" rx="9" fill="var(--accent)" />
      <circle cx="18" cy="7" r="2.3" fill="none" stroke="#fff" strokeWidth="1.9" />
      <path
        d="M18 9.3v10.2a4.8 4.8 0 0 1-9.6 0v-1.7"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M8.4 17.8l2.9 2.3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="23.5" cy="23" r="1.4" fill="#fff" opacity="0.7" />
      <circle cx="25.5" cy="19.2" r="0.9" fill="#fff" opacity="0.5" />
    </svg>
  )
}
