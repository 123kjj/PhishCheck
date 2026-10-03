// Rule-based message analyzer.
// Everything here is plain pattern matching — no AI, no network calls.
// It will miss some phishing messages and flag some normal ones, which is
// why the UI talks about "warning signs" instead of giving a verdict.

const URGENCY_PHRASES = [
  'act now',
  'immediately',
  'immediate action',
  'urgent',
  'right away',
  'as soon as possible',
  'asap',
  'within 24 hours',
  'within 48 hours',
  'within 12 hours',
  'within 1 hour',
  'within the next',
  'in the next 24 hours',
  'today only',
  'expires today',
  'final notice',
  'final warning',
  'last chance',
  'last warning',
  'action required',
  'respond now',
  "don't delay",
  'do not delay',
  'before it is too late',
  "before it's too late",
  'limited time',
  'time sensitive',
  'time-sensitive',
]

const THREAT_PHRASES = [
  'account suspended',
  'account has been suspended',
  'will be suspended',
  'account locked',
  'account has been locked',
  'will be locked',
  'will be deactivated',
  'will be disabled',
  'will be closed',
  'will be terminated',
  'will be cancelled',
  'will be canceled',
  'permanently deleted',
  'permanently disabled',
  'lose access',
  'loss of access',
  'legal action',
  'law enforcement',
  'arrest',
  'warrant',
  'penalty',
  'late fee',
  'unusual activity',
  'suspicious activity',
  'unauthorized access',
  'compromised',
  'on hold',
]

const INFO_REQUEST_PATTERNS = [
  { re: /\bpass(word|code)s?\b/i, label: 'password' },
  { re: /\b(verification|security|login|one[- ]time|2fa|otp|confirmation) codes?\b/i, label: 'verification code' },
  { re: /\bsocial security\b|\bssn\b/i, label: 'Social Security number' },
  { re: /\b(bank|checking|savings) (account|details|info(rmation)?)\b|\brouting number\b/i, label: 'bank details' },
  { re: /\b(credit|debit) card\b|\bcard (number|details)\b|\bcvv\b|\bexpiration date\b/i, label: 'card details' },
  { re: /\bpin( number)?\b/i, label: 'PIN' },
  { re: /\b(date of birth|birth ?date|dob)\b/i, label: 'date of birth' },
  { re: /\b(home address|mailing address)\b/i, label: 'home address' },
  { re: /\b(login|sign[- ]in) (details|info(rmation)?|credentials)\b|\bcredentials\b|\busername and password\b/i, label: 'login details' },
  { re: /\b(confirm|verify|validate|update) (your )?(identity|account|information|details|billing|payment)\b/i, label: 'account verification' },
  { re: /\bgift cards?\b/i, label: 'gift card payment' },
]

const CLICK_PATTERNS = [
  /\bclick (here|below|the link|this link|the button|on the link)\b/i,
  /\btap (here|below|the link|this link)\b/i,
  /\bfollow (the|this) link\b/i,
  /\b(use|visit|open) the link\b/i,
  /\b(log|sign) ?in (here|below|now)\b/i,
  /\bverify (here|now|below)\b/i,
  /\bclick to\b/i,
]

