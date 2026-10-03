// Turns saved progress into what the reef shows. Deliberately simple:
//   coral  = 1 per completed challenge
//   fish   = 1 per 5 correct answers
//   shells = 1 per 3 answers in your best streak
//   bubbles appear while your current streak is 3 or more

export const REEF_LIMITS = { coral: 8, fish: 6, shells: 4 }
export const FISH_EVERY = 5
export const SHELL_EVERY = 3

export function getReef(progress) {
  const coral = Math.min(progress.challengesCompleted, REEF_LIMITS.coral)
  const fish = Math.min(Math.floor(progress.correct / FISH_EVERY), REEF_LIMITS.fish)
  const shells = Math.min(Math.floor(progress.bestStreak / SHELL_EVERY), REEF_LIMITS.shells)
  const bubbles = progress.currentStreak >= 3

  const nextFish = fish < REEF_LIMITS.fish ? FISH_EVERY - (progress.correct % FISH_EVERY) : 0
  const nextShell = shells < REEF_LIMITS.shells ? SHELL_EVERY * (shells + 1) - progress.bestStreak : 0

  return { coral, fish, shells, bubbles, nextFish, nextShell, isEmpty: coral + fish + shells === 0 }
}
