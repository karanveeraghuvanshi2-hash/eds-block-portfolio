# Interview prep: questions a partner may ask

**What is a block in EDS?**
A folder in `/blocks` with a JS and CSS file. Authors add a table with the block's name; EDS outputs it as nested divs, and the block's `decorate()` function turns that into the final component.

**Why no React?**
EDS is designed for Lighthouse 100 scores. Plain JS with no framework and no build step means less JavaScript to download and parse, and blocks only load when they're on the page.

**How does EDS keep pages fast?**
It loads in three phases: eager (first section and LCP image), lazy (the rest of the blocks, header and footer) and delayed (analytics and third-party scripts, about 3 seconds later).

**How did you make the carousel accessible?**
I followed the WAI-ARIA APG carousel pattern: region and slide roles, `inert` on hidden slides, a live region announcing the current slide, keyboard support and reduced-motion support.

**Why `<details>` for the accordion?**
Native elements give keyboard and screen-reader support for free, with less code and nothing to break.

**What is roving tabindex?**
Only the active tab is in the Tab order; arrow keys move between tabs. It's the pattern the WAI-ARIA tabs spec recommends.

**How does an author use a variant?**
They write `Accordion (single)` in the table header. EDS adds `single` as a class on the block, and the JS checks for it.

**How do you protect LCP in a carousel?**
Only the first slide's image is eager-loaded; the others are lazy-loaded, and all use responsive optimized pictures.

**How do you work with AI tools?**
I use Claude Code with Adobe's published EDS skills to scaffold blocks fast, then I review every line, lint it and test it in the browser.
