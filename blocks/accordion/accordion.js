/**
 * Accordion block. Authoring: one row per item; column 1 = question/summary,
 * column 2 = answer/body. Uses native <details>/<summary> so it works
 * without JS state and is accessible by default.
 * Add the "single" variant, i.e. Accordion (single), to keep one item open at a time.
 */
export default function decorate(block) {
  const single = block.classList.contains('single');
  const items = [...block.children].map((row) => {
    const [summaryCol, bodyCol] = row.children;
    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    if (summaryCol) summary.append(...summaryCol.childNodes);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (bodyCol) body.append(...bodyCol.childNodes);

    details.append(summary, body);
    return details;
  });

  if (single) {
    items.forEach((item) => item.addEventListener('toggle', () => {
      if (!item.open) return;
      items.filter((other) => other !== item).forEach((other) => { other.open = false; });
    }));
  }

  block.replaceChildren(...items);
}
