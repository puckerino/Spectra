export default class STimeline extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const contenido = this.innerHTML;
    const titulo = this.getAttribute("titulo") || "";

    this.innerHTML = `
      <style>
        s-timeline {
          display: block;
          position: relative;
        }

        s-timeline .s-timeline-title:empty {
          display: none;
        }

        s-timeline .s-timeline-title {
          font: var(--f-xl) var(--f-title-deco);
          margin-bottom: var(--spacing-l);
        }

        s-timeline .s-timeline-list {
          display: grid;
          gap: var(--spacing-l);
          position: relative;
        }

        s-timeline .s-timeline-list::before {
          content: "";
          position: absolute;
          inset-block: 0;
          inset-inline-start: .55rem;
          width: 1px;
          background: var(--border);
        }
      </style>

      <h2 class="s-timeline-title">${titulo}</h2>

      <div class="s-timeline-list">
        ${contenido}
      </div>
    `;
  }
}
