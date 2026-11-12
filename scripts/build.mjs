// Generates css/tokens.css, css/fonts.css and index.js from tokens.json.
// Run `npm run build` after editing tokens.json and commit the results.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const tokens = JSON.parse(readFileSync(new URL('tokens.json', root), 'utf8'))
const header = '/* Generated from tokens.json by scripts/build.mjs. Do not edit by hand. */\n'

// Lightness steps of each ramp, derived from the brand color with oklch().
const ramps = {
  primary: { 100: '90%', 200: '80%', 300: '70%', 400: '60%', 500: '50%', 800: '30%' },
  secondary: { 100: '90%', 200: '80%', 300: '70%', 400: '60%', 500: '50%', 800: '30%' },
  outline: { 50: '90%', 100: '80%', 200: '50%', 300: '70%', 800: '30%' },
  neutral: { 150: '98%', 200: '95%', 300: '90%', 400: '85%', 500: '80%', 600: '60%', 700: '40%', 800: '30%', 850: '20%', 900: '15%' },
}

const lines = []
for (const [name, value] of Object.entries(tokens.color)) lines.push(`  --brand-${name}: ${value};`)
lines.push('')
for (const [name, steps] of Object.entries(ramps)) {
  if (name === 'neutral') lines.push('  --color-neutral-100: oklch(from var(--brand-neutral) 100% 0 0);')
  for (const [step, lightness] of Object.entries(steps)) {
    lines.push(`  --color-${name}-${step}: oklch(from var(--brand-${name}) ${lightness} c h);`)
  }
  lines.push('')
}
for (const [name, value] of Object.entries(tokens.font.family)) lines.push(`  --font-family-${name}: ${value};`)

writeFileSync(new URL('css/tokens.css', root), `${header}:root,\n::backdrop {\n${lines.join('\n')}\n}\n`)

const faces = tokens.font.faces.map((face) => {
  if (!existsSync(new URL(`fonts/${face.file}`, root))) throw new Error(`Missing font file: fonts/${face.file}`)
  return [
    '@font-face {',
    `  font-family: '${face.family}';`,
    `  font-style: ${face.style};`,
    `  font-weight: ${face.weight};`,
    '  font-display: swap;',
    `  src: url('../fonts/${face.file}') format('woff2');`,
    '}',
  ].join('\n')
})
writeFileSync(new URL('css/fonts.css', root), `${header}${faces.join('\n\n')}\n`)

const js = {
  colors: tokens.color,
  fonts: tokens.font.family,
}
writeFileSync(
  new URL('index.js', root),
  `${header}${Object.entries(js)
    .map(([name, value]) => `export const ${name} = ${JSON.stringify(value, null, 2)}\n`)
    .join('\n')}\nexport default { ${Object.keys(js).join(', ')} }\n`,
)

console.log(`Built css/tokens.css, css/fonts.css and index.js in ${fileURLToPath(root)}`)
