/*!
 * shop-recompensas.js
 * Configuración de la tienda de recompensas para Spectra.
 *
 * @version 1.1.0
 *
 * Requiere:
 * - pixie-shop.js
 * - pixie-shop-fields.js
 * - pixie-shop-renderers.js
 * - pixie-shop-sections.js
 * - pixie-shop-totals.js
 * - pixie-shop-validators.js
 * - pixie-shop-output.js
 */

(function (window) {
  "use strict";

  const SHOP_NAME = "recompensas";

  if (!window.PixieShop) {
    console.warn(
      "[ShopRecompensas] PixieShop no está disponible."
    );

    return;
  }

  const PixieShop = window.PixieShop;

  /*
   * Módulos requeridos
   */

  const REQUIRED_MODULES = [
    "fields",
    "renderers",
    "sections",
    "totals",
    "validators",
    "output"
  ];

  const missingModules =
    REQUIRED_MODULES.filter(
      (moduleName) => {
        return !PixieShop.hasModule(
          moduleName
        );
      }
    );

  if (missingModules.length) {
    console.warn(
      [
        "[ShopRecompensas] Faltan módulos de PixieShop:",
        missingModules.join(", ")
      ].join(" ")
    );

    return;
  }

  const fields =
    PixieShop.use("fields");

  const sections =
    PixieShop.use("sections");

  const totals =
    PixieShop.use("totals");

  /*
   * Datos de ejemplo
   *
   * Si window.SPECTRA_RECOMPENSAS existe,
   * se utilizarán esos datos en su lugar.
   */

  const DEFAULT_REWARDS = [
    {
      id: "participacion-evento",

      titulo:
        "Participación en evento",

      dinero: 50,

      categoria:
        "Eventos",

      descripcion:
        "Recompensa por participar en un evento del foro.",

      tags: [
        "evento",
        "participación"
      ]
    },

    {
      id: "tema-finalizado",

      titulo:
        "Tema finalizado",

      dinero: 25,

      categoria:
        "Rol",

      descripcion:
        "Recompensa por finalizar un tema de rol.",

      tags: [
        "rol",
        "tema"
      ]
    }
  ];

  const REWARDS =
    Array.isArray(
      window.SPECTRA_RECOMPENSAS
    )
      ? window.SPECTRA_RECOMPENSAS
      : DEFAULT_REWARDS;

  /*
   * Campo de enlaces
   *
   * El número de inputs se sincronizará
   * automáticamente con la cantidad.
   */

  const rewardLinkField =
    fields.repeatableUrl({
      name: "links",

      label: "Enlaces",

      outputLabel: "Enlace",

      placeholder: "https://...",

      required: true,

      min: 1,

      max: null,

      outsideOutput: true,

      autocomplete: "url",

      addLabel:
        "Añadir otro enlace",

      removeLabel:
        "Eliminar enlace"
    });

  /*
   * Sincroniza la cantidad de inputs
   * con la cantidad de recompensas.
   *
   * Cantidad 1 → 1 enlace
   * Cantidad 2 → 2 enlaces
   * Cantidad 3 → 3 enlaces
   */

  function syncLinksWithQuantity({
    cart,
    shop
  }) {
    let changed = false;

    Object.values(
      cart?.sections || {}
    ).forEach((entries) => {
      if (!Array.isArray(entries)) {
        return;
      }

      entries.forEach((entry) => {
        const quantity = Math.max(
          1,
          Math.floor(
            Number(entry.quantity) || 1
          )
        );

        /*
         * Compatibilidad con entradas antiguas
         * guardadas en localStorage.
         */

        entry.fields ||= {};

        const links = Array.isArray(
          entry.fields.links
        )
          ? entry.fields.links
          : [];

        while (
          links.length < quantity
        ) {
          links.push("");
          changed = true;
        }

        if (
          links.length > quantity
        ) {
          links.length = quantity;
          changed = true;
        }

        entry.fields.links = links;
      });
    });

    if (!changed) {
      return;
    }

    shop.saveCart();
    shop.renderCart();
  }

  /*
   * Configuración de la tienda
   */

  PixieShop.register(
    SHOP_NAME,
    {
      items: REWARDS,

      currency: "MONEDAS",

      storageKey:
        "spectra_shop_recompensas",

      persist: true,

      requireLogin: true,

      itemsPerPage: 24,

      features: {
        search: true,
        sort: true,
        categories: true,
        tags: true
      },

      fields: {
        id: "id",
        title: "titulo",
        category: "categoria",
        tags: "tags",
        value: "dinero"
      },

      quantity: {
        enabled: true,
        min: 1,
        max: 99,
        step: 1
      },

      cart: {
        defaultSection:
          "recompensas",

        mergeDuplicates: true,

        uniqueItems: false,

        sectionResolver:
          sections.fixed(
            "recompensas"
          )
      },

      /*
       * Sección del carrito
       */

      sections: {
        recompensas:
          sections.basic({
            label:
              "RECOMPENSAS",

            emptyText:
              "No hay recompensas añadidas.",

            fields: [
              rewardLinkField
            ],

            /*
             * dinero × cantidad
             */

            total:
              totals.sum({
                field: "dinero",

                multiplyQuantity:
                  true
              })
          })
      },

      /*
       * Renderizado
       */

      renderer: {
        item: {
          type: "card",

          fields: {
            media:
              "mediaHTML",

            category:
              "categoria",

            title:
              "titulo",

            description:
              "descripcion",

            effect: null,

            value:
              "dinero",

            tags:
              "tags"
          },

          hideEmpty: true,

          trustedMediaHTML: true,

          afterRender({
            node
          }) {
            node.classList.add(
              "shop-reward"
            );

            /*
             * Elimina el espacio reservado
             * para bonus o efectos.
             */

            node
              .querySelectorAll(
                [
                  "[data-shop-item-effect]",
                  ".shop-item-effect",
                  ".shop-item-bonus"
                ].join(", ")
              )
              .forEach(
                (element) => {
                  element.remove();
                }
              );

            /*
             * Todos los botones de la tarjeta
             * añaden una recompensa.
             */

            node
              .querySelectorAll(
                [
                  "[data-shop-action]",
                  ".shop-item-add",
                  ".shop-item-add-purchase"
                ].join(", ")
              )
              .forEach(
                (button) => {
                  button.dataset
                    .shopAction =
                    "add";

                  if (
                    !button.textContent
                      .trim()
                  ) {
                    button.textContent =
                      "Añadir recompensa";
                  }
                }
              );

            /*
             * Esta tienda no admite retiradas.
             */

            node
              .querySelectorAll(
                [
                  "[data-shop-action='withdrawal']",
                  ".shop-item-add-withdrawal",
                  "[data-shop-withdrawal]"
                ].join(", ")
              )
              .forEach(
                (element) => {
                  element.remove();
                }
              );
          }
        },

        cart: {
          type: "basic-cart",

          fields: {
            title:
              "titulo",

            value:
              "dinero"
          },

          showValue: true,

          showCurrency: true,

          showQuantity: true,

          renderFields: true,

          afterRender({
            node
          }) {
            node.classList.add(
              "cart-reward"
            );

            /*
             * Los enlaces dependen únicamente
             * de la cantidad.
             *
             * El usuario no necesita añadirlos
             * o eliminarlos manualmente.
             */

            node
              .querySelectorAll(
                [
                  ".cart-item-field-add",
                  ".cart-item-field-remove",
                  "[data-cart-action='add-field']",
                  "[data-cart-action='remove-field']"
                ].join(", ")
              )
              .forEach(
                (button) => {
                  button.remove();
                }
              );
          }
        }
      },

      /*
       * Validación
       *
       * El módulo valida automáticamente:
       * - que los campos sean obligatorios;
       * - que los valores sean URLs.
       *
       * Esta regla adicional comprueba que
       * haya un enlace completo por unidad.
       */

      validation: {
        rules: [
          {
            type: "custom",

            validate({
              entry,
              item,
              getFilledValues
            }) {
              const quantity =
                Math.max(
                  1,
                  Math.floor(
                    Number(
                      entry.quantity
                    ) || 1
                  )
                );

              const links =
                getFilledValues(
                  "links"
                );

              if (
                links.length <
                quantity
              ) {
                const title =
                  item.title ||
                  item.raw?.titulo ||
                  "La recompensa";

                return (
                  `${title}: debes indicar ` +
                  `${quantity} enlace(s), ` +
                  "uno por cada unidad."
                );
              }

              return null;
            }
          }
        ]
      },

      /*
       * Sincronización del carrito
       */

      hooks: {
        afterCartChange:
          syncLinksWithQuantity
      },

      /*
       * Publicación
       */

      output: {
        type: "message",

        codeBlock: true,

        codeOpen: "[code]",

        codeClose: "[/code]",

        sectionJoiner: "\n",

        entryJoiner: "\n",

        sections: {
          recompensas: {
            type: "collection",

            wrapperTag: "div",

            wrapperClass:
              "recompensas",

            entryJoiner: "\n",

            item: {
              tag:
                "s-recompensa",

              attrs: {
                titulo:
                  "titulo",

                dinero:
                  "dinero",

                cantidad:
                  "$quantity"
              }
            }
          }
        },

        outsideFields: {
          enabled: true,

          title:
            "JUSTIFICANTES",

          itemSeparator:
            "\n\n",

          linePrefix:
            "— "
        },

        totals: [
          {
            section:
              "recompensas",

            label:
              "TOTAL RECOMPENSAS",

            currency: true
          }
        ],

        totalJoiner: "\n",

        emptyMessage: ""
      },

      /*
       * Mensajes de interfaz
       */

      messages: {
        allCategories:
          "Todas",

        noTags:
          "Sin etiquetas",

        noResults:
          "No hay recompensas para mostrar.",

        uniqueItem:
          "{item} ya está en el carrito.",

        loginRequired:
          "Debes iniciar sesión para solicitar recompensas.",

        quantity:
          "Cantidad de {item}",

        remove:
          "Quitar {item}",

        increase:
          "Sumar una unidad de {item}",

        decrease:
          "Restar una unidad de {item}"
      },

      /*
       * Ordenación
       */

      sort(
        itemA,
        itemB,
        mode
      ) {
        switch (mode) {
          case "price-asc":
          case "value-asc":
            return (
              itemA.value -
              itemB.value
            );

          case "price-desc":
          case "value-desc":
            return (
              itemB.value -
              itemA.value
            );

          case "name-desc":
            return itemB.title
              .localeCompare(
                itemA.title,
                "es"
              );

          case "name-asc":
          default:
            return itemA.title
              .localeCompare(
                itemB.title,
                "es"
              );
        }
      }
    }
  );
})(window);
