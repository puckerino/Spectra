export default class SEvent extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const fecha = this.getAttribute("fecha") || "";
    const lugar = this.getAttribute("lugar") || "";
    const titulo = this.getAttribute("titulo") || "";
    const faccion = this.getAttribute("faccion") || "";
    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        s-event {
          display: block;
          position: relative;
          padding-inline-start: calc(var(--spacing-xl) + .5rem);
        }

        s-event::before {
          content: "";
          position: absolute;
          inset-inline-start: .25rem;
          inset-block-start: .45rem;
          inline-size: .7rem;
          block-size: .7rem;
          border-radius: 50%;
          background: var(--poster);
          box-shadow: 0 0 0 4px var(--background);
          z-index: 1;
        }

        s-event .s-event-card {
          border: 1px solid var(--border);
          border-radius: var(--spacing);
          corner-shape: var(--shape-elements);
          background: var(--background-elevated);
          padding: var(--spacing-l);
        }

        s-event .s-event-meta {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-s);
          font: var(--f-s) var(--f-mono);
          text-transform: uppercase;
          color: var(--text-subtle);
        }

        s-event .s-event-meta span:empty {
          display: none;
        }

        s-event .s-event-title:empty {
          display: none;
        }

        s-event .s-event-title {
          font: var(--f-xl) var(--f-title);
          margin: 0 0 var(--spacing-s);
        }

        s-event .s-event-body {
          line-height: 1.5;
        }
      </style>

      <article class="s-event-card">
        <div class="s-event-meta">
          <span>${fecha}</span>
          <span>${lugar}</span>
          <span>${faccion}</span>
        </div>

        <h3 class="s-event-title">${titulo}</h3>

        <div class="s-event-body">
          ${contenido}
        </div>
      </article>
    `;
  }
}
