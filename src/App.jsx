import { useEffect, useRef, useState } from 'react'
import {
  ArrowDown,
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
import { motion as Motion, useReducedMotion } from 'motion/react'

const works = [
  {
    title: 'A Divina Tragicomédia de Dionísio',
    year: '2024',
    medium: 'Teatro',
    direction: 'Vitor Mendes',
    script: 'Grupo Asas de Papel Produções',
    location: 'Teatro Municipal Paschoal Carlos Magno',
    images: ['/images/divina-tragicomedia-4.webp', '/images/divina-tragicomedia-1.webp', '/images/divina-tragicomedia-2.webp', '/images/divina-tragicomedia-3.webp'],
    alt: 'Isabella Monteiro em cena em A Divina Tragicomédia de Dionísio',
    tone: 'rose',
  },
  {
    title: 'A História é uma História',
    year: '2024',
    medium: 'Teatro',
    direction: 'Fernando Rodembuch',
    script: 'Millôr Fernandes',
    location: 'Teatro Municipal Paschoal Carlos Magno',
    images: ['/images/historia-3.webp', '/images/historia-1.webp', '/images/historia-2.webp', '/images/historia-4.webp', '/images/historia-5.webp', '/images/historia-6.webp'],
    alt: 'Elenco de A História é uma História no palco',
    tone: 'blue',
  },
  {
    title: 'Teicoscopia ou Vaudeville do Horror',
    year: '2025',
    medium: 'Teatro',
    direction: 'João Mauro Cruz',
    script: 'Criação do grupo',
    location: 'Teatro Barracão Encena',
    images: ['/images/teicoscopia-3.webp', '/images/teicoscopia-1.webp', '/images/teicoscopia-2.webp', '/images/teicoscopia-4.webp'],
    alt: 'Isabella Monteiro em cena em Teicoscopia ou Vaudeville do Horror',
    tone: 'terracotta',
    focus: '50% 22%',
  },
  {
    title: 'Elas não Usam Black-Tie',
    year: '2026',
    medium: 'Teatro',
    direction: 'Felipe Renã',
    script: 'Adaptação de Gianfrancesco Guarnieri',
    location: 'Teatro Barracão Encena',
    images: ['/images/black-tie-3.webp', '/images/black-tie-1.webp', '/images/black-tie-2.webp', '/images/black-tie-4.webp', '/images/black-tie-5.webp', '/images/black-tie-6.webp'],
    alt: 'Elenco de Elas não Usam Black-Tie em cena',
    tone: 'sage',
  },
  {
    id: 'filme-delirio',
    title: 'Filme Delírio',
    year: '2025',
    medium: 'Audiovisual · longa-metragem',
    direction: 'Gabriel Eneas',
    script: 'Gabriel Eneas, Artur Bitencourt e Rafael Avila',
    images: ['/images/delirio-1.webp', '/images/delirio-2.webp'],
    alt: 'Isabella Monteiro em cena no filme Delírio',
    tone: 'ink',
    fit: 'cinematic',
    ratio: '728 / 391',
  },
  {
    id: 'ecos',
    title: 'Ecos',
    year: '2025',
    medium: 'Audiovisual',
    direction: 'Juscelino Zilio',
    script: 'Criação do grupo',
    images: ['/images/ecos-1.webp'],
    alt: 'Isabella Monteiro em cena no filme Ecos',
    tone: 'pearl',
    fit: 'cinematic',
    ratio: '835 / 380',
  },
]

const backstage = [
  'Iluminação em Os Ninguéns (2023)',
  'Recreação infantil e pintura facial para prefeituras e Sicredi (2023, 2024)',
  'Auxiliar de coxia no festival de dança Dançando (2023, 2024)',
  'Iluminação e captura de som para a minissérie Jardim de Eros (2024)',
  'Sonoplastia no evento Pororoca Cultural para O Método e Estranhas Poesias Celestes (2024)',
  'Fotografia no evento Conserto pro Arturzinho (2024)',
]

function BrandMark() {
  return (
    <a className="brand-mark" href="#inicio" aria-label="Isabella Monteiro, início">
      <img className="brand-icon" src="/favicon.png?v=2" alt="" aria-hidden="true" />
      <span className="brand-name">Isabella<br />Monteiro</span>
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
      <BrandMark />
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-expanded={open}
        aria-controls="primary-navigation"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={25} weight="bold" /> : <List size={25} weight="bold" />}
      </button>
      <nav
        ref={navRef}
        id="primary-navigation"
        className={open ? 'site-nav is-open' : 'site-nav'}
        aria-label="Navegação principal"
      >
        <a href="#trabalhos" onClick={close}>Trabalhos</a>
        <a href="#inicio" onClick={close}>Início</a>
        <a href="#sobre" onClick={close}>Sobre</a>
        <a href="#contato" onClick={close}>Contato</a>
      </nav>
    </header>
  )
}

