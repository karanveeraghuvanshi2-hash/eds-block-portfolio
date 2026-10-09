# How the blocks work

## How Edge Delivery Services renders a block

1. An author writes a page in a document (da.live, Google Docs or SharePoint) and adds a **table** whose first row is the block name, e.g. `Carousel`.
2. EDS converts that table into plain HTML: one `<div class="carousel">`, with one child `<div>` per row and one grandchild `<div>` per column.
3. `scripts/aem.js` finds every block on the page, then loads `blocks/<name>/<name>.css` and `blocks/<name>/<name>.js`.
4. It calls the block's default export, `decorate(block)`, with that `<div>`. The block rewrites its own DOM into the final component.

So every block here is just: **read rows → build accessible markup → attach behaviour.** No framework, no build step, no dependencies.

## Carousel (`blocks/carousel/carousel.js`)

- **Input:** one row per slide; column 1 image, column 2 text.
- **Output:** a `<ul>` track of `<li>` slides inside a viewport with `overflow: hidden`. Moving between slides sets `transform: translateX(-N * 100%)` on the track.
- **Images:** `createOptimizedPicture` (from `aem.js`) creates responsive WebP sources. Only the first slide's image is eager-loaded; the rest are lazy, which protects LCP.
- **Accessibility:**
  - The block is a `region` with `aria-roledescription="carousel"`; each slide is a `group` with `aria-roledescription="slide"` and a "1 of 3" label (WAI-ARIA APG carousel pattern).
  - Hidden slides get `aria-hidden="true"` and `inert`, so keyboard and screen-reader users can't reach off-screen links.
  - A visually hidden `aria-live="polite"` element announces "Slide 2 of 3" on change.
  - Arrow keys work inside the block; buttons are 44 px touch targets with visible focus.
  - `prefers-reduced-motion` disables the slide animation.
- **Touch:** a swipe over 50 px moves one slide.
- **State:** the active index is stored in `block.dataset.active`; `showSlide()` wraps around with modulo.

## Tabs (`blocks/tabs/tabs.js`)

- **Input:** one row per tab; column 1 label, column 2 content.
- **Output:** a `tablist` of `<button role="tab">` plus one `role="tabpanel"` per tab, linked with `aria-controls` / `aria-labelledby`.
- **Roving tabindex:** only the selected tab has `tabIndex = 0`, so Tab moves into the tab list once and then into the panel. Left/Right arrows, Home and End move between tabs (WAI-ARIA APG tabs pattern, automatic activation).
- **Panels:** inactive panels use the `hidden` attribute, so they are removed from the accessibility tree.
- **Unique IDs:** a module-level counter gives each tabs block unique IDs when several are on one page.

## Accordion (`blocks/accordion/accordion.js`)

- **Input:** one row per item; column 1 question, column 2 answer.
- **Output:** native `<details>` / `<summary>` elements. The browser provides keyboard support, expanded/collapsed state and screen-reader semantics for free, with no ARIA needed.
- **`single` variant:** authors write `Accordion (single)`. EDS adds the class `single`; a `toggle` listener closes the other items when one opens.
- **Styling:** the default disclosure marker is hidden and replaced with a CSS chevron that rotates on `[open]`.

## Quality checks

- `npm run lint` runs ESLint (airbnb-base) and Stylelint; all blocks pass.
- Local test page: `drafts/demo.html` (run `aem up --html-folder drafts`).
- Verified in headless Chromium: slide navigation by button and keyboard, tab arrow-key selection with exactly one visible panel, single-open accordion, zero JavaScript errors.
