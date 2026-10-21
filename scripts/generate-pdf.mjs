import { spawn } from 'node:child_process'
import { copyFileSync, createReadStream, existsSync, renameSync, rmSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

function run(command, args) {
  return new Promise((resolveCode) => {
    const child = spawn(command, args, { stdio: ['ignore', 'ignore', 'ignore'] })
    child.on('error', () => resolveCode(-1))
    child.on('close', resolveCode)
  })
}

const root = resolve(fileURLToPath(new URL('.', import.meta.url)), '..')
const dist = join(root, 'dist')
const output = join(root, 'public', 'portfolio-isabella-monteiro.pdf')

const chromeCandidates = [
  process.env.CHROME_BIN,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
].filter(Boolean)

const chrome = chromeCandidates.find((candidate) => existsSync(candidate)) ?? 'chromium'

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

if (!existsSync(dist)) {
  console.error('dist/ não encontrado. Rode "npm run build" antes de gerar o PDF.')
  process.exit(1)
}

const server = createServer((request, response) => {
  const { pathname } = new URL(request.url, 'http://localhost')
  let file = join(dist, decodeURIComponent(pathname))
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')

  if (!existsSync(file)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  response.writeHead(200, {
    'content-type': contentTypes[extname(file)] ?? 'application/octet-stream',
  })
  createReadStream(file).pipe(response)
})

const port = await new Promise((resolvePort) => {
  server.listen(0, '127.0.0.1', () => resolvePort(server.address().port))
})

const url = `http://127.0.0.1:${port}/`

const args = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--run-all-compositor-stages-before-draw',
  '--virtual-time-budget=20000',
  '--no-pdf-header-footer',
  `--print-to-pdf=${output}`,
  url,
]

const rawCode = await run(chrome, args)

server.close()

if (rawCode !== 0 || !existsSync(output)) {
  console.error(`Falha ao gerar o PDF com ${chrome}.`)
  process.exit(1)
}

const rawSize = statSync(output).size

const optimized = await run('gs', [
  '-q',
  '-dNOPAUSE',
  '-dBATCH',
  '-sDEVICE=pdfwrite',
  '-dCompatibilityLevel=1.5',
  '-dPDFSETTINGS=/printer',
  '-dDetectDuplicateImages=true',
  '-dAutoRotatePages=/None',
  '-dEmbedAllFonts=true',
  '-dSubsetFonts=true',
  '-dDownsampleColorImages=true',
  '-dColorImageResolution=170',
  '-dColorImageDownsampleType=/Bicubic',
  '-dDownsampleGrayImages=true',
  '-dGrayImageResolution=170',
  '-dGrayImageDownsampleType=/Bicubic',
  '-dDownsampleMonoImages=true',
  '-dMonoImageResolution=300',
  `-sOutputFile=${output}.tmp`,
  output,
])

let optimizedNote = ''

if (existsSync(`${output}.tmp`)) {
  const tmpSize = statSync(`${output}.tmp`).size
  if (optimized === 0 && tmpSize > 0 && tmpSize < rawSize) {
    renameSync(`${output}.tmp`, output)
    optimizedNote = ' · otimizado'
  } else {
    rmSync(`${output}.tmp`)
  }
}

const distCopy = join(dist, 'portfolio-isabella-monteiro.pdf')
if (existsSync(dist)) copyFileSync(output, distCopy)

const { size } = statSync(output)
console.log(`PDF gerado: ${output} (${(size / 1024 / 1024).toFixed(2)} MB${optimizedNote})`)
