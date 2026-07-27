export default class SpectraRol extends HTMLElement {
  connectedCallback() {
    const titulo = this.getAttribute("titulo") || "";
    const subtitulo = this.getAttribute("subtitulo") || "";
    const lugar = this.getAttribute("lugar") || "";
    const fecha = this.getAttribute("fecha") || "";
    const pjs = this.getAttribute("pjs") || "";
    const triggers = this.getAttribute("triggers") || "";
    const contenido = this.innerHTML;

    this.innerHTML = `
      <style>
        s-rol > hgroup {
          position: relative;
          padding: var(--spacing-2xl);
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }

        s-rol > hgroup::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 60% at 50% 0%,
            color-mix(in srgb, var(--poster), transparent 85%),
            transparent
          );
          pointer-events: none;
        }

        s-rol h2.sp-rol-title {
          font: var(--f-3xl) var(--f-title-deco) !important;
          line-height: .8 !important;
          position: relative;
        }

        s-rol .sp-rol-subtitle:empty {
          display: none;
        }

        s-rol .sp-rol-data {
          font: var(--f-s) var(--f-title);
          text-transform: uppercase;
          display: flex;
          padding: var(--spacing-s) var(--spacing-2xl);
          gap: var(--spacing);
          border-bottom: 1px solid var(--border);
          position: relative;
        }

        s-rol .sp-rol-content {
          padding: var(--spacing-2xl);
          text-align: justify;
          line-height: 1.5;
        }

        s-rol .sp-rol-content strong {
          color: light-dark(
            var(--poster),
            color-mix(in srgb, var(--poster), white 20%)
          );
        }

        s-rol .tw {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-s);
          font: var(--f-s) var(--f-mono);
          text-transform: uppercase;
          margin-bottom: var(--spacing);
        }

        s-rol .sp-tw-title {
          border: 1px solid var(--danger-border);
          background: var(--danger-surface);
          color: var(--danger-text);
          font-weight: bold;
          padding: var(--spacing-3xs) var(--spacing-s);
          border-radius: 999px;
        }

        s-rol .tw:has(.sp-triggers:empty) {
          display: none;
        }
      </style>

      <hgroup>
        <h2 class="sp-rol-title">${titulo}</h2>
        <span class="sp-rol-subtitle">${subtitulo}</span>
      </hgroup>

      <menu class="sp-rol-data">
        <li>${lugar}</li>
        <li>${fecha}</li>
        <li>${pjs}</li>
      </menu>

      <article class="sp-rol-content">
        <article class="tw">
          <span class="sp-tw-title">TRIGGER WARNINGS:</span>
          <span class="sp-triggers">${triggers}</span>
        </article>

        ${contenido}
      </article>
    `;
  }
}
