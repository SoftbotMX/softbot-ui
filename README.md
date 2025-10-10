# @softbot/softbot-ui

Modern, accessible React UI components styled with Tailwind and DaisyUI‑inspired tokens.  
Shipped as ESM + CJS with type definitions and a production CSS bundle.

- ⚛️ **React 18/19** compatible
- 🎯 **Tree‑shakable** components
- 🧩 **Composable API** (props over children where it improves DX)
- 🧪 **Storybook** included
- 🗂️ **TypeScript** first

---

## Installation

### 1) Add the package from **GitHub Packages**

> The library is published to GitHub Packages under the `@softbot` scope.

#### Yarn (Berry, v2+)

1) In your **admin** app, configure auth in `.yarnrc.yml`:

```yml
npmScopes:
  softbot:
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true

npmRegistries:
  "https://npm.pkg.github.com":
    npmAuthToken: "${GITHUB_TOKEN}" # or a PAT with read:packages
```

2) Install:

```bash
yarn add @softbot/softbot-ui
```

> Prefer installing the scoped name.  
> If you really want to install as `softbot-ui`, add an alias in your admin’s `package.json`:
>
> ```json
> {
>   "dependencies": {
>     "softbot-ui": "npm:@softbot/softbot-ui@^1.0.0"
>   }
> }
> ```

#### npm

Create/append a project-level `.npmrc`:

```
@softbot:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then:

```bash
npm i @softbot/softbot-ui
```

### 2) Peer dependencies

Add React (18 or 19):

```bash
yarn add react react-dom
```

### 3) Styles

Import the compiled CSS once in your app entry:

```ts
// e.g., src/main.tsx or src/index.tsx
import '@softbot/softbot-ui/styles.css';
```

If you already have Tailwind set up, you can still import this CSS — it scopes its classes to component blocks and uses CSS variables for theming.

---

## Quick start

```tsx
import * as React from 'react';
import { Button, Input, Modal } from '@softbot/softbot-ui';
import '@softbot/softbot-ui/styles.css';

export default function Demo() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Softbot UI</h1>

      <div className="flex items-center gap-3">
        <Input placeholder="Email" tone="primary" />
        <Button onClick={() => setOpen(true)}>Open modal</Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Hello!">
        This is a modal body.
      </Modal>
    </div>
  );
}
```

---

## Components

> The library mirrors DaisyUI component behavior with a typed, React‑friendly API. Most components accept `size`, `tone`, and `className`.

- **Actions & Inputs**
  - `Button`
  - `Input`
  - `Textarea`
  - `Select` *(single select)*
  - `Checkbox`
  - `Radio`
  - `Range` (slider)
  - `Toggle`
  - `FileInput`
  - `Validator` (valid/invalid visual state helper)
- **Data display**
  - `Table`
  - `List`
  - `Stat` / `Stats`
  - `Progress`
  - `RadialProgress`
  - `Status`
  - `Skeleton`
  - `Loading` (spinner, dots, ring, bars, ball, infinity)
  - `Mask` (shapes: circle, hexagon, star, etc.)
- **Navigation & Structure**
  - `Navbar`
  - `Tabs`
  - `Menu` (nested)
  - `Pagination`
  - `Breadcrumb` *(if present in your repo)*
- **Overlays & Feedback**
  - `Modal`
  - `Dropdown`
  - `Tooltip`
  - `Toast`
- **Layout & Utility**
  - `Divider`
  - `Stack`
  - `Indicator`
  - `Fieldset`
  - `Label` (+ floating label)
- **Special**
  - `Countdown` (date & duration)
  - `Diff` (before/after comparison)
  - `Fab` (floating action button; uses `Button` internally)
  - `Filter` (radio/checkbox group with reset)
  - `Kbd` (keyboard key)
  - `Steps`
  - `Swap` (toggle between 2 visual states)
  - `Timeline`

> Names can vary slightly depending on your final export surface (index). Check `dist/index.d.ts` for the authoritative list.

---

## Usage snippets

### Button

```tsx
<Button size="md" tone="primary" iconLeft="plus">
  Create
</Button>
```

### Select (single)

```tsx
<Select
  tone="neutral"
  options={[
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ]}
/>
```

### Toggle with icons

```tsx
<Toggle
  aria-label="notifications"
  iconOnAriaLabel="enabled"
  iconOffAriaLabel="disabled"
  iconOn={<CheckIcon />}   // any ReactNode
  iconOff={<CrossIcon />}
/>
```

### Tooltip

```tsx
<Tooltip content="Copy to clipboard" placement="top">
  <Button size="sm" tone="secondary">Copy</Button>
</Tooltip>
```

### Countdown

```tsx
{/* 5 minutes */}
<Countdown minutes={5} />

{/* Target date */}
<Countdown target={new Date(Date.now() + 1000 * 60 * 90)} showDays />
```

---

## Theming

The CSS uses custom properties (e.g. `--color-primary`, `--radius-field`, `--border`, etc.).  
You can override them at `:root` or per container:

```css
:root {
  --color-primary: oklch(63% 0.2 240);
  --radius-field: 0.75rem;
  --border: 1px;
}
```

---

## Storybook

Run locally:

```bash
yarn dev:storybook
```

Build static bundle:

```bash
yarn build:storybook
```

Chromatic or Playwright can be added for visual/E2E testing (optional).

---

## Build & Types

- `dist/index.mjs` (ESM)  
- `dist/index.cjs` (CJS)  
- `dist/index.d.ts` (types)  
- `dist/styles.css` (compiled CSS)

Tree‑shaking works when you import named exports. Types are generated via `vite-plugin-dts`.

Build locally:

```bash
yarn build
```

---

## Releasing (GitHub Packages)

This repo ships via GitHub Actions when you push a semver tag:

```bash
# bump, tag, and push
npm version 1.0.1
git push --follow-tags
```

The workflow:
- installs deps
- builds (`vite` + PostCSS)
- verifies `package.json` version matches tag
- publishes to `npm.pkg.github.com/@softbot/softbot-ui`

> Tip: If you use a self‑hosted runner, ensure its labels match the workflow (`[self-hosted, office]`) or switch to `ubuntu-latest`.

---

## Using in your Admin project

**Preferred:**

```bash
yarn add @softbot/softbot-ui
```

Or alias as **softbot-ui**:

```json
{
  "dependencies": {
    "softbot-ui": "npm:@softbot/softbot-ui@^1.0.0"
  }
}
```

Then import once:

```ts
import '@softbot/softbot-ui/styles.css';
```

---

## Troubleshooting

- **401 on install** – Ensure your token has `read:packages` and your registry config matches the `@softbot` scope.
- **Styles not applied** – Verify `import '@softbot/softbot-ui/styles.css'` is in your app entry and not tree‑shaken away.
- **Class conflicts** – If you use Tailwind, make sure it doesn’t purge `softbot-ui` classes. Tailwind v4 is fine; for v3, safelist if needed.

---

## Contributing

- Run `yarn dev` to develop components.
- Run `yarn dev:storybook` to iterate with stories.
- Ensure `yarn typecheck` and linters pass before opening a PR.

---

## License

MIT © Softbot
