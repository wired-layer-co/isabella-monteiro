import { useCallback, useEffect, useRef, useState } from 'react'
import { about, backstage, filmstrip, hero, profile, works } from './content'
import ElasticWordmark from './fun/ElasticWordmark'
import EyesCursor from './fun/EyesCursor'
import Menu from './fun/Menu'
import Preloader from './fun/Preloader'
import ScrollReveal from './fun/ScrollReveal'
import WorksSection from './fun/WorksSection'
import { usePrefersReducedMotion } from './fun/hooks'

function shouldPlayPreloader() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return window.sessionStorage.getItem('fun-preloader-played') !== '1'
  } catch {
    return true
  }
}

function Hero({ wordmarkRef, revealed }) {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__meta" data-reveal>
        <p>ATRIZ · TEATRO &amp; AUDIOVISUAL</p>
        <p>PORTFÓLIO / 2026</p>
      </div>

      <ElasticWordmark ref={wordmarkRef} id="hero-title" revealed={revealed} fitScale={0.84} />
      <p className="hero__brush" aria-hidden="true">portfólio *</p>

      <div className="hero__grid">
        <p className="hero__statement" data-reveal style={{ '--d': '80ms' }}>
          Atriz curitibana entre o teatro e o audiovisual. Presença, escuta e jogo — do palco à câmera.
        </p>

        <dl className="hero__facts" data-reveal style={{ '--d': '160ms' }}>
          <div>
            <dt>Base</dt>
            <dd>Curitiba, BR</dd>
          </div>
          <div>
            <dt>Em cena desde</dt>
            <dd>2022</dd>
          </div>
          <div>
            <dt>Áreas</dt>
            <dd>Teatro + Audiovisual</dd>
          </div>
        </dl>

        <div className="hero__actions" data-reveal style={{ '--d': '240ms' }}>
          <a className="button button--solid" href={profile.whatsappUrl} target="_blank" rel="noreferrer">
            Vamos conversar <span aria-hidden="true">↗</span>
          </a>
          <a className="button button--ghost" href="#trabalhos">
            Ver trabalhos <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      <div className="hero__strip" data-reveal style={{ '--d': '320ms' }}>
        {hero.strip.map((image, index) => (
          <figure className="hero__strip-item" key={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              loading={index === 2 ? 'lazy' : 'eager'}
            />
            <figcaption aria-hidden="true">STILL {String(index + 1).padStart(2, '0')}</figcaption>
          </figure>
        ))}
        <div className="hero__stamp" aria-hidden="true">
          <span>em cena</span>
          <strong>↗</strong>
          <small>ATRIZ / 2026</small>
        </div>
      </div>
    </section>
  )
}

