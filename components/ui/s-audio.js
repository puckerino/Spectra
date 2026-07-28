export default class SAudio extends HTMLElement {
  connectedCallback() {

    if (this.dataset.ready === "true") return;
    this.dataset.ready = "true";

    const youtube =
      this.getAttribute("youtube") || "";

    const titulo =
      this.getAttribute("titulo") || "Audio";

    const videoId =
      this.getVideoId(youtube);

    if (!videoId) {

      this.innerHTML = `
        <p>Video no válido</p>
      `;

      return;

    }

    const origin =
      encodeURIComponent(location.origin);

    this.innerHTML = `

      <style>

        s-audio {
          display: block;
        }

        s-audio .s-audio {

          display: flex;
          align-items: center;
          gap: var(--spacing);
          padding: var(--spacing);
          border: 1px solid var(--border);
          border-radius: var(--spacing);
          corner-shape: var(--shape-elements);
          background: var(--background-elevated);

        }

        s-audio .s-audio-button {
          width: 3rem;
          height: 3rem;
          flex-shrink: 0;
          border:  1px solid var(--border);
          border-radius: 50%;
          background: var(--background);
          color:  var(--text-subtle);
          cursor: pointer;
          display: grid;
          place-items: center;
          font-size: 1rem;
          transition:
            background .2s ease,
            border-color .2s ease,
            color .2s ease;
        }

        s-audio .s-audio-button:hover {
          background: var(--poster);
          border-color: var(--poster-dark);
        }

        s-audio .s-audio-content {
          display: grid;
          gap: .25rem;
          min-width: 0;
          flex-grow: 1;
        }

        s-audio .s-audio-title {
          font: var(--f-base) var(--f-metadata);
        }

        s-audio .s-audio-status {
          font: var(--f-s) var(--f-mono);
          text-transform: uppercase;
          color: var(--text-subtle);

        }

        s-audio iframe {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
          border: 0;
        }

      </style>

      <article class="s-audio">

        <button class="s-audio-button" type="button" aria-label="Reproducir audio">
          <i data-lucide="play"></i>
        </button>

        <div class="s-audio-content">
          <div class="s-audio-title">
            ${titulo}
          </div>

          <div class="s-audio-status">
            detenido
          </div>

        </div>

        <iframe allow="autoplay; encrypted-media" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${origin}&playsinline=1&controls=0"></iframe>

      </article>

    `;

    this.button =
      this.querySelector(
        ".s-audio-button"
      );

    this.status =
      this.querySelector(
        ".s-audio-status"
      );

    this.iframe =
      this.querySelector("iframe");

    this.playing = false;

    this.button.addEventListener(
      "click",
      () => {

        this.toggle();

      }
    );

  }

  toggle() {

    if (
      !this.iframe ||
      !this.iframe.contentWindow
    ) return;

    // PLAY
    if (!this.playing) {

      this.sendCommand(
        "playVideo"
      );

      this.playing = true;

      this.button.innerHTML =
        '<i data-lucide="pause"></i>';

      this.button.setAttribute(
        "aria-label",
        "Pausar audio"
      );

      this.status.innerHTML =
        "reproduciendo";

    }

    // PAUSE
    else {

      this.sendCommand(
        "pauseVideo"
      );

      this.playing = false;

      this.button.innerHTML =
        '<i data-lucide="play"></i>';

      this.button.setAttribute(
        "aria-label",
        "Reproducir audio"
      );

      this.status.innerHTML =
        "detenido";

    }

  }

  sendCommand(command) {

    this.iframe.contentWindow.postMessage(
      JSON.stringify({

        event: "command",

        func: command,

        args: []

      }),
      "*"
    );

  }

  getVideoId(url) {

    // ya es un id
    if (
      /^[a-zA-Z0-9_-]{11}$/.test(url)
    ) {

      return url;

    }

    try {

      const parsed =
        new URL(url);

      // youtube.com/watch?v=
      if (
        parsed.hostname.includes(
          "youtube.com"
        )
      ) {

        return (
          parsed.searchParams.get("v")
          || ""
        );

      }

      // youtu.be/
      if (
        parsed.hostname.includes(
          "youtu.be"
        )
      ) {

        return parsed.pathname.replace(
          "/",
          ""
        );

      }

    }

    catch (err) {}

    return "";

  }

}
