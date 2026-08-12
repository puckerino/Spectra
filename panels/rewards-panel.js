/*!
 * Spectra - Rewards Panel
 *
 * Lee recompensas publicadas en un post
 * y suma únicamente el total numérico
 * al campo "Dinero ganado".
 */

(function () {
  "use strict";


  /*
   * =========================================================
   * REGISTRAR PANEL
   * =========================================================
   */

  function registerRewardsPanel() {
    /*
     * Pixie todavía no está listo.
     */
    if (!window.PixieProfilePanel) {
      return false;
    }


    /*
     * Evitar registros duplicados.
     */
    if (
      PixieProfilePanel.registry?.has?.(
        "rewards"
      )
    ) {
      return true;
    }


    PixieProfilePanel.register(
      "rewards",
      {
        title:
          "Entrega de recompensas",

        description:
          "Carga un post y suma automáticamente el total de recompensas al dinero ganado del autor.",


        /*
         * =====================================================
         * CÓMO LEER EL POST
         * =====================================================
         *
         * Ejemplo:
         *
         * <div class="recompensas">
         *
         *   <s-recompensa
         *     titulo="Tema finalizado"
         *     dinero="40"
         *     cantidad="1">
         *   </s-recompensa>
         *
         * </div>
         */

        source: {
          reader:
            "items",

          options: {
            /*
             * Cada recompensa.
             */
            itemSelector:
              "s-recompensa",


            /*
             * Leemos las recompensas, pero
             * NO emitimos una directiva por cada una.
             *
             * Solo nos interesan para calcular el total.
             */
            groups: [
              {
                selector:
                  ".recompensas",

                field:
                  "earned",

                operation:
                  "add",

                emit:
                  false
              }
            ],


            /*
             * Atributos del componente.
             */
            attributes: {
              item:
                "titulo",

              quantity:
                "cantidad",

              price:
                "dinero"
            },


            /*
             * Normalización interna.
             */
            output: {
              item:
                "titulo",

              quantity:
                "cantidad",

              price:
                "dinero"
            },


            /*
             * =================================================
             * TOTAL
             * =================================================
             *
             * cantidad × dinero
             *
             * ÚNICAMENTE este total genera una directiva.
             */
            total: {
              field:
                "earned",

              from:
                ".recompensas",

              operation:
                "add"
            }
          }
        },


        /*
         * =====================================================
         * CAMPOS DEL PERFIL
         * =====================================================
         *
         * SOLO EXISTE UNO:
         *
         * Dinero ganado.
         */

        fields: [
          {
            key:
              "earned",

            label:
              "Dinero ganado",

            id:
              "field_id8",

            field:
              "dinero-ganado",

            forumField:
              "8",

            type:
              "number",

            operations: [
              "add"
            ],

            min:
              0
          }
        ]
      }
    );


    return true;
  }


  /*
   * =========================================================
   * ESPERAR A PIXIE
   * =========================================================
   */

  if (
    registerRewardsPanel()
  ) {
    return;
  }


  const interval =
    setInterval(() => {
      if (
        !registerRewardsPanel()
      ) {
        return;
      }

      clearInterval(
        interval
      );

      clearTimeout(
        timeout
      );
    }, 50);


  const timeout =
    setTimeout(() => {
      clearInterval(
        interval
      );

      if (
        !window.PixieProfilePanel
      ) {
        console.error(
          "[Spectra] PixieProfilePanel no estuvo disponible para rewards-panel."
        );
      }
    }, 20000);

})();