function Filmstrip() {
  return (
    <div className="filmstrip" aria-hidden="true">
      <div className="filmstrip__track">
        {[0, 1].map((group) => (
          <div className="filmstrip__group" key={group}>
            {filmstrip.map((image) => (
              <img src={image.src} alt="" key={`${group}-${image.src}`} loading="lazy" decoding="async" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function About() {
  return (
    <section className="about" id="sobre" aria-labelledby="about-title" tabIndex={-1}>
      <header className="section-head">
        <p className="section-label">03 / SOBRE</p>
        <h2 id="about-title" className="brush-title">Sobre mim</h2>
        <p className="script-note" aria-hidden="true">quem sou eu ↗</p>
      </header>

      <ScrollReveal className="about__statement" text={about.paragraphs[0]} />

      <div className="about__grid">
        <div className="about__collage" data-reveal>
          <figure className="about__portrait">
            <img src={about.image} alt="Retrato de Isabella Monteiro em fundo terracota" loading="lazy" />
          </figure>
          <figure className="about__mini">
            <img src={hero.portrait} alt="Retrato de Isabella Monteiro em fundo verde" loading="lazy" />
          </figure>
          <span className="about__tag" aria-hidden="true">ATRIZ<br />CURITIBA</span>
        </div>

        <div className="about__copy">
          <p data-reveal>{about.paragraphs[1]}</p>

          <dl className="casting" data-reveal style={{ '--d': '100ms' }}>
            {about.casting.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          <a className="text-link" href={profile.pdfUrl} download data-reveal style={{ '--d': '180ms' }}>
            Baixar portfólio em PDF <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Backstage() {
  return (
    <section className="backstage" id="fora-de-cena" aria-labelledby="backstage-title" tabIndex={-1}>
      <div className="backstage__band" aria-hidden="true">
        <div className="backstage__band-track">
          <span>FORA DE CENA * BASTIDORES * FORA DE CENA * BASTIDORES *&nbsp;</span>
          <span>FORA DE CENA * BASTIDORES * FORA DE CENA * BASTIDORES *&nbsp;</span>
        </div>
      </div>

      <div className="backstage__inner">
        <header className="backstage__head">
          <p className="section-label">04 / BASTIDORES</p>
          <h2 id="backstage-title" className="brush-title"><span aria-hidden="true">*</span>Fora<br /><span>de cena</span><span aria-hidden="true">*</span></h2>
          <span className="backstage__star" aria-hidden="true">*</span>
          <p className="backstage__intro" data-reveal>{backstage.intro}</p>
        </header>

        <div className="backstage__body">
          <ol className="backstage__list">
            {backstage.items.map((item, index) => (
              <li key={item}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>

          <div className="backstage__photos" data-reveal>
            <figure className="backstage__main">
              <img src={backstage.image} alt={backstage.imageAlt} loading="lazy" />
            </figure>
            <figure className="backstage__second">
              <img src="/images/bastidores-aquela-cancao.webp" alt="Isabella Monteiro em um registro de bastidores" loading="lazy" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contato" aria-labelledby="contact-title" tabIndex={-1}>
      <div className="contact__top">
        <p className="section-label">05 / CONTATO</p>
        <p className="contact__note" data-reveal>
          Para convites, parcerias e novas ideias.
          <span className="script-note" aria-hidden="true">chama no zap</span>
        </p>
      </div>

      <h2 id="contact-title" className="contact__heading brush-title">Contato</h2>

      <div className="contact__cta-row">
        <a
          className="contact__cta"
          href={profile.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Vamos conversar pelo WhatsApp"
        >
          <span>Vamos</span>
          <span>conversar?</span>
          <span className="contact__arrow" aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="contact__grid" data-reveal>
        <a href={profile.whatsappUrl} target="_blank" rel="noreferrer">
          <span className="contact__link-label">WhatsApp</span>
          <span className="contact__link-value">{profile.whatsapp}</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href={profile.instagramUrl} target="_blank" rel="noreferrer">
          <span className="contact__link-label">Instagram</span>
          <span className="contact__link-value">{profile.instagram}</span>
          <span aria-hidden="true">↗</span>
        </a>
        <a href={profile.pdfUrl} download>
          <span className="contact__link-label">Portfólio</span>
          <span className="contact__link-value">Baixar em PDF</span>
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <p className="contact__place">CURITIBA · PARANÁ · BRASIL</p>
    </section>
  )
}

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="fun-footer" id="fun-footer">
      <div className="fun-footer__top">
        <p>ISABELLA MONTEIRO<br /><span>ATRIZ · CURITIBA</span></p>
        <a href="#inicio">Voltar ao topo <span aria-hidden="true">↑</span></a>
      </div>

      <ElasticWordmark as="div" decorative revealed lines={['Isabella Monteiro']} className="fun-footer__wordmark" />

      <div className="fun-footer__bottom">
        <p>PORTFÓLIO DE ATRIZ / {year}</p>
        <div className="fun-footer__links">
          <a href={profile.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
          <a href={profile.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={profile.pdfUrl} download>PDF</a>
        </div>
        <p>
          Desenvolvido por{' '}
          <a href="https://portfolio.wired.rs/creative" target="_blank" rel="noreferrer">wired layer co.</a>
        </p>
      </div>
    </footer>
  )
}

export default function FunApp() {
  const [showPreloader, setShowPreloader] = useState(shouldPlayPreloader)
  const [introDone, setIntroDone] = useState(() => !shouldPlayPreloader())
  const wordmarkRef = useRef(null)
  const reducedMotion = usePrefersReducedMotion()

  const handleIntroDone = useCallback(() => {
    setShowPreloader(false)
    setIntroDone(true)
  }, [])

  useEffect(() => {
    if (showPreloader) return undefined
    const frame = window.requestAnimationFrame(() => {
      wordmarkRef.current?.wobble()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [showPreloader])

  useEffect(() => {
    if (showPreloader) return undefined
    const nodes = Array.from(document.querySelectorAll('[data-reveal]'))
    if (reducedMotion) {
      nodes.forEach((node) => node.classList.add('is-in'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' })

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [showPreloader, reducedMotion])

  return (
    <div className={`fun${introDone ? ' is-ready' : ''}`}>
      {showPreloader && <Preloader wordmarkRef={wordmarkRef} onDone={handleIntroDone} />}

      <div className="fun-shell" inert={showPreloader}>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

        <Menu profile={profile} />

        <main id="conteudo" tabIndex={-1}>
          <Hero wordmarkRef={wordmarkRef} revealed={introDone} />
          <Filmstrip />
          <WorksSection works={works} />
          <About />
          <Backstage />
          <Contact />
        </main>

        <Footer />
      </div>

      <EyesCursor active={!showPreloader} />
    </div>
  )
}
