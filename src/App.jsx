import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  CaretLeft,
  CaretRight,
  DownloadSimple,
  FilePdf,
  InstagramLogo,
  List,
  WhatsappLogo,
  X,
} from '@phosphor-icons/react'
import { about, backstage, filmstrip, hero, profile, worksByCategory } from './content'

function BrandMark({ footer = false, onClick }) {
  return (
    <a className={`brand${footer ? ' brand-footer' : ''}`} href="#inicio" onClick={onClick} aria-label="Isabella Monteiro, início">
      <img className="brand-icon" src="/favicon.png?v=2" alt="" aria-hidden="true" />
      <span className="brand-name">
        <span>Isabella</span>
        <span>Monteiro</span>
      </span>
    </a>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const menuButtonRef = useRef(null)
  const navRef = useRef(null)
  const wasOpenRef = useRef(false)
  const close = () => setOpen(false)

  useEffect(() => {
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    if (!open) {
      if (wasOpenRef.current) menuButtonRef.current?.focus()
      wasOpenRef.current = false
      return undefined
    }

    wasOpenRef.current = true
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    main?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')

    const focusFirstLink = window.setTimeout(() => {
      navRef.current?.querySelector('a')?.focus()
    }, 80)

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = [
        menuButtonRef.current,
        ...Array.from(navRef.current?.querySelectorAll('a') ?? []),
      ].filter(Boolean)
      const first = focusable[0]
      const last = focusable.at(-1)

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.clearTimeout(focusFirstLink)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      main?.removeAttribute('inert')
      footer?.removeAttribute('inert')
    }
  }, [open])

  return (
    <header className="site-header">
      <BrandMark onClick={close} />
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={30} weight="bold" /> : <List size={30} weight="bold" />}
      </button>
      <nav
        ref={navRef}
        id="primary-navigation"
        className={`site-nav${open ? ' is-open' : ''}`}
        aria-label="Navegação principal"
      >
        <a href="#inicio" onClick={close}>Início</a>
        <a href="#sobre" onClick={close}>Sobre</a>
        <a href="#trabalhos" onClick={close}>Trabalhos</a>
        <a href="#contato" onClick={close}>Contato</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <p className="eyebrow">Atriz</p>
        <h1>Isabella<br />Monteiro</h1>
        <p className="hero-brush" aria-label="Portfólio">
          <span aria-hidden="true">*</span>Portfolio<span aria-hidden="true">*</span>
        </p>
      </div>

      <div className="hero-strip" aria-label="Retratos de Isabella Monteiro">
        {hero.strip.map((image) => (
          <figure key={image.src}>
            <img src={image.src} alt={image.alt} fetchPriority="high" />
          </figure>
        ))}
      </div>

      <figure className="hero-portrait">
        <div className="hero-portrait-inner">
          <img src={hero.portrait} alt="Retrato de Isabella Monteiro em fundo verde" fetchPriority="high" />
          <figcaption aria-hidden="true">Atriz</figcaption>
        </div>
      </figure>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="sobre">
      <h2>Sobre mim</h2>
      <div className="about-body">
        <div className="about-copy">
          {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <figure className="about-portrait">
          <img src={about.image} alt="Retrato de Isabella Monteiro em fundo terracota" loading="eager" />
        </figure>
      </div>
      <dl className="casting">
        {about.casting.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function WorksIntro() {
  return (
    <section className="works-intro" id="trabalhos">
      <h2 className="brush">Trabalhos</h2>
      <div className="works-links">
        <a className="pill" href="#audiovisual" aria-label="Ver trabalhos audiovisuais">
          <img src="/images/pill-audiovisual.png" alt="" loading="lazy" />
        </a>
        <a className="pill" href="#teatro" aria-label="Ver trabalhos de teatro">
          <img src="/images/pill-teatro.png" alt="" loading="lazy" />
        </a>
      </div>
      <div className="filmstrip" aria-hidden="true">
        {filmstrip.map((image) => (
          <img key={image.src} src={image.src} alt="" loading="eager" />
        ))}
      </div>
    </section>
  )
}

function Carousel({ work }) {
  const [photo, setPhoto] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ active: false, startX: 0, startY: 0 })
  const count = work.images.length

  const show = (next) => setPhoto((next + count) % count)

  const resist = (value) => {
    const atStart = photo === 0 && value > 0
    const atEnd = photo === count - 1 && value < 0
    return atStart || atEnd ? value * 0.35 : value
  }

  const startDrag = (event) => {
    if (count < 2) return
    if (event.target.closest?.('.work-controls')) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag.current = { active: true, startX: event.clientX, startY: event.clientY }
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const moveDrag = (event) => {
    if (!drag.current.active) return
    setOffset(resist(event.clientX - drag.current.startX))
  }

  const endDrag = (event) => {
    if (!drag.current.active) return
    const cancelled = event.type === 'pointercancel'
    const horizontal = cancelled ? 0 : event.clientX - drag.current.startX
    const vertical = cancelled ? 0 : event.clientY - drag.current.startY
    drag.current.active = false
    setDragging(false)
    setOffset(0)

    if (cancelled) return
    if (horizontal <= -48) show(photo + 1)
    else if (horizontal >= 48) show(photo - 1)
    else if (Math.hypot(horizontal, vertical) < 8) show(photo + 1)
  }

  const handleKeys = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      show(photo + 1)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      show(photo - 1)
    }
  }

  const [ratioWidth, ratioHeight] = work.ratio ? work.ratio.split('/').map(Number) : []
  const portraitFrame = Boolean(ratioWidth && ratioHeight && ratioWidth < ratioHeight)

  return (
    <div
      className={`work-gallery is-${work.category}${portraitFrame ? ' is-portrait' : ''}`}
      style={work.ratio ? { aspectRatio: work.ratio } : undefined}
      role="group"
      aria-label={`Fotos de ${work.title}`}
      tabIndex={count > 1 ? 0 : undefined}
      onKeyDown={count > 1 ? handleKeys : undefined}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={`work-track${dragging ? ' is-dragging' : ''}`}
        style={{ transform: `translateX(calc(${-photo * 100}% + ${offset}px))` }}
      >
        {work.images.map((source, index) => (
          <div className="work-slide" key={source} aria-hidden={index !== photo}>
            <img
              src={source}
              alt={index === 0 ? work.alt : `${work.alt}, outro momento`}
              loading={index === 0 ? 'eager' : 'lazy'}
              draggable="false"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <div className="work-shade" aria-hidden="true" />
          <div className="work-controls">
            <span className="work-counter" aria-live="polite">
              {String(photo + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
            </span>
            <button type="button" onClick={() => show(photo - 1)} aria-label={`Foto anterior de ${work.title}`}>
              <CaretLeft size={24} weight="bold" />
            </button>
            <button type="button" onClick={() => show(photo + 1)} aria-label={`Próxima foto de ${work.title}`}>
              <CaretRight size={24} weight="bold" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function Project({ work }) {
  return (
    <article className="project">
      <header className="project-copy">
        <h3>{work.title}</h3>
        {(work.year || work.medium) && <p className="project-year">{work.year || work.medium}</p>}
        {(work.direction || work.script) && (
          <dl className="project-credits">
            {work.direction && <div><dt>Direção</dt><dd>{work.direction}</dd></div>}
            {work.script && <div><dt>{work.category === 'audiovisual' ? 'Roteiro' : 'Texto'}</dt><dd>{work.script}</dd></div>}
          </dl>
        )}
        {work.description && <p className="project-description">{work.description}</p>}
      </header>
      <Carousel work={work} />
    </article>
  )
}

function Category({ id, title, works }) {
  return (
    <section className={`category category-${id}`} id={id}>
      <h2 className="brush category-title">{title}</h2>
      {works.map((work) => <Project key={work.id} work={work} />)}
    </section>
  )
}

function Backstage() {
  return (
    <section className="backstage" id="fora-de-cena">
      <div className="backstage-grid">
        <h2 className="brush backstage-title"><span aria-hidden="true">*</span>Fora de cena<span aria-hidden="true">*</span></h2>
        <p className="backstage-intro">{backstage.intro}</p>
        <ul className="backstage-list">
          {backstage.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <figure className="backstage-photo">
          <img src={backstage.image} alt={backstage.imageAlt} loading="eager" />
        </figure>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contato">
      <h2 className="brush">Contato</h2>
      <div className="contact-panel">
        <a href={profile.whatsappUrl} target="_blank" rel="noreferrer">
          <WhatsappLogo size={32} weight="regular" aria-hidden="true" />
          <span><small>WhatsApp</small>{profile.whatsapp}</span>
          <ArrowUpRight size={26} weight="bold" aria-hidden="true" />
        </a>
        <a href={profile.instagramUrl} target="_blank" rel="noreferrer">
          <InstagramLogo size={32} weight="regular" aria-hidden="true" />
          <span><small>Instagram</small>{profile.instagram}</span>
          <ArrowUpRight size={26} weight="bold" aria-hidden="true" />
        </a>
        <a href={profile.pdfUrl} download>
          <FilePdf size={32} weight="regular" aria-hidden="true" />
          <span><small>Portfólio</small>Baixar em PDF</span>
          <DownloadSimple size={26} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <BrandMark footer />
      <p>Portfólio de atriz / {year}</p>
      <a className="back-to-top" href="#inicio">Voltar ao início</a>
      <div className="footer-credit">
        Desenvolvido por <a href="https://portfolio.wired.rs/creative" target="_blank" rel="noreferrer">wired layer co.</a>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <WorksIntro />
        <Category id="audiovisual" title="Audiovisual" works={worksByCategory.audiovisual} />
        <Category id="teatro" title="Teatro" works={worksByCategory.teatro} />
        <Backstage />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
