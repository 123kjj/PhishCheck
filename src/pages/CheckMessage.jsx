import { useState } from 'react'
import { analyzeMessage, RESULT_LEVELS } from '../lib/analyzer.js'
import { SAMPLES } from '../data/samples.js'
import { Mascot, BubbleBurst } from '../components/Ocean.jsx'

// How the fish reacts to the result (purely decorative)
const RESULT_MOOD = { high: 'worried', some: 'curious', few: 'happy' }

export default function CheckMessage() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [stale, setStale] = useState(false)
  const [runs, setRuns] = useState(0) // only used to replay the bubble animation

  const analyze = () => {
    if (!text.trim()) return
    setResult(analyzeMessage(text))
    setStale(false)
    setRuns((n) => n + 1)
  }

  const onChange = (e) => {
    setText(e.target.value)
    if (result) setStale(true)
  }

  const loadSample = (sample) => {
    setText(sample.text)
    setResult(null)
    setStale(false)
  }

  const clear = () => {
    setText('')
    setResult(null)
    setStale(false)
  }

  return (
    <div className="container narrow">
      <header className="page-header">
        <div className="eyebrow">Message analyzer</div>
        <h1>Fish or Phish?</h1>
        <p>
          Got a message that feels a little off? Paste it below and PhishCheck will point out common
          warning signs. Nothing you paste leaves your browser.
        </p>
      </header>

      <div className="card analyzer-card">
        <div className="analyzer-mascot">
          <Mascot
            mood={result && !stale ? RESULT_MOOD[result.level] : text.trim() ? 'curious' : 'idle'}
            look={result && !stale ? 'ahead' : 'down'}
            size={60}
            flip
          />
          {runs > 0 && <BubbleBurst key={runs} />}
        </div>
        <div className="sample-row">
          <span className="sample-label">Try an example:</span>
          {SAMPLES.map((s) => (
            <button key={s.label} type="button" className="chip" onClick={() => loadSample(s)}>
              {s.label}
            </button>
          ))}
        </div>

        <label htmlFor="message" className="sr-only">
          Message to analyze
        </label>
        <textarea
          id="message"
          className="textarea"
          placeholder="Paste an email or text message here..."
          value={text}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) analyze()
          }}
          rows={10}
        />
        <p className="hint">
          Tip: for emails, include the “From:” line so the sender can be checked too.
        </p>

        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={analyze} disabled={!text.trim()}>
            Analyze Message
          </button>
          {text && (
            <button type="button" className="btn btn-ghost" onClick={clear}>
              Clear
            </button>
          )}
        </div>
      </div>

      {result && (
        <section className="results" aria-live="polite">
          {stale && (
            <p className="stale-note">
              You’ve edited the message since this analysis.{' '}
              <button type="button" className="text-button" onClick={analyze}>
                Analyze again
              </button>
            </p>
          )}

          <div className="caught">
            <h2 className="caught-title">Your message has been caught!</h2>
            <p>
              {result.findings.length === 0
                ? 'Here’s what PhishCheck checked for.'
                : `PhishCheck found ${result.findings.length} warning sign${result.findings.length === 1 ? '' : 's'}.`}
            </p>
          </div>

          <h3 className="section-title">Warning signs found</h3>
          {result.findings.length === 0 ? (
            <div className="card muted-card">
              None of the patterns PhishCheck looks for showed up in this message.
            </div>
          ) : (
            <ul className="finding-list">
              {result.findings.map((f) => (
                <li key={f.id} className="finding">
                  <div className="finding-title">
                    <span className="warn-icon" aria-hidden="true">⚠</span>
                    {f.title}
                  </div>
                  <p className="finding-desc">{f.description}</p>
                  <FindingEvidence finding={f} />
                </li>
              ))}
            </ul>
          )}

          <div className={`overall overall-${result.level}`}>
            <div className="overall-kicker">Overall</div>
            <div className="overall-label">{RESULT_LEVELS[result.level].label}</div>
            <p>{RESULT_LEVELS[result.level].summary}</p>
          </div>

          <p className="disclaimer">
            PhishCheck is an educational tool. A message with warning signs is not automatically
            fraudulent.
          </p>
        </section>
      )}

      <details className="how-it-works">
        <summary>How does PhishCheck check messages?</summary>
        <p>
          It uses a set of simple rules written in JavaScript, not AI. It looks for urgent phrases,
          threats, requests for passwords or personal details, links that don’t match the company
          they mention, lookalike spellings (like “paypa1”), link shorteners, unusual domain
          endings, and sender addresses that don’t fit who the message claims to be from.
        </p>
        <p>
          Rules like these can be fooled. A well-written scam might show no warning signs, and a
          normal message might trigger a few. When in doubt, don’t use links in the message — go to
          the website or app yourself, or ask someone you trust.
        </p>
      </details>
    </div>
  )
}

function FindingEvidence({ finding }) {
  // Link and sender findings have full-sentence reasons; others are matched phrases
  if (finding.id === 'link' || finding.id === 'sender') {
    return (
      <ul className="reason-list">
        {finding.evidence.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    )
  }
  return (
    <div className="evidence">
      <span className="evidence-label">{finding.id === 'info' ? 'Mentions:' : 'Found:'}</span>
      {finding.evidence.map((e) => (
        <span key={e} className="evidence-chip">
          {e}
        </span>
      ))}
    </div>
  )
}
