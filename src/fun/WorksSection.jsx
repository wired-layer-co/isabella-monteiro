import { useEffect, useRef, useState } from 'react'
import { clamp, useMediaQuery, usePrefersReducedMotion } from './hooks'

const COVERS = {
  'quem-me-dera-ser-amada': '/images/quem-me-dera-02.webp',
  'filme-delirio': '/images/delirio-1.webp',
  ecos: '/images/ecos-1.webp',
  'divina-tragicomedia': '/images/divina-tragicomedia-4.webp',
  'historia-e-uma-historia': '/images/historia-2.webp',
  teicoscopia: '/images/teicoscopia-3.webp',
  'black-tie': '/images/black-tie-3.webp',
}

function coverFor(work) {
  return COVERS[work.id] ?? work.images[0]
}

function ProjectDialog({ work, onRequestClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [photo, setPhoto] = useState(0)
  const photos = work.images
  const total = photos.length

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined
    if (!dialog.open) dialog.showModal()
    document.body.classList.add('fun-dialog-open')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 80)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.classList.remove('fun-dialog-open')
      document.body.style.overflow = previousOverflow
      if (dialog.open) dialog.close()
    }
  }, [])

  const requestClose = () => {
    dialogRef.current?.close()
  }

  const showPhoto = (next) => {
    setPhoto((next + total) % total)
  }

  const onKeyDown = (event) => {
    if (total < 2) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showPhoto(photo + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showPhoto(photo - 1)
    }
  }

  return (
    <dialog
      className="project-dialog"
      ref={dialogRef}
      aria-labelledby="project-dialog-title"
      onClose={onRequestClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose()
      }}
    >
      <div className="project-dialog__panel">
        <button className="project-dialog__close" type="button" onClick={requestClose} ref={closeRef}>
          Fechar <span aria-hidden="true">✕</span>
        </button>

        <div className="project-dialog__media">
          <img
            src={photos[photo]}
            alt={photo === 0 ? work.alt : `${work.alt} — foto ${photo + 1}`}
            loading="eager"
          />
          {total > 1 && (
            <div className="project-dialog__media-controls">
              <button type="button" onClick={() => showPhoto(photo - 1)} aria-label={`Foto anterior de ${work.title}`}>
                ←
              </button>
              <span aria-live="polite">{String(photo + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
              <button type="button" onClick={() => showPhoto(photo + 1)} aria-label={`Próxima foto de ${work.title}`}>
                →
              </button>
            </div>
          )}
        </div>

        <div className="project-dialog__copy">
          <p className="project-dialog__meta">
            {work.category === 'teatro' ? 'TEATRO' : 'AUDIOVISUAL'}
            {work.year ? ` · ${work.year}` : ''}
            {` · ${work.medium}`}
          </p>
          <h2 id="project-dialog-title">{work.title}</h2>

          {(work.direction || work.script) && (
            <dl className="project-dialog__credits">
              {work.direction && (
                <div>
                  <dt>Direção</dt>
                  <dd>{work.direction}</dd>
                </div>
              )}
              {work.script && (
                <div>
                  <dt>{work.category === 'audiovisual' ? 'Roteiro' : 'Texto'}</dt>
                  <dd>{work.script}</dd>
                </div>
              )}
            </dl>
          )}

          {work.description && <p className="project-dialog__description">{work.description}</p>}

          {total > 1 && (
            <div className="project-dialog__thumbs" role="group" aria-label={`Fotos de ${work.title}`}>
              {photos.map((source, index) => (
                <button
                  type="button"
                  className={index === photo ? 'is-current' : ''}
                  key={source}
                  aria-label={`Ver foto ${index + 1} de ${total}`}
                  aria-pressed={index === photo}
                  onClick={() => setPhoto(index)}
                >
                  <img src={source} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          <p className="project-dialog__hint">Use ← → para passar as fotos · ESC para fechar</p>
        </div>
      </div>
    </dialog>
  )
}

export default function WorksSection({ works }) {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const metricsRef = useRef({ distance: 0 })
  const triggerRef = useRef(null)
  const [activeWork, setActiveWork] = useState(null)
  const desktop = useMediaQuery('(min-width: 900px)')
  const reducedMotion = usePrefersReducedMotion()
  const pinned = desktop && !reducedMotion

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track || !pinned) {
      if (section) section.style.height = ''
      if (track) track.style.transform = ''
      return undefined
    }

    let frame = 0
    let observed = false

    const update = () => {
      frame = 0
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      if (scrollable <= 0) {
        track.style.transform = 'translate3d(0, 0, 0)'
        return
      }
      const progress = clamp(-rect.top / scrollable, 0, 1)
      const x = -(metricsRef.current.distance * progress)
      track.style.transform = `translate3d(${x}px, 0, 0)`
    }

    const measure = () => {
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth)
      metricsRef.current = { distance }
      section.style.height = `${Math.round(window.innerHeight + distance)}px`
      update()
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    measure()
    const observer = new ResizeObserver(() => {
      if (!observed) {
        observed = true
        measure()
        observed = false
      }
    })
    observer.observe(track)
    observer.observe(viewport)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)

    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      track.style.transform = ''
      section.style.height = ''
    }
  }, [pinned, works.length])

  const revealCard = (index) => {
    if (!pinned) return
    const section = sectionRef.current
    const track = trackRef.current
    const card = track?.querySelectorAll('.work-card')[index]
    if (!section || !card) return
    const distance = metricsRef.current.distance
    if (!distance) return
    const padding = Number.parseFloat(window.getComputedStyle(track).paddingLeft) || 0
    const progress = clamp((card.offsetLeft - padding) / distance, 0, 1)
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const scrollable = section.offsetHeight - window.innerHeight
    window.scrollTo({
      top: sectionTop + progress * scrollable,
      behavior: reducedMotion ? 'auto' : 'smooth',
    })
  }

  const moveFocus = (event, index) => {
    let next = null
    if (event.key === 'ArrowRight') next = index + 1
    else if (event.key === 'ArrowLeft') next = index - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = works.length - 1
    if (next === null) return
    event.preventDefault()
    const nextCard = trackRef.current?.querySelectorAll('.work-card')[next]
    nextCard?.focus()
  }

  const openWork = (work, event) => {
    triggerRef.current = event.currentTarget
    setActiveWork(work)
  }

  const closeWork = () => {
    setActiveWork(null)
    window.requestAnimationFrame(() => {
      triggerRef.current?.focus({ preventScroll: true })
    })
  }

  return (
    <section
      className={`works${pinned ? ' is-pinned' : ' is-stacked'}`}
      id="trabalhos"
      ref={sectionRef}
      aria-labelledby="works-title"
      tabIndex={-1}
    >
      <div className="works__pin">
        <header className="works__head">
          <p className="section-label">02 / TRABALHOS</p>
          <h2 id="works-title" className="brush-title">Trabalhos <sup>{String(works.length).padStart(2, '0')}</sup></h2>
          <p className="works__hint">{pinned ? 'SCROLL PARA O LADO · SETAS ← →' : 'TOQUE PARA ABRIR'}</p>
        </header>

        <div className="works__viewport" ref={viewportRef}>
          <div
            className={`works__track${pinned ? '' : ' is-stacked'}`}
            ref={trackRef}
            role="group"
            aria-label="Projetos de Isabella Monteiro"
          >
            {works.map((work, index) => {
              const cover = coverFor(work)
              return (
                <button
                  className="work-card"
                  type="button"
                  key={work.id}
                  aria-haspopup="dialog"
                  aria-label={`Abrir ${work.title} — ${work.medium}${work.year ? `, ${work.year}` : ''}`}
                  onClick={(event) => openWork(work, event)}
                  onFocus={() => revealCard(index)}
                  onKeyDown={(event) => moveFocus(event, index)}
                >
                  <span className="work-card__media">
                    <img
                      src={cover}
                      alt={work.alt}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <span className="work-card__top">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{work.category === 'teatro' ? 'TEATRO' : 'AUDIOVISUAL'}</span>
                      <span>{work.year || '—'}</span>
                    </span>
                  </span>
                  <span className="work-card__caption">
                    <span className="work-card__title">{work.title}</span>
                    <span className="work-card__meta">{work.medium}</span>
                  </span>
                  <span className="work-card__bar" aria-hidden="true">
                    <span className="work-card__bar-default">VER O PROJETO</span>
                    <span className="work-card__bar-hover">BORA VER</span>
                    <span>↗</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {activeWork && <ProjectDialog work={activeWork} onRequestClose={closeWork} />}
    </section>
  )
}
