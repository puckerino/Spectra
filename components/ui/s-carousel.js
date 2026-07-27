export default class SCarousel extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const items = [...this.children];
    const labelAnterior = this.getAttribute("prev") || "Anterior";
    const labelSiguiente = this.getAttribute("next") || "Siguiente";

    if (!items.length) return;

    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        s-carousel {
          display: block;
          position: relative;
        }

        s-carousel .s-carousel-viewport {
          overflow: hidden;
        }

        s-carousel .s-carousel-track {
          display: flex;
          transition: transform .35s ease;
        }

        s-carousel .s-carousel-slide {
          min-width: 100%;
        }

        s-carousel .s-carousel-controls {
          display: flex;
          justify-content: center;
          gap: var(--spacing-s);
          margin-top: var(--spacing);
        }

        s-carousel .s-carousel-dots {
          display: flex;
          justify-content: center;
          gap: var(--spacing-xs);
          margin-top: var(--spacing-s);
        }

        s-carousel .s-carousel-dot {
          inline-size: .6rem;
          block-size: .6rem;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: transparent;
          cursor: pointer;
          padding: 0;
        }

        s-carousel .s-carousel-dot[active] {
          background: var(--text1);
        }
      </style>

      <div class="s-carousel-viewport">
        <div class="s-carousel-track">
          ${items.map(item => `
            <div class="s-carousel-slide">
              ${item.outerHTML}
            </div>
          `).join("")}
        </div>
      </div>

      <div class="s-carousel-controls">
        <button type="button" class="s-carousel-btn s-carousel-prev">
          ${labelAnterior}
        </button>

        <button type="button" class="s-carousel-btn s-carousel-next">
          ${labelSiguiente}
        </button>
      </div>

      <div class="s-carousel-dots">
        ${items.map((_, i) => `
          <button type="button" class="s-carousel-dot" data-index="${i}" aria-label="Ir a slide ${i + 1}"></button>
        `).join("")}
      </div>
    `;

    let index = 0;

    const track = this.querySelector(".s-carousel-track");
    const prev = this.querySelector(".s-carousel-prev");
    const next = this.querySelector(".s-carousel-next");
    const dots = [...this.querySelectorAll(".s-carousel-dot")];

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;

      dots.forEach((dot, i) => {
        dot.toggleAttribute("active", i === index);
      });
    };

    prev.addEventListener("click", () => {
      index = index <= 0 ? items.length - 1 : index - 1;
      update();
    });

    next.addEventListener("click", () => {
      index = index >= items.length - 1 ? 0 : index + 1;
      update();
    });

    dots.forEach(dot => {
      dot.addEventListener("click", () => {
        index = Number(dot.dataset.index);
        update();
      });
    });

    update();
  }
}
