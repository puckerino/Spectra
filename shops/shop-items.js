/*!
 * shop-items.js
 * Configuración de la tienda de items para Spectra.
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
 *   data-shop-config="items"
 * >
 *   ...
 * </form>
 */

(function (window) {
  "use strict";

  const SHOP_NAME = "items";

  /*
   * Comprobación del núcleo
   */

  if (!window.PixieShop) {
    console.warn(
      "[ShopItems] PixieShop no está disponible."
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
        "[ShopItems] Faltan módulos de PixieShop:",
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
   * Puedes sustituirlos declarando:
   *
   * window.SPECTRA_ITEMS = [...]
   *
   * antes de cargar este archivo.
   */

  const DEFAULT_ITEMS = [
    {
      id: "pocion-curativa",

      titulo:
        "Poción curativa",

      bonus:
        "+2 salud",

      descripcion:
        "Permite recuperar dos puntos de salud.",

      coste: 20,

      categoria:
        "Consumibles",

      tags: [
        "salud",
        "consumible"
      ],

      /*
       * Este item puede comprarse
       * y también retirarse.
       */

      allowPurchase: true,

      allowWithdrawal: true
    },

    {
      id: "amuleto-proteccion",

      titulo:
        "Amuleto de protección",

      bonus:
        "+1 defensa",

      descripcion:
        "Protege al portador frente a ataques físicos.",

      coste: 50,

      categoria:
        "Equipamiento",

      tags: [
        "defensa",
        "amuleto"
      ],

      /*
       * Solo puede comprarse.
       */

      allowPurchase: true,

      allowWithdrawal: false
    },

    {
      id: "llave-antigua",

      titulo:
        "Llave antigua",

      bonus:
        "Abre una localización especial",

      descripcion:
        "Una llave obtenida previamente que puede utilizarse durante una trama.",

      coste: 0,

      categoria:
        "Objetos especiales",

      tags: [
        "trama",
        "llave"
      ],

      /*
       * Solo puede retirarse.
       */

      allowPurchase: false,

      allowWithdrawal: true
    }
  ];

  /*
   * Normalización de datos
   *
   * También admite la propiedad antigua:
   *
   * retirada: true
   *
   * En ese caso se interpretará como:
   *
   * allowPurchase: false
   * allowWithdrawal: true
   */

  function normalizeItem(item) {
    const legacyWithdrawal =
      item.retirada === true;

    const hasPurchaseRule =
      typeof item.allowPurchase ===
      "boolean";

    const hasWithdrawalRule =
      typeof item.allowWithdrawal ===
      "boolean";

    return {
      ...item,

      coste:
        Number(item.coste) || 0,

      allowPurchase:
        hasPurchaseRule
          ? item.allowPurchase
          : !legacyWithdrawal,

      allowWithdrawal:
        hasWithdrawalRule
          ? item.allowWithdrawal
          : legacyWithdrawal
    };
  }

  const ITEMS = (
    Array.isArray(
      window.SPECTRA_ITEMS
    )
      ? window.SPECTRA_ITEMS
      : DEFAULT_ITEMS
  ).map(normalizeItem);

  /*
   * Campo de enlaces para retiradas
   *
   * La cantidad de inputs se sincroniza
   * automáticamente con la cantidad retirada.
   */

  const withdrawalLinksField =
    fields.repeatableUrl({
      name: "links",

      label:
        "Enlaces de uso",

      outputLabel:
        "Enlace de uso",

      placeholder:
        "https://...",

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
   * Acceso seguro a las secciones
   */

  function getSectionEntries(
    cart,
    sectionName
  ) {
    const sectionsMap =
      cart?.sections || {};

    const entries =
      sectionsMap[sectionName];

    return Array.isArray(entries)
      ? entries
      : [];
  }

  /*
   * Sincroniza enlaces y cantidad
   *
   * Solo se aplica a retiradas.
   *
   * Cantidad 1 → 1 enlace
   * Cantidad 2 → 2 enlaces
   * Cantidad 3 → 3 enlaces
   */

  function syncWithdrawalLinks({
    cart,
    shop
  }) {
    let changed = false;

    const entries =
      getSectionEntries(
        cart,
        "retiradas"
      );

    entries.forEach((entry) => {
      const quantity = Math.max(
        1,
        Math.floor(
          Number(entry.quantity) || 1
        )
      );

      /*
       * Compatibilidad con carritos
       * antiguos guardados.
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

    if (!changed) {
      return;
    }

    shop.saveCart();
    shop.renderCart();
  }

  /*
   * Devuelve las reglas de operación
   * del item original.
   */

  function getItemRules(item) {
    const raw =
      item?.raw || item || {};

    return {
      allowPurchase:
        raw.allowPurchase !== false,

      allowWithdrawal:
        raw.allowWithdrawal === true
    };
  }

  /*
   * Oculta botones que no correspondan
   * con las reglas del item.
   */

  function configureItemActions({
    node,
    item
  }) {
    const rules =
      getItemRules(item);

    const purchaseButtons =
      node.querySelectorAll(
        [
          "[data-shop-action='purchase']",
          ".shop-item-add-purchase",
          "[data-shop-purchase]"
        ].join(", ")
      );

    const withdrawalButtons =
      node.querySelectorAll(
        [
          "[data-shop-action='withdrawal']",
          ".shop-item-add-withdrawal",
          "[data-shop-withdrawal]"
        ].join(", ")
      );

    purchaseButtons.forEach(
      (button) => {
        if (
          !rules.allowPurchase
        ) {
          button.remove();
          return;
        }

        button.dataset.shopAction =
          "purchase";

        if (
          !button.textContent.trim()
        ) {
          button.textContent =
            "Comprar";
        }
      }
    );

    withdrawalButtons.forEach(
      (button) => {
        if (
          !rules.allowWithdrawal
        ) {
          button.remove();
          return;
        }

        button.dataset.shopAction =
          "withdrawal";

        if (
          !button.textContent.trim()
        ) {
          button.textContent =
            "Retirar";
        }
      }
    );

    /*
     * Compatibilidad con templates
     * que solo tengan un botón genérico.
     */

    const genericButton =
      node.querySelector(
        "[data-shop-action='add']"
      );

    if (!genericButton) {
      return;
    }

    if (
      rules.allowPurchase &&
      !rules.allowWithdrawal
    ) {
      genericButton.dataset
        .shopAction =
        "purchase";

      genericButton.textContent =
        "Comprar";

      return;
    }

    if (
      !rules.allowPurchase &&
      rules.allowWithdrawal
    ) {
      genericButton.dataset
        .shopAction =
        "withdrawal";

      genericButton.textContent =
        "Retirar";

      return;
    }

    /*
     * Si permite las dos acciones,
     * necesitamos dos botones.
     */

    if (
      rules.allowPurchase &&
      rules.allowWithdrawal
    ) {
      genericButton.dataset
        .shopAction =
        "purchase";

      genericButton.textContent =
        "Comprar";

      const withdrawalButton =
        genericButton.cloneNode(true);

      withdrawalButton.dataset
        .shopAction =
        "withdrawal";

      withdrawalButton.textContent =
        "Retirar";

      genericButton.after(
        withdrawalButton
      );

      return;
    }

    /*
     * Si no permite ninguna operación,
     * no debe mostrarse ningún botón.
     */

    genericButton.remove();
  }

  /*
   * Configuración de la tienda
   */

  PixieShop.register(
    SHOP_NAME,
    {
      /*
       * Datos
       */

      items: ITEMS,

      currency: "DADOS",

      storageKey:
        "spectra_shop_items",

      persist: true,

      requireLogin: true,

      itemsPerPage: 24,

      /*
       * Interfaz
       */

      features: {
        search: true,
        sort: true,
        categories: true,
        tags: true
      },

      /*
       * Correspondencia de campos
       *
       * PixieShop trabaja internamente
       * con item.value.
       *
       * En esta tienda:
       *
       * value = coste
       */

      fields: {
        id: "id",
        title: "titulo",
        category: "categoria",
        tags: "tags",
        value: "coste"
      },

      /*
       * Cantidad
       */

      quantity: {
        enabled: true,
        min: 1,
        max: 99,
        step: 1
      },

      /*
       * Carrito
       */

      cart: {
        defaultSection:
          "compras",

        mergeDuplicates: true,

        uniqueItems: false,

        /*
         * Cada acción lleva el item
         * a una sección distinta.
         */

        sectionResolver:
          sections.action({
            actions: {
              purchase:
                "compras",

              withdrawal:
                "retiradas",

              add:
                "compras"
            },

            fallback:
              "compras"
          })
      },

      /*
       * Secciones
       */

      sections: {
        /*
         * COMPRAS
         *
         * Se suma:
         *
         * coste × cantidad
         */

        compras:
          sections.purchase({
            label:
              "COMPRAS",

            emptyText:
              "No hay compras añadidas.",

            fields: [],

            total:
              totals.sum({
                field: "coste",

                multiplyQuantity:
                  true
              })
          }),

        /*
         * RETIRADAS
         *
         * No se suma ningún coste.
         */

        retiradas:
          sections.withdrawal({
            label:
              "RETIRADAS",

            emptyText:
              "No hay retiradas añadidas.",

            fields: [
              withdrawalLinksField
            ],

            total:
              totals.none()
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

            effect:
              "bonus",

            value:
              "coste",

            tags:
              "tags"
          },

          hideEmpty: true,

          trustedMediaHTML: true,

          afterRender({
            node,
            item
          }) {
            node.classList.add(
              "shop-store-item"
            );

            configureItemActions({
              node,
              item
            });
          }
        },

        cart: {
          type: "basic-cart",

          fields: {
            title:
              "titulo",

            value:
              "coste"
          },

          showValue: true,

          showCurrency: true,

          showQuantity: true,

          renderFields: true,

          afterRender({
            node,
            sectionName
          }) {
            node.classList.add(
              "cart-store-item"
            );

            if (
              sectionName ===
              "compras"
            ) {
              node.classList.add(
                "cart-purchase"
              );

              return;
            }

            if (
              sectionName ===
              "retiradas"
            ) {
              node.classList.add(
                "cart-withdrawal"
              );

              /*
               * Los inputs dependen únicamente
               * de la cantidad retirada.
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

              /*
               * En retirada no mostramos
               * el coste en el carrito.
               */

              node
                .querySelectorAll(
                  [
                    "[data-cart-item-value]",
                    ".cart-item-value",
                    "[data-shop-currency]"
                  ].join(", ")
                )
                .forEach(
                  (element) => {
                    element.remove();
                  }
                );
            }
          }
        }
      },

      /*
       * Validación
       *
       * La validación automática comprueba:
       *
       * - campos obligatorios;
       * - URLs válidas.
       *
       * Esta regla verifica además que haya
       * un enlace por cada unidad retirada.
       */

      validation: {
        rules: [
          {
            type: "custom",

            validate({
              sectionName,
              entry,
              item,
              getFilledValues
            }) {
              if (
                sectionName !==
                "retiradas"
              ) {
                return null;
              }

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
                  "El item";

                return (
                  `${title}: debes indicar ` +
                  `${quantity} enlace(s) ` +
                  "de uso, uno por cada unidad retirada."
                );
              }

              return null;
            }
          }
        ]
      },

      /*
       * Sincronización
       */

      hooks: {
        afterCartChange:
          syncWithdrawalLinks
      },

      /*
       * Publicación
       */

      output: {
        type: "message",

        codeBlock: true,

        codeOpen: "[code]",

        codeClose: "[/code]",

        sectionJoiner:
          "\n",

        entryJoiner:
          "\n",

        sections: {
          /*
           * Compras
           */

          compras: {
            type:
              "collection",

            wrapperTag:
              "div",

            wrapperClass:
              "compras",

            entryJoiner:
              "\n",

            item: {
              tag:
                "s-item",

              attrs: {
                tipo:
                  "compra",

                item:
                  "titulo",

                bonus:
                  "bonus",

                descripcion:
                  "descripcion",

                coste:
                  "coste",

                cantidad:
                  "$quantity"
              }
            }
          },

          /*
           * Retiradas
           */

          retiradas: {
            type:
              "collection",

            wrapperTag:
              "div",

            wrapperClass:
              "retiradas",

            entryJoiner:
              "\n",

            item: {
              tag:
                "s-item",

              attrs: {
                tipo:
                  "retirada",

                item:
                  "titulo",

                bonus:
                  "bonus",

                descripcion:
                  "descripcion",

                cantidad:
                  "$quantity"
              }
            }
          }
        },

        /*
         * Solo Retiradas tiene campos
         * externos, por lo que los enlaces
         * se publicarán automáticamente
         * para esa sección.
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
         * Solo se publica el total
         * de compras.
         */

        totals: [
          {
            section:
              "compras",

            label:
              "TOTAL COMPRAS",

            currency: true,

            hideZero: true
          }
        ],

        totalJoiner:
          "\n",

        emptyMessage: ""
      },

      /*
       * Mensajes
       */

      messages: {
        allCategories:
          "Todas",

        noTags:
          "Sin etiquetas",

        noResults:
          "No hay items para mostrar.",

        uniqueItem:
          "{item} ya está en esta sección del carrito.",

        loginRequired:
          "Debes iniciar sesión para utilizar la tienda.",

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
