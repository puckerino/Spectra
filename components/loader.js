const COMPONENTS = {
  // UI
  "s-audio": "ui/s-audio.js",
  "s-spoiler": "ui/s-spoiler.js",
  "s-tabs": "ui/s-tabs.js",
  "s-tab": "ui/s-tab.js",
  "s-carousel": "ui/s-carousel.js",
  "s-copy": "ui/s-copy.js",
  "s-accordion": "ui/s-accordion.js",
  "s-callout": "ui/s-callout.js",

  // POSTS
  "s-rol": "posts/s-rol.js",
  "s-timeline": "posts/s-timeline.js",
  "s-event": "posts/s-event.js",
  "s-location": "posts/s-location.js",
  "s-search": "posts/s-search.js"
};

const loadingComponents = new Set();

function loadComponent(tag) {
  if (customElements.get(tag)) return;
  if (loadingComponents.has(tag)) return;

  const file = COMPONENTS[tag];
  if (!file) return;

  loadingComponents.add(tag);

  const componentUrl = new URL(file, import.meta.url);

  import(componentUrl.href)
    .then(module => {
      if (customElements.get(tag)) return;

      const component = module.default || module;
      customElements.define(tag, component);
    })
    .catch(error => {
      console.error(`Error cargando ${tag}`, error);
    })
    .finally(() => {
      loadingComponents.delete(tag);
    });
}

function scan(root = document) {
  if (root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
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

scan();

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
