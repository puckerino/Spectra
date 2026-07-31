const CALLOUT_TYPES = {
  info: {
    title: "Información",
    icon: "info"
  },

  success: {
    title: "Correcto",
    icon: "circle-check"
  },

  warning: {
    title: "Aviso",
    icon: "triangle-alert"
  },

  danger: {
    title: "Peligro",
    icon: "circle-x"
  },

  tip: {
    title: "Consejo",
    icon: "lightbulb"
  },

  note: {
    title: "Nota",
    icon: "notebook-pen"
  }
};

const ICONS = {
  info: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4"></path>
      <path d="M12 8h.01"></path>
    </svg>
  `,

  "circle-check": `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>
  `,

  "triangle-alert": `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  `,

  "circle-x": `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m15 9-6 6"></path>
      <path d="m9 9 6 6"></path>
    </svg>
  `,

  lightbulb: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
      <path d="M8.5 14.5A6 6 0 1 1 15.5 14.5C14.6 15.2 14 16.1 14 17h-4c0-.9-.6-1.8-1.5-2.5"></path>
    </svg>
  `,

  "notebook-pen": `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M13.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.5"></path>
      <path d="M8 2v20"></path>
      <path d="M13.5 8.5 18 4a2.12 2.12 0 1 1 3 3l-4.5 4.5L13 12z"></path>
      <path d="M13 12v-3.5"></path>
    </svg>
  `,

  sparkles: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9z"></path>
      <path d="M5 3v4"></path>
      <path d="M3 5h4"></path>
      <path d="M19 17v4"></path>
      <path d="M17 19h4"></path>
    </svg>
  `,

  heart: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path>
    </svg>
  `,

  star: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2l-5-4.9 6.9-1z"></path>
    </svg>
  `
};

export default class SCallout extends HTMLElement {
  static get observedAttributes() {
    return ["tipo", "titulo", "icono"];
  }

  constructor() {
    super();

    this._sourceContent = "";
    this._initialized = false;
  }

  connectedCallback() {
    if (!this._initialized) {
      this._sourceContent = this.innerHTML;
      this._initialized = true;
    }

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) return;

    this.render();
  }

  getType() {
    const requestedType = this.getAttribute("tipo")
      ?.trim()
      .toLowerCase();

    return CALLOUT_TYPES[requestedType]
      ? requestedType
      : "info";
  }

  getIconName(type) {
    const customIcon = this.getAttribute("icono")
      ?.trim()
      .toLowerCase();

    if (customIcon && ICONS[customIcon]) {
      return customIcon;
    }

    return CALLOUT_TYPES[type].icon;
  }

  getTitle(type) {
    if (this.hasAttribute("titulo")) {
      return this.getAttribute("titulo")?.trim() || "";
    }

    return CALLOUT_TYPES[type].title;
  }

  render() {
    const type = this.getType();
    const iconName = this.getIconName(type);
    const title = this.getTitle(type);

    this.setAttribute("tipo", type);
    this.setAttribute("role", type === "danger" ? "alert" : "note");

    this.innerHTML = `
      <style>
        s-callout {
          --s-callout-accent: light-dark(#2563eb, #60a5fa);
          --s-callout-soft: color-mix(
            in srgb,
            var(--s-callout-accent) 12%,
            var(--surface-1, transparent)
          );

          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          gap: var(--spacing-m, 1rem);
          position: relative;
          overflow: clip;
          padding: var(--spacing-m, 1rem);

          color: var(--text-1, currentColor);
          background: var(--s-callout-soft);
          border: 1px solid color-mix(
            in srgb,
            var(--s-callout-accent) 35%,
            transparent
          );
          border-radius: var(--spacing, 0.75rem);
          corner-shape: var(--shape-elements, round);
        }

        s-callout::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 0.25rem;
          background: var(--s-callout-accent);
        }

        s-callout[tipo="info"] {
          --s-callout-accent: light-dark(#2563eb, #60a5fa);
        }

        s-callout[tipo="success"] {
          --s-callout-accent: light-dark(#15803d, #4ade80);
        }

        s-callout[tipo="warning"] {
          --s-callout-accent: light-dark(#b45309, #fbbf24);
        }

        s-callout[tipo="danger"] {
          --s-callout-accent: light-dark(#b91c1c, #f87171);
        }

        s-callout[tipo="tip"] {
          --s-callout-accent: light-dark(#7e22ce, #c084fc);
        }

        s-callout[tipo="note"] {
          --s-callout-accent: light-dark(#475569, #94a3b8);
        }

        s-callout .s-callout-icon {
          display: grid;
          place-items: center;
          flex: 0 0 auto;

          width: 2.25rem;
          height: 2.25rem;

          color: var(--s-callout-accent);
          background: color-mix(
            in srgb,
            var(--s-callout-accent) 14%,
            transparent
          );
          border-radius: 50%;
        }

        s-callout .s-callout-icon svg {
          display: block;
          width: 1.25rem;
          height: 1.25rem;
        }

        s-callout .s-callout-body {
          min-width: 0;
        }

        s-callout .s-callout-title {
          display: block;
          margin: 0 0 var(--spacing-xs, 0.35rem);

          color: var(--s-callout-accent);
          font: inherit;
          font-weight: 700;
          line-height: 1.25;
        }

        s-callout .s-callout-content {
          line-height: 1.6;
        }

        s-callout .s-callout-content > :first-child {
          margin-top: 0;
        }

        s-callout .s-callout-content > :last-child {
          margin-bottom: 0;
        }

        s-callout .s-callout-content:empty {
          display: none;
        }
      </style>

      <span class="s-callout-icon">
        ${ICONS[iconName]}
      </span>

      <div class="s-callout-body">
        ${
          title
            ? `<strong class="s-callout-title">${this.escapeHTML(title)}</strong>`
            : ""
        }

        <div class="s-callout-content">
          ${this._sourceContent}
        </div>
      </div>
    `;
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
