// Short, honest feedback for the end of a challenge.
export function scoreMessage(score, total) {
  if (score === total) return 'Perfect score. You checked the details carefully on every message.'
  const missed = total - score
  const ones = missed === 1 ? 'the one you missed' : `the ${missed} you missed`
  const ratio = score / total
  if (ratio >= 0.8) return `Nice work. You caught most of the tricks. Take a look at ${ones} below.`
  if (ratio >= 0.5)
    return `Good start. Some of these are hard on purpose. Look at ${ones} and notice what gave them away.`
  return 'These can be tricky. Read through the explanations below and try again. It gets easier once you know what to look for.'
}

// "suspicious" is the right call for phishing, "safe" for legitimate messages
export function isCorrectChoice(choice, answer) {
  return (choice === 'safe' && answer === 'safe') || (choice === 'suspicious' && answer === 'phishing')
}
