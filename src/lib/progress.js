// Progress is stored only in this browser using localStorage.

const STORAGE_KEY = 'phishcheck-progress-v1'

export function emptyProgress() {
  return {
    challengesCompleted: 0,
    answered: 0,
    correct: 0,
    currentStreak: 0,
    bestStreak: 0,
    skills: {
      link: { attempts: 0, correct: 0 },
      sender: { attempts: 0, correct: 0 },
      urgency: { attempts: 0, correct: 0 },
    },
    history: [], // { date, score, total }
  }
}

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const saved = JSON.parse(raw)
    // Merge with defaults so older or partial saves don't break the page
    const base = emptyProgress()
    return {
      ...base,
      ...saved,
      skills: { ...base.skills, ...(saved.skills || {}) },
      history: Array.isArray(saved.history) ? saved.history : [],
    }
  } catch {
    return emptyProgress()
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch {
    // Storage can be unavailable (private mode, full disk). The app still works,
    // progress just won't be remembered.
  }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function applyAnswer(progress, { isCorrect, skills }) {
  const next = {
    ...progress,
    answered: progress.answered + 1,
    correct: progress.correct + (isCorrect ? 1 : 0),
    currentStreak: isCorrect ? progress.currentStreak + 1 : 0,
    skills: { ...progress.skills },
  }
  next.bestStreak = Math.max(progress.bestStreak, next.currentStreak)
  for (const skill of skills) {
    const s = next.skills[skill] || { attempts: 0, correct: 0 }
    next.skills[skill] = {
      attempts: s.attempts + 1,
      correct: s.correct + (isCorrect ? 1 : 0),
    }
  }
  return next
}

export function applyCompletion(progress, { score, total }) {
  return {
    ...progress,
    challengesCompleted: progress.challengesCompleted + 1,
    history: [{ date: new Date().toISOString(), score, total }, ...progress.history].slice(0, 5),
  }
}

export function percent(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 100)
}
