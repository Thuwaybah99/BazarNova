// Updated Tableau embeds load from Tableau Public; product and ERD images use repository raw URLs.
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
  loadTableau(document.querySelector(`#panel-${tab.dataset.target}`));
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

// Load the selected Tableau sheet only when its tab is visible.
function loadTableau(panel) {
  const shell = panel && panel.querySelector('.tableau-shell');
  if (!shell || shell.dataset.loaded) return;
  const view = shell.dataset.tableau;
  const url = view.startsWith('BazarNova_Project/')
    ? 'https://public.tableau.com/views/' + view + '?:showVizHome=no&:embed=true&:toolbar=no&:tabs=no'
    : 'https://public.tableau.com/shared/' + view + '?:showVizHome=no&:embed=true&:toolbar=no';
  const frame = document.createElement('iframe');
  frame.title = shell.dataset.label + ' Tableau visualization';
  frame.src = url; frame.loading = 'lazy'; frame.allowFullscreen = true;
  frame.addEventListener('load', () => shell.querySelector('.tableau-loading')?.remove());
  shell.appendChild(frame); shell.dataset.loaded = 'true';
}
loadTableau(document.querySelector('.analysis-panel.is-active'));
