import { useState } from 'react'
import { Mascot } from '../components/Ocean.jsx'

// Where messages from the contact form go. There's no server, so the form
// opens the visitor's email app with everything filled in.
export const CONTACT_EMAIL = 'kritijain.1019@gmail.com'

const TOPICS = ['Question', 'Feedback', 'Report a bug', 'Idea for a new example', 'Something else']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function buildMailto({ name, email, topic, message }) {
  const subject = `PhishCheck: ${topic}`
  const body = `${message.trim()}\n\nFrom: ${name.trim()}\nReply to: ${email.trim()}`
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Please add your name.'
  if (!form.email.trim()) errors.email = 'Please add your email so we can reply.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'That email doesn’t look quite right.'
  if (form.message.trim().length < 10) errors.message = 'Please write a little more (at least 10 characters).'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const update = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
    if (errors[field]) setErrors({ ...errors, [field]: undefined })
  }

  const submit = (e) => {
    e.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus()
      return
    }
    window.location.href = buildMailto(form)
    setSent(true)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="container contact-layout">
      <header className="page-header contact-header">
        <div className="eyebrow">Contact</div>
        <h1>Contact Us</h1>
        <p>
          Questions, feedback, or an idea for a new example message? We’d love to hear from you.
        </p>
      </header>

      <div className="contact-grid">
        <form className="card contact-form" onSubmit={submit} noValidate>
          <span className="contact-mascot">
            <Mascot mood={sent ? 'happy' : 'curious'} look="down" size={54} flip />
          </span>

          <div className="field">
            <label htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={update('name')}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'err-name' : undefined}
            />
            {errors.name && <p className="field-error" id="err-name">{errors.name}</p>}
          </div>

          <div className="field">
            <label htmlFor="contact-email">Your email</label>
            <input
              id="contact-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={update('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'err-email' : undefined}
            />
            {errors.email && <p className="field-error" id="err-email">{errors.email}</p>}
          </div>

          <div className="field">
            <label htmlFor="contact-topic">What’s it about?</label>
            <select id="contact-topic" value={form.topic} onChange={update('topic')}>
              {TOPICS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows={6}
              value={form.message}
              onChange={update('message')}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'err-message' : undefined}
            />
            {errors.message && <p className="field-error" id="err-message">{errors.message}</p>}
          </div>

          <p className="hint">
            Please don’t include passwords or other private information. Sending this opens your
            email app with your message ready to go.
          </p>

          <div className="button-row">
            <button type="submit" className="btn btn-primary">
              Send Message
            </button>
          </div>

          {sent && (
            <div className="sent-note" role="status">
              <strong>Almost there!</strong> Your email app should now be open with your message
              filled in. Just press send. If nothing opened, email us at{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </div>
          )}
        </form>

        <aside className="contact-side">
          <div className="card">
            <h2 className="side-title">Email us directly</h2>
            <p className="side-text">
              <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
                {CONTACT_EMAIL}
              </a>
            </p>
            <button type="button" className="btn btn-secondary btn-small" onClick={copyEmail}>
              {copied ? 'Copied!' : 'Copy email address'}
            </button>
          </div>

          <div className="card report-card">
            <h2 className="side-title">Got a real phishing message?</h2>
            <p className="side-text">
              PhishCheck can’t investigate scams, but these official places can:
            </p>
            <ul className="report-list">
              <li>
                <strong>Phishing email:</strong> forward it to{' '}
                <a href="mailto:reportphishing@apwg.org">reportphishing@apwg.org</a>
              </li>
              <li>
                <strong>Phishing text:</strong> forward it to <strong>7726</strong> (SPAM)
              </li>
              <li>
                <strong>Any scam:</strong> report it at{' '}
                <a href="https://reportfraud.ftc.gov" target="_blank" rel="noreferrer">
                  ReportFraud.ftc.gov
                </a>
              </li>
              <li>
                <strong>At school:</strong> tell a teacher or your school’s IT team
              </li>
            </ul>
            <p className="side-text small">
              Already clicked a link or shared a password? Change that password right away, turn on
              two-step verification, and tell someone you trust.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
