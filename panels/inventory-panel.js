/*!
 * Spectra - Inventory Panel
 */

(function () {
  "use strict";


  /*
   * =========================================================
   * UTILIDADES
   * =========================================================
   */

  function decodeHTML(value) {
    const textarea =
      document.createElement("textarea");

    textarea.innerHTML =
      String(value || "");

    return textarea.value;
  }


  function escapeAttribute(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }


  function cloneInventoryMap(source) {
    return new Map(
      Array.from(
        source.entries()
      ).map(
        ([key, value]) => [
          key,
          {
            ...value
          }
        ]
      )
    );
  }


  /*
   * =========================================================
   * INVENTARIO GUARDADO → MAP
   * =========================================================
   */

  function inventoryToMap(value) {
    const container =
      document.createElement("div");

    container.innerHTML =
      decodeHTML(value);

    const map =
      new Map();


    container
      .querySelectorAll("s-item")
      .forEach(node => {
        const item =
          (
            node.getAttribute("item") ||
            ""
          ).trim();

        if (!item) {
          return;
        }


        const cantidad =
          parseFloat(
            node.getAttribute(
              "cantidad"
            ) || "0"
          ) || 0;


        const coste =
          parseFloat(
            node.getAttribute(
              "coste"
            ) || "0"
          ) || 0;


        const bonus =
          (
            node.getAttribute(
              "bonus"
            ) || ""
          ).trim();


        const descripcion =
          (
            node.getAttribute(
              "descripcion"
            ) || ""
          ).trim();


        if (!map.has(item)) {
          map.set(
            item,
            {
              cantidad: 0,
              coste,
              bonus,
              descripcion
            }
          );
        }


        const current =
          map.get(item);

        current.cantidad +=
          cantidad;


        if (
          !current.coste &&
          coste
        ) {
          current.coste =
            coste;
        }


        if (
          !current.bonus &&
          bonus
        ) {
          current.bonus =
            bonus;
        }


        if (
          !current.descripcion &&
          descripcion
        ) {
          current.descripcion =
            descripcion;
        }
      });


    return map;
  }


  /*
   * =========================================================
   * MAP → INVENTARIO GUARDADO
   * =========================================================
   */

  function mapToInventory(map) {
    return Array.from(
      map.entries()
    )
      .filter(
        ([, data]) =>
          data.cantidad > 0
      )
      .sort(
        (a, b) =>
          a[0].localeCompare(
            b[0],
            "es"
          )
      )
      .map(
        ([item, data]) => {
          const attrs = [
            `item="${escapeAttribute(item)}"`,
            `cantidad="${escapeAttribute(data.cantidad)}"`
          ];


          if (data.coste) {
            attrs.push(
              `coste="${escapeAttribute(data.coste)}"`
            );
          }


          if (data.bonus) {
            attrs.push(
              `bonus="${escapeAttribute(data.bonus)}"`
            );
          }


          if (data.descripcion) {
            attrs.push(
              `descripcion="${escapeAttribute(data.descripcion)}"`
            );
          }


          return (
            `<s-item ${attrs.join(" ")}></s-item>`
          );
        }
      )
      .join("\n");
  }


  /*
   * =========================================================
   * REGISTRAR PANEL
   * =========================================================
   */

  function registerInventoryPanel() {
    /*
     * Pixie todavía no está listo.
     */
    if (!window.PixieProfilePanel) {
      return false;
    }


    /*
     * Evitamos registrar dos veces el mismo panel
     * si el intervalo vuelve a ejecutarse.
     */
    if (
      PixieProfilePanel.registry?.has?.(
        "inventory"
      )
    ) {
      return true;
    }


    PixieProfilePanel.register(
      "inventory",
      {
        title:
          "Ajuste de inventario",

        description:
          "Carga un post y aplica automáticamente sus compras y retiradas.",


        /*
         * =====================================================
         * CÓMO LEER EL POST
         * =====================================================
         */

        source: {
          reader:
            "items",

          options: {
            /*
             * Cada objeto de la Shop:
             *
             * <s-item ...>
             */
            itemSelector:
              "s-item",


            /*
             * Cada grupo genera una operación distinta.
             */
            groups: [
              {
                selector:
                  ".compras",

                field:
                  "inventory",

                operation:
                  "add"
              },

              {
                selector:
                  ".retiradas",

                field:
                  "inventory",

                operation:
                  "subtract"
              }
            ],


            /*
             * Cómo se llaman los atributos
             * en el HTML de Spectra.
             */
            attributes: {
              item:
                "item",

              quantity:
                "cantidad",

              price:
                "coste",

              extra: [
                "bonus",
                "descripcion"
              ]
            },


            /*
             * Cómo queremos que Pixie
             * normalice esos atributos.
             */
            output: {
              item:
                "item",

              quantity:
                "cantidad",

              price:
                "precio"
            },


            /*
             * Calculamos automáticamente:
             *
             * cantidad × precio
             *
             * para todo lo que esté en .compras
             */
            total: {
              field:
                "spent",

              from:
                ".compras",

              operation:
                "add"
            }
          }
        },


        /*
         * =====================================================
         * CAMPOS DEL PERFIL
         * =====================================================
         */

        fields: [
          /*
           * ===================================================
           * INVENTARIO
           * ===================================================
           */

          {
            key:
              "inventory",

            label:
              "Inventario",

            id:
              "field_id9",

            field:
              "inventario",

            forumField:
              "9",

            type:
              "html",

            operations: [
              "add",
              "subtract"
            ],


            /*
             * PixieProfile lee el HTML del campo
             * y aquí lo convertimos a Map.
             */
            read({
              html,
              text
            }) {
              return inventoryToMap(
                html || text
              );
            },


            /*
             * =================================================
             * APLICAR CAMBIO
             * =================================================
             */

            apply({
              current,
              operation,
              value
            }) {
              const map =
                cloneInventoryMap(
                  current instanceof Map
                    ? current
                    : new Map()
                );


              const item =
                String(
                  value?.item ||
                  ""
                ).trim();


              if (!item) {
                return map;
              }


              const cantidad =
                Number(
                  value?.cantidad
                ) || 0;


              const precio =
                Number(
                  value?.precio
                ) || 0;


              const bonus =
                String(
                  value?.bonus ||
                  ""
                ).trim();


              const descripcion =
                String(
                  value?.descripcion ||
                  ""
                ).trim();


              /*
               * Si todavía no existe,
               * lo creamos.
               */
              if (!map.has(item)) {
                map.set(
                  item,
                  {
                    cantidad: 0,
                    coste: precio,
                    bonus,
                    descripcion
                  }
                );
              }


              const data =
                map.get(item);


              /*
               * SUMAR
               */
              if (
                operation ===
                "add"
              ) {
                data.cantidad +=
                  cantidad;


                if (precio) {
                  data.coste =
                    precio;
                }


                if (bonus) {
                  data.bonus =
                    bonus;
                }


                if (descripcion) {
                  data.descripcion =
                    descripcion;
                }
              }


              /*
               * RESTAR
               */
              if (
                operation ===
                "subtract"
              ) {
                data.cantidad -=
                  cantidad;
              }


              /*
               * Si el objeto llega a 0,
               * desaparece del inventario.
               */
              if (
                data.cantidad <= 0
              ) {
                map.delete(item);
              }


              return map;
            },


            /*
             * Antes de guardar:
             *
             * Map → <s-item>
             */
            write(value) {
              return mapToInventory(
                value
              );
            },


            /*
             * Cómo mostramos el inventario
             * en la previsualización.
             */
            format(value) {
              if (
                !(value instanceof Map)
              ) {
                return "—";
              }


              if (!value.size) {
                return "Inventario vacío";
              }


              return Array.from(
                value.entries()
              )
                .map(
                  ([item, data]) =>
                    `${data.cantidad} × ${item}`
                )
                .join("\n");
            },


            /*
             * Cómo mostramos cada cambio detectado.
             */
            formatDirective({
              directive
            }) {
              const value =
                directive.value ||
                {};

              const cantidad =
                Number(
                  value.cantidad
                ) || 0;

              const item =
                value.item ||
                "Objeto";

              return (
                `${cantidad} × ${item}`
              );
            }
          },


          /*
           * ===================================================
           * DINERO GASTADO
           * ===================================================
           */

          {
            key:
              "spent",

            label:
              "Dinero gastado",

            id:
              "field_id7",

            field:
              "dinero-gastado",

            forumField:
              "7",

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

  /*
   * Si PixieProfilePanel ya existe,
   * el registro se hace inmediatamente.
   */
  if (registerInventoryPanel()) {
    return;
  }


  /*
   * Si el loader de Pixie todavía está trabajando,
   * esperamos hasta que PixieProfilePanel aparezca.
   */
  const interval =
    setInterval(() => {
      if (
        !registerInventoryPanel()
      ) {
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