const TOO_GOOD_PATTERNS = [
  /\byou('ve| have)? (won|been selected|been chosen)\b/i,
  /\bcongratulations\b/i,
  /\bfree (gift|iphone|money|cash|prize)\b/i,
  /\bclaim (your|the) (prize|reward|gift|award|refund|money)\b/i,
  /\bno experience (needed|required)\b/i,
  /\$\s?\d{2,}\s?(\/|per )\s?(hr|hour)\b/i,
  /\bguaranteed\b/i,
  /\bpre-?selected\b/i,
]

const GENERIC_GREETINGS = [
  /\bdear (customer|user|client|member|account holder|student|valued customer|sir|madam|sir\/madam)\b/i,
  /\bhello (customer|user|member)\b/i,
]

// Known organizations and the domains they actually use.
// Used to spot links/senders that mention a brand but don't belong to it.
const KNOWN_BRANDS = {
  paypal: ['paypal.com'],
  amazon: ['amazon.com', 'amazon.co.uk', 'amazon.ca'],
  apple: ['apple.com', 'icloud.com'],
  icloud: ['icloud.com', 'apple.com'],
  google: ['google.com', 'gmail.com', 'youtube.com'],
  microsoft: ['microsoft.com', 'live.com', 'outlook.com', 'office.com'],
  outlook: ['outlook.com', 'microsoft.com', 'live.com'],
  netflix: ['netflix.com'],
  spotify: ['spotify.com'],
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.com', 'meta.com'],
  snapchat: ['snapchat.com'],
  tiktok: ['tiktok.com'],
  discord: ['discord.com', 'discord.gg'],
  steam: ['steampowered.com', 'steamcommunity.com'],
  roblox: ['roblox.com'],
  usps: ['usps.com'],
  fedex: ['fedex.com'],
  ups: ['ups.com'],
  dhl: ['dhl.com'],
  chase: ['chase.com'],
  venmo: ['venmo.com'],
  zelle: ['zellepay.com'],
  irs: ['irs.gov'],
  canvas: ['instructure.com'],
}

const BRAND_NAMES = {
  paypal: 'PayPal', usps: 'USPS', ups: 'UPS', dhl: 'DHL', irs: 'IRS',
  fedex: 'FedEx', icloud: 'iCloud', tiktok: 'TikTok',
}

function brandName(b) {
  return BRAND_NAMES[b] || b.charAt(0).toUpperCase() + b.slice(1)
}

const SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'rb.gy',
  'ow.ly', 'shorturl.at', 'tiny.cc', 'buff.ly', 'rebrand.ly', 's.id',
]

const UNUSUAL_TLDS = [
  'xyz', 'top', 'click', 'info', 'tk', 'ml', 'ga', 'cf', 'gq', 'zip', 'icu',
  'buzz', 'live', 'rest', 'cam', 'monster', 'support', 'help', 'link',
  'online', 'site', 'shop', 'work', 'loan', 'win', 'ru',
]

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com',
  'icloud.com', 'protonmail.com', 'proton.me', 'mail.com', 'gmx.com',
]

const BAIT_WORDS = [
  'secure', 'security', 'verify', 'verification', 'login', 'signin', 'sign-in',
  'account', 'update', 'billing', 'support', 'helpdesk', 'confirm', 'alert',
  'service', 'recovery', 'unlock', 'redelivery',
]

// Two-part public suffixes we want to treat as one "TLD" when finding the
// registered domain (e.g. example.co.uk -> example.co.uk, not co.uk).
const TWO_PART_SUFFIXES = ['co.uk', 'org.uk', 'ac.uk', 'com.au', 'co.in', 'co.nz', 'com.br']

// ---------- helpers ----------

function findPhrases(text, phrases) {
  const lower = text.toLowerCase()
  const found = []
  for (const phrase of phrases) {
    const re = new RegExp(`(^|[^a-z])${escapeRegex(phrase)}(?![a-z])`, 'i')
    if (re.test(lower)) found.push(phrase)
  }
  return found
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getRegisteredDomain(host) {
  const parts = host.split('.')
  if (parts.length <= 2) return host
  const lastTwo = parts.slice(-2).join('.')
  if (TWO_PART_SUFFIXES.includes(lastTwo)) return parts.slice(-3).join('.')
  return lastTwo
}

// Undo common character swaps scammers use (paypa1 -> paypal, g00gle -> google)
function normalizeLookalikes(s) {
  return s
    .toLowerCase()
    .replace(/rn/g, 'm')
    .replace(/vv/g, 'w')
    .replace(/0/g, 'o')
    .replace(/1/g, 'l')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
}

// Levenshtein distance, used to catch near-miss spellings like "amazom"
function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
  }
  return dp[a.length][b.length]
}

