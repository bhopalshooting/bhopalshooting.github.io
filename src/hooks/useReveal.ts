import { useEffect, useRef, useState } from 'react'

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(true)
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (!('IntersectionObserver' in window)) return

    const belowFold = node.getBoundingClientRect().top > window.innerHeight * 0.88
    setCanAnimate(belowFold)
    setShown(!belowFold)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, shown, canAnimate }
}
