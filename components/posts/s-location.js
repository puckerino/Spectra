export default class SLocation extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const nombre = this.getAttribute("nombre") || "";
    const subtitulo = this.getAttribute("subtitulo") || "";
    const imagen = this.getAttribute("imagen") || "";
    const estado = this.getAttribute("estado") || "";
    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        s-location {
          display: block;
          overflow: clip;
          border: 1px solid var(--border);
          border-radius: var(--spacing);
          corner-shape: var(--shape-elements);
          background: var(--background-elevated);
        }

        s-location .s-location-media:empty {
          display: none;
        }

        s-location .s-location-media img {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 7;
          object-fit: cover;
        }

        s-location .s-location-content {
          padding: var(--spacing-l);
        }

        s-location .s-location-header {
          display: grid;
          gap: var(--spacing-2xs);
          margin-bottom: var(--spacing);
        }

        s-location .s-location-name {
          font: var(--f-2xl) var(--f-title-deco);
          margin: 0;
        }

        s-location .s-location-subtitle,
        s-location .s-location-status {
          font: var(--f-s) var(--f-mono);
          text-transform: uppercase;
          color: var(--text-subtle);
        }

        s-location .s-location-subtitle:empty,
        s-location .s-location-status:empty {
          display: none;
        }

        s-location .s-location-body {
          line-height: 1.5;
        }
      </style>

      <figure class="s-location-media">
        ${imagen ? `<img src="${imagen}" alt="${nombre}">` : ""}
      </figure>

      <div class="s-location-content">
        <header class="s-location-header">
          <h3 class="s-location-name">${nombre}</h3>
          <span class="s-location-subtitle">${subtitulo}</span>
          <span class="s-location-status">${estado}</span>
        </header>

        <div class="s-location-body">
          ${contenido}
        </div>
      </div>
    `;
  }
}
