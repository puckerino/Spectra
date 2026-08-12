/*!
 * Spectra - PixiePostReader config
 *
 * Configuración de la estructura de posts
 * de Spectra para PixiePostReader.
 */

(function () {
  "use strict";

  if (!window.PixiePostReader) {
    console.warn(
      "[Spectra] PixiePostReader no está cargado."
    );

    return;
  }

  PixiePostReader.configure({
    /*
     * ============================================
     * POST
     * ============================================
     *
     * <article id="p69" class="post">
     */
    post: {
      rootSelector:
        "article.post",

      idPrefix:
        "p",

      /*
       * <a
       *   class="permalink"
       *   id="69"
       * >
       */
      permalinkSelector:
        ".permalink[id]"
    },


    /*
     * ============================================
     * CODEBOX
     * ============================================
     *
     * <article class="content message">
     *   <dl class="codebox">
     *     <code>...</code>
     *   </dl>
     * </article>
     */
    content: {
      codeSelector:
        ".content.message dl.codebox code"
    },


    /*
     * ============================================
     * PERFIL DEL AUTOR
     * ============================================
     *
     * Se busca siempre dentro del post concreto.
     */
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
})();
