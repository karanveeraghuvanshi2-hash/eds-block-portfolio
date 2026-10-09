let tabsId = 0;

function select(tabs, panels, index, focus = false) {
  tabs.forEach((tab, i) => {
    const active = i === index;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    panels[i].hidden = !active;
  });
  if (focus) tabs[index].focus();
}

/**
 * Tabs block. Authoring: one row per tab; column 1 = tab label, column 2 = panel content.
 * Implements the WAI-ARIA tabs pattern with roving tabindex and arrow/Home/End keys.
 */
export default function decorate(block) {
  tabsId += 1;
  const rows = [...block.children];
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const tabs = [];
  const panels = [];

  rows.forEach((row, i) => {
    const [labelCol, contentCol] = row.children;
    const id = `tabs-${tabsId}-${i}`;

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-tab';
    tab.id = `${id}-tab`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${id}-panel`);
    tab.textContent = labelCol ? labelCol.textContent.trim() : `Tab ${i + 1}`;

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.id = `${id}-panel`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    if (contentCol) panel.append(...contentCol.childNodes);

    tab.addEventListener('click', () => select(tabs, panels, i));
    tabs.push(tab);
    panels.push(panel);
    tablist.append(tab);
  });

  tablist.addEventListener('keydown', (e) => {
    const current = tabs.indexOf(document.activeElement);
    if (current < 0) return;
    const keys = {
      ArrowRight: (current + 1) % tabs.length,
      ArrowLeft: (current - 1 + tabs.length) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    };
    if (e.key in keys) {
      e.preventDefault();
      select(tabs, panels, keys[e.key], true);
    }
  });

  block.replaceChildren(tablist, ...panels);
  if (tabs.length) select(tabs, panels, 0);
}
