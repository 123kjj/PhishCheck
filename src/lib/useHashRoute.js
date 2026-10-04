import { useEffect, useState } from 'react'

const ROUTES = ['home', 'check', 'challenge', 'progress', 'contact']

function readHash() {
  const name = window.location.hash.replace(/^#\/?/, '')
  return ROUTES.includes(name) ? name : 'home'
}

// Tiny hash-based router: #/check, #/challenge, #/progress.
// Works with the browser back button and needs no server config.
export function useHashRoute() {
  const [route, setRoute] = useState(readHash)
  useEffect(() => {
    const onChange = () => setRoute(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function hrefFor(route) {
  return route === 'home' ? '#/' : `#/${route}`
}
