---
name: Isabella Monteiro — Portfólio de Atriz
description: Um zine de casting fotocopiado, editorial e direto, conduzido pelas fotografias de Isabella.
colors:
  ink: "#171717"
  copy-paper: "#fbfbf8"
  pearl: "#f0ede4"
  terracotta: "#974315"
  dolphin-blue: "#788990"
  rose-beige: "#e3d6c5"
  light-sage: "#8d957e"
  ink-line: "rgba(23, 23, 23, 0.35)"
typography:
  display:
    fontFamily: "Road Rage, Impact, sans-serif"
    fontSize: "clamp(8rem, 17vw, 17rem)"
    fontWeight: 400
    lineHeight: 0.62
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Archivo Variable, Arial, sans-serif"
    fontSize: "clamp(4rem, 7.2vw, 7.3rem)"
    fontWeight: 610
    lineHeight: 0.78
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Archivo Variable, Arial, sans-serif"
    fontSize: "clamp(3rem, 5.5vw, 6rem)"
    fontWeight: 560
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Archivo Variable, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo Variable, Arial, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 750
    lineHeight: 1.35
    letterSpacing: "0.08em"
rounded:
  square: "0"
spacing:
  gutter-mobile: "18px"
  gutter-fluid: "clamp(22px, 4vw, 68px)"
  text-gap: "16px"
  section-pad: "clamp(80px, 10vw, 150px)"
components:
  hero-cta:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0 0 4px"
  work-card:
    backgroundColor: "{colors.rose-beige}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "clamp(50px, 7vw, 110px) clamp(22px, 4vw, 68px)"
  contact-link:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.copy-paper}"
    rounded: "{rounded.square}"
    height: "120px"
---

# Design System: Isabella Monteiro — Portfólio de Atriz

## Overview

**Creative North Star: "Zine de Casting Fotocopiado"**

O sistema trata o portfólio como um conjunto de folhas impressas montadas à mão: cru, autoral e imediatamente legível. A composição nasce de grandes áreas de preto e branco, tipografia seca, lettering de pincel e fotografias coloridas que ocupam mais espaço do que a interface. Os blocos cromáticos funcionam como papéis recortados, não como decoração digital.

A densidade alterna capa, respiro editorial e spreads de trabalhos em tela cheia. O resultado deve comunicar presença de atriz e rigor de casting, sem assumir a aparência de uma landing page corporativa, de um portfólio de designer ou de uma interface baseada em cartões.

**Key Characteristics:**

- Fotografia de Isabella como elemento dominante.
- Lettering áspero em escala de pôster combinado a sans serif condensada visualmente pelo tracking.
- Colagens assimétricas, espaços negativos amplos e alternância de spreads.
- Superfícies planas, cantos retos e cor aplicada em blocos sólidos.
- Créditos profissionais curtos, contrastados e fáceis de examinar.

## Colors

A paleta combina tinta e papel de cópia com cinco papéis coloridos dessaturados; cada spread escolhe um bloco dominante e preserva contraste alto.

### Primary

- **Tinta Gráfica:** base tipográfica, fundos de abertura e contato e contraste principal.
- **Papel de Cópia:** fundo editorial, texto reverso e moldura das fotografias.

### Secondary

- **Terracota de Arquivo:** ênfase, foco visível, seleção e superfície de trajetória.
- **Azul-Golfinho:** recortes frios, detalhes de apoio e rótulos sobre fundos escuros.

### Tertiary

- **Bege-Rose:** folha de colagem, fechamento e acento suave do contato.
- **Verde-Claro:** superfície de trabalho alternativa.
- **Pérola:** neutralidade quente para trabalhos e áreas de apoio.

### Neutral

- **Linha de Tinta:** divisores discretos sobre papel; nunca substitui o contraste estrutural preto/branco.

### Named Rules

**The One Sheet Rule.** Cada seção longa escolhe uma superfície dominante; as cores não viram gradiente nem competem dentro do mesmo spread.

