import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string) => {
  const getMatches = () => window.matchMedia(query).matches
  const [matches, setMatches] = useState(getMatches)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    const handler = () => setMatches(mediaQuery.matches)

    handler()
    mediaQuery.addEventListener('change', handler)

    return () => mediaQuery.removeEventListener('change', handler)
  }, [query])

  return matches
}