function Hero() {
  const reduceMotion = useReducedMotion()
  const rise = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.72, delay, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <section className="hero" id="inicio">
      <div className="hero-copy">
        <Motion.h1 {...rise(0.05)}>
          <span className="hero-role">Atriz</span>
          <span>Isabella</span>
          <span>Monteiro</span>
        </Motion.h1>
        <Motion.p className="hero-brush" {...rise(0.13)}>
          <span aria-hidden="true">*</span>PORTFOLIO<span aria-hidden="true">*</span>
        </Motion.p>
        <Motion.div className="hero-details" {...rise(0.22)}>
          <p className="hero-year">2026</p>
          <p>Atriz de teatro e audiovisual em Curitiba. Presença de palco, escuta e trabalho construído entre o Paraná e o Rio Grande do Sul.</p>
          <a href="#trabalhos">Ver trabalhos <ArrowDown size={18} weight="bold" /></a>
        </Motion.div>
      </div>

      <Motion.div className="hero-collage" {...rise(0.18)} aria-label="Retratos e cena de Isabella Monteiro">
        <span className="hero-color-sheet" aria-hidden="true" />
        <figure className="hero-portrait-main">
          <img src="/images/isabella-retrato-principal.webp" alt="Retrato de Isabella Monteiro usando jaqueta preta" fetchPriority="high" />
        </figure>
        <figure className="hero-portrait-side">
          <img src="/images/isabella-retrato-perfil.webp" alt="Retrato de perfil de Isabella Monteiro" />
        </figure>
        <figure className="hero-scene">
          <img src="/images/black-tie-3.webp" alt="Isabella Monteiro no palco em Elas não Usam Black-Tie" />
        </figure>
      </Motion.div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="sobre">
      <div className="about-image">
        <span className="about-block" aria-hidden="true" />
        <img src="/images/isabella-retrato-frente.webp" alt="Retrato de Isabella Monteiro" loading="eager" />
        <strong aria-hidden="true">ATRIZ</strong>
      </div>
      <div className="about-copy">
        <h2>Sobre mim</h2>
        <p>
          Atriz curitibana, Isabella iniciou sua carreira no Rio Grande do Sul em 2022, no teatro Paranóia Produções. Em 2023, integrou a companhia Asas de Papel, ampliando sua atuação para festivais, novas montagens e conteúdos audiovisuais.
        </p>
        <p>
          De volta a Curitiba em 2025, ingressou no Barracão Encena, onde cursa Teatro e TV com conclusão prevista para 2027. Também atua em curtas e filmes realizados por alunos da PUCPR.
        </p>
        <dl className="casting-data" aria-label="Dados físicos">
          <div><dt>Altura</dt><dd>1,58 m</dd></div>
          <div><dt>Peso</dt><dd>60 kg</dd></div>
          <div><dt>Manequim</dt><dd>M</dd></div>
          <div><dt>Calçado</dt><dd>36</dd></div>
        </dl>
      </div>
    </section>
  )
}