**The Casting Contrast Rule.** Créditos, navegação e contato sempre mantêm leitura imediata sobre o bloco cromático em que aparecem.

## Typography

**Display Font:** Road Rage (com Impact e sans-serif como fallback)  
**Body Font:** Archivo Variable (com Arial e sans-serif como fallback)

**Character:** Road Rage fornece a marca física de pincel e fotocópia; Archivo sustenta nomes, biografia, créditos e navegação com precisão editorial. A tensão entre as duas famílias é intencional e substitui ornamentos adicionais.

### Hierarchy

- **Display** (400, escala fluida de pôster, line-height 0.62): palavras-manifesto como PORTFOLIO, TRABALHOS e CONTATO.
- **Headline** (peso variável 610, escala fluida, line-height 0.78): grandes chamadas editoriais e identidade de seção.
- **Title** (itálico, peso variável 560, escala fluida, line-height 0.88): títulos das obras, limitados a cerca de 10 caracteres por linha visual.
- **Body** (400, 1rem, line-height 1.55): biografia em colunas de no máximo 61ch; textos auxiliares podem reduzir para 0.95–1rem.
- **Label** (peso variável 750, 0.9rem, tracking 0.08em, caixa alta): mídia, metadados, ações e navegação. Rótulos nunca descem abaixo de 0.84rem.

### Named Rules

**The Two Voices Rule.** Road Rage fala apenas em palavras-manifesto; toda informação factual permanece em Archivo.

**The Tight Poster Rule.** Títulos grandes usam entrelinha compacta e tracking negativo em Archivo, sem sacrificar créditos ou corpo de texto.

## Layout

O desktop usa divisões assimétricas de duas colunas: hero em 58/42, sobre em 46/54, trabalhos em 40/60 e trajetória em aproximadamente 42/58. O gutter é fluido e compartilhado por cabeçalho, spreads e rodapé. Trabalhos alternam texto e imagem para criar ritmo de páginas viradas; fotografias preenchem seus recortes com `object-fit: cover`.

Em até 1080px, as proporções são comprimidas sem perder a dupla coluna. Abaixo de 768px, todos os spreads se tornam páginas empilhadas, o menu ocupa a viewport inteira e o gutter passa a 18px. Em até 420px, colagens e mídias têm alturas menores. O sistema suporta largura mínima de 320px sem overflow horizontal; elementos decorativos nunca invadem texto.

O espaçamento privilegia poucos intervalos grandes: seções usam blocos verticais entre 70px e 150px, enquanto texto corrido mantém 16px entre parágrafos. O hero e as mídias usam unidades dinâmicas de viewport para preservar impacto em telas móveis.

## Print

O sistema tem uma camada A4 paisagem usada para gerar `public/portfolio-isabella-monteiro.pdf` com `npm run pdf`. A impressão reproduz a página como ela é: mesmos blocos cromáticos e cards em duas colunas com `print-color-adjust: exact`, mas cada obra vira uma tira com os dois stills empilhados, separados pela cor do papel do card (Papel de Cópia nas obras escuras). Cada seção começa em uma página nova, os cards nunca quebram no meio e o layout mobile é ignorado na impressão (`@media screen`) para o PDF sair no formato de desktop. Setas, contador e o próprio botão de PDF desaparecem.

## Elevation & Depth

O sistema é plano por padrão e não usa cartões elevados. Profundidade aparece por escala, sobreposição, rotação leve e contraste tonal. A única sombra ambiente recorrente pertence às molduras fotográficas do hero; no mobile ela reduz junto com a borda. Fotografias de bastidor podem receber borda de papel e rotação, mantendo a lógica de colagem física.

### Shadow Vocabulary

- **Deslocamento de Papel** (`12px 16px 0 rgba(23, 23, 23, 0.08)`): sombra dura e discreta das fotos sobrepostas do hero; reduz para `7px 9px 0` no mobile.

### Named Rules

**The Flat-by-Default Rule.** Nenhuma superfície de conteúdo recebe sombra, blur ou vidro; profundidade vem da montagem das folhas e fotografias.

