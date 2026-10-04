import Logo from './Logo.jsx'
import { hrefFor } from '../lib/useHashRoute.js'

// Friendly names, each with a plain-language caption so it's clear what's behind them
export const NAV_LINKS = [
  { route: 'home', label: 'Home', caption: 'Start here' },
  { route: 'check', label: 'Fish or Phish?', caption: 'Check a message' },
  { route: 'challenge', label: 'Don’t Get Hooked', caption: 'Challenge' },
  { route: 'progress', label: 'Your Reef', caption: 'Progress' },
  { route: 'contact', label: 'Contact', caption: 'Get in touch' },
]

export default function Header({ route }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#/" className="brand">
          <Logo />
          <span>PhishCheck</span>
        </a>
        <nav className="nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <a
              key={link.route}
              href={hrefFor(link.route)}
              className={`nav-link${route === link.route ? ' active' : ''}`}
              aria-current={route === link.route ? 'page' : undefined}
            >
              <span className="nav-label">{link.label}</span>
              <span className="nav-caption">{link.caption}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
