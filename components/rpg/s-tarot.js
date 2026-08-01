const TAROT_CARDS = {
  loco: {
    numero: "0",
    nombre: "El Loco",
    imagen: "https://www.odiseajung.com/wp-core-files/images/2015/02/fool.jpg"
  },

  mago: {
    numero: "I",
    nombre: "El Mago",
    imagen: "https://ejemplo.com/tarot/el-mago.webp"
  },

  sacerdotisa: {
    numero: "II",
    nombre: "La Sacerdotisa",
    imagen: "https://ejemplo.com/tarot/la-sacerdotisa.webp"
  },

  emperatriz: {
    numero: "III",
    nombre: "La Emperatriz",
    imagen: "https://ejemplo.com/tarot/la-emperatriz.webp"
  },

  emperador: {
    numero: "IV",
    nombre: "El Emperador",
    imagen: "https://ejemplo.com/tarot/el-emperador.webp"
  },

  hierofante: {
    numero: "V",
    nombre: "El Hierofante",
    imagen: "https://ejemplo.com/tarot/el-hierofante.webp"
  },

  enamorados: {
    numero: "VI",
    nombre: "Los Enamorados",
    imagen: "https://ejemplo.com/tarot/los-enamorados.webp"
  },

  carro: {
    numero: "VII",
    nombre: "El Carro",
    imagen: "https://ejemplo.com/tarot/el-carro.webp"
  },

  justicia: {
    numero: "VIII",
    nombre: "La Justicia",
    imagen: "https://ejemplo.com/tarot/la-justicia.webp"
  },

  ermitano: {
    numero: "IX",
    nombre: "El Ermitaño",
    imagen: "https://ejemplo.com/tarot/el-ermitano.webp"
  },

  rueda: {
    numero: "X",
    nombre: "La Rueda de la Fortuna",
    imagen: "https://ejemplo.com/tarot/la-rueda-de-la-fortuna.webp"
  },

  fuerza: {
    numero: "XI",
    nombre: "La Fuerza",
    imagen: "https://ejemplo.com/tarot/la-fuerza.webp"
  },

  colgado: {
    numero: "XII",
    nombre: "El Colgado",
    imagen: "https://ejemplo.com/tarot/el-colgado.webp"
  },

  muerte: {
    numero: "XIII",
    nombre: "La Muerte",
    imagen: "https://ejemplo.com/tarot/la-muerte.webp"
  },

  templanza: {
    numero: "XIV",
    nombre: "La Templanza",
    imagen: "https://ejemplo.com/tarot/la-templanza.webp"
  },

  diablo: {
    numero: "XV",
    nombre: "El Diablo",
    imagen: "https://ejemplo.com/tarot/el-diablo.webp"
  },

  torre: {
    numero: "XVI",
    nombre: "La Torre",
    imagen: "https://ejemplo.com/tarot/la-torre.webp"
  },

  estrella: {
    numero: "XVII",
    nombre: "La Estrella",
    imagen: "https://ejemplo.com/tarot/la-estrella.webp"
  },

  luna: {
    numero: "XVIII",
    nombre: "La Luna",
    imagen: "https://ejemplo.com/tarot/la-luna.webp"
  },

  sol: {
    numero: "XIX",
    nombre: "El Sol",
    imagen: "https://ejemplo.com/tarot/el-sol.webp"
  },

  juicio: {
    numero: "XX",
    nombre: "El Juicio",
    imagen: "https://ejemplo.com/tarot/el-juicio.webp"
  },

  mundo: {
    numero: "XXI",
    nombre: "El Mundo",
    imagen: "https://ejemplo.com/tarot/el-mundo.webp"
  }
};

export default class STarot extends HTMLElement {
  static get observedAttributes() {
    return ["carta"];
  }

  constructor() {
    super();

    this._sourceContent = "";
    this._initialized = false;
    this._rendering = false;
  }

  connectedCallback() {
    /*
     * Conservamos el HTML original solamente la primera vez.
     *
     * Es importante hacerlo antes de renderizar para que el componente
     * no capture como contenido su propia estructura generada.
     */
    if (!this._initialized) {
      this._sourceContent = this.innerHTML;
      this._initialized = true;
    }

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    /*
     * attributeChangedCallback puede ejecutarse antes que
     * connectedCallback cuando el elemento ya incluye carta="".
     *
     * Por eso no renderizamos hasta haber guardado el contenido original.
     */
    if (
      !this.isConnected ||
      !this._initialized ||
      this._rendering ||
      oldValue === newValue
    ) {
      return;
    }

    this.render();
  }

