import {
  ArrowUpRight,
  DownloadSimple,
  FilePdf,
  InstagramLogo,
  WhatsappLogo,
} from '@phosphor-icons/react'
import { about, backstage, filmstrip, hero, profile, works } from './content'
import { useMediaQuery } from './components/hooks'
import Menu from './components/Menu'
import WorksSection from './components/WorksSection'
import EyesCursor from './components/EyesCursor'

// No site normal os trabalhos vêm depois do "Sobre".
const MAIN_NAV = [
  { number: '01', label: 'Início', href: '#inicio' },
  { number: '02', label: 'Sobre', href: '#sobre' },
  { number: '03', label: 'Trabalhos', href: '#trabalhos' },
  { number: '04', label: 'Fora de cena', href: '#fora-de-cena' },
  { number: '05', label: 'Contato', href: '#contato' },
]

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

function HeroCopy() {
  return (
    <div className="hero-copy">
      <p className="eyebrow">Atriz</p>
      <h1>Isabella<br />Monteiro</h1>
      <p className="hero-brush" aria-label="Portfólio">
        <span aria-hidden="true">*</span>Portfolio<span aria-hidden="true">*</span>
      </p>
      <ul className="hero-facts">
        <li>Curitiba · Brasil</li>
        <li>Teatro &amp; audiovisual</li>
      </ul>
    </div>
  )
}

function Hero() {
  // Mesma estrutura em todas as larguras: capa editorial + régua de retratos.
  return (
    <section className="hero hero--desktop" id="inicio">
      <div className="hero-stage">
        <HeroCopy />

        <figure className="hero-portrait">
          <div className="hero-portrait-inner">
            <img src={hero.portrait} alt="Retrato de Isabella Monteiro em fundo terracota" fetchPriority="high" />
            <figcaption aria-hidden="true">Atriz</figcaption>
          </div>
        </figure>
      </div>

      <div className="hero-reel-head" aria-hidden="true">
        <span>Retratos · estúdio</span>
        <span>01 — 10</span>
      </div>
      <div className="hero-reel" aria-hidden="true">
        {filmstrip.map((image, index) => (
          <figure key={image.src}>
            <img src={image.src} alt="" loading={index < 4 ? 'eager' : 'lazy'} />
          </figure>
        ))}
      </div>
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
          <img
            className="about-portrait__base"
            src={about.image}
            alt="Retrato de Isabella Monteiro em fundo verde"
            loading="eager"
          />
          <img
            className="about-portrait__reveal"
            src={about.reveal}
            alt=""
            aria-hidden="true"
            loading="eager"
          />
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
  // A estrutura é a mesma em todas as larguras; o cursor de olho fica só no desktop.
  const isDesktop = useMediaQuery('(min-width: 900px)')

  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Menu profile={profile} items={MAIN_NAV} />
      <main id="conteudo">
        <Hero />
        <About />
        <WorksSection works={works} />
        <Backstage />
        <Contact />
      </main>
      <Footer />
      <EyesCursor active={isDesktop} />
    </>
  )
}
