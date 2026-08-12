/*!
 * Spectra - PixiePostReader config
 */

(function () {
  "use strict";

  function configure() {
    if (!window.PixiePostReader) {
      return false;
    }

    PixiePostReader.configure({
      post: {
        rootSelector:
          "article.post",

        idPrefix:
          "p",

        permalinkSelector:
          ".permalink[id]"
      },

      content: {
        codeSelector:
          ".content.message dl.codebox code"
      },

      profile: {
        linkSelectors: [
          'aside.profile .username a[href^="/u"]',
          'aside.profile .avatar-post a[href^="/u"]',
          'aside.profile .avatar-post-mobile a[href^="/u"]',
          'aside.profile .contact a[href^="/u"]',
          'aside.profile a[href^="/u"]'
        ],

        pattern:
          /\/u\d+/i
      }
    });

    return true;
  }


  /*
   * Pixie ya está disponible.
   */
  if (configure()) {
    return;
  }


  /*
   * Pixie todavía está cargando.
   *
   * Esperamos hasta que PixiePostReader
   * esté disponible.
   */
  const interval =
    setInterval(() => {
      if (!configure()) {
        return;
      }

      clearInterval(interval);
    }, 50);


  /*
   * Seguridad:
   * dejamos de esperar después de 10 segundos.
   */
  setTimeout(() => {
    clearInterval(interval);
  }, 10000);

})();
