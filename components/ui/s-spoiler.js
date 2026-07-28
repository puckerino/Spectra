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
          border-radius: var(--spacing);
          corner-shape: var(--shape-elements);
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
          color: var(--text-1)!important;
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
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
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
