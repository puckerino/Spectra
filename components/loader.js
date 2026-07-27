const COMPONENTS = {
  // UI
  "s-audio": "ui/s-audio.js",
  "s-spoiler": "ui/s-spoiler.js",
  "s-tabs": "ui/s-tabs.js",
  "s-tab": "ui/s-tab.js",
  "s-carousel": "ui/s-carousel.js",
  "s-copy": "ui/s-copy.js",
  "s-accordion": "ui/s-accordion.js"
};

const loadingComponents = new Set();

function loadComponent(tag) {
  if (customElements.get(tag)) return;
  if (loadingComponents.has(tag)) return;

  const file = COMPONENTS[tag];
  if (!file) return;

  loadingComponents.add(tag);

  const componentUrl = new URL(file, import.meta.url);

  console.log(`[Spectra] Cargando ${tag}:`, componentUrl.href);

  import(componentUrl.href)
    .catch(error => {
      console.error(`[Spectra] Error cargando ${tag}:`, error);
    })
    .finally(() => {
      loadingComponents.delete(tag);
    });
}

function scan(root = document) {
  if (
    root.nodeType !== Node.ELEMENT_NODE &&
    root.nodeType !== Node.DOCUMENT_NODE &&
    root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
  ) {
    return;
  }

  if (
    root.nodeType === Node.ELEMENT_NODE &&
    root.tagName.includes("-")
  ) {
    loadComponent(root.tagName.toLowerCase());
  }

  root.querySelectorAll?.("*").forEach(element => {
    if (element.tagName.includes("-")) {
      loadComponent(element.tagName.toLowerCase());
    }
  });
}

scan(document);

new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      scan(node);
    });
  });
}).observe(document.body, {
  childList: true,
  subtree: true
});
