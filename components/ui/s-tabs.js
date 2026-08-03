export default class STabs extends HTMLElement {

  connectedCallback() {

    const tabs =
      [...this.querySelectorAll("s-tab")];

    if (!tabs.length) return;

    tabs.forEach((tab, i) => {

      tab.dataset.index = i;

      if (i !== 0) {
        tab.hidden = true;
      }

    });

    const nav = document.createElement("menu");
    nav.className = "s-tabs-nav";

    tabs.forEach((tab, i) => {

      const button =
        document.createElement("button");

      button.className = "s-tab-button";

      button.textContent =
        tab.getAttribute("titulo") ||
        `Tab ${i + 1}`;

      if (i === 0) {
        button.setAttribute("active", "");
      }

      button.addEventListener("click", () => {

        tabs.forEach(t => {
          t.hidden = true;
        });

        nav
          .querySelectorAll(".s-tab-button")
          .forEach(b => {
            b.removeAttribute("active");
          });

        tab.hidden = false;

        button.setAttribute("active", "");

      });

      nav.append(button);

    });

    this.prepend(nav);

    if (!this.querySelector("style")) {

      const style =
        document.createElement("style");

      style.textContent = `

        s-tab:not([hidden]) {
          display: block;
        }

        s-tab[hidden] {
          display: none;
        }

      `;

      this.prepend(style);

    }

  }

}
