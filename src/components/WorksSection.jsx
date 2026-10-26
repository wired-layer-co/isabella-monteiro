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

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'audiovisual', label: 'Audiovisual' },
  { id: 'teatro', label: 'Teatro' },
]

function coverFor(work) {
  return COVERS[work.id] ?? work.images[0]
}

function ProjectDialog({
  work,
  index,
  total,
  mobile,
  onPrev,
  onNext,
  onRequestClose,
}) {
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const panelRef = useRef(null)
  // A foto pertence ao trabalho: trocar de trabalho volta para a primeira sem
  // precisar de efeito de reset.
  const [photoState, setPhotoState] = useState({ workId: work.id, index: 0 })
  const photo = photoState.workId === work.id ? photoState.index : 0
  const onRequestCloseRef = useRef(onRequestClose)
  useEffect(() => {
    onRequestCloseRef.current = onRequestClose
  }, [onRequestClose])
  const photos = work.images
  const photoTotal = photos.length
  const isFirst = index === 0
  const isLast = index === total - 1

  // "AUDIOVISUAL · AUDIOVISUAL" acontece quando o medium repete a categoria.
  const metaParts = [
    work.category === 'teatro' ? 'TEATRO' : 'AUDIOVISUAL',
    work.year,
    work.medium,
  ].filter(Boolean)
  const meta = metaParts.filter(
    (part, partIndex) =>
      metaParts.findIndex((other) => String(other).toLowerCase() === String(part).toLowerCase()) === partIndex,
  )

  useEffect(() => {
    document.body.classList.add('fun-dialog-open')
    const previousOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    // No mobile a barra de rolagem do navegador fica visivel e atrapalha;
    // travar o html tambem remove a barra (em mobile ela e overlay).
    if (window.matchMedia('(max-width: 899px)').matches) {
      document.documentElement.style.overflow = 'hidden'
    }
    const focusTimer = window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 80)

    // ESC fecha mesmo quando o foco saiu do dialogo (ex.: depois de arrastar
    // na imagem, o foco vai para o body).
    const onWindowKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onRequestCloseRef.current()
    }
    window.addEventListener('keydown', onWindowKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onWindowKeyDown)
      document.body.classList.remove('fun-dialog-open')
      document.body.style.overflow = previousOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
    }
  }, [])

  // Troca de trabalho: o conteudo novo comeca no topo.
  useEffect(() => {
    panelRef.current?.scrollTo?.({ top: 0 })
  }, [work.id])

  const showPhoto = (next) => {
    setPhotoState({ workId: work.id, index: (next + photoTotal) % photoTotal })
  }

  const selectPhoto = (next) => {
    setPhotoState({ workId: work.id, index: next })
  }

  const swipe = useRef({ active: false, axis: null, x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragY, setDragY] = useState(0)

  // Distancia (px) para trocar de trabalho durante o arraste.
  const STEP_PX = 72

  const startSwipe = (event) => {
    if (event.target.closest?.('.project-dialog__media-controls')) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    swipe.current = { active: true, axis: null, x: event.clientX, y: event.clientY }
    setDragging(true)
    // Pode nao haver ponteiro ativo (gesto cancelado, evento sintetico).
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId)
    } catch {
      // segue sem captura: o pointerup ainda chega no mesmo elemento
    }
  }

  // Arraste continuo: o painel acompanha o dedo e troca de trabalho ao cruzar
  // o passo, sem esperar soltar.
  const moveSwipe = (event) => {
    const drag = swipe.current
    if (!drag.active || !mobile) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y
    if (!drag.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      drag.axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x'
    }
    if (drag.axis !== 'y') return

    // Nos extremos nao ha para onde ir: nao desloca (evita mostrar vazio).
    const blocked = (dy > 0 && isLast) || (dy < 0 && isFirst)
    if (blocked) {
      setDragY(0)
      return
    }
    setDragY(dy)

    if (dy >= STEP_PX) {
      onNext()
      drag.y = event.clientY
      setDragY(0)
    } else if (dy <= -STEP_PX) {
      onPrev()
      drag.y = event.clientY
      setDragY(0)
    }
  }

  const endSwipe = (event) => {
    const drag = swipe.current
    if (!drag.active) return
    const horizontal = event.clientX - drag.x
    const vertical = event.clientY - drag.y
    drag.active = false
    setDragging(false)
    setDragY(0)

    if (!mobile || drag.axis === 'x') {
      if (Math.abs(horizontal) < 40 || Math.abs(horizontal) < Math.abs(vertical)) return
      if (photoTotal < 2) return
      showPhoto(horizontal < 0 ? photo + 1 : photo - 1)
      return
    }

    // No ultimo, arrastar para baixo fecha e devolve ao card correspondente.
    if (isLast && vertical >= 90) onRequestClose()
  }

  const onKeyDown = (event) => {
    if (mobile && event.key === 'ArrowDown') {
      event.preventDefault()
      onNext()
      return
    }
    if (mobile && event.key === 'ArrowUp') {
      event.preventDefault()
      onPrev()
      return
    }
    if (photoTotal > 1 && event.key === 'ArrowRight') {
      event.preventDefault()
      showPhoto(photo + 1)
      return
    }
    if (photoTotal > 1 && event.key === 'ArrowLeft') {
      event.preventDefault()
      showPhoto(photo - 1)
      return
    }
    if (event.key === 'Tab') {
      const root = dialogRef.current
      if (!root) return
      const items = Array.from(root.querySelectorAll('a[href], button:not([disabled])')).filter(
        (element) => element.getClientRects().length > 0,
      )
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  return (
    <>
      <div className="project-dialog__scrim" onClick={onRequestClose} aria-hidden="true" />
      <div
        className="project-dialog"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        onKeyDown={onKeyDown}
      >
      <div
        className={`project-dialog__panel${dragging ? ' is-dragging' : ''}`}
        ref={panelRef}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
      >
        <button className="project-dialog__close" type="button" onClick={onRequestClose} ref={closeRef}>
          Fechar <span aria-hidden="true">{'✕\uFE0E'}</span>
        </button>

        <div
          className={`project-dialog__media${dragging ? ' is-dragging' : ''}`}
          onPointerDown={startSwipe}
          onPointerMove={moveSwipe}
          onPointerUp={endSwipe}
          onPointerCancel={endSwipe}
        >
          <img
            src={photos[photo]}
            alt={photo === 0 ? work.alt : `${work.alt} — foto ${photo + 1}`}
            loading="eager"
            draggable="false"
          />
          {photoTotal > 1 && (
            <div className="project-dialog__media-controls">
              <button type="button" onClick={() => showPhoto(photo - 1)} aria-label={`Foto anterior de ${work.title}`}>
                {'←\uFE0E'}
              </button>
              <span aria-live="polite">{String(photo + 1).padStart(2, '0')} / {String(photoTotal).padStart(2, '0')}</span>
              <button type="button" onClick={() => showPhoto(photo + 1)} aria-label={`Próxima foto de ${work.title}`}>
                {'→\uFE0E'}
              </button>
            </div>
          )}
        </div>

        <div className="project-dialog__copy">
          <div className="project-dialog__topline">
            <p className="project-dialog__meta">{meta.join(' · ')}</p>
            {mobile && (
              <p className="project-dialog__step" aria-live="polite">
                {String(index + 1).padStart(2, '0')}
                <span aria-hidden="true"> / </span>
                {String(total).padStart(2, '0')}
              </p>
            )}
          </div>
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

          {photoTotal > 1 && (
            <div className="project-dialog__thumbs" role="group" aria-label={`Fotos de ${work.title}`}>
              {photos.map((source, photoIndex) => (
                <button
                  type="button"
                  className={photoIndex === photo ? 'is-current' : ''}
                  key={source}
                  aria-label={`Ver foto ${photoIndex + 1} de ${photoTotal}`}
                  aria-pressed={photoIndex === photo}
                  onClick={() => selectPhoto(photoIndex)}
                >
                  <img src={source} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {mobile && isLast && (
            <p className="project-dialog__last">
              Último trabalho. Arraste para baixo para voltar ao site.
            </p>
          )}

          <p className="project-dialog__hint">
            {photoTotal > 1
              ? mobile
                ? 'Arraste para o lado para passar as fotos'
                : 'Use ←\uFE0E →\uFE0E para passar as fotos · ESC para fechar'
              : mobile
                ? ''
                : 'ESC para fechar'}
          </p>
        </div>
      </div>
      </div>
    </>
  )
}

export default function WorksSection({ works }) {
  const sectionRef = useRef(null)
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const metricsRef = useRef({ distance: 0 })
  const triggerRef = useRef(null)
  const pendingScrollRef = useRef(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [activeIndex, setActiveIndex] = useState(null)
  const [filter, setFilter] = useState('todos')
  const desktop = useMediaQuery('(min-width: 900px)')
  const reducedMotion = usePrefersReducedMotion()
  const pinned = desktop
  const visibleWorks = filter === 'todos' ? works : works.filter((work) => work.category === filter)
  const activeWork = activeIndex === null ? null : visibleWorks[activeIndex] ?? null

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
  }, [pinned, visibleWorks.length])

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
    else if (event.key === 'End') next = visibleWorks.length - 1
    if (next === null) return
    event.preventDefault()
    const nextCard = trackRef.current?.querySelectorAll('.work-card')[next]
    nextCard?.focus()
  }

  const changeFilter = (id) => {
    setFilter(id)
    window.requestAnimationFrame(() => {
      const section = sectionRef.current
      if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY, behavior: 'auto' })
    })
  }

  // Ao fechar no mobile, rola a pagina ate o card do trabalho em que parou.
  useEffect(() => {
    if (activeIndex !== null) return
    const index = pendingScrollRef.current
    if (index === null) return
    pendingScrollRef.current = null
    if (desktop) {
      const trigger = triggerRef.current
      triggerRef.current = null
      trigger?.focus?.({ preventScroll: true })
      return
    }
    const card = trackRef.current?.querySelectorAll('.work-card')[index]
    if (!card) return
    window.requestAnimationFrame(() => {
      card.scrollIntoView({ block: 'center', behavior: 'auto' })
      card.focus({ preventScroll: true })
      triggerRef.current = null
    })
  }, [activeIndex, desktop])

  const openWork = (work, event) => {
    triggerRef.current = event?.currentTarget ?? null
    const index = visibleWorks.findIndex((item) => item.id === work.id)
    setActiveIndex(index < 0 ? 0 : index)
  }

  const closeWork = () => {
    // Ao fechar, a pagina fica no card do trabalho em que a pessoa parou
    // (inclusive o ultimo), para continuar a leitura dali.
    pendingScrollRef.current = activeIndex
    setActiveIndex(null)
  }

  // Reels: desce para o proximo trabalho, sobe para o anterior. No ultimo,
  // descer fecha e devolve a pessoa ao site normal.
  const goToWork = (delta) => {
    if (activeIndex === null) return
    const next = activeIndex + delta
    if (next >= visibleWorks.length) {
      closeWork()
      return
    }
    if (next < 0) return
    setActiveIndex(next)
  }

  // No mobile, o card "da vez" e o ultimo que passou da linha de leitura.
  // E nele que a barra BORA VER aparece (os anteriores escondem).
  useEffect(() => {
    if (desktop) return undefined
    let frame = 0

    const update = () => {
      frame = 0
      const cards = trackRef.current?.querySelectorAll('.work-card')
      if (!cards?.length) return
      // Linha de leitura acima do centro: o card vira "o da vez" quando ja
      // subiu um pouco na tela (nao no meio exato do viewport).
      const line = window.innerHeight * 0.38
      let best = 0
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        if (rect.top <= line) best = index
      })
      setScrollIndex((previous) => (previous === best ? previous : best))
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    frame = window.requestAnimationFrame(update)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [desktop, visibleWorks.length])

  const currentCardIndex =
    activeIndex ?? Math.min(scrollIndex, Math.max(0, visibleWorks.length - 1))

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
          <h2 id="works-title" className="brush-title">Trabalhos <sup>{String(visibleWorks.length).padStart(2, '0')}</sup></h2>
          <p className="works__hint">{pinned ? 'SCROLL PARA O LADO · SETAS ←\uFE0E →\uFE0E' : 'TOQUE PARA ABRIR'}</p>
          <div className="works__filter" role="tablist" aria-label="Filtrar trabalhos">
            {FILTERS.map((option) => (
              <button
                type="button"
                key={option.id}
                role="tab"
                aria-selected={filter === option.id}
                className={`works__filter-tab${filter === option.id ? ' is-active' : ''}`}
                onClick={() => changeFilter(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </header>

        <div className="works__viewport" ref={viewportRef}>
          <div
            className={`works__track${pinned ? '' : ' is-stacked'}`}
            ref={trackRef}
            role="group"
            aria-label="Projetos de Isabella Monteiro"
          >
            {visibleWorks.map((work, index) => {
              const cover = coverFor(work)
              const isCurrent = index === currentCardIndex
              return (
                <button
                  className={`work-card${isCurrent ? ' is-current' : ''}`}
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
                    <span className="work-card__print">
                      {work.year && <span className="work-card__print-year">{work.year}</span>}
                      {work.direction && <span><b>Direção:</b> {work.direction}</span>}
                      {work.script && (
                        <span><b>{work.category === 'audiovisual' ? 'Roteiro' : 'Texto'}:</b> {work.script}</span>
                      )}
                      {work.description && <span>{work.description}</span>}
                    </span>
                  </span>
                  <span className="work-card__bar" aria-hidden="true">
                    <span className="work-card__bar-default">BORA VER</span>
                    <span className="work-card__bar-hover">BORA VER</span>
                    <span>{'↗\uFE0E'}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {activeWork && (
        <ProjectDialog
          work={activeWork}
          index={activeIndex}
          total={visibleWorks.length}
          mobile={!desktop}
          onPrev={() => goToWork(-1)}
          onNext={() => goToWork(1)}
          onRequestClose={closeWork}
        />
      )}
    </section>
  )
}
