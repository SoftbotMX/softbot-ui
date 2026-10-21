/** Lo que admite el editor clásico, y nada más.
 *
 * LA LISTA ES EL CONTRATO. Lo que no está aquí no existe en el esquema de
 * ProseMirror, y por eso tampoco sobrevive a un pegado: el `<span style=
 * "font-family…">` de Word, el `class="s1"` de Notas o el `div` del tema de
 * otra página se caen solos al parsear, sin una limpieza aparte. Es la muestra
 * de expreso.press (2026-10-21) la que fijó la lista: párrafos, negritas,
 * cursivas, subtítulos, citas, enlaces y saltos de línea; listas y tamaño de
 * letra los pidió el medio aparte.
 *
 * QUIEN CONSUME EL EDITOR VUELVE A LIMPIAR EN SU SERVIDOR. Esto decide lo que
 * se puede escribir, no lo que es seguro publicar.
 */
import { Extension, type Extensions } from "@tiptap/core";
import { Link } from "@tiptap/extension-link";
import { ListItem } from "@tiptap/extension-list";
// EL EXPORT NOMBRADO, NO EL PREDETERMINADO: en la salida CommonJS el
// predeterminado llega como `{ default, StarterKit }` y `configure` no existe
// (codex, la entrada `require` del kit).
import { StarterKit } from "@tiptap/starter-kit";

/** Los tamaños de letra, con el valor EXACTO que se escribe en el `style`.
 *  Fuera de estos dos, el párrafo es de tamaño normal. */
export const TAMANOS = { chico: "0.875em", grande: "1.25em" } as const;
export type Tamano = keyof typeof TAMANOS;

const VALORES = new Set<string>(Object.values(TAMANOS));

/** Los protocolos de un enlace. Un `javascript:` pegado se queda en texto. */
export const PROTOCOLOS = ["http", "https", "mailto"] as const;

export function enlacePermitido(url: string): boolean {
  try {
    const u = new URL(url);
    return (PROTOCOLOS as readonly string[]).includes(u.protocol.replace(/:$/, ""));
  } catch {
    return false;
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tamanoDeTexto: {
      /** Pone el tamaño a los párrafos de la selección; `null` vuelve al normal. */
      ponerTamano: (tamano: Tamano | null) => ReturnType;
    };
  }
}

/** El tamaño va en el `style` del `<p>`, igual que lo recibe WordPress: así el
 *  editor, la vista previa y el portal leen lo mismo, y no depende de que el
 *  tema defina las clases de tamaño de Gutenberg. */
export const TamanoDeTexto = Extension.create({
  name: "tamanoDeTexto",
  addGlobalAttributes() {
    return [
      {
        types: ["paragraph"],
        attributes: {
          tamano: {
            default: null,
            parseHTML: (el: HTMLElement) => {
              const v = el.style.fontSize;
              return VALORES.has(v) ? v : null;
            },
            // SE VUELVE A MIRAR AL PINTAR: un documento que entra como JSON
            // no pasa por `parseHTML`, y el atributo llegaría tal cual al `style`.
            renderHTML: (attrs: { tamano?: string | null }) =>
              attrs.tamano && VALORES.has(attrs.tamano) ? { style: `font-size:${attrs.tamano}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      ponerTamano:
        (tamano) =>
        ({ commands }) =>
          commands.updateAttributes("paragraph", {
            tamano: tamano === null ? null : TAMANOS[tamano],
          }),
    };
  },
});

/** UN ENLACE ES SU `href` Y NADA MÁS. El de TipTap trae `target`, `rel` y
 *  `class` en el esquema, y un enlace pegado con `class="hidden"` escondía
 *  texto dentro del propio editor (codex). */
const EnlaceDelClasico = Link.extend({
  addAttributes() {
    return { href: { default: null } };
  },
  // EL PROTOCOLO SE VUELVE A MIRAR AL PINTAR. El `renderHTML` de TipTap ya lo
  // hacía, y reescribirlo lo quitó: un documento que entra como JSON —el que
  // el consumidor arma desde lo guardado— no pasa por `parseHTML`, y un
  // `javascript:` salía en el `href` (revisión de seguridad).
  renderHTML({ HTMLAttributes }) {
    const href = HTMLAttributes.href;
    return ["a", typeof href === "string" && enlacePermitido(href) ? { href } : {}, 0];
  },
});

/** UN ELEMENTO DE LISTA ES UN PÁRRAFO, sin listas dentro. Con sublistas, el
 *  párrafo que precede a una no se podía convertir en subtítulo ni sacar de la
 *  lista (codex), y la muestra de Expreso no tiene ni una lista, menos
 *  anidadas. Una sublista pegada queda como lista aparte. */
const ElementoDeLista = ListItem.extend({ content: "paragraph" });

/** Las extensiones del editor clásico. El consumidor puede añadir las suyas
 *  (las fotos de MDX), nunca quitar estas. */
export function extensionesDelClasico(): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      code: false,
      codeBlock: false,
      strike: false,
      underline: false,
      horizontalRule: false,
      // SIN PÁRRAFO VACÍO AL FINAL: el consumidor guarda cada nodo como un
      // bloque, y ése se guardaría como un párrafo en blanco detrás de cada
      // subtítulo o foto que cierre la nota.
      trailingNode: false,
      link: false,
      listItem: false,
    }),
    ElementoDeLista,
    EnlaceDelClasico.configure({
      openOnClick: false,
      autolink: false,
      linkOnPaste: false,
      protocols: [...PROTOCOLOS],
      isAllowedUri: (url) => enlacePermitido(url),
    }),
    TamanoDeTexto,
  ];
}
