---
name: Isabella Monteiro — Portfólio de Atriz
description: Um portfólio editorial de página longa, montado como um cartaz de cena: tipografia de pincel, blocos de cor e fotografia real em escala.
colors:
  paper: "#fbfbf8"
  ink: "#000000"
  terracotta: "#a26a42"
  olive: "#6c6a51"
  olive-panel: "#79775a"
  butter: "#f9e8ac"
typography:
  display:
    fontFamily: "Biro Script Plus, cursive"
    fontWeight: 400
    lineHeight: 0.74
  headline:
    fontFamily: "Poppins, Arial, sans-serif"
    fontWeight: 400
    fontStyle: italic
  body:
    fontFamily: "Poppins, Arial, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Poppins, Arial, sans-serif"
    fontWeight: 700
    letterSpacing: "0.08em"
    textTransform: uppercase
rounded:
  none: "0"
spacing:
  edge-gutter: "clamp(18px, 4vw, 60px)"
  content-gutter: "clamp(22px, 8vw, 120px)"
  header: "100px"
  header-mobile: "78px"
components:
  section-audiovisual:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.paper}"
  section-teatro:
    backgroundColor: "{colors.olive}"
    textColor: "{colors.paper}"
  section-contact:
    backgroundColor: "{colors.terracotta}"
    textColor: "{colors.paper}"
  footer:
    backgroundColor: "{colors.butter}"
    textColor: "{colors.ink}"
---

# Design System: Isabella Monteiro — Portfólio de Atriz

## Overview

O site segue o desenho feito pela cliente no Canva: uma página longa, editorial e mobile-first, com fotografia em grande escala, blocos de cor chapada e títulos de pincel. O layout ocupa a largura da tela no desktop; não é uma coluna centralizada com bordas brancas.

**Características principais:**

- Papel `#FBFBF8`, tinta preta e blocos de terracota `#A26A42` e oliva `#6C6A51`.
- Títulos de pincel em **Biro Script Plus**; todo o restante em **Poppins**.
- Fotos reais em recortes cheios, sem molduras decorativas.
- Hierarquia por escala, cor e espaço; sem sombras, gradientes ou cartões de SaaS.
- Bots “Audiovisual” e “Teatro” são os recortes originais do Canvas (imagem), preservando o rabisco.
- Carrossel de trabalhos com a imagem inteira (contain) sobre fundo preto; nada é cortado.
- PDF A4 gerado automaticamente a partir do build (`postbuild`).

## Cores

- **Papel:** fundo principal, hero, sobre e Fora de Cena.
- **Tinta:** texto, header, painel de contato e fundo das imagens.
- **Terracota:** seção Audiovisual e Contato.
- **Oliva:** seção Teatro.
- **Oliva-painel:** painel de bastidores.
- **Manteiga:** rodapé.

## Tipografia

- **Biro Script Plus:** apenas títulos de pincel (`PORTFOLIO`, `TRABALHOS`, `AUDIOVISUAL`, `TEATRO`, `FORA DE CENA`, `CONTATO`, `ATRIZ`).
- **Poppins:** nome, sobre, títulos de projeto, créditos, contato e interface. Itálico nos títulos e no nome do header/footer.
- Títulos de projeto grandes usam itálico, entrelinha curta e tracking negativo.

## Layout

- Header fixo, limpo, com marca e menu hambúrguer.
- Hero: etiqueta, nome, brush, três retratos, retrato verde em largura total com overlay “ATRIZ”.
- Sobre: texto à esquerda, retrato terracota à direita, dados físicos em quatro colunas.
- Trabalhos: título de pincel, dois recortes de botão do Canvas, filmstrip de retratos.
- Categorias: fundo cheio, título de pincel, projetos com título/ano/créditos/descrição e carrossel.
- Fora de Cena: título de pincel, intro, painel verde com lista e foto de cortina vermelha.
- Contato: fundo terracota e painel preto com WhatsApp, Instagram e PDF.
- Rodapé manteiga com marca, ano e crédito.

## Regras

- Não cortar as fotos do carrossel; usar `object-fit: contain` e fundo preto.
- Não inventar créditos, anos, depoimentos ou métricas.
- Não usar bordas arredondadas, sombras ou gradientes decorativos.
- Respeitar `prefers-reduced-motion`, foco visível e navegação por teclado.
- Preservar a geração automática do PDF no `postbuild`.
