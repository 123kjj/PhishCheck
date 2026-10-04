import { useRef } from 'react'
import { OceanScene, DeepScene, CursorFish, Pufferfish, Mascot, Waves } from '../components/Ocean.jsx'
import { HEADLINE_STATS, COMPLAINTS_BY_AGE, WHO_IT_HELPS, SOURCES } from '../data/facts.js'

const MAX_COMPLAINTS = Math.max(...COMPLAINTS_BY_AGE.map((d) => d.complaints))

const SIGNS = [
  {
    title: 'Urgent language',
    text: 'Messages that pressure you to act immediately deserve a closer look.',
  },
  {
    title: 'Requests for information',
    text: 'Be careful when a message asks for passwords, codes, or other sensitive information.',
  },
]

export default function Home() {
  const bandRef = useRef(null)
  return (
    <>
      <section className="hero-band">
        <OceanScene />
        <div className="container hero">
          <div className="hero-text">
            <h1 className="hero-title">PhishCheck</h1>
            <p className="hero-tagline">Don’t get hooked.</p>
            <p className="hero-lead">
              Learn how to spot suspicious messages before they catch you.
            </p>
            <div className="button-row">
              <a href="#/check" className="btn btn-primary">
                Check a Message
              </a>
              <a href="#/challenge" className="btn btn-secondary">
                Start a Challenge
              </a>
            </div>
            <p className="hero-friendly">
              Never heard of phishing before? That’s okay. We’ll show you what to look for.
            </p>
          </div>

          {/* The example message is the "bait" hanging on a line. Numbers match the list below. */}
          <figure className="hero-example" aria-label="Example phishing text with warning signs marked">
            <svg className="fishing-line" width="24" height="300" viewBox="0 0 24 300" aria-hidden="true">
              <line x1="12" y1="0" x2="12" y2="276" stroke="var(--line)" strokeWidth="1.5" />
              <path
                d="M12 276v10a6 6 0 0 1-12 0v-2"
                fill="none"
                stroke="var(--hook)"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
            </svg>
            <div className="example-label">Example text message</div>
            <div className="example-bubble">
              Your school account will be locked{' '}
              <mark className="mark">
                <span className="mark-num">1</span>within 24 hours
              </mark>
              . To keep access, reply with{' '}
              <mark className="mark">
                <span className="mark-num">2</span>your password
              </mark>
              .
            </div>
            <figcaption className="example-caption">
              Looks harmless at first. It has two warning signs.
            </figcaption>
            {/* the PhishCheck fish peeks out from behind the card, eyeing the message */}
            <Mascot className="peek-hero" mood="curious" look="down" size={58} flip />
          </figure>
        </div>
        <Waves />
      </section>

      <div className="deep-band on-deep" ref={bandRef}>
        <DeepScene />
        <CursorFish areaRef={bandRef} />
        <div className="container deep-band-content">
        <section className="section look-section">
          <h2 className="section-title">What should you look for?</h2>
          <span className="puffer-spot" data-ocean aria-hidden="true">
            <Pufferfish size={54} flip className="puffer-live" />
          </span>
          <div className="sign-grid">
            {SIGNS.map((sign, i) => (
              <div key={sign.title} className="card sign-card">
                <span className="sign-num">{i + 1}</span>
                <h3>{sign.title}</h3>
                <p>{sign.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section why-section" aria-labelledby="why-title">
          <h2 className="section-title" id="why-title">Why PhishCheck?</h2>
          <p className="why-lead">
            Phishing is the most reported internet crime in the United States, and it doesn’t only
            happen to other people. Scammers don’t need to break into a computer if they can get
            someone to hand over a password. Most people are never taught what to look for, so
            PhishCheck teaches the warning signs through practice instead of fear.
          </p>

          <div className="fact-grid">
            {HEADLINE_STATS.map((s) => (
              <div key={s.value} className="card fact-card">
                <div className="fact-value">{s.value}</div>
                <p className="fact-label">{s.label}</p>
                <div className="fact-detail">{s.detail}</div>
              </div>
            ))}
          </div>

          <figure className="card age-chart">
            <figcaption>
              <span className="age-chart-title">Who reports internet crime to the FBI, by age</span>
              <span className="age-chart-sub">Number of complaints in 2025</span>
            </figcaption>
            <ul className="age-bars">
              {COMPLAINTS_BY_AGE.map((d) => (
                <li key={d.age}>
                  <span className="age-label">{d.age}</span>
                  <span className="age-track">
                    <span
                      className={`age-fill${d.age === 'Under 20' || d.age === '20–29' ? ' young' : ''}`}
                      style={{ width: `${(d.complaints / MAX_COMPLAINTS) * 100}%` }}
                    />
                  </span>
                  <span className="age-num">{d.complaints.toLocaleString('en-US')}</span>
                </li>
              ))}
            </ul>
            <p className="age-note">
              Every age group is targeted. Younger people report scams often, while older adults
              tend to lose the most money.
            </p>
          </figure>

          <p className="sources">
            Sources:{' '}
            <a href={SOURCES.ic3.url} target="_blank" rel="noreferrer">
              {SOURCES.ic3.name}
            </a>
            {' · '}
            <a href={SOURCES.dbir.url} target="_blank" rel="noreferrer">
              {SOURCES.dbir.name}
            </a>
          </p>
        </section>

        <section className="section who-section" aria-labelledby="who-title">
          <h2 className="section-title" id="who-title">Who can PhishCheck help?</h2>
          <div className="who-grid">
            {WHO_IT_HELPS.map((w) => (
              <div key={w.title} className="card who-card">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section how-strip">
          <a href="#/check" className="how-item">
            <span className="how-name">Fish or Phish?</span>
            <span className="how-text">Paste a message you got and see which warning signs it has.</span>
          </a>
          <a href="#/challenge" className="how-item">
            <span className="how-name">Don’t Get Hooked</span>
            <span className="how-text">Ten real-looking messages. Decide which ones you’d trust.</span>
          </a>
          <a href="#/progress" className="how-item">
            <span className="how-name">Your Reef</span>
            <span className="how-text">Track your progress and watch a small reef grow.</span>
          </a>
        </section>
        </div>
      </div>
    </>
  )
}
