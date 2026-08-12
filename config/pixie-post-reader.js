/*!
 * Spectra - PixiePostReader config
 */

(function () {
  "use strict";

  function configurePostReader() {
    /*
     * Pixie todavía no está listo.
     */
    if (!window.PixiePostReader) {
      return false;
    }

    /*
     * Configuración específica de Spectra.
     */
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
   * Si Pixie ya ha cargado,
   * configuramos inmediatamente.
   */
  if (configurePostReader()) {
    return;
  }


  /*
   * Si Pixie todavía está cargando,
   * comprobamos periódicamente hasta que
   * PixiePostReader esté disponible.
   */
  const interval = setInterval(() => {
    if (!configurePostReader()) {
      return;
    }

    clearInterval(interval);
  }, 50);


  /*
   * Seguridad:
   * dejamos de comprobar tras 10 segundos.
   */
  setTimeout(() => {
    clearInterval(interval);
  }, 10000);

})();