  getCardKey() {
    const requestedCard = this.getAttribute("carta")
      ?.trim()
      .toLowerCase();

    return requestedCard && TAROT_CARDS[requestedCard]
      ? requestedCard
      : "";
  }

  getCard() {
    const cardKey = this.getCardKey();

    return cardKey
      ? TAROT_CARDS[cardKey]
      : null;
  }

  render() {
    if (!this._initialized || this._rendering) return;

    this._rendering = true;

    try {
      const cardKey = this.getCardKey();
      const card = this.getCard();

      if (!card) {
        this.removeAttribute("aria-label");

        this.innerHTML = `
          <style>
            s-tarot {
              display: block;
            }

            s-tarot .s-tarot-error {
              padding: var(--spacing);

              color: var(--text-2);
              background: var(--background-elevated);
              border: 1px solid var(--border);
              border-radius: var(--spacing-s);
              corner-shape: var(--shape-elements);
            }
          </style>

          <div class="s-tarot-error" role="alert">
            Carta de tarot no reconocida.
          </div>
        `;

        return;
      }

      const accessibleName = `${card.numero} — ${card.nombre}`;

      this.setAttribute("aria-label", accessibleName);
      this.dataset.card = cardKey;

      this.innerHTML = `
        <style>
          s-tarot {
            --s-tarot-accent: var(--accent, var(--text-1));
            --s-tarot-image-width: 11rem;

            display: grid;
            grid-template-columns:
              minmax(0, var(--s-tarot-image-width))
              minmax(0, 1fr);
            gap: var(--spacing-l);

            position: relative;
            overflow: clip;

            padding: var(--spacing-l);

            color: var(--text-1);
            background: var(--background-elevated);
            border: 1px solid var(--border);
            border-radius: var(--spacing);
            corner-shape: var(--shape-elements);
          }

          s-tarot .s-tarot-media {
            position: relative;
            min-width: 0;
            margin: 0;
          }

          s-tarot .s-tarot-image {
            display: block;
            width: 100%;
            height: auto;
            aspect-ratio: 2 / 3;
            object-fit: cover;

            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--spacing-s);
            corner-shape: var(--shape-elements);
          }

          s-tarot .s-tarot-body {
            min-width: 0;
          }

          s-tarot .s-tarot-header {
            display: flex;
            flex-wrap: wrap;
            align-items: baseline;
            gap: var(--spacing-s);

            margin-bottom: var(--spacing);
            padding-bottom: var(--spacing);

            border-bottom: 1px solid var(--border);
          }

          s-tarot .s-tarot-number {
            color: var(--s-tarot-accent);
            font: bold var(--f-s) var(--f-title);
            letter-spacing: 0.12em;
            text-transform: uppercase;
          }

          s-tarot .s-tarot-number::after {
            content: " ·";
          }

          s-tarot .s-tarot-name {
            margin: 0;

            color: var(--text-1);
            font: bold var(--f-xl) var(--f-title);
            line-height: 1.1;
            text-transform: uppercase;
          }

          s-tarot .s-tarot-content {
            min-width: 0;
          }

          s-tarot .s-tarot-content > :first-child {
            margin-top: 0;
          }

          s-tarot .s-tarot-content > :last-child {
            margin-bottom: 0;
          }

          s-tarot .s-tarot-content:empty {
            display: none;
          }

          @media (max-width: 600px) {
            s-tarot {
              grid-template-columns: 1fr;
            }

            s-tarot .s-tarot-media {
              width: min(100%, 14rem);
              margin-inline: auto;
            }

            s-tarot .s-tarot-header {
              justify-content: center;
              text-align: center;
            }
          }
        </style>

        <figure class="s-tarot-media">
          <img
            class="s-tarot-image"
            src="${this.escapeHTML(card.imagen)}"
            alt="${this.escapeHTML(accessibleName)}"
            loading="lazy"
            decoding="async"
          >
        </figure>

        <div class="s-tarot-body">
          <header class="s-tarot-header">
            <span class="s-tarot-number">
              ${this.escapeHTML(card.numero)}
            </span>

            <h3 class="s-tarot-name">
              ${this.escapeHTML(card.nombre)}
            </h3>
          </header>

          <div class="s-tarot-content">
            ${this._sourceContent}
          </div>
        </div>
      `;
    } finally {
      this._rendering = false;
    }
  }

  escapeHTML(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}
