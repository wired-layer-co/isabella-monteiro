import { useEffect, useRef } from 'react'
import { clamp } from './hooks'

const INTERACTIVE = 'a[href], button:not([disabled]), [role="button"], summary, [data-cursor="click"]'
const BRAND_SECTION = '#sobre'

// Hit tests are the only forced-layout work here, so they are throttled and
// only ever happen after actual movement (pointer move or page scroll).
const HIT_THROTTLE = 140
const FRAME_MS = 1000 / 60
const PUPIL_EASE = 0.22
const PUPIL_EPSILON = 0.05
const PUPIL_LIMIT = 5.5

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function EyesCursor({ active }) {
  const rootRef = useRef(null)
  const pupilLeftRef = useRef(null)
  const pupilRightRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!active) return undefined
    const root = rootRef.current
    const pupilLeft = pupilLeftRef.current
    const pupilRight = pupilRightRef.current
    const label = labelRef.current
    if (!root || !pupilLeft || !pupilRight || !label) return undefined

    document.body.classList.add('fun-eyes-on')

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduceMotion = reduceMotionQuery.matches

    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let appliedX = Number.NaN
    let appliedY = Number.NaN
    let pupilX = 0
    let pupilY = 0
    let appliedPupilX = Number.NaN
    let appliedPupilY = Number.NaN
    let targetX = 0
    let targetY = 0
    let dartX = 0
    let dartY = 0
    let hovered = null
    let lastTarget = null
    let hoverRect = null
    let visible = false
    let inBrandSection = false

    let frame = 0
    let lastFrameAt = 0
    let lastHitAt = 0
    let hitTimer = 0
    let blinkTimer = 0
    let blinkOffTimer = 0
    let dartTimer = 0
    let clickTimer = 0
    let disposed = false

    // --- rendering -------------------------------------------------------

    const writePosition = () => {
      if (pointerX === appliedX && pointerY === appliedY) return
      appliedX = pointerX
      appliedY = pointerY
      root.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`
      if (!visible) {
        visible = true
        root.classList.add('is-visible')
      }
    }

    const writePupils = () => {
      if (
        Math.abs(pupilX - appliedPupilX) < 0.01 &&
        Math.abs(pupilY - appliedPupilY) < 0.01
      ) {
        return
      }
      appliedPupilX = pupilX
      appliedPupilY = pupilY
      const transform = `translate3d(${pupilX.toFixed(2)}px, ${pupilY.toFixed(2)}px, 0)`
      pupilLeft.style.transform = transform
      pupilRight.style.transform = transform
    }

    const step = (now) => {
      frame = 0
      const dt = lastFrameAt ? Math.min(now - lastFrameAt, 64) : FRAME_MS
      lastFrameAt = now
      // Frame-rate independent easing: on a dropped frame the pupils catch up
      // instead of lagging further behind the pointer.
      const easing = 1 - Math.pow(1 - PUPIL_EASE, dt / FRAME_MS)
      pupilX += (targetX - pupilX) * easing
      pupilY += (targetY - pupilY) * easing
      if (Math.abs(targetX - pupilX) < PUPIL_EPSILON) pupilX = targetX
      if (Math.abs(targetY - pupilY) < PUPIL_EPSILON) pupilY = targetY
      writePupils()
      if (pupilX !== targetX || pupilY !== targetY) {
        frame = window.requestAnimationFrame(step)
      } else {
        lastFrameAt = 0
      }
    }

    const requestFrame = () => {
      if (frame) return
      lastFrameAt = 0
      frame = window.requestAnimationFrame(step)
    }

    const setPupilTarget = () => {
      if (hovered && hoverRect) {
        const centerX = hoverRect.left + hoverRect.width / 2
        const centerY = hoverRect.top + hoverRect.height / 2
        targetX = clamp((centerX - pointerX) * 0.06, -PUPIL_LIMIT, PUPIL_LIMIT)
        targetY = clamp((centerY - pointerY) * 0.06, -PUPIL_LIMIT, PUPIL_LIMIT)
      } else if (reduceMotion) {
        targetX = 0
        targetY = 0
      } else {
        targetX = dartX
        targetY = dartY
      }

      if (reduceMotion) {
        pupilX = targetX
        pupilY = targetY
        writePupils()
        return
      }
      requestFrame()
    }

    // --- hover detection -------------------------------------------------

    const applyHover = (next, refresh) => {
      const changed = next !== hovered
      if (!changed && !refresh) return
      hovered = next
      hoverRect = next ? next.getBoundingClientRect() : null
      if (changed) {
        label.classList.toggle('is-visible', Boolean(next))
        root.classList.toggle('is-clickable', Boolean(next))
      }
      setPupilTarget()
    }

    const applySection = (element) => {
      const next = Boolean(element && element.closest && element.closest(BRAND_SECTION))
      if (next === inBrandSection) return
      inBrandSection = next
      root.classList.toggle('is-brand', inBrandSection)
      if (inBrandSection) label.classList.remove('is-visible')
    }

    const hitTestAtPointer = () => {
      const element = document.elementFromPoint(pointerX, pointerY)
      applySection(element)
      applyHover(element && element.closest ? element.closest(INTERACTIVE) : null, true)
    }

    const scheduleScrollHit = () => {
      if (hitTimer) return
      const wait = HIT_THROTTLE - (performance.now() - lastHitAt)
      if (wait <= 0) {
        lastHitAt = performance.now()
        hitTestAtPointer()
        return
      }
      hitTimer = window.setTimeout(() => {
        hitTimer = 0
        lastHitAt = performance.now()
        hitTestAtPointer()
      }, wait)
    }

    // --- idle personality -------------------------------------------------

    const scheduleBlink = () => {
      if (reduceMotion) return
      blinkTimer = window.setTimeout(() => {
        if (disposed) return
        root.classList.add('is-blinking')
        blinkOffTimer = window.setTimeout(() => {
          if (disposed) return
          root.classList.remove('is-blinking')
          scheduleBlink()
        }, 130)
      }, randomBetween(2600, 5600))
    }

    const scheduleDart = () => {
      if (reduceMotion) return
      dartTimer = window.setTimeout(() => {
        if (disposed) return
        dartX = randomBetween(-5.4, 5.4)
        dartY = randomBetween(-5.4, 5.4)
        if (!hovered) setPupilTarget()
        scheduleDart()
      }, randomBetween(900, 1700))
    }

    // --- events -----------------------------------------------------------

    const onPointerMove = (event) => {
      pointerX = event.clientX
      pointerY = event.clientY
      writePosition()

      // Most events during a sweep stay on the same node: skip the ancestor
      // walk (and any style write) until the target actually changes.
      const target = event.target
      if (target !== lastTarget) {
        lastTarget = target
        applySection(target)
        const match = target && target.closest ? target.closest(INTERACTIVE) : null
        applyHover(match, false)
      }
      // The pupil direction depends on the pointer position, not just on hover.
      if (hovered) setPupilTarget()
    }

    const onScroll = () => {
      scheduleScrollHit()
    }

    // Clicks can re-render the page under a still pointer (filters, dialogs),
    // so re-check once afterwards instead of polling every frame.
    const onClick = () => {
      window.clearTimeout(clickTimer)
      clickTimer = window.setTimeout(() => {
        if (disposed) return
        lastHitAt = performance.now()
        hitTestAtPointer()
      }, 80)
    }

    const onPointerDown = () => {
      root.classList.add('is-pressed')
    }

    const onPointerUp = () => {
      root.classList.remove('is-pressed')
    }

    const onReduceMotionChange = (event) => {
      reduceMotion = event.matches
      if (!reduceMotion) {
        scheduleBlink()
        scheduleDart()
        return
      }

      window.clearTimeout(blinkTimer)
      window.clearTimeout(blinkOffTimer)
      window.clearTimeout(dartTimer)
      blinkTimer = 0
      blinkOffTimer = 0
      dartTimer = 0
      root.classList.remove('is-blinking')
      if (frame) {
        window.cancelAnimationFrame(frame)
        frame = 0
      }
      dartX = 0
      dartY = 0
      setPupilTarget()
    }

    writePosition()
    lastHitAt = performance.now()
    hitTestAtPointer()
    scheduleBlink()
    scheduleDart()
    reduceMotionQuery.addEventListener('change', onReduceMotionChange)
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('click', onClick, { passive: true })

    return () => {
      disposed = true
      if (frame) window.cancelAnimationFrame(frame)
      window.clearTimeout(blinkTimer)
      window.clearTimeout(blinkOffTimer)
      window.clearTimeout(dartTimer)
      window.clearTimeout(hitTimer)
      window.clearTimeout(clickTimer)
      reduceMotionQuery.removeEventListener('change', onReduceMotionChange)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('click', onClick)
      root.classList.remove('is-visible', 'is-clickable', 'is-pressed', 'is-blinking', 'is-brand')
      label.classList.remove('is-visible')
      document.body.classList.remove('fun-eyes-on')
    }
  }, [active])

  if (!active) return null

  return (
    <div className="eyes" ref={rootRef} aria-hidden="true">
      <div className="eyes__pair">
        <span className="eyes__orb">
          <span className="eyes__pupil" ref={pupilLeftRef}>
            <span className="eyes__glint" />
          </span>
        </span>
        <span className="eyes__orb">
          <span className="eyes__pupil" ref={pupilRightRef}>
            <span className="eyes__glint" />
          </span>
        </span>
      </div>
      <img className="eyes__brand" src="/favicon.png?v=2" alt="" aria-hidden="true" />
      <span className="eyes__label" ref={labelRef}>CLIQUE</span>
    </div>
  )
}
