/*!
 * shop-recompensas.js
 * Configuración de la tienda de recompensas para Spectra.
 *
 * @version 1.0.0
 *
 * Requiere:
 * - pixie-shop.js
 * - pixie-shop-fields.js
 * - pixie-shop-renderers.js
 * - pixie-shop-sections.js
 * - pixie-shop-totals.js
 * - pixie-shop-validators.js
 * - pixie-shop-output.js
 *
 * HTML:
 *
 * <form
 *   data-pixie-shop
 *   data-shop-config="recompensas"
 * >
 *   ...
 * </form>
 */

(function (window) {
  "use strict";

  const SHOP_NAME = "recompensas";

  /*
   * Comprobación de PixieShop.
   */

  if (!window.PixieShop) {
    console.warn(
      "[ShopRecompensas] PixieShop no está disponible."
    );

    return;
  }

  const PixieShop = window.PixieShop;

  /*
   * Módulos necesarios.
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
   * Datos de la tienda
   * -------------------
   *
   * Puedes editar esta lista directamente.
   *
   * Cada recompensa admite:
   *
   * {
   *   id: "identificador-unico",
   *   titulo: "Título visible",
   *   dinero: 50,
   *   categoria: "Categoría",
   *   tags: ["tag-1", "tag-2"],
   *   descripcion: "Texto opcional",
   *   mediaHTML: `...`,
   *
   *   quantity: {
   *     enabled: true,
   *     min: 1,
   *     max: 99
   *   }
   * }
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

  /*
   * Puedes definir los datos antes de cargar
   * este archivo:
   *
   * window.SPECTRA_RECOMPENSAS = [
   *   ...
   * ];
   *
   * Si no existe esa variable, se usarán los
   * ejemplos de DEFAULT_REWARDS.
   */

  const REWARDS =
    Array.isArray(
      window.SPECTRA_RECOMPENSAS
    )
      ? window.SPECTRA_RECOMPENSAS
      : DEFAULT_REWARDS;

  /*
   * Campo del carrito
   * -----------------
   *
   * Cada entrada necesita un enlace
   * justificativo.
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

    addLabel: "Añadir otro enlace",

    removeLabel: "Eliminar enlace"
  });

  function syncLinksWithQuantity({
  cart,
  shop
}) {
  let changed = false;

  Object.values(
    cart.sections
  ).forEach((entries) => {
    entries.forEach((entry) => {
      const quantity = Math.max(
        1,
        Number(entry.quantity) || 1
      );

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

  if (!changed) return;

  shop.saveCart();
  shop.renderCart();
}

  /*
   * Configuración de PixieShop.
   */

  PixieShop.register(
    SHOP_NAME,
    {
      /*
       * Datos.
       */

      items: REWARDS,

      /*
       * Moneda mostrada en la tienda,
       * carrito y total publicado.
       */

      currency: "MONEDAS",

      /*
       * Clave del carrito en localStorage.
       *
       * PixieShop añadirá automáticamente
       * el ID del usuario y la versión.
       */

      storageKey:
        "spectra_shop_recompensas",

      persist: true,

      requireLogin: true,

      itemsPerPage: 24,

      /*
       * Funciones de la interfaz.
       */

      features: {
        search: true,
        sort: true,
        categories: true,
        tags: true
      },

      /*
       * Correspondencia entre los campos
       * internos de PixieShop y los datos.
       */

      fields: {
        id: "id",
        title: "titulo",
        category: "categoria",
        tags: "tags",
        value: "dinero"
      },

      /*
       * Las recompensas pueden añadirse
       * varias veces.
       */

      quantity: {
        enabled: true,
        min: 1,
        max: 99,
        step: 1
      },

      /*
       * Configuración del carrito.
       *
       * Las recompensas repetidas se
       * fusionan y aumentan su cantidad.
       */

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
       * Sección única del carrito.
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
             * Suma:
             *
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
       * Renderizado de las tarjetas.
       *
       * Utiliza el template:
       *
       * [data-shop-item-template]
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

            /*
             * Las recompensas no tienen
             * bonus o efecto.
             */

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
            /*
             * Clase opcional para estilos
             * específicos de Spectra.
             */

            node.classList.add(
              "shop-reward"
            );

            /*
             * Si el template conserva un
             * elemento de efecto, lo quitamos.
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
             * Los botones deben añadir la
             * recompensa a la sección única.
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
             * No hay retirada en esta tienda.
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

        /*
         * Renderizado de las entradas
         * del carrito.
         *
         * El módulo fields insertará
         * automáticamente el input del enlace.
         */

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
          }
        }
      },

      /*
       * Validación
       * ----------
       *
       * No hacen falta reglas adicionales.
       *
       * pixie-shop-validators.js comprobará
       * automáticamente que:
       *
       * - el enlace esté rellenado;
       * - el contenido sea una URL válida.
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
        const quantity = Math.max(
          1,
          Number(entry.quantity) || 1
        );

        const links =
          getFilledValues("links");

        if (
          links.length < quantity
        ) {
          return (
            `${item.title}: debes indicar ` +
            `${quantity} enlace(s), uno por cada unidad.`
          );
        }

        return null;
      }
    }
  ]
},

      
hooks: {
  afterCartChange:
    syncLinksWithQuantity
},

      /*
       * Publicación
       * -----------
       *
       * Cada recompensa se publica como:
       *
       * <s-recompensa
       *   titulo="..."
       *   dinero="..."
       *   cantidad="..."
       * ></s-recompensa>
       *
       * El enlace se publica fuera de [code]
       * como justificante.
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

        /*
         * Los inputs con outsideOutput: true
         * aparecerán en este bloque.
         */

        outsideFields: {
          enabled: true,

          title:
            "JUSTIFICANTES",

          itemSeparator:
            "\n\n",

          linePrefix:
            "— "
        },

        /*
         * Total publicado al final.
         */

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
       * Textos de interfaz.
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
       * Ordenación personalizada.
       *
       * El núcleo ya gestiona:
       *
       * name-asc
       * name-desc
       *
       * Aquí añadimos:
       *
       * price-asc
       * price-desc
       * value-asc
       * value-desc
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
