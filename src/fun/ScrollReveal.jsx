import { Fragment, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './hooks'

export default function ScrollReveal({ text, as = 'p', className = '' }) {
  const rootRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()
  const words = text.split(' ')
  const Tag = as

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const chars = Array.from(root.querySelectorAll('.reveal-char'))
    if (!chars.length) return undefined

    if (reducedMotion) {
      chars.forEach((char) => { char.style.opacity = '1' })
      return undefined
    }

    let frame = 0
    let last = -1

    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      const start = window.innerHeight * 0.92
      const end = window.innerHeight * 0.28
      const denominator = rect.height + start - end
      const progress = denominator > 0
        ? Math.max(0, Math.min(1, (start - rect.top) / denominator))
        : 1
      if (Math.abs(progress - last) < 0.001) return
      last = progress

      const visible = progress * chars.length
      const whole = Math.floor(visible)
      const fraction = visible - whole
      chars.forEach((char, index) => {
        if (index < whole) char.style.opacity = '1'
        else if (index === whole) char.style.opacity = String(0.18 + fraction * 0.82)
        else char.style.opacity = '0.18'
      })
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reducedMotion, text])

  return (
    <Tag className={`scroll-reveal${className ? ` ${className}` : ''}`} ref={rootRef}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, wordIndex) => (
          <Fragment key={`${word}-${wordIndex}`}>
            <span className="reveal-word">{Array.from(word).map((char, charIndex) => (
              <span className="reveal-char" key={`${char}-${charIndex}`}>{char}</span>
            ))}</span>
            {wordIndex < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}
