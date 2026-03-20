# Neon Ceefax

A retro-futuristic terminal interface for the Mothership TTRPG "Open Bulwark" campaign. Built with React 19 + Vite. Each page is designed to feel like its own corner of a fictional internet, with unique visual identity and self-contained styling.

## Quick start

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
npm run deploy    # deploy to GitHub Pages
```

## Project structure

```
src/
├── App.jsx                 # Shell: header + page renderer
├── App.css                 # Global CRT/scanline/flicker styles
├── components/
│   ├── Block.jsx           # Shared block renderer (h1, p, callout, menu, links, etc.)
│   ├── Header.jsx          # Navigation input bar (6-digit page codes)
│   ├── LoadingButton.jsx   # Animated progress button
│   └── ScrollingLog.jsx    # Looping terminal log display
└── pages/
    ├── registry.js         # Master registry — merges all page registries
    ├── basic/              # "Prospero Station" bulletin-board style
    ├── voyage/             # Green-terminal Cosmic Voyage narrative
    ├── neoncn/             # Neon-pink weapons catalogue
    ├── thread/             # Embroidery archive gallery
    ├── system/             # Interactive planet browser
    ├── landing/            # Boot sequence intro
    ├── help/               # Help page
    └── notfound/           # 404 page
```

Each page folder is self-contained:

```
src/pages/mypage/
├── MyPage.jsx      # React component
├── mypage.css      # Scoped styles (optional)
├── pages.js        # Content data (optional)
└── registry.js     # Page code → component mapping
```

## How navigation works

Pages are addressed by string codes like `"100000.000"`, `"voyage.000"`, or `"system.aegir"`. The Header component accepts typed input and appends `.000` to form the full code. Any component can navigate by calling `setPageCode("target.code")`.

The master registry in `src/pages/registry.js` maps every page code to a `{ Component, content }` pair. Unrecognised codes fall back to the NotFound page (`"000000.000"`).

## Creating a new page

### 1. Create the page folder

```
mkdir src/pages/bazaar
```

### 2. Write the component

Create `src/pages/bazaar/BazaarPage.jsx`:

```jsx
import Block from "../../components/Block";
import "./bazaar.css";

function BazaarPage({ pageCode, setPageCode, content }) {
  const blocks = content?.blocks ?? [];

  return (
    <div className="bazaar">
      {blocks.map((b, i) => (
        <Block key={i} block={b} setPageCode={setPageCode} />
      ))}
    </div>
  );
}

export default BazaarPage;
```

Every page component receives three props:
- `pageCode` — the current page code string
- `setPageCode` — call this to navigate (`setPageCode("voyage.000")`)
- `content` — the content object from the registry entry (or `null`)

### 3. Add scoped CSS

Create `src/pages/bazaar/bazaar.css`. **Always scope rules under your root class** to prevent bleed:

```css
.bazaar {
  --bazaar-accent: rgb(255, 180, 0);
  background: #1a0f00;
  color: var(--bazaar-accent);
  padding: 20px;
}

/* Scope all Block class overrides under .bazaar */
.bazaar .r-h1    { color: var(--bazaar-accent); }
.bazaar .r-link  { color: var(--bazaar-accent); text-decoration: none; }
.bazaar .r-link:hover { text-decoration: underline; }
.bazaar .r-callout {
  border: 1px solid var(--bazaar-accent);
  padding: 10px;
}
```

See [CSS scoping rules](#css-scoping) below for the full list of Block class names.

### 4. Add content data (optional)

Create `src/pages/bazaar/pages.js`:

```js
const landing = {
  blocks: [
    { type: "h1", text: "Welcome to the Bazaar" },
    { type: "p", text: "Trade goods from across the system." },
    {
      type: "links",
      items: [
        { label: "Back to System Map", to: "system.000" },
      ],
    },
  ],
};

export default { landing };
```

### 5. Create the registry

Create `src/pages/bazaar/registry.js`:

```js
import BazaarPage from "./BazaarPage";
import pages from "./pages";

export default {
  "bazaar.000": { Component: BazaarPage, content: pages.landing },
};
```

A single page folder can register multiple page codes, each pointing to the same component with different content:

```js
export default {
  "bazaar.000": { Component: BazaarPage, content: pages.landing },
  "bazaar.001": { Component: BazaarPage, content: pages.weapons },
  "bazaar.002": { Component: BazaarPage, content: pages.supplies },
};
```

### 6. Register in the master registry

Add two lines to `src/pages/registry.js`:

```js
import bazaar from "./bazaar/registry";

const registry = {
  ...landing,
  ...basic,
  // ...existing spreads...
  ...bazaar,   // ← add this
};
```

That's it. No changes to `App.jsx` needed.

## CSS scoping

Each page should wrap its content in a single root element with a unique class name (`"bazaar"`, `"voyage"`, `"neoncn"`, etc.). All CSS selectors in that page's stylesheet must be scoped under this class.

### Block class names

The shared `Block` component (`src/components/Block.jsx`) outputs these class names. Override them per-page by scoping under your root class:

| Block type  | Class names                                             |
|-------------|---------------------------------------------------------|
| `h1`        | `.r-h1`                                                 |
| `h2`        | `.r-h2`                                                 |
| `p`         | `.r-p`                                                  |
| `image`     | (bare `<img>`)                                          |
| `pre`       | (bare `<pre>`)                                          |
| `callout`   | `.r-callout`, `.r-callout__label`, `.r-callout__text`   |
| `links`     | `.r-links` (ul), `.r-link` (a)                          |
| `menu`      | `.menu` (ul), `.menu-item` (li), `.menu-item-body`, `.menu-item-title`, `.menu-item-description`, `.menu-item-cost` |
| `feed`      | Uses `block.className` as the container class           |

Example — making links amber in a bazaar theme:

```css
.bazaar .r-link       { color: rgb(255, 180, 0); }
.bazaar .r-link:hover { color: #fff; }
```

### Pages that don't use Block

Pages like Thread and SystemPage have their own rendering and don't use Block at all. This is fine — Block is opt-in. If your page has a unique layout (gallery, interactive map, etc.), just build your own JSX and scope the CSS the same way.

## Content data format

Content objects follow this shape:

```js
{
  title: "Page Title",        // optional, used by some page components
  updated: "2001-09-17",      // optional
  blocks: [
    { type: "h1", text: "Heading" },
    { type: "h2", text: "Subheading" },
    { type: "p", text: "Paragraph text." },
    { type: "pre", text: "Preformatted text" },
    { type: "image", filename: "./images/photo.png", alt: "Description" },
    { type: "callout", label: "ALERT", text: "Important message." },
    { type: "links", items: [
      { label: "Go somewhere", to: "pagecode.000" },
    ]},
    { type: "menu", items: [
      { filename: "./img.png", title: "Item", description: "Desc", cost: "100cr" },
    ]},
    { type: "feed", className: "my-feed", items: [
      // nested blocks
    ]},
  ],
}
```

## Deployment

The site deploys to GitHub Pages via the GitHub Actions workflow at `.github/workflows/deploy.yml`. It builds the Vite app and publishes the `dist/` directory to Pages. You can also deploy manually:

```bash
npm run deploy
```

> Important: do not publish the repository root directly to Pages. Pages must serve the built `dist/` output.
