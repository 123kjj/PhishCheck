import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import CheckMessage from './pages/CheckMessage.jsx'
import Challenge from './pages/Challenge.jsx'
import Progress from './pages/Progress.jsx'
import { useHashRoute } from './lib/useHashRoute.js'
import {
  loadProgress,
  saveProgress,
  clearProgress,
  emptyProgress,
  applyAnswer,
  applyCompletion,
} from './lib/progress.js'

export default function App() {
  const route = useHashRoute()
  const [progress, setProgress] = useState(loadProgress)
  // Challenge session lives here so leaving the page mid-challenge doesn't lose your place
  const [session, setSession] = useState(null)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  const recordAnswer = (result) => setProgress((p) => applyAnswer(p, result))
  const recordCompletion = (result) => setProgress((p) => applyCompletion(p, result))
  const resetProgress = () => {
    clearProgress()
    setProgress(emptyProgress())
  }

  let page
  switch (route) {
    case 'check':
      page = <CheckMessage />
      break
    case 'challenge':
      page = (
        <Challenge
          session={session}
          setSession={setSession}
          onAnswer={recordAnswer}
          onComplete={recordCompletion}
        />
      )
      break
    case 'progress':
      page = <Progress progress={progress} onReset={resetProgress} />
      break
    default:
      page = <Home />
  }

  return (
    <div className="app">
      <Header route={route} />
      <main className={`main${route === 'home' ? ' main-home' : ''}`} id="main">
        {page}
      </main>
      <Footer />
    </div>
  )
}