function WorkCard({ work, index }) {
  const reduceMotion = useReducedMotion()
  const [photo, setPhoto] = useState(0)
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const drag = useRef({ active: false, startX: 0 })
  const count = work.images.length

  const show = (next) => setPhoto((next + count) % count)

  const resist = (value) => {
    const atStart = photo === 0 && value > 0
    const atEnd = photo === count - 1 && value < 0
    return atStart || atEnd ? value * 0.35 : value
  }

  const startDrag = (event) => {
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

  return (
    <Motion.article
      className={`work-card tone-${work.tone}${work.fit ? ` is-${work.fit}` : ''}`}
      id={work.id}
      style={{ ...(work.ratio && { '--still-ratio': work.ratio }), ...(work.focus && { '--focus': work.focus }) }}
      initial={reduceMotion ? false : { opacity: 0.96, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      aria-label={`${work.title}, ${work.year}`}
    >
      <div className="work-copy">
        <p className="work-kind">{work.medium}</p>
        <h3>{work.title}</h3>
        <p className="work-year">{work.year}</p>
        <dl>
          <div><dt>Direção</dt><dd>{work.direction}</dd></div>
          <div><dt>Texto</dt><dd>{work.script}</dd></div>
          {work.location && <div><dt>Local</dt><dd>{work.location}</dd></div>}
        </dl>
      </div>
      <div className="work-media" onKeyDown={count > 1 ? handleKeys : undefined}>
        <div
          className={dragging ? 'work-carousel is-grabbing' : 'work-carousel'}
          role="group"
          aria-label={`Fotos de ${work.title}`}
          onPointerDown={count > 1 ? startDrag : undefined}
          onPointerMove={count > 1 ? moveDrag : undefined}
          onPointerUp={count > 1 ? endDrag : undefined}
          onPointerCancel={count > 1 ? endDrag : undefined}
        >
          <div
            className={dragging ? 'work-track is-dragging' : 'work-track'}
            style={{ transform: `translateX(calc(${-photo * 100}% + ${offset}px))` }}
          >
            {work.images.map((source, slide) => (
              <div className="work-slide" key={source} aria-hidden={slide !== photo}>
                <img
                  className="work-image"
                  src={source}
                  alt={slide === 0 ? work.alt : `${work.alt}, segundo momento`}
                  loading={slide === 0 && index > 1 ? 'lazy' : 'eager'}
                  draggable="false"
                />
              </div>
            ))}
          </div>
        </div>
        {count > 1 && <div className="work-nav">
          <span className="work-counter" aria-live="polite">
            <span key={photo}>{`0${photo + 1}/0${count}`}</span>
          </span>
          <button type="button" onClick={() => show(photo - 1)} aria-label={`Foto anterior de ${work.title}`}>
            <CaretLeft size={20} weight="bold" />
          </button>
          <button type="button" onClick={() => show(photo + 1)} aria-label={`Próxima foto de ${work.title}`}>
            <CaretRight size={20} weight="bold" />
          </button>
        </div>}
        <span className="work-mark" aria-hidden="true">*</span>
      </div>
    </Motion.article>
  )
}

function Work() {
  return (
    <section className="work" id="trabalhos">
      <div className="work-heading">
        <h2>TRABALHOS</h2>
        <p>Teatro e audiovisual. Arraste, clique ou use as setas para ver outros momentos de cada obra.</p>
      </div>
      <div className="work-list">
        {works.map((work, index) => <WorkCard key={work.title} work={work} index={index} />)}
      </div>
    </section>
  )
}

function Trajectory() {
  return (
    <section className="trajectory" id="trajetoria">
      <div className="trajectory-heading">
        <h2>FORA<br />DE CENA</h2>
        <p>Produção, técnica e bastidores também formam o olhar de Isabella sobre cada trabalho.</p>
      </div>
      <div className="backstage-collage" aria-label="Bastidores de produções audiovisuais">
        <img src="/images/bastidores-aquela-cancao.webp" alt="Isabella Monteiro trabalhando em uma produção audiovisual" loading="lazy" />
        <img src="/images/bastidores-fotografia.webp" alt="Isabella Monteiro fotografando em evento teatral" loading="lazy" />
      </div>
      <ul className="backstage-list">
        {backstage.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contato">
      <div className="contact-title">
        <p>Para publicidades, teatro e audiovisual.</p>
        <h2>CONTATO</h2>
      </div>
      <div className="contact-links">
        <a href="https://wa.me/5541995027607" target="_blank" rel="noreferrer">
          <WhatsappLogo size={30} weight="regular" />
          <span><small>WhatsApp</small>41 99502-7607</span>
          <ArrowUpRight size={22} weight="bold" />
        </a>
        <a href="https://instagram.com/isamontwiro" target="_blank" rel="noreferrer">
          <InstagramLogo size={30} weight="regular" />
          <span><small>Instagram</small>@isamontwiro</span>
          <ArrowUpRight size={22} weight="bold" />
        </a>
        <a className="contact-download" href="/portfolio-isabella-monteiro.pdf" download>
          <FilePdf size={30} weight="regular" />
          <span><small>Portfólio</small>Baixar em PDF</span>
          <DownloadSimple size={22} weight="bold" />
        </a>
      </div>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-row">
        <BrandMark />
        <p>Portfólio de atriz / {year}</p>
        <a href="#inicio">Voltar ao início</a>
      </div>
      <div className="site-credit">
        Desenvolvido por{' '}
        <a href="https://portfolio.wired.rs/creative" target="_blank" rel="noreferrer">wired layer co.</a>
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
        <Work />
        <Trajectory />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
