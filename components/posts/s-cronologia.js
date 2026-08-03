export default class SCronologia extends HTMLElement {
    connectedCallback() {
        if (this.dataset.ready === "true") return;
        this.dataset.ready = "true";
       
        const titulo = this.getAttribute("titulo") || "";
        const subtitulo = this.getAttribute("subtitulo") || "";
        const imagen = this.getAttribute("imagen") || "";
        const contenido = this.innerHTML;

        this.innerHTML = `
      <style>
      s-cronologia {
      width: 100%;
      }

      s-cronologia .s-cronologia {
      width: 100%;
      display: flex;
      flex-direction: column;
      }

      s-cronologia .s-cronologia-hero {
      display: grid;
      align-items: center;
      grid-template-columns: max-content 1fr 1fr;
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--border);
      }

      s-cronologia .s-cronologia-media img {
      height: 100px;
      width: 100px;
      object-fit: cover;
      border: 10px solid var(--poster-dark);
      outline: 1px solid var(--border);
      outline-offset: var(--spacing-xs);
      }

      s-cronologia .s-cronologia-title {
      font: var(--f-2xl) var(--f-title-deco);
      text-transform: uppercase;
      line-height: 1;
      }

      s-cronologia .s-cronologia-subtitle {
      font: var(--f-s) var(--f-metadata);
      color: var(--text-subtle);
      }

      s-cronologia .s-cronologia-body {
      display: flex;
      flex-direction: column;
      }

      </style>

      <div class="s-cronologia profile-no padding-no">
        <hgroup class="s-cronologia-hero">
          <figure class="s-cronologia-media">
            <img src="${imagen}" />
          </figure>
          <h2 class="s-cronologia-title">${titulo}</h2>
          <p class="s-cronologia-subtitle">${subtitulo}</p>
        </hgroup>
        <div class="s-cronologia-body">
          ${contenido}
        </div>
      </div>
    `;
    }
}
