# style-guide

Shared colors and fonts for the KozhaAkhmet personal website and the docs sites.

## What is in here

| Path | Purpose |
|---|---|
| `tokens.json` | The source of truth. Edit this file only. |
| `css/tokens.css` | Generated. `--brand-*` colors, the `--color-*` ramps derived from them, and `--font-family-*`. |
| `css/fonts.css` | Generated. `@font-face` rules for the files in `fonts/`. |
| `css/starlight.css` | Hand-written. Maps the tokens onto Starlight's `--sl-*` variables. |
| `index.js`, `index.d.ts` | Generated. The colors and font families as JavaScript, for config files. |
| `fonts/` | Atkinson Hyperlegible Next (SIL Open Font License, see `fonts/OFL.txt`). |

## Changing the style

1. Edit `tokens.json`. Fonts: `font.family.default` and `special` are for the personal website; `font.family.docs` is the font of the Starlight docs sites (`--sl-font`). A new font family also needs its files in `fonts/` and entries in `font.faces`.
2. Run `npm run build` and commit the generated files.
3. Push to `main`.

Sites load these files in the browser from the `main` branch, so a push reaches every site without rebuilding it. jsDelivr caches a branch for up to 12 hours; to update sooner, open `https://purge.jsdelivr.net/gh/KozhaAkhmet/style-guide@main/css/tokens.css` (and the same for the other files).

## Using it in a site

Add the links inside `<body>`, before the content. They must come after the site's own stylesheets so that their values win:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/KozhaAkhmet/style-guide@main/css/fonts.css" media="print" onload="this.media='all'" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/KozhaAkhmet/style-guide@main/css/tokens.css" media="print" onload="this.media='all'" />
```

A Starlight docs site also adds `css/starlight.css` the same way.

`media="print" onload="this.media='all'"` loads the file without blocking the page. Each site keeps its own default colors and fonts in its CSS. They show until these files arrive, and stay if the style guide cannot be reached, so keep them equal to the values here.

To freeze a site on one version, replace `@main` with a tag such as `@v1.0.0`.

The repo is also an npm package (`npm install github:KozhaAkhmet/style-guide`) for build-time use: `import { colors, fonts } from '@kozhaakhmet/style-guide'`.
