import { useEffect } from 'react'

export function useInfiniteScroll(callback: () => void) {
  useEffect(() => {
    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200
      if (scrollBottom) callback()
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback])
}
