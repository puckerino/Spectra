export default class SAccordion extends HTMLElement {

  connectedCallback() {

    const titulo =
      this.getAttribute("titulo") ||
      "Accordion";

    const contenido =
      this.innerHTML;

    this.innerHTML = `

      <style>

        s-accordion {
          display: block;

          border:
            1px solid var(--border);

          border-radius:
            var(--br);

          overflow: clip;

          background:
            var(--background-elevated);
        }

        s-accordion .s-accordion-toggle {

          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: var(--spacing);

          padding:
            var(--spacing)
            var(--spacing-l);

          border: none;

          background: none;

          cursor: pointer;

          color:
            var(--mono-text1);

          font:
            var(--f-s)
            var(--f-base);

          text-transform:
            uppercase;

        }

        s-accordion .s-accordion-icon {
          transition:
            rotate .3s ease;
        }

        s-accordion[open]
        .s-accordion-icon {

          rotate: 180deg;

        }

        s-accordion .s-accordion-content {

          display: grid;

          grid-template-rows: 0fr;

          transition:
            grid-template-rows .35s ease;

        }

        s-accordion[open]
        .s-accordion-content {

          grid-template-rows: 1fr;

        }

        s-accordion .s-accordion-inner {
          overflow: hidden;
        }

        s-accordion .s-accordion-body {

          padding:
            0
            var(--spacing-l)
            var(--spacing-l);

        }

      </style>

      <button class="s-accordion-toggle">

        <span class="s-accordion-title">
          ${titulo}
        </span>

        <span class="s-accordion-icon">
          <i data-lucide="chevron-down"></i>
        </span>

      </button>

      <div class="s-accordion-content">

        <div class="s-accordion-inner">

          <div class="s-accordion-body">

            ${contenido}

          </div>

        </div>

      </div>

    `;

    const button =
      this.querySelector(
        ".s-accordion-toggle"
      );

    button.addEventListener("click", () => {

      this.toggleAttribute("open");

    });

  }

}
