import { useEffect, useRef, useState } from 'react'
import { formatCuritibaTime } from './hooks'

const NAV_ITEMS = [
  { number: '01', label: 'Início', href: '#inicio' },
  { number: '02', label: 'Trabalhos', href: '#trabalhos' },
  { number: '03', label: 'Sobre', href: '#sobre' },
  { number: '04', label: 'Fora de cena', href: '#fora-de-cena' },
  { number: '05', label: 'Contato', href: '#contato' },
]

export default function Menu({ profile, items = NAV_ITEMS }) {
  const [open, setOpen] = useState(false)
  const [time, setTime] = useState(formatCuritibaTime)
  const headerRef = useRef(null)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)
  const wasOpenRef = useRef(false)
  const skipRestoreRef = useRef(false)

  useEffect(() => {
    const timer = window.setInterval(() => setTime(formatCuritibaTime()), 60000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const main = document.getElementById('conteudo')
    const footer = document.querySelector('footer')

    if (!open) {
      if (wasOpenRef.current && !skipRestoreRef.current) {
        buttonRef.current?.focus({ preventScroll: true })
      }
      skipRestoreRef.current = false
      wasOpenRef.current = false
      return undefined
    }

    wasOpenRef.current = true
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.body.classList.add('fun-menu-open')
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')

    const focusTimer = window.setTimeout(() => {
      panelRef.current?.querySelector('a')?.focus({ preventScroll: true })
    }, 120)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [
        ...(headerRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? []),
        ...(panelRef.current?.querySelectorAll('a[href], button:not([disabled])') ?? []),
      ].filter((element) => element.getClientRects().length > 0)

      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.classList.remove('fun-menu-open')
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
    }
  }, [open])

  const close = () => setOpen(false)

  const navigate = (event, href) => {
    event.preventDefault()
    skipRestoreRef.current = true
    setOpen(false)
    const target = document.querySelector(href)
    window.setTimeout(() => {
      target?.focus({ preventScroll: true })
      target?.scrollIntoView({ block: 'start' })
    }, 60)
  }

  return (
    <>
      <header className={`fun-header${open ? ' is-open' : ''}`} ref={headerRef}>
        <a
          className="fun-brand"
          href="#inicio"
          aria-label="Isabella Monteiro, início"
          onClick={(event) => navigate(event, '#inicio')}
        >
          <img className="fun-brand__icon" src="/favicon.png?v=2" alt="" aria-hidden="true" />
          <span className="fun-brand__name">
            <span>Isabella</span>
            <span>Monteiro</span>
          </span>
        </a>

        <div className="fun-header__right">
          <span className="fun-clock">CURITIBA, BR · {time}</span>
          <button
            ref={buttonRef}
            className={`menu-button${open ? ' is-open' : ''}`}
            type="button"
            aria-expanded={open}
            aria-controls="fun-menu"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-button__line" aria-hidden="true" />
            <span className="menu-button__line" aria-hidden="true" />
            <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
          </button>
        </div>
      </header>

      <div
        className={`curtain${open ? ' is-open' : ''}`}
        id="fun-menu"
        ref={panelRef}
        inert={!open}
        aria-hidden={!open}
      >
        <nav className="curtain__nav" aria-label="Navegação principal">
          {items.map((item) => (
            <a
              className="curtain__link"
              href={item.href}
              key={item.href}
              onClick={(event) => navigate(event, item.href)}
            >
              <span className="curtain__number">{item.number}</span>
              <span className="curtain__label">{item.label}</span>
              <span className="curtain__arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>

        <div className="curtain__foot">
          <div>
            <p className="curtain__kicker">FALE</p>
            <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" onClick={close}>{profile.whatsapp}</a>
          </div>
          <div>
            <p className="curtain__kicker">SOCIAL</p>
            <a href={profile.instagramUrl} target="_blank" rel="noreferrer" onClick={close}>{profile.instagram}</a>
          </div>
          <div>
            <p className="curtain__kicker">PORTFÓLIO</p>
            <a href={profile.pdfUrl} download onClick={close}>Baixar em PDF</a>
          </div>
          <p className="curtain__place">ATRIZ · CURITIBA · BRASIL</p>
        </div>
      </div>
    </>
  )
}
