import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './hooks'

const NAME_LINES = ['Isabella', 'Monteiro']
const MAX_STRETCH = 0.18

function splitLines(lines) {
  let offset = 0
  return lines.map((line) => {
    const chars = Array.from(line)
    const start = offset
    offset += chars.length
    return { chars, start }
  })
}

const ElasticWordmark = forwardRef(function ElasticWordmark(
  {
    lines = NAME_LINES,
    as = 'h1',
    className = '',
    decorative = false,
    revealed = true,
    id,
    fitScale = 1,
  },
  ref,
) {
  const rootRef = useRef(null)
  const rowRefs = useRef([])
  const charRefs = useRef([])
  const metricsRef = useRef({ centers: [], widths: [], average: 0 })
  const reducedMotion = usePrefersReducedMotion()
  const rows = splitLines(lines)
  const totalChars = rows.reduce((total, row) => total + row.chars.length, 0)
  const Tag = as

  useImperativeHandle(ref, () => ({
    getLetters: () => charRefs.current.filter(Boolean),
    wobble: () => {
      const root = rootRef.current
      if (!root || reducedMotion) return
      root.classList.remove('is-landing')
      void root.offsetWidth
      root.classList.add('is-landing')
      root.addEventListener('animationend', () => root.classList.remove('is-landing'), { once: true })
    },
  }), [reducedMotion])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    let disposed = false

    const measure = () => {
      const rootRect = root.getBoundingClientRect()
      const letters = charRefs.current.filter(Boolean)
      const centers = []
      const widths = []
      letters.forEach((letter) => {
        const rect = letter.getBoundingClientRect()
        centers.push(rect.left - rootRect.left + rect.width / 2)
        widths.push(rect.width)
      })
      const average = widths.length
        ? widths.reduce((total, width) => total + width, 0) / widths.length
        : 0
      metricsRef.current = { centers, widths, average }
    }

    const fit = () => {
      if (disposed) return
      const currentRows = rowRefs.current.filter(Boolean)
      const letters = charRefs.current.filter(Boolean)
      if (!currentRows.length || !letters.length) return
      const savedTransforms = letters.map((letter) => letter.style.transform)
      letters.forEach((letter) => { letter.style.transform = 'none' })
      root.style.fontSize = '100px'
      const first = letters[0].getBoundingClientRect()
      const last = letters[letters.length - 1].getBoundingClientRect()
      const textWidth = last.right - first.left
      letters.forEach((letter, index) => { letter.style.transform = savedTransforms[index] })
      const available = currentRows[0].clientWidth
      if (textWidth > 0 && available > 0) {
        root.style.fontSize = `${(available / textWidth) * 100 * fitScale}px`
      }
      measure()
    }

    fit()
    document.fonts?.ready.then(() => {
      if (!disposed) {
        fit()
        window.requestAnimationFrame(fit)
      }
    })
    window.addEventListener('resize', fit)
    return () => {
      disposed = true
      window.removeEventListener('resize', fit)
    }
  }, [fitScale])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return undefined

    const letters = charRefs.current.filter(Boolean)
    if (!letters.length) return undefined

    const targets = new Float32Array(letters.length)
    const values = new Float32Array(letters.length)
    const velocities = new Float32Array(letters.length)
    let frame = 0
    let lastTime = 0
    let pulseTimer = 0

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(tick)
    }

    const apply = () => {
      letters.forEach((letter, index) => {
        const value = values[index]
        const scaleX = 1 + value
        const scaleY = Math.pow(scaleX, -0.42)
        letter.style.transform = `translate3d(0, ${value * -2}px, 0) scale(${scaleX}, ${scaleY})`
      })
    }

    const tick = (now) => {
      if (!lastTime) lastTime = now
      const delta = Math.min(0.032, (now - lastTime) / 1000)
      lastTime = now
      const step = delta / 2
      const count = letters.length

      for (let substep = 0; substep < 2; substep += 1) {
        for (let index = 0; index < count; index += 1) {
          const acceleration = 260 * (targets[index] - values[index]) - 18 * velocities[index]
          velocities[index] += acceleration * step
          values[index] += velocities[index] * step
        }
      }

      apply()

      let moving = false
      for (let index = 0; index < count; index += 1) {
        if (
          Math.abs(targets[index]) > 0.0004
          || Math.abs(values[index]) > 0.0004
          || Math.abs(velocities[index]) > 0.012
        ) {
          moving = true
          break
        }
      }

      if (moving) {
        frame = window.requestAnimationFrame(tick)
      } else {
        frame = 0
        lastTime = 0
        values.fill(0)
        velocities.fill(0)
        apply()
      }
    }

    const pull = (clientX) => {
      const rootRect = root.getBoundingClientRect()
      const x = clientX - rootRect.left
      const { centers, average } = metricsRef.current
      const spread = Math.max(28, average * 1.45)
      letters.forEach((letter, index) => {
        const distance = (centers[index] - x) / spread
        targets[index] = MAX_STRETCH * Math.exp(-distance * distance)
      })
      start()
    }

    const release = () => {
      targets.fill(0)
      start()
    }

    const onPointerMove = (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      pull(event.clientX)
    }

    const onPointerDown = (event) => {
      if (event.pointerType === 'mouse') return
      pull(event.clientX)
      window.clearTimeout(pulseTimer)
      pulseTimer = window.setTimeout(release, 420)
    }

    root.addEventListener('pointermove', onPointerMove)
    root.addEventListener('pointerleave', release)
    root.addEventListener('pointercancel', release)
    root.addEventListener('pointerdown', onPointerDown)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(pulseTimer)
      root.removeEventListener('pointermove', onPointerMove)
      root.removeEventListener('pointerleave', release)
      root.removeEventListener('pointercancel', release)
      root.removeEventListener('pointerdown', onPointerDown)
      letters.forEach((letter) => {
        letter.style.transform = ''
      })
    }
  }, [reducedMotion])

  return (
    <Tag
      ref={rootRef}
      id={id}
      className={`wordmark${revealed ? '' : ' is-pending'}${decorative ? ' is-decorative' : ''}${className ? ` ${className}` : ''}`}
      aria-label={decorative ? undefined : 'Isabella Monteiro'}
      aria-hidden={decorative ? 'true' : undefined}
      data-wordmark
    >
      {rows.map((row, rowIndex) => (
        <span
          className="wordmark__row"
          key={lines[rowIndex]}
          ref={(element) => { rowRefs.current[rowIndex] = element }}
          aria-hidden="true"
        >
          {row.chars.map((char, charIndex) => {
            const index = row.start + charIndex
            return (
              <span
                className="wordmark__char"
                key={`${char}-${index}`}
                style={{ '--i': index, '--total': totalChars }}
                ref={(element) => { charRefs.current[index] = element }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
})

export default ElasticWordmark
