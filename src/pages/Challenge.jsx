import { useEffect, useRef } from 'react'
import MessageCard from '../components/MessageCard.jsx'
import { SCENARIOS } from '../data/scenarios.js'
import { scoreMessage, isCorrectChoice } from '../lib/scoring.js'

function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function newSession() {
  return {
    order: shuffle(SCENARIOS.map((s) => s.id)),
    index: 0,
    answers: [], // { id, choice, correct }
    finished: false,
  }
}

function hasLinks(scenario) {
  return scenario.body.some((b) => typeof b !== 'string' || b.includes('[['))
}

const byId = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]))

export default function Challenge({ session, setSession, onAnswer, onComplete }) {
  const topRef = useRef(null)

  // Scroll back to the question when moving to the next one
  useEffect(() => {
    if (session && session.index > 0 && topRef.current) {
      topRef.current.scrollIntoView({ block: 'start' })
    }
  }, [session?.index])

  if (!session) {
    return <Intro onStart={() => setSession(newSession())} />
  }

  if (session.finished) {
    return (
<Results session={session} onRestart={() => setSession(newSession())} />
    )
  }

  const total = session.order.length
  const scenario = byId[session.order[session.index]]
  const answer = session.answers[session.index] // undefined until answered
  const score = session.answers.filter((a) => a.correct).length
  const isLast = session.index === total - 1

  const choose = (choice) => {
    if (answer) return // already answered, ignore double clicks
    const correct = isCorrectChoice(choice, scenario.answer)
    setSession({
      ...session,
      answers: [...session.answers, { id: scenario.id, choice, correct }],
    })
    onAnswer({ isCorrect: correct, skills: scenario.skills })
  }

  const next = () => {
    if (isLast) {
      onComplete({ score, total })
      setSession({ ...session, finished: true })
    } else {
      setSession({ ...session, index: session.index + 1 })
    }
  }

  return (
    <div className="container narrow" ref={topRef}>
      <div className="quiz-top">
        <span>
          Question {session.index + 1} of {total}
        </span>
        <span>Score: {score}</span>
      </div>
      <div className="quiz-track" aria-hidden="true">
        {session.order.map((id, i) => {
          const a = session.answers[i]
          let cls = 'dot'
          if (a) cls += a.correct ? ' dot-right' : ' dot-wrong'
          else if (i === session.index) cls += ' dot-current'
          return <span key={id} className={cls} />
        })}
      </div>

      {scenario.context && <p className="context">{scenario.context}</p>}

      <MessageCard scenario={scenario} />
      {hasLinks(scenario) && (
        <p className="hint">Hover over or tap a link to see where it really goes.</p>
      )}

      {!answer ? (
        <div className="question">
          <h2>Would you trust this message?</h2>
          <div className="choice-row">
            <button type="button" className="btn btn-choice" onClick={() => choose('safe')}>
              Looks Safe
            </button>
            <button type="button" className="btn btn-choice" onClick={() => choose('suspicious')}>
              Looks Suspicious
            </button>
          </div>
        </div>
      ) : (
        <Feedback scenario={scenario} answer={answer} isLast={isLast} onNext={next} />
      )}
    </div>
  )
}

function Feedback({ scenario, answer, isLast, onNext }) {
  const nextRef = useRef(null)
  useEffect(() => {
    nextRef.current?.focus({ preventScroll: true })
  }, [])

  const phishing = scenario.answer === 'phishing'
  return (
    <div className={`feedback ${answer.correct ? 'feedback-right' : 'feedback-wrong'}`} aria-live="polite">
      <div className="feedback-verdict">
        {answer.correct ? 'Correct!' : 'Not quite. Here’s what you might have missed.'}
      </div>
      <p className="feedback-sub">
        {phishing ? 'This one is a phishing message.' : 'This one is a real, legitimate message.'}
      </p>
      <p className="feedback-lead">
        {phishing ? 'It has several warning signs:' : 'Why it’s okay to trust:'}
      </p>
      <ul className="feedback-points">
        {scenario.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <button ref={nextRef} type="button" className="btn btn-primary" onClick={onNext}>
        {isLast ? 'See Results' : 'Next Question'}
      </button>
    </div>
  )
}

function Intro({ onStart }) {
  const safeCount = SCENARIOS.filter((s) => s.answer === 'safe').length
  return (
    <div className="container narrow">
      <header className="page-header">
        <div className="eyebrow">Challenge</div>
        <h1>Don’t Get Hooked</h1>
        <p>
          You’ll see {SCENARIOS.length} emails and text messages. Some are phishing and some are
          completely normal, so don’t just pick “suspicious” every time. Getting one wrong is part of
          learning, and every answer comes with an explanation.
        </p>
      </header>
      <div className="card intro-card">
        <ul className="intro-list">
          <li>Read each message like it just showed up on your phone.</li>
          <li>Check the sender and hover over (or tap) links to see where they go.</li>
          <li>Decide if you’d trust it, then read why.</li>
        </ul>
        <p className="muted small">
          {SCENARIOS.length} questions · {safeCount} of them are legitimate · takes about 5 minutes
        </p>
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Start Challenge
        </button>
      </div>
    </div>
  )
}

function Results({ session, onRestart }) {
  const total = session.order.length
  const score = session.answers.filter((a) => a.correct).length
  return (
    <div className="container narrow">
      <header className="page-header">
        <div className="eyebrow">Don’t Get Hooked</div>
        <h1>Challenge Complete</h1>
      </header>
      <div className="card results-card">
        <div className="score">
          Score: {score} / {total}
        </div>
        <p>{scoreMessage(score, total)}</p>
        <p className="reef-note">A new coral was added to your reef.</p>
        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={onRestart}>
            Try Again
          </button>
          <a href="#/progress" className="btn btn-secondary">
            See Your Reef
          </a>
        </div>
      </div>

      <h2 className="section-title">Your answers</h2>
      <ul className="review-list">
        {session.answers.map((a) => {
          const s = byId[a.id]
          return (
            <li key={a.id} className="review-item">
              <span className={`review-mark ${a.correct ? 'right' : 'wrong'}`} aria-label={a.correct ? 'Correct' : 'Incorrect'}>
                {a.correct ? '✓' : '✗'}
              </span>
              <div>
                <div className="review-title">{s.type === 'sms' ? `Text from ${s.fromName}` : s.subject}</div>
                <div className="review-meta">
                  {s.answer === 'phishing' ? 'Phishing' : 'Legitimate'} · you said{' '}
                  {a.choice === 'safe' ? 'Looks Safe' : 'Looks Suspicious'}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
