export default class SFilter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    this.render();
    this.setup();
  }

  /**
   * Convierte el texto a una forma más fácil de comparar:
   * - minúsculas
   * - sin tildes
   * - espacios normalizados
   */
  normalizeText(value = "") {
    return String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Escapa texto antes de insertarlo en atributos HTML.
   */
  escapeAttribute(value = "") {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  render() {
    const placeholder =
      this.getAttribute("placeholder") || "Buscar...";

    const label =
      this.getAttribute("label") || placeholder;

    const buttonLabel =
      this.getAttribute("clear-label") || "Limpiar búsqueda";

    this.innerHTML = `
      <style>
        s-filter {
          display: block;
        }

        s-filter .s-filter-form {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: var(--spacing-s, 0.5rem);
          align-items: center;
        }

        s-filter .s-filter-field {
          position: relative;
          min-width: 0;
        }

        s-filter .s-filter-input {
          width: 100%;
          min-width: 0;
        }

        s-filter .s-filter-clear {
          display: inline-grid;
          place-items: center;
          flex: none;

          width: 2.5rem;
          min-height: 2.5rem;
          padding: 0;

          cursor: pointer;
        }

        s-filter .s-filter-clear[hidden] {
          display: none;
        }

        s-filter .s-filter-count {
          grid-column: 1 / -1;
          min-height: 1lh;

          color: var(--text-2, currentColor);
          font-size: var(--font-size-small, 0.875rem);
        }

        s-filter .s-filter-count:empty {
          display: none;
        }

        @media (max-width: 480px) {
          s-filter .s-filter-form {
            grid-template-columns: minmax(0, 1fr) auto;
          }
        }
      </style>

      <form
        class="s-filter-form"
        role="search"
        novalidate
      >
        <div class="s-filter-field">
          <input
            class="s-filter-input"
            type="search"
            placeholder="${this.escapeAttribute(placeholder)}"
            aria-label="${this.escapeAttribute(label)}"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <button
          class="s-filter-clear"
          type="button"
          aria-label="${this.escapeAttribute(buttonLabel)}"
          title="${this.escapeAttribute(buttonLabel)}"
          hidden
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>

        <span
          class="s-filter-count"
          aria-live="polite"
          aria-atomic="true"
        ></span>
      </form>
    `;
  }

  setup() {
    this.form = this.querySelector(".s-filter-form");
    this.input = this.querySelector(".s-filter-input");
    this.clearButton = this.querySelector(".s-filter-clear");
    this.countElement = this.querySelector(".s-filter-count");

    if (
      !this.form ||
      !this.input ||
      !this.clearButton ||
      !this.countElement
    ) {
      return;
    }

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    this.input.addEventListener("input", () => {
      this.filter();
    });

    this.input.addEventListener("search", () => {
      this.filter();
    });

    this.clearButton.addEventListener("click", () => {
      this.clear();
    });

    /*
     * Permite que otros scripts puedan limpiar el filtro
     * mediante:
     *
     * document.querySelector("s-filter").clear();
     */
  }

  /**
   * Devuelve todos los elementos que deben filtrarse.
   */
  getItems() {
    const selector = this.getAttribute("selector") || ".post";

    try {
      return Array.from(document.querySelectorAll(selector)).filter(
        (item) => !this.contains(item)
      );
    } catch (error) {
      console.warn(
        `[s-filter] El selector "${selector}" no es válido.`,
        error
      );

      return [];
    }
  }

  /**
   * Obtiene el texto que debe examinarse dentro de cada elemento.
   *
   * Si existe search-in, solo se busca dentro de esa zona.
   * Si no existe, se busca en todo el elemento.
   */
  getSearchText(item) {
    const searchIn = this.getAttribute("search-in");

    if (!searchIn) {
      return item.textContent || "";
    }

    try {
      const zones = item.querySelectorAll(searchIn);

      if (!zones.length) {
        return "";
      }

      return Array.from(zones)
        .map((zone) => zone.textContent || "")
        .join(" ");
    } catch (error) {
      console.warn(
        `[s-filter] El selector search-in "${searchIn}" no es válido.`,
        error
      );

      return "";
    }
  }

  /**
   * Muestra u oculta un elemento.
   *
   * Utilizamos hidden para que el navegador y las tecnologías
   * de asistencia reconozcan que el contenido está oculto.
   */
  setItemVisibility(item, visible) {
    item.hidden = !visible;

    item.toggleAttribute("data-s-filter-hidden", !visible);
  }

  filter() {
    const rawQuery = this.input?.value || "";
    const query = this.normalizeText(rawQuery);
    const items = this.getItems();

    let matches = 0;

    items.forEach((item) => {
      const searchableText = this.normalizeText(
        this.getSearchText(item)
      );

      const isMatch =
        query === "" || searchableText.includes(query);

      this.setItemVisibility(item, isMatch);

      if (isMatch) {
        matches++;
      }
    });

    this.updateInterface({
      query,
      matches,
      total: items.length
    });

    this.dispatchEvent(
      new CustomEvent("s-filter-change", {
        bubbles: true,
        detail: {
          query: rawQuery,
          normalizedQuery: query,
          matches,
          total: items.length
        }
      })
    );
  }

  updateInterface({ query, matches, total }) {
    const showCount =
      this.getAttribute("show-count") !== "false";

    this.clearButton.hidden = query === "";

    if (!showCount || query === "") {
      this.countElement.textContent = "";
      return;
    }

    this.countElement.textContent = this.getCountMessage(
      matches,
      total
    );
  }

  getCountMessage(matches, total) {
    const zeroMessage = this.getAttribute("zero-message");
    const singularMessage = this.getAttribute("singular-message");
    const pluralMessage = this.getAttribute("plural-message");

    if (matches === 0) {
      return (
        zeroMessage ||
        `No se han encontrado resultados entre ${total} elementos.`
      );
    }

    if (matches === 1) {
      return (
        singularMessage ||
        `Se ha encontrado 1 resultado de ${total}.`
      );
    }

    if (pluralMessage) {
      return pluralMessage
        .replace(/\{\{count\}\}/g, String(matches))
        .replace(/\{\{total\}\}/g, String(total));
    }

    return `Se han encontrado ${matches} resultados de ${total}.`;
  }

  /**
   * Limpia la búsqueda y vuelve a mostrar todos los elementos.
   */
  clear() {
    if (!this.input) return;

    this.input.value = "";
    this.filter();
    this.input.focus();
  }

  /**
   * Permite actualizar manualmente el filtro si se han añadido
   * elementos nuevos a la página.
   *
   * Ejemplo:
   * document.querySelector("s-filter").refresh();
   */
  refresh() {
    this.filter();
  }
}

if (!customElements.get("s-filter")) {
  customElements.define("s-filter", SFilter);
}
