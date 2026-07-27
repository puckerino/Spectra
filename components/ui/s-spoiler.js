export default class S_Spoiler extends HTMLElement {

  connectedCallback() {

    const titulo =
      this.getAttribute("titulo") ||
      "Spoiler";

    const contenido = this.innerHTML;

    this.innerHTML = `
    
      <style>

        s-spoiler {
          display: block;
          border: 1px solid var(--border);
          border-radius: var(--br);
          overflow: clip;
          background: var(--background-elevated);
        }

        s-spoiler .spoiler-toggle {
          width: 100%;
          display: flex;
          gap: var(--spacing-s);
          padding:var(--spacing);
          border: none;
          background: none;
          color: var(--text-subtle);
          font: var(--f-s) var(--f-metadata);
          text-transform: uppercase;
          cursor: pointer;
        }

        s-spoiler .spoiler-icon {
          transition: rotate .3s ease;
        }

        s-spoiler[open] .spoiler-icon {
          rotate: 90deg;
        }

        s-spoiler .spoiler-content {
          display: grid;
          grid-template-rows: 0fr;

          transition:
            grid-template-rows .35s ease;
        }

        s-spoiler[open] .spoiler-content {
          grid-template-rows: 1fr;
        }

        s-spoiler .spoiler-inner {
          overflow: hidden;
        }

        s-spoiler .spoiler-body {
          padding:
            0
            var(--spacing-l)
            var(--spacing-l);
        }

      </style>

      <button class="spoiler-toggle">

        <span class="spoiler-icon">
          <i data-lucide="chevron-right"></i>
        </span>

        <span class="spoiler-title">
          ${titulo}
        </span>

      </button>

      <div class="spoiler-content">

        <div class="spoiler-inner">

          <div class="spoiler-body">
            ${contenido}
          </div>

        </div>

      </div>

    `;

    const button =
      this.querySelector(".spoiler-toggle");

    button.addEventListener("click", () => {

      this.toggleAttribute("open");

    });

  }

}
