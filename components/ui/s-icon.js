const ICONS = {
  heart: `
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"></path>
  `,

  star: `
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"></path>
  `,

  check: `
    <path d="m20 6-11 11-5-5"></path>
  `,

  close: `
    <path d="M18 6 6 18"></path>
    <path d="m6 6 12 12"></path>
  `,

  info: `
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 16v-4"></path>
    <path d="M12 8h.01"></path>
  `,

  warning: `
    <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  `,

  user: `
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  `,

  search: `
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  `,

  menu: `
    <path d="M4 6h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 18h16"></path>
  `,

  "arrow-left": `
    <path d="m12 19-7-7 7-7"></path>
    <path d="M19 12H5"></path>
  `,

  "arrow-right": `
    <path d="m12 5 7 7-7 7"></path>
    <path d="M5 12h14"></path>
  `,

  "chevron-down": `
    <path d="m6 9 6 6 6-6"></path>
  `,

  plus: `
    <path d="M5 12h14"></path>
    <path d="M12 5v14"></path>
  `,

  minus: `
    <path d="M5 12h14"></path>
  `,

  copy: `
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
  `,

  link: `
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  `
};

export default class SIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name"];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (
      name === "name" &&
      oldValue !== newValue &&
      this.isConnected
    ) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute("name") || "";
    const icon = ICONS[name];

    if (!icon) {
      this.innerHTML = "";
      this.dataset.iconMissing = "true";

      if (name) {
        console.warn(`[s-icon] No existe el icono "${name}".`);
      }

      return;
    }

    delete this.dataset.iconMissing;

    this.innerHTML = `
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        ${icon}
      </svg>
    `;
  }
}

if (!customElements.get("s-icon")) {
  customElements.define("s-icon", SIcon);
}
