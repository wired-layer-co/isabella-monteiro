# Isabella Monteiro | Portfólio de atriz

Portfólio de Isabella Monteiro para teatro e audiovisual. O site reúne trajetória, dados físicos, trabalhos selecionados, experiência de bastidores e contato profissional.

## Stack

- React 19 + Vite
- Poppins para textos, títulos e interface
- Biro Script Plus para os títulos de pincel
- Phosphor Icons

A fonte Biro Script Plus está em `public/fonts/biro-script-plus.woff2`; a Poppins é servida via `@fontsource/poppins`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Validação local:

```bash
npm run lint
npm run build
```

## PDF para download

O link "Baixar em PDF" no fim da página baixa `public/portfolio-isabella-monteiro.pdf`, gerado a partir da própria página com os estilos de impressão A4 de `src/styles.css`.

O PDF é atualizado automaticamente depois de cada build:

```bash
npm run build
```

O script `postbuild` executa `scripts/generate-pdf.mjs`. Para gerar manualmente:

```bash
npm run pdf
```

O gerador usa Chrome/Chromium (defina `CHROME_BIN` se necessário) e, quando disponível, otimiza o arquivo com Ghostscript. Se o navegador não estiver disponível, o PDF existente é preservado e o build continua.

## Conteúdo e imagens

O conteúdo factual vem do briefing da atriz. As fotografias foram extraídas do portfólio anterior e do pacote de imagens de 21/10/2026. A procedência está documentada em `public/images/SOURCES.md`.

## Deploy

Cada push na branch `main` executa lint e build e publica automaticamente no GitHub Pages.

Domínios de produção:

```text
https://isamonteiro.com.br
https://isamonteiro.com.br/socialmedia/
```

O arquivo `public/CNAME` mantém o domínio customizado associado ao projeto. Os registros DNS do domínio raiz e de `www` são gerenciados na Cloudflare. Durante o deploy, o workflow também baixa `wired-layer-co/isabella-comunicacao-bandas`, gera o build com `--base=/socialmedia/` e o incorpora em `dist/socialmedia` sem alterar o portfólio da raiz.
