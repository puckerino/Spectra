export default class SSearch extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const titulo = this.getAttribute("titulo") || "";
    const subtitulo = this.getAttribute("subtitulo") || "";
    const imagen = this.getAttribute("imagen") || "";
    const estado = this.getAttribute("estado") || "";
    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        .s-search {
          display: grid;
          grid-template-columns: .5fr 1fr;
        }

        .s-search .s-sidebar {
          display: flex;
          flex-direction: column;
          gap: var(--spacing);
        }

        .s-search .s-search-title {
          font: bold var(--f-l) var(--f-title-deco);
          text-align: right;
        }

        .s-search .s-search-subtitle {
          font: var(--f-s) var(--f-metadata);
          color: var(--text-subtle);
          text-transform: uppercase;
          text-align: right;
        }

        .s-search .s-search-media {
          padding: var(--spacing-2xl);
          }

        .s-search .s-search-media img {
          display: block;
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
          outline: 1px solid var(--poster);
          outline-offset: var(--spacing-s);
        }

        .s-search .s-search-body {
          padding: 0 var(--spacing-l);
          border-left: 1px solid var(--border);
        }
      </style>

      <div class="s-search">
        <div class="s-search-sidebar">
            <h3 class="s-search-title">${titulo}</h3>
            <span class="s-search-subtitle">${subtitulo}</span>
            <figure class="s-search-media">
              <img src="${imagen}" />
            </figure>
        </div>

        <div class="s-search-body">
          <span class="s-search-estado">${estado}</span>
          ${contenido}
        </div>
      </div>
    `;
  }
}
