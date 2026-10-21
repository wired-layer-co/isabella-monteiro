import { useEffect, useRef } from 'react'
import { useMediaQuery, usePrefersReducedMotion } from './hooks'

const INTERACTIVE = 'a[href], button:not([disabled]), [role="button"], summary, [data-cursor="click"]'

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export default function EyesCursor({ active }) {
  const rootRef = useRef(null)
  const pupilLeftRef = useRef(null)
  const pupilRightRef = useRef(null)
  const labelRef = useRef(null)
  const finePointer = useMediaQuery('(pointer: fine)')
  const reducedMotion = usePrefersReducedMotion()
  const enabled = active && finePointer && !reducedMotion

  useEffect(() => {
    if (!enabled) return undefined
    const root = rootRef.current
    const pupilLeft = pupilLeftRef.current
    const pupilRight = pupilRightRef.current
    const label = labelRef.current
    if (!root || !pupilLeft || !pupilRight || !label) return undefined

    document.body.classList.add('fun-eyes-on')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const pupil = { x: 0, y: 0 }
    const targetPupil = { x: 0, y: 0 }
    const dart = { x: 0, y: 0 }
    let hovered = null
    let hitDirty = true
    let frame = 0
    let blinkTimer = 0
    let dartTimer = 0
    let blinkOffTimer = 0
    let visible = false

    const apply = () => {
      root.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
      if (!visible) {
        visible = true
        root.classList.add('is-visible')
      }
    }

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        root.classList.add('is-blinking')
        blinkOffTimer = window.setTimeout(() => {
          root.classList.remove('is-blinking')
          scheduleBlink()
        }, 130)
      }, randomBetween(2600, 5600))
    }

    const scheduleDart = () => {
      dartTimer = window.setTimeout(() => {
        dart.x = randomBetween(-5.4, 5.4)
        dart.y = randomBetween(-5.4, 5.4)
        scheduleDart()
      }, randomBetween(900, 1700))
    }

    const hitTest = () => {
      const stack = document.elementsFromPoint(pointer.x, pointer.y)
      let found = null
      for (const element of stack) {
        const match = element.closest?.(INTERACTIVE)
        if (match) {
          found = match
          break
        }
      }
      hovered = found
      label.classList.toggle('is-visible', Boolean(found))
      root.classList.toggle('is-clickable', Boolean(found))
    }

    const tick = () => {
      if (hitDirty) {
        hitDirty = false
        hitTest()
      }

      if (hovered) {
        const rect = hovered.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        targetPupil.x = Math.max(-5.5, Math.min(5.5, (centerX - pointer.x) * 0.06))
        targetPupil.y = Math.max(-5.5, Math.min(5.5, (centerY - pointer.y) * 0.06))
      } else {
        targetPupil.x = dart.x
        targetPupil.y = dart.y
      }

      pupil.x += (targetPupil.x - pupil.x) * 0.22
      pupil.y += (targetPupil.y - pupil.y) * 0.22
      const transform = `translate3d(${pupil.x}px, ${pupil.y}px, 0)`
      pupilLeft.style.transform = transform
      pupilRight.style.transform = transform

      apply()
      frame = window.requestAnimationFrame(tick)
    }

    const onPointerMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      hitDirty = true
      apply()
    }

    const onPointerDown = () => {
      root.classList.add('is-pressed')
    }
    const onPointerUp = () => {
      root.classList.remove('is-pressed')
    }

    apply()
    frame = window.requestAnimationFrame(tick)
    scheduleBlink()
    scheduleDart()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(blinkTimer)
      window.clearTimeout(blinkOffTimer)
      window.clearTimeout(dartTimer)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      document.body.classList.remove('fun-eyes-on')
    }
  }, [enabled])

  if (!enabled) return null

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
      <span className="eyes__label" ref={labelRef}>CLICK</span>
    </div>
  )
}
