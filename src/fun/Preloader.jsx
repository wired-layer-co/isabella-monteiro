import { useEffect, useRef } from 'react'

const STORAGE_KEY = 'fun-preloader-played'
const LINES = ['Isabella', 'Monteiro']
const LOAD_MS = 1800
const MORPH_MS = 820
const STAGGER_MS = 22

export default function Preloader({ wordmarkRef, onDone }) {
  const overlayRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)
  const progressTextRef = useRef(null)
  const progressBarRef = useRef(null)
  const progressRoleRef = useRef(null)
  const skipRef = useRef(null)
  const finishRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const background = bgRef.current
    const content = contentRef.current
    if (!overlay || !background || !content) return undefined

    let cancelled = false
    let finished = false
    let frame = 0

    const finish = () => {
      if (finished || cancelled) return
      finished = true
      try {
        window.sessionStorage.setItem(STORAGE_KEY, '1')
      } catch {
        // Private browsing can refuse storage; the abertura simply plays again.
      }
      onDone()
    }
    finishRef.current = finish

    const morph = async () => {
      if (cancelled || finished) return
      content.classList.add('is-morphing')
      skipRef.current?.setAttribute('hidden', '')

      const loaderLetters = Array.from(overlay.querySelectorAll('.preloader__char'))
      const heroLetters = wordmarkRef.current?.getLetters?.() ?? []

      background.animate(
        [
          { transform: 'translate3d(0, 0, 0)' },
          { transform: 'translate3d(0, -101%, 0)' },
        ],
        { duration: 620, delay: 360, easing: 'cubic-bezier(.76, 0, .24, 1)', fill: 'forwards' },
      )

      await new Promise((resolve) => {
        window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))
      })
      if (cancelled || finished) return

      const animations = []
      loaderLetters.forEach((letter, index) => {
        const target = heroLetters[index]
        if (!target) return
        const from = letter.getBoundingClientRect()
        const to = target.getBoundingClientRect()
        if (!from.width || !from.height || !to.width || !to.height) return

        const deltaX = to.left - from.left
        const deltaY = to.top - from.top
        const scaleX = to.width / from.width
        const scaleY = to.height / from.height
        const delay = index * STAGGER_MS

        animations.push(letter.animate(
          [
            {
              transform: 'translate3d(0, 0, 0) scale(1, 1)',
              color: '#fbfbf8',
              offset: 0,
            },
            {
              transform: `translate3d(${deltaX * 0.56}px, ${deltaY * 0.56}px, 0) scale(${scaleX * 0.62}, ${scaleY * 1.34})`,
              color: '#fbfbf8',
              offset: 0.56,
            },
            {
              transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
              color: '#000000',
              offset: 1,
            },
          ],
          {
            duration: MORPH_MS,
            delay,
            easing: 'cubic-bezier(.22, 1, .36, 1)',
            fill: 'both',
          },
        ))
      })

      await Promise.allSettled(animations.map((animation) => animation.finished))
      if (cancelled || finished) return
      finish()
    }

    const start = window.performance.now()
    const updateProgress = (value) => {
      const percentage = Math.round(value * 100)
      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${String(percentage).padStart(3, '0')}%`
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${value})`
      }
      progressRoleRef.current?.setAttribute('aria-valuenow', String(percentage))
    }

    const tick = (now) => {
      if (cancelled) return
      const progress = Math.min(1, (now - start) / LOAD_MS)
      updateProgress(progress)
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick)
      } else {
        morph()
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        finish()
      }
    }

    frame = window.requestAnimationFrame(tick)
    const safety = window.setTimeout(finish, 7000)
    window.addEventListener('keydown', onKeyDown)
    skipRef.current?.focus({ preventScroll: true })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(safety)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onDone, wordmarkRef])

  return (
    <div
      ref={overlayRef}
      className="preloader"
      role="dialog"
      aria-modal="true"
      aria-label="Abertura do portfólio de Isabella Monteiro"
    >
      <div className="preloader__bg" ref={bgRef} />
      <div className="preloader__content" ref={contentRef}>
        <div className="preloader__meta">
          <span>PORTFÓLIO · 2026</span>
          <span ref={progressRoleRef} role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
            CARREGANDO <span ref={progressTextRef}>000%</span>
          </span>
        </div>

        <div className="preloader__name" aria-hidden="true">
          {LINES.map((line, rowIndex) => (
            <span className="preloader__line" key={line}>
              {Array.from(line).map((char, index) => (
                <span
                  className="preloader__char"
                  key={`${char}-${rowIndex}-${index}`}
                  style={{ '--i': rowIndex * line.length + index }}
                >
                  {char}
                </span>
              ))}
            </span>
          ))}
        </div>

        <div className="preloader__bottom">
          <span>ATRIZ · CURITIBA · BRASIL</span>
          <button
            ref={skipRef}
            className="preloader__skip"
            type="button"
            onClick={() => finishRef.current?.()}
          >
            Pular abertura <span aria-hidden="true">↗</span>
          </button>
        </div>

        <div className="preloader__track" aria-hidden="true">
          <span className="preloader__bar" ref={progressBarRef} />
        </div>
      </div>
    </div>
  )
}
