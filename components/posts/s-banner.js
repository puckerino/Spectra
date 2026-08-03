export default class SBanner extends HTMLElement {
    connectedCallback() {
        if (this.dataset.ready === "true") return;
        this.dataset.ready = "true";
       
        const tipo = this.getAttribute("tipo") || "";
        const titulo = this.getAttribute("titulo") || "";
        const subtitulo = this.getAttribute("subtitulo") || "";
        const imagen = this.getAttribute("imagen") || "";
        const contenido = this.innerHTML;

        this.innerHTML = `
      <style>
      .s-banner {
        width: 100%;
        max-height: 70vh;
        position: relative;
        }

        .s-banner-media img {
        object-fit: cover;
        max-width: 100%;
        max-height: 70vh;
        }

      </style>

      <div class="s-banner ${tipo}">
        <figure class="s-banner-media">
          <img src="${imagen}" />
        </figure>
        <h2 class="s-banner-title">${titulo}</h2>
        <p class="s-banner-subtitle">${subtitulo}</p>
        <div class="s-banner-body">
          ${contenido}
        </div>
      </div>
    `;
    }
}
