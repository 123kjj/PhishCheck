# PhishCheck

**Don't get hooked.**

PhishCheck is a small website that teaches students how to recognize phishing through realistic examples, a short challenge, and a message analyzer.

Built for the Future Innovators Hackathon (Computer Science / Engineering, cybersecurity education).

## The problem

Students use email, texts, and online accounts every day, but phishing messages can look convincing. Many students don't know which warning signs to look for.

## Design

The look plays on the "phish" pun with an underwater world that gets deeper as you move through the app: Home starts at the bright surface and drops into deep water, Fish or Phish? is shallow, Don't Get Hooked is mid-water, and Your Reef is the deepest. Deep ocean colors (Midnight Ocean #031F2B, Deep Navy #042F3E, Deep Ocean #073B4C, Dark Teal #075E68) sit behind the colorful coral and fish, while everything you read or click stays on light cards. Text on dark water meets WCAG AA contrast.

The sea life is hand-drawn SVG: round tropical fish, schools, a pufferfish that puffs up when you hover it, distant silhouettes, starfish, crabs, a treasure chest, and the little coral-colored PhishCheck fish who appears on every page and reacts to what you do. Correctly spotting a phishing message drops a hook with a tiny envelope "phish" on it. All motion is lightweight CSS/SVG (no images or GIFs) and turns off completely for people who have "reduce motion" enabled. The security content itself stays plain and professional, and wrong answers get "Not quite. Here's what you might have missed." instead of anything that makes people feel bad.

## What it does

The navigation uses friendly names, each with a plain caption underneath so it's obvious what they do.

- **Fish or Phish? (Check a message)** – Paste an email or text and PhishCheck points out common warning signs: urgent language, threats, requests for passwords or personal info, suspicious or lookalike links, link shorteners, and senders that don't match who they claim to be. It explains *why* each sign matters and gives an overall level (few / some / high number of warning signs). It never says a message is definitely a scam.
- **Don't Get Hooked (Challenge)** – 10 realistic emails and texts, shuffled each time. 6 are phishing and 4 are legitimate, so you can't just say "suspicious" to everything. You can hover over (or tap) links to see where they really go, just like checking a real link. After each answer you get an explanation.
- **Your Reef (Progress)** – A small reef grows as you practice: one coral per completed challenge, one fish per 5 correct answers, one shell per 3 correct answers in a row, and bubbles while you're on a streak. It also tracks challenges completed, correct answers, accuracy, current streak, and three skill areas (link, sender, and urgency awareness). Everything is saved in your browser with localStorage and can be reset.

## How the analyzer works

It's plain JavaScript rules in `src/lib/analyzer.js` (no AI, no API calls, nothing leaves the browser):

- Phrase lists for urgency ("within 24 hours", "act now") and threats ("account suspended", "will be closed")
- Regex patterns for requests like passwords, verification codes, SSNs, bank and card details, and gift cards
- Link checks: lookalike spellings (`paypa1`, `amazom`), brand names in the wrong part of the domain (`netflix.account-update.xyz`), links that don't match the company mentioned, shorteners, IP-address links, and unusual domain endings
- Sender checks: free email addresses claiming to be organizations, and display names that don't match the address

Rules like these can be fooled, so the app is clear that it's an educational tool, not a scam detector.

## Running it

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To make a production build: `npm run build` (output goes to `dist/`).

## Project structure

```
src/
  App.jsx               page switching + progress state
  components/           Header, Footer, Logo, MessageCard, LinkPreview, ProgressBar,
                        Ocean (fish, bubbles, seaweed, waves), Reef
  pages/                Home, CheckMessage, Challenge, Progress
  data/scenarios.js     the 10 challenge messages and explanations
  data/samples.js       example messages for the analyzer
  lib/analyzer.js       rule-based warning sign detection
  lib/progress.js       localStorage save/load and stat updates
  lib/reef.js           rules for what the reef shows
  lib/scoring.js        answer checking and end-of-challenge messages
  lib/useHashRoute.js   tiny hash router (#/check, #/challenge, #/progress)
```

Built with React + Vite and plain CSS. No backend, no accounts, no API keys.

The organizations in the challenge (Streamly, Pixgram, Cloudbox, SwiftShip, Lincoln High) are made up.