## Shapes

Todas as superfícies, links e recortes usam cantos retos. Linhas de 1px organizam contato e bastidores; linhas de 2px enfatizam dados e ações. Molduras fotográficas de 8px usam a cor do papel e caem para 5px no mobile. Rotações entre aproximadamente 1.5° e 4° pertencem apenas a folhas e fotos sobrepostas, nunca a blocos de texto.

**The Square Cut Rule.** Não introduza pílulas, raios arredondados ou avatares circulares; a silhueta deve continuar parecendo papel cortado.

## Components

### Navigation

- **Desktop:** links Archivo em caixa alta, pequenos e espaçados, distribuídos pelo centro do cabeçalho transparente.
- **Hover:** sublinhado preto de 2px com afastamento de 6px.
- **Mobile:** overlay de Tinta Gráfica em tela cheia; links migram para Road Rage em escala de pôster e Papel de Cópia.
- **Focus:** outline Terracota de 3px com offset de 5px em toda interação.

### Hero Action

- **Shape:** link reto, sem preenchimento nem raio.
- **Treatment:** rótulo Archivo em caixa alta com uma borda inferior de 2px e ícone de seta.
- **Motion:** entrada com deslocamento vertical de 26px e fade em 720ms; respeita redução de movimento.

### Work Spreads

- **Corner Style:** completamente quadrado.
- **Background:** um papel cromático sólido por obra, alternando com a fotografia em cor.
- **Internal Padding:** fluido entre 50px e 110px no desktop; 70px/42px vertical no mobile.
- **Carousel:** cada obra tem um carrossel manual com trilho deslizante e avanço circular. Arraste com mouse ou toque (com resistência de 0.35 nas pontas), clique ou toque na foto para avançar, ou use as setas quadradas. O contador tabular `01/02` e as setas ficam em Papel de Cópia no canto inferior esquerdo; o contador dá um tick vertical a cada troca. Teclado: setas esquerda/direita com o foco nas setas. A troca anima em 420ms com a mesma curva editorial do sistema.
- **Cinematic Still:** obras de audiovisual preservam a proporção original do still (cerca de 2:1) em uma faixa centralizada na coluna, com fundo transparente; nunca cropar o enquadramento nem criar tarjas.

### Contact Links

- **Shape:** faixas retas com altura mínima de 120px, reduzida para 104px no mobile.
- **Treatment:** Papel de Cópia sobre Tinta Gráfica, ícone à esquerda e seta externa à direita; divisores translúcidos separam as faixas.
- **Hover / Focus:** texto muda para Bege-Rose no hover; o foco global permanece Terracota e o active desloca 1px.

### Photo Collage

- **Treatment:** imagens em cor com saturação natural e contraste moderado, recortadas sobre papéis sólidos.
- **Depth:** sobreposição, rotação e borda de Papel de Cópia; sombra apenas no hero.
- **Responsive:** bordas, sombras e alturas diminuem sem remover a leitura de colagem.

## Do's and Don'ts

### Do:

- **Do** deixe fotografias reais dominarem a área visual e mantenha textos sobre superfícies sólidas.
- **Do** use Road Rage em palavras curtas e monumentais, preservando Archivo para toda informação factual.
- **Do** alterne spreads e blocos cromáticos para sustentar o ritmo de zine.
- **Do** preserve contraste WCAG AA, foco visível e estados equivalentes para hover e teclado.
- **Do** teste cada composição até 320px e respeite `prefers-reduced-motion`.

### Don't:

- **Don't** introduza cartões arredondados, gradientes, glassmorphism ou sombras difusas de produto digital.
- **Don't** transforme a paleta em decoração multicolorida; use uma folha dominante por seção ou obra.
- **Don't** aplique Road Rage a biografias, créditos, números ou navegação desktop.
- **Don't** acrescente textura de ruído quando tipografia, fotografia e montagem já criam materialidade.
- **Don't** deixe colagens decorativas cobrirem texto ou gerar overflow em telas pequenas.
