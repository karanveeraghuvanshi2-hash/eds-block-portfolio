# EDS Block Portfolio

Accessible, performance-first blocks for **Adobe Experience Manager Edge Delivery Services**, built on Adobe's [aem-boilerplate](https://github.com/adobe/aem-boilerplate).

**Live demo:** `https://main--eds-block-portfolio--karanveeraghuvanshi2-hash.aem.page/demo` *(goes live once the demo page is published)*

| Block | What it does | Accessibility |
|---|---|---|
| `carousel` | Image + text slides with buttons, dots, arrow keys and swipe | WAI-ARIA carousel pattern, live status for screen readers, inactive slides are `inert`, respects reduced motion |
| `tabs` | Tabbed content panels | WAI-ARIA tabs pattern, roving tabindex, Left/Right/Home/End keys |
| `accordion` | Expand/collapse FAQ items; `single` variant keeps one open | Native `<details>`/`<summary>`, works without JavaScript state |

All blocks pass the boilerplate's ESLint (airbnb) and Stylelint rules, use only the existing design tokens, and add no dependencies.

## Authoring

Each block is a table in the document. First row is the block name; each following row is one item.

**Carousel** — column 1: image, column 2: heading + text

| Carousel | |
|---|---|
| *image* | **Slide title** Slide text |

**Tabs** — column 1: tab label, column 2: panel content

| Tabs | |
|---|---|
| Overview | Panel content |

**Accordion** — column 1: question, column 2: answer. Use `Accordion (single)` to keep only one item open.

| Accordion (single) | |
|---|---|
| Question? | Answer. |

## Run locally

```sh
npm install -g @adobe/aem-cli
npm ci
aem up --html-folder drafts
```

Open `http://localhost:3000/drafts/demo` to see all three blocks without any CMS content.

## Documentation

- [How the blocks work](docs/how-the-blocks-work.md)
- [Interview prep](docs/interview-prep.md)

## Lint

```sh
npm run lint
```
