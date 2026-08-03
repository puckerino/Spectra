export default class STema extends HTMLElement {
    connectedCallback() {
        if (this.dataset.ready === "true") return;
        this.dataset.ready = "true";

        const estado = this.getAttribute("estado") || "";
        const titulo = this.getAttribute("titulo") || "";
        const temaid = this.getAttribute("tid") || "";
        const fecha = this.getAttribute("fecha") || "";
        const lugar = this.getAttribute("lugar") || "";
        const pjs = this.getAttribute("pjs") || "";
        const contenido = this.innerHTML;

        this.innerHTML = `
      <style>
      s-tema {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--spacing);
      border: 1px solid var(--border);
      padding: var(--spacing);
      }

      s-tema .s-tema-resumen {
      flex-grow: 1;
      }

      s-tema .s-tema-resumen:empty {
      display: none;
      }

      </style>
      
      <s-icon name="${estado}"></s-icon>
      <span class="s-tema-fecha">${fecha}</span>
      <a class="s-tema-titulo" href="/t${temaid}-">${titulo}</a>
      <div class="datos">
      <span class="s-tema-lugar">${lugar}</span>
      <span class="s-tema-pjs">${pjs}</span>
      <div class="s-tema-resumen">
      ${contenido}
      </div>
      
    `;
    }
}
