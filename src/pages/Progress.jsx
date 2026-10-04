import { useState } from 'react'
import ProgressBar from '../components/ProgressBar.jsx'
import Reef from '../components/Reef.jsx'
import { getReef, FISH_EVERY, SHELL_EVERY } from '../lib/reef.js'
import { SKILL_LABELS, SKILL_DESCRIPTIONS } from '../data/scenarios.js'
import { percent } from '../lib/progress.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function Progress({ progress, onReset }) {
  const [confirming, setConfirming] = useState(false)
  const accuracy = percent(progress.correct, progress.answered)
  const hasData = progress.answered > 0
  const reef = getReef(progress)

  const stats = [
    { label: 'Challenges completed', value: progress.challengesCompleted },
    { label: 'Correct answers', value: `${progress.correct}`, sub: `out of ${progress.answered}` },
    { label: 'Accuracy', value: hasData ? `${accuracy}%` : '–' },
    {
      label: 'Current streak',
      value: progress.currentStreak,
      sub: `best: ${progress.bestStreak}`,
    },
  ]

  return (
    <div className="container narrow">
      <header className="page-header">
        <div className="eyebrow">Progress</div>
        <h1>Your Reef</h1>
        <p>Your challenge results, saved in this browser. Your reef grows as you practice.</p>
      </header>

      <section className="card reef-card on-deep">
        <Reef reef={reef} />
        {reef.isEmpty ? (
          <div className="reef-empty">
            <p>
              {hasData
                ? 'You’re partway there. Finish a full challenge to plant your first coral.'
                : 'Your reef is empty for now. Finish a challenge to plant your first coral.'}
            </p>
            <a href="#/challenge" className="btn btn-primary">
              Start a Challenge
            </a>
          </div>
        ) : (
          <ul className="reef-legend">
            <li>
              <span className="legend-dot coral" aria-hidden="true" />
              <span>
                <strong>{progress.challengesCompleted} coral</strong> · one for each challenge you finish
              </span>
            </li>
            <li>
              <span className="legend-dot fish" aria-hidden="true" />
              <span>
                <strong>{reef.fish} fish</strong> · one for every {FISH_EVERY} correct answers
                {reef.nextFish > 0 && (
                  <span className="legend-next">
                    {' '}({reef.nextFish} more for the next one)
                  </span>
                )}
              </span>
            </li>
            <li>
              <span className="legend-dot shell" aria-hidden="true" />
              <span>
                <strong>{reef.shells} {reef.shells === 1 ? 'shell' : 'shells'}</strong> · one for every {SHELL_EVERY} correct answers
                in a row
                {reef.nextShell > 0 && (
                  <span className="legend-next">
                    {' '}(next one at a streak of {SHELL_EVERY * (reef.shells + 1)})
                  </span>
                )}
              </span>
            </li>
            {reef.bubbles && (
              <li>
                <span className="legend-dot bubbles-dot" aria-hidden="true" />
                <span>Bubbles appear while you’re on a streak of 3 or more.</span>
              </li>
            )}
          </ul>
        )}
      </section>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            {s.sub && <div className="stat-sub">{s.sub}</div>}
          </div>
        ))}
      </div>

      <section className="section">
        <h2 className="section-title">Skill areas</h2>
        <div className="card">
          {Object.keys(SKILL_LABELS).map((key) => {
            const s = progress.skills[key]
            const pct = percent(s.correct, s.attempts)
            return (
              <div key={key} className="skill">
                <div className="skill-head">
                  <div>
                    <div className="skill-name">{SKILL_LABELS[key]}</div>
                    <div className="skill-desc">{SKILL_DESCRIPTIONS[key]}</div>
                  </div>
                  <div className="skill-pct">{s.attempts ? `${pct}%` : 'Not practiced yet'}</div>
                </div>
                <ProgressBar value={pct} label={SKILL_LABELS[key]} />
                {s.attempts > 0 && (
                  <div className="skill-count">
                    {s.correct} of {s.attempts} related questions correct
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {progress.history.length > 0 && (
        <section className="section">
          <h2 className="section-title">Recent challenges</h2>
          <ul className="history card">
            {progress.history.map((h, i) => (
              <li key={`${h.date}-${i}`}>
                <span>{formatDate(h.date)}</span>
                <span className="history-score">
                  {h.score} / {h.total}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="section reset-section">
        {!confirming ? (
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => setConfirming(true)}
            disabled={!hasData && progress.challengesCompleted === 0}
          >
            Reset Progress
          </button>
        ) : (
          <div className="confirm">
            <span>Clear all saved progress and start a new reef? This can’t be undone.</span>
            <div className="button-row">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  onReset()
                  setConfirming(false)
                }}
              >
                Yes, reset
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
