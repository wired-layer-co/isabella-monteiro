export const profile = {
  name: 'Isabella Monteiro',
  role: 'Atriz',
  city: 'Curitiba',
  instagram: '@isamontwiro',
  instagramUrl: 'https://instagram.com/isamontwiro',
  whatsapp: '41 99502-7607',
  whatsappUrl: 'https://wa.me/5541995027607',
  pdfUrl: '/portfolio-isabella-monteiro.pdf',
}

export const about = {
  title: 'Sobre mim',
  paragraphs: [
    'Atriz curitibana, Isabella iniciou sua carreira no Rio Grande do Sul em 2022, no teatro Paranóia Produções. Em 2023, integrou a companhia Asas de Papel, ampliando sua atuação para festivais, novas montagens e conteúdos audiovisuais.',
    'De volta a Curitiba em 2025, ingressou no Barracão Encena, onde cursa Teatro e TV com conclusão prevista para 2027. Também atua em curtas e filmes realizados por alunos da PUCPR.',
  ],
  image: '/images/isa-about-terracotta.webp',
  casting: [
    ['Altura', '1,58 m'],
    ['Peso', '60 kg'],
    ['Manequim', 'M'],
    ['Calçado', '36'],
  ],
}

export const hero = {
  strip: [
    { src: '/images/isa-strip-sitting.webp', alt: 'Isabella Monteiro sentada em um estúdio de fundo claro' },
    { src: '/images/isa-strip-standing.webp', alt: 'Isabella Monteiro em pé em um estúdio de fundo claro' },
    { src: '/images/isa-strip-walking.webp', alt: 'Isabella Monteiro caminhando em um estúdio de fundo claro' },
  ],
  portrait: '/images/isa-hero-green.webp',
}

export const filmstrip = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')
  return {
    src: `/images/isa-thumb-${number}.webp`,
    alt: `Retrato de Isabella Monteiro, frame ${number}`,
  }
})

