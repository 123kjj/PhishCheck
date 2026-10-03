import LinkPreview from './LinkPreview.jsx'

// Splits "text [[label|url]] more text" into text and link pieces
function renderInline(text, keyPrefix) {
  const parts = []
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]/g
  let last = 0
  let m
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(<LinkPreview key={`${keyPrefix}-${m.index}`} label={m[1]} href={m[2]} />)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function Body({ blocks }) {
  return blocks.map((block, i) => {
    if (typeof block === 'string') {
      return (
        <p key={i} className="msg-paragraph">
          {renderInline(block, i)}
        </p>
      )
    }
    return (
      <p key={i} className="msg-paragraph">
        <LinkPreview label={block.button} href={block.href} variant="button" />
      </p>
    )
  })
}

export default function MessageCard({ scenario }) {
  if (scenario.type === 'sms') {
    return (
      <div className="msg sms" aria-label="Text message">
        <div className="sms-header">
          <div className="avatar small" aria-hidden="true">
            {/^[+\d]/.test(scenario.fromName) ? '#' : scenario.fromName[0]}
          </div>
          <div>
            <div className="sms-from">{scenario.fromName}</div>
            <div className="sms-kind">Text message</div>
          </div>
        </div>
        <div className="sms-thread">
          <div className="sms-time">{scenario.time}</div>
          <div className="sms-bubble">
            <Body blocks={scenario.body} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="msg email" aria-label="Email">
      <div className="email-subject">{scenario.subject}</div>
      <div className="email-meta">
        <div className="avatar" aria-hidden="true">
          {scenario.fromName[0]}
        </div>
        <div className="email-from">
          <div>
            <strong>{scenario.fromName}</strong>{' '}
            <span className="email-address">&lt;{scenario.fromAddress}&gt;</span>
          </div>
          <div className="email-to">to me</div>
        </div>
        <div className="email-time">{scenario.time}</div>
      </div>
      <div className="email-body">
        <Body blocks={scenario.body} />
      </div>
    </div>
  )
}
