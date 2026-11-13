// The original charts and ERD are loaded from files already in the repository root.
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
function activateTab(tab, moveFocus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  panels.forEach(panel => {
    const active = panel.id === `panel-${tab.dataset.target}`;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  if (moveFocus) tab.focus();
}
tabs.forEach((tab,index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next = index;
    if(event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if(event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if(event.key === 'Home') next = 0;
    else if(event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault(); activateTab(tabs[next], true);
  });
});
document.querySelectorAll('img[data-fallback]').forEach(img => img.addEventListener('error', () => {
  if(img.dataset.failed) return;
  img.dataset.failed = 'true';
  const block = document.createElement('div');
  block.className = 'image-missing';
  block.textContent = `${img.dataset.fallback} is unavailable. Copy the original .jpg file to the same folder as index.html.`;
  img.replaceWith(block);
}));
document.querySelector('#year').textContent = new Date().getFullYear();