export const works = [
  {
    id: 'quem-me-dera-ser-amada',
    category: 'audiovisual',
    title: 'Quem Me Derá Ser Amada',
    year: '',
    medium: 'Audiovisual',
    direction: '',
    script: '',
    description: '',
    images: [
      '/images/quem-me-dera-01.webp',
      '/images/quem-me-dera-02.webp',
      '/images/quem-me-dera-03.webp',
      '/images/quem-me-dera-04.webp',
      '/images/quem-me-dera-05.webp',
    ],
    alt: 'Isabella Monteiro em cena em Quem Me Derá Ser Amada',
    focus: '50% 50%',
  },
  {
    id: 'filme-delirio',
    category: 'audiovisual',
    title: 'Filme Delírio',
    year: '2025',
    medium: 'Audiovisual · longa-metragem',
    direction: 'Gabriel Eneas',
    script: 'Gabriel Eneas, Artur Bitencourt e Rafael Avila',
    description:
      'Longa-metragem com direção de Gabriel Eneas e roteiro de Gabriel Eneas, Artur Bitencourt e Rafael Avila.',
    images: ['/images/delirio-1.webp', '/images/delirio-2.webp'],
    alt: 'Isabella Monteiro em cena no filme Delírio',
    ratio: '728 / 391',
  },
  {
    id: 'ecos',
    category: 'audiovisual',
    title: 'Ecos',
    year: '2025',
    medium: 'Audiovisual',
    direction: 'Juscelino Zilio',
    script: 'Criação do grupo',
    description: 'Audiovisual com direção de Juscelino Zilio e criação do grupo.',
    images: ['/images/ecos-1.webp'],
    alt: 'Isabella Monteiro em cena no filme Ecos',
    ratio: '835 / 380',
  },
  {
    id: 'divina-tragicomedia',
    category: 'teatro',
    title: 'A Divina Tragicomédia de Dionísio',
    year: '2024',
    medium: 'Teatro',
    direction: 'Vitor Mendes',
    script: 'Grupo Asas de Papel Produções',
    description:
      'Espetáculo teatral com direção de Vitor Mendes e texto do Grupo Asas de Papel Produções, no Teatro Municipal Paschoal Carlos Magno.',
    images: [
      '/images/divina-tragicomedia-4.webp',
      '/images/divina-tragicomedia-1.webp',
      '/images/divina-tragicomedia-2.webp',
      '/images/divina-tragicomedia-3.webp',
    ],
    alt: 'Isabella Monteiro em cena em A Divina Tragicomédia de Dionísio',
    focus: '50% 62%',
  },
  {
    id: 'historia-e-uma-historia',
    category: 'teatro',
    title: 'A História é uma História',
    year: '2024',
    medium: 'Teatro',
    direction: 'Fernando Rodembuch',
    script: 'Millôr Fernandes',
    description:
      'Espetáculo teatral com direção de Fernando Rodembuch e texto de Millôr Fernandes, no Teatro Municipal Paschoal Carlos Magno.',
    images: [
      '/images/historia-3.webp',
      '/images/historia-1.webp',
      '/images/historia-2.webp',
      '/images/historia-4.webp',
      '/images/historia-5.webp',
      '/images/historia-6.webp',
    ],
    alt: 'Elenco de A História é uma História no palco',
    focus: '50% 55%',
  },
  {
    id: 'teicoscopia',
    category: 'teatro',
    title: 'Teicoscopia ou Vaudeville do Horror',
    year: '2025',
    medium: 'Teatro',
    direction: 'João Mauro Cruz',
    script: 'Criação do grupo',
    description:
      'Espetáculo teatral com direção de João Mauro Cruz e criação do grupo, no Teatro Barracão Encena.',
    images: [
      '/images/teicoscopia-3.webp',
      '/images/teicoscopia-1.webp',
      '/images/teicoscopia-2.webp',
      '/images/teicoscopia-4.webp',
    ],
    alt: 'Isabella Monteiro em cena em Teicoscopia ou Vaudeville do Horror',
    focus: '50% 35%',
  },
  {
    id: 'black-tie',
    category: 'teatro',
    title: 'Elas não Usam Black-Tie',
    year: '2026',
    medium: 'Teatro',
    direction: 'Felipe Renã',
    script: 'Adaptação de Gianfrancesco Guarnieri',
    description:
      'Espetáculo teatral com direção de Felipe Renã e adaptação de Gianfrancesco Guarnieri, no Teatro Barracão Encena.',
    images: [
      '/images/black-tie-3.webp',
      '/images/black-tie-1.webp',
      '/images/black-tie-2.webp',
      '/images/black-tie-4.webp',
      '/images/black-tie-5.webp',
      '/images/black-tie-6.webp',
    ],
    alt: 'Elenco de Elas não Usam Black-Tie em cena',
    focus: '50% 45%',
  },
]

export const worksByCategory = {
  audiovisual: works.filter((work) => work.category === 'audiovisual'),
  teatro: works.filter((work) => work.category === 'teatro'),
}

export const backstage = {
  title: 'Fora de cena',
  intro: 'Produção, técnica e bastidores também formam o olhar de Isabella sobre cada trabalho.',
  image: '/images/bastidores-fotografia.webp',
  imageAlt: 'Isabella Monteiro trabalhando em uma produção audiovisual',
  items: [
    'Iluminação em Os Ninguéns (2023)',
    'Recreação infantil e pintura facial para prefeituras e Sicredi (2023, 2024)',
    'Auxiliar de coxia no festival de dança Dançando (2023, 2024)',
    'Iluminação e captura de som para a minissérie Jardim de Eros (2024)',
    'Sonoplastia no evento Pororoca Cultural para O Método e Estranhas Poesias Celestes (2024)',
    'Fotografia no evento Conserto pro Arturzinho (2024)',
  ],
}