export function extractUrls(text) {
  // Full URLs, www. links, and bare domains like "paypa1-login.com/verify"
  const re = /\b((?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?![a-z0-9@-])(?::\d+)?(?:\/[^\s<>"')\]]*)?)/gi
  const urls = []
  let m
  while ((m = re.exec(text)) !== null) {
    let raw = m[1].replace(/[.,;:!?]+$/, '')
    // Skip both halves of email addresses (senders are handled separately)
    const before = text[m.index - 1]
    if (before === '@' || before === '.') continue
    const host = parseHost(raw)
    if (!host) continue
    // Ignore things like "e.g" or "i.e" or file names like "report.pdf"
    const tld = host.split('.').pop()
    if (['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg', 'txt', 'g', 'e'].includes(tld)) continue
    if (!/^https?:\/\//i.test(raw) && !raw.includes('/') && !host.startsWith('www.') && host.split('.').length < 2) continue
    urls.push({ raw, host, index: m.index })
  }
  // Also catch IP-address links
  const ipRe = /\b(?:https?:\/\/)?(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?(\/[^\s]*)?/g
  while ((m = ipRe.exec(text)) !== null) {
    urls.push({ raw: m[0], host: m[1], index: m.index, isIp: true })
  }
  return urls
}

function parseHost(raw) {
  const withoutProto = raw.replace(/^https?:\/\//i, '')
  const hostPart = withoutProto.split(/[/?#:]/)[0]
  // A URL like "paypal.com@evil.com" sends you to evil.com
  const atIndex = withoutProto.split('/')[0].lastIndexOf('@')
  const host = atIndex >= 0 ? withoutProto.slice(atIndex + 1).split(/[/?#:]/)[0] : hostPart
  return host.toLowerCase().replace(/^www\./, '')
}

function brandsMentioned(text) {
  const lower = text.toLowerCase()
  return Object.keys(KNOWN_BRANDS).filter((b) => new RegExp(`\\b${b}\\b`).test(lower))
}

function belongsToBrand(host, brand) {
  return KNOWN_BRANDS[brand].some((d) => host === d || host.endsWith('.' + d))
}

function isOfficialDomain(host) {
  return Object.values(KNOWN_BRANDS).some((domains) =>
    domains.some((d) => host === d || host.endsWith('.' + d)),
  )
}

// Returns a list of reasons a single host looks off
export function checkHost(host, { isIp = false, raw = '', mentionedBrands = [] } = {}) {
  const reasons = []
  if (isIp) {
    reasons.push(`${host} is a raw number address instead of a website name.`)
    return reasons
  }
  if (raw.includes('@') && !raw.startsWith('mailto')) {
    reasons.push(`The link contains an "@" symbol, which can hide where it really goes.`)
  }
  if (SHORTENERS.includes(host)) {
    reasons.push(`${host} is a link shortener, so you can't see the real destination.`)
    return reasons
  }
  if (isOfficialDomain(host)) return reasons

  const registered = getRegisteredDomain(host)
  const registeredName = registered.split('.')[0]
  const tld = host.split('.').pop()
  const labels = host.split('.')

  // Brand name appears somewhere in the host, but the real domain is something else
  for (const brand of Object.keys(KNOWN_BRANDS)) {
    if (brand.length < 4) continue
    const normalizedHost = normalizeLookalikes(host)
    if (normalizedHost.includes(brand) && !belongsToBrand(host, brand)) {
      if (!host.includes(brand)) {
        reasons.push(`"${registered}" looks like "${brandName(brand)}" but uses swapped letters or numbers.`)
      } else if (labels.slice(0, -2).some((l) => l.includes(brand))) {
        reasons.push(`"${brandName(brand)}" appears at the start, but the real website is ${registered}.`)
      } else {
        reasons.push(`${registered} uses the name "${brandName(brand)}" but isn't ${brandName(brand)}'s official website.`)
      }
      break
    }
    // Near-miss spellings (amazom, netflx, paypall)
    // Only for same-length swaps or longer brand names, so real words
    // like "stream" aren't mistaken for "steam".
    const d = editDistance(registeredName, brand)
    const comparable = registeredName.length === brand.length || brand.length >= 6
    if (comparable && d > 0 && d <= (brand.length >= 7 ? 2 : 1) && registeredName.length >= 4) {
      reasons.push(`"${registered}" is very close to "${brandName(brand)}" but is spelled differently.`)
      break
    }
  }

  // Message talks about a brand but the link goes elsewhere
  if (reasons.length === 0 && mentionedBrands.length > 0) {
    const brand = mentionedBrands.find((b) => !belongsToBrand(host, b))
    if (brand && mentionedBrands.every((b) => !belongsToBrand(host, b))) {
      const name = brandName(brand)
      reasons.push(`The message mentions ${name}, but the link goes to ${registered}.`)
    }
  }

  if (UNUSUAL_TLDS.includes(tld)) {
    reasons.push(`The ".${tld}" ending is less common for real companies and schools.`)
  }

  const bait = BAIT_WORDS.filter((w) => registered.includes(w))
  if (bait.length > 0 && registered.includes('-')) {
    reasons.push(`${registered} mixes words like "${bait[0]}" into the domain name, a common trick.`)
  }

  if (labels.length >= 5) {
    reasons.push(`${host} has an unusually long chain of subdomains.`)
  }

  if (/\d{3,}/.test(registeredName)) {
    reasons.push(`${registered} contains a long string of numbers.`)
  }

  return reasons
}

function parseSender(text) {
  // Look for a "From:" line, or an email address on the first line
  const fromLine = text.match(/^\s*from:\s*(.+)$/im)
  const source = fromLine ? fromLine[1] : text.split('\n')[0]
  const emailMatch = source.match(/([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})/i)
  if (!emailMatch) return null
  const displayName = source
    .replace(emailMatch[0], '')
    .replace(/[<>"]/g, '')
    .trim()
  return {
    local: emailMatch[1].toLowerCase(),
    domain: emailMatch[2].toLowerCase(),
    displayName,
    raw: emailMatch[0],
  }
}

function checkSender(sender, mentionedBrands) {
  if (!sender) return []
  const reasons = []
  const { domain, local, displayName } = sender
  const nameLower = displayName.toLowerCase()
  const orgWords = /\b(team|support|security|service|services|billing|admin|helpdesk|help desk|department|office|bank|official|it|account|accounts)\b/i

  if (FREE_EMAIL_DOMAINS.includes(domain)) {
    const claimsOrg =
      orgWords.test(displayName) ||
      orgWords.test(local) ||
      mentionedBrands.length > 0 ||
      /\b(school|university|college|scholarship|grant|foundation)\b/i.test(displayName)
    if (claimsOrg) {
      reasons.push(`The sender uses a free ${domain} address while presenting itself as an organization.`)
    }
  }

  const hostReasons = checkHost(domain, { mentionedBrands: [] })
  for (const r of hostReasons) reasons.push(`Sender address: ${r}`)

  // Display name claims a brand that the address doesn't match
  for (const brand of Object.keys(KNOWN_BRANDS)) {
    if (new RegExp(`\\b${brand}\\b`).test(nameLower) && !belongsToBrand(domain, brand)) {
      const name = brandName(brand)
      reasons.push(`The sender's name says "${name}" but the email comes from ${domain}.`)
      break
    }
  }

  if (/\d{4,}/.test(local) && reasons.length === 0 && FREE_EMAIL_DOMAINS.includes(domain)) {
    reasons.push(`The sender address (${sender.raw}) looks randomly generated.`)
  }

  return [...new Set(reasons)]
}

// ---------- main entry ----------

export function analyzeMessage(text) {
  const findings = []
  // Curly quotes from copied emails would otherwise break phrases like "don't"
  const trimmed = text.trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
  if (!trimmed) return { findings, level: 'few', score: 0, urls: [] }

  const mentioned = brandsMentioned(trimmed)

  // 1. Urgency
  const urgency = findPhrases(trimmed, URGENCY_PHRASES)
  if (urgency.length) {
    findings.push({
      id: 'urgency',
      title: 'Urgent language',
      description: 'This message pressures you to act immediately.',
      evidence: urgency,
      weight: 1,
    })
  }

  // 2. Threats / consequences
  const threats = findPhrases(trimmed, THREAT_PHRASES)
  if (threats.length) {
    findings.push({
      id: 'threats',
      title: 'Threats or scary consequences',
      description: 'The message warns that something bad will happen if you don’t respond.',
      evidence: threats,
      weight: threats.length >= 2 ? 2 : 1,
    })
  }

  // 3. Requests for sensitive information
  const info = INFO_REQUEST_PATTERNS.filter((p) => p.re.test(trimmed)).map((p) => p.label)
  // A code you requested yourself often says "don't share" — don't count that as a request
  const warnsNotToShare = /\b(do not|don't|never) (share|give|send)\b/i.test(trimmed) ||
    /\bwill never ask\b/i.test(trimmed)
  if (info.length && !(warnsNotToShare && info.every((l) => ['verification code', 'password', 'PIN'].includes(l)))) {
    findings.push({
      id: 'info',
      title: 'Request for information',
      description: 'This message asks for information that should not normally be shared.',
      evidence: [...new Set(info)],
      weight: 2,
    })
  }

  // 4. Links
  const urls = extractUrls(trimmed)
  const sender = parseSender(trimmed)
  const linkReasons = []
  const seenHosts = new Set()
  for (const url of urls) {
    // Don't re-check the sender's own domain from the From: line as a link
    if (sender && url.host === sender.domain && !url.raw.includes('/')) continue
    if (seenHosts.has(url.host)) continue
    seenHosts.add(url.host)
    const reasons = checkHost(url.host, { isIp: url.isIp, raw: url.raw, mentionedBrands: mentioned })
    if (reasons.length) linkReasons.push({ url: url.raw, reasons })
  }
  if (linkReasons.length) {
    findings.push({
      id: 'link',
      title: 'Suspicious link',
      description: 'The link does not clearly match the organization mentioned, or uses a pattern scammers often rely on.',
      evidence: linkReasons.flatMap((l) => l.reasons),
      links: linkReasons.map((l) => l.url),
      weight: 2,
    })
  }

  // 5. Pushes you to click
  const clickMatches = CLICK_PATTERNS.map((re) => trimmed.match(re)).filter(Boolean).map((m) => m[0])
  if (clickMatches.length && urls.length) {
    findings.push({
      id: 'click',
      title: 'Asks you to click a link',
      description: 'The message is built around getting you to open a link. It’s safer to go to the website yourself.',
      evidence: [...new Set(clickMatches.map((s) => s.toLowerCase()))],
      weight: 1,
    })
  }

  // 6. Sender
  let senderReasons = checkSender(sender, mentioned)
  // If the sender uses the same flagged domain as a link, say so once
  // instead of repeating every link reason.
  if (sender && linkReasons.some((l) => parseHost(l.url) === sender.domain)) {
    senderReasons = senderReasons.filter((r) => !r.startsWith('Sender address:'))
    senderReasons.unshift(`The email comes from ${sender.domain}, the same suspicious domain as the link.`)
  }
  if (senderReasons.length) {
    findings.push({
      id: 'sender',
      title: 'Suspicious sender',
      description: 'The sender’s address doesn’t look like it belongs to who the message claims to be from.',
      evidence: senderReasons,
      weight: 2,
    })
  }

  // 7. Too good to be true
  const tooGood = TOO_GOOD_PATTERNS.map((re) => trimmed.match(re)).filter(Boolean).map((m) => m[0])
  if (tooGood.length) {
    findings.push({
      id: 'offer',
      title: 'Offer that seems too good',
      description: 'Prizes, easy money, and surprise awards are common bait.',
      evidence: [...new Set(tooGood.map((s) => s.toLowerCase()))],
      weight: 1,
    })
  }

  // 8. Generic greeting
  const greeting = GENERIC_GREETINGS.map((re) => trimmed.match(re)).filter(Boolean).map((m) => m[0])
  if (greeting.length) {
    findings.push({
      id: 'greeting',
      title: 'Generic greeting',
      description: 'Real organizations you have an account with usually use your name.',
      evidence: greeting,
      weight: 1,
    })
  }

  const score = findings.reduce((sum, f) => sum + f.weight, 0)
  let level = 'few'
  if (score >= 5) level = 'high'
  else if (score >= 2) level = 'some'

  return { findings, level, score, urls }
}

export const RESULT_LEVELS = {
  high: {
    label: 'High number of warning signs',
    summary: 'This message has several patterns commonly found in phishing. Don’t click links or reply with information. If you’re worried, contact the organization directly using a website or number you already know.',
  },
  some: {
    label: 'Some warning signs',
    summary: 'A few things here are worth a second look. Check the sender and any links carefully before doing what the message asks.',
  },
  few: {
    label: 'Few warning signs',
    summary: 'PhishCheck didn’t find many common warning signs. That doesn’t guarantee the message is safe, so still use your judgment.',
  },
}
