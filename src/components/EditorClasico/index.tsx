/** Un editor de texto con formato, como el editor clásico de WordPress: una
 *  barra arriba y el documento entero debajo.
 *
 * EL DOCUMENTO ENTRA Y SALE COMO `JSONContent` DE TIPTAP, no como HTML. Pasarlo
 * a lo que se guarda es cosa del consumidor: MDX lo serializa a su cuerpo por
 * bloques, con sus fotos dentro. Un componente del kit que decidiera el formato
 * guardado obligaría a todos los proyectos a guardar igual.
 *
 * `extensiones` AÑADE, NO QUITA. El consumidor mete sus nodos (las fotos de MDX)
 * y los ve dentro del mismo documento, con el mismo deshacer; lo que admite la
 * barra sigue siendo la lista de `extensionesDelClasico`.
 *
 * NO ES CONTROLADO. TipTap guarda su propio estado, y reescribirlo en cada
 * tecla desde fuera pierde la selección y el deshacer. `contenido` es el
 * documento inicial; para cargar otro, se cambia la `key` del componente.
 */
import { type Editor, type Extensions, type JSONContent } from "@tiptap/core";
import { liftTarget } from "@tiptap/pm/transform";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import clsx from "clsx";
import * as React from "react";

import Button from "../Button";
import Dropdown from "../Dropdown";
import { usePanel } from "../Dropdown/usePanel";
import Input from "../Input";
import Select from "../Select";
import SelectorDeEmoji from "../SelectorDeEmoji";
import { TAMANOS, enlacePermitido, extensionesDelClasico, type Tamano } from "./extensiones";

export { TAMANOS, enlacePermitido, extensionesDelClasico, type Tamano } from "./extensiones";

/** Los textos de la barra. Van en español por omisión; se pueden cambiar. */
export interface TextosDelEditor {
  formato: string;
  parrafo: string;
  subtitulo: string;
  subtituloMenor: string;
  cita: string;
  negrita: string;
  cursiva: string;
  enlace: string;
  enlaceUrl: string;
  enlaceAplicar: string;
  enlaceQuitar: string;
  enlaceInvalido: string;
  enlaceSinSeleccion: string;
  vinetas: string;
  numerada: string;
  tamano: string;
  chico: string;
  normal: string;
  grande: string;
  emoji: string;
  deshacer: string;
  rehacer: string;
}

export const TEXTOS_DEL_EDITOR: TextosDelEditor = {
  formato: "Formato del párrafo",
  parrafo: "Párrafo",
  subtitulo: "Subtítulo",
  subtituloMenor: "Subtítulo menor",
  cita: "Cita",
  negrita: "Negrita",
  cursiva: "Cursiva",
  enlace: "Enlace",
  enlaceUrl: "https://…",
  enlaceAplicar: "Aplicar",
  enlaceQuitar: "Quitar enlace",
  enlaceInvalido: "Sólo enlaces http, https o mailto",
  enlaceSinSeleccion: "Selecciona el texto que quieres enlazar",
  vinetas: "Lista con viñetas",
  numerada: "Lista numerada",
  tamano: "Tamaño de letra",
  chico: "Chico",
  normal: "Normal",
  grande: "Grande",
  emoji: "Insertar emoji",
  deshacer: "Deshacer",
  rehacer: "Rehacer",
};

export interface EditorClasicoProps {
  /** El documento inicial. Para cargar otro, cambia la `key`. */
  contenido?: JSONContent;
  onCambio?: (doc: JSONContent) => void;
  /** Nodos y extensiones del consumidor, además de los del clásico. */
  extensiones?: Extensions;
  /** El editor ya montado, para que el consumidor inserte sus nodos. */
  onListo?: (editor: Editor) => void;
  soloLectura?: boolean;
  /** El nombre del área de texto para el lector de pantalla. */
  etiqueta: string;
  textos?: Partial<TextosDelEditor>;
  /** Dónde se sirven los datos de los emojis (ver `SelectorDeEmoji`). */
  urlDeEmojis?: string;
  /** Botones del consumidor al final de la barra. */
  barraExtra?: React.ReactNode;
  className?: string;
}

type Bloque = "p" | "h2" | "h3" | "cita";

function bloqueActual(e: Editor): Bloque {
  if (e.isActive("blockquote")) return "cita";
  if (e.isActive("heading", { level: 2 })) return "h2";
  if (e.isActive("heading", { level: 3 })) return "h3";
  return "p";
}

function tamanoActual(e: Editor): Tamano | "normal" {
  const v = e.getAttributes("paragraph").tamano as string | null | undefined;
  return (Object.keys(TAMANOS) as Tamano[]).find((k) => TAMANOS[k] === v) ?? "normal";
}

/** Hay algún párrafo en la selección. `isActive("paragraph")` pide que lo
 *  cubra ENTERA, y una selección que cruza una lista o una cita no lo cumple
 *  aunque esté llena de párrafos (codex). */
function hayParrafo(e: Editor): boolean {
  const { from, to } = e.state.selection;
  let hay = false;
  e.state.doc.nodesBetween(from, to, (n) => {
    if (n.type.name === "paragraph") hay = true;
    return !hay;
  });
  return hay || e.isActive("paragraph");
}

/** Si hay letras seleccionadas: es sobre lo que cae un enlace. Unos espacios
 *  o una figura no cuentan. */
function hayTextoSeleccionado(e: Editor): boolean {
  const { from, to, empty } = e.state.selection;
  return !empty && e.state.doc.textBetween(from, to, " ").trim() !== "";
}

/** Saca de sus citas y listas cada párrafo de la selección, y sólo esos: en
 *  una cita de tres párrafos, convertir el del medio deja los otros dos
 *  citados, como en el clásico.
 *
 * DE UNO EN UNO Y DE ABAJO ARRIBA. Levantar la selección entera de golpe no
 * puede cuando cruza el borde de una cita o una lista (codex), y levantar un
 * bloque sólo parte lo que viene detrás, así que los de arriba no se mueven. */
function desenvolver(e: Editor) {
  const tr = e.state.tr;
  const { from, to } = tr.selection;
  const bloques: number[] = [];
  tr.doc.nodesBetween(from, to, (n, pos) => {
    if (n.isTextblock) {
      bloques.push(pos);
      return false;
    }
    return true;
  });
  for (const inicio of bloques.reverse()) {
    let pos = inicio;
    // El tope es la profundidad: cada vuelta saca el bloque un nivel.
    for (let vuelta = 0; vuelta < 20; vuelta++) {
      const $p = tr.doc.resolve(pos + 1);
      if ($p.depth <= 1) break;
      const rango = $p.blockRange();
      const destino = rango ? liftTarget(rango) : null;
      if (rango === null || destino == null) break;
      const pasos = tr.steps.length;
      tr.lift(rango, destino);
      pos = tr.mapping.slice(pasos).map(pos);
    }
  }
  if (tr.docChanged) e.view.dispatch(tr);
}

function ponerBloque(e: Editor, b: Bloque) {
  // LA CITA ENVUELVE, LOS DEMÁS SUSTITUYEN, y sustituir es sacar primero de
  // las citas y listas que toque la selección: un subtítulo citado o dentro
  // de una lista no existe en el clásico (codex).
  if (b === "cita") {
    // UNA CITA ES DE PÁRRAFOS: un subtítulo que se cita deja de serlo.
    e.chain().focus().setParagraph().setBlockquote().run();
    return;
  }
  desenvolver(e);
  const c = e.chain().focus();
  if (b === "p") c.setParagraph();
  else c.setHeading({ level: b === "h2" ? 2 : 3 });
  c.run();
}

const EditorClasico = ({
  contenido,
  onCambio,
  extensiones = [],
  onListo,
  soloLectura = false,
  etiqueta,
  textos,
  urlDeEmojis,
  barraExtra,
  className,
}: EditorClasicoProps) => {
  const t = { ...TEXTOS_DEL_EDITOR, ...textos };
  const alCambiar = React.useRef(onCambio);
  alCambiar.current = onCambio;

  const editor = useEditor({
    extensions: [...extensionesDelClasico(), ...extensiones],
    content: contenido,
    editable: !soloLectura,
    immediatelyRender: true,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": etiqueta,
        class: "editor-clasico-documento",
      },
    },
    onUpdate: ({ editor: e }) => alCambiar.current?.(e.getJSON()),
  });

  React.useEffect(() => {
    if (editor) onListo?.(editor);
    // Sólo al montarse: `onListo` es para tomar el editor, no un efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  React.useEffect(() => {
    // SIN AVISAR: cambiar a sólo lectura no es un cambio del documento, y
    // `setEditable` emite `update` por omisión (codex).
    editor?.setEditable(!soloLectura, false);
  }, [editor, soloLectura]);

  const estado = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e === null
        ? null
        : {
            bloque: bloqueActual(e),
            tamano: tamanoActual(e),
            enParrafo: hayParrafo(e),
            negrita: e.isActive("bold"),
            cursiva: e.isActive("italic"),
            enlace: e.isActive("link"),
            conTexto: hayTextoSeleccionado(e),
            href: (e.getAttributes("link").href as string | undefined) ?? "",
            vinetas: e.isActive("bulletList"),
            numerada: e.isActive("orderedList"),
            puedeDeshacer: e.can().undo(),
            puedeRehacer: e.can().redo(),
          },
  });

  if (editor === null || estado === null) return null;

  const off = soloLectura;
  const marca = (activa: boolean) => (activa ? "soft" : "ghost");

  return (
    <div className={clsx("editor-clasico", off && "editor-clasico-solo-lectura", className)}>
      {/* UN GRUPO Y NO `toolbar`: la barra del clásico se recorre con Tab, y
          `toolbar` promete flechas que no hay (codex). */}
      <div className="editor-clasico-barra" role="group" aria-label={etiqueta}>
        <Select
          size="sm"
          aria-label={t.formato}
          disabled={off}
          wrapperClassName="editor-clasico-formato"
          value={estado.bloque}
          options={[
            { value: "p", label: t.parrafo },
            { value: "h2", label: t.subtitulo },
            { value: "h3", label: t.subtituloMenor },
            { value: "cita", label: t.cita },
          ]}
          onChange={(v) => ponerBloque(editor, v as Bloque)}
        />
        <span className="editor-clasico-separador" aria-hidden="true" />
        <Button
          size="sm"
          look={marca(estado.negrita)}
          aria-label={t.negrita}
          aria-pressed={estado.negrita}
          title={t.negrita}
          disabled={off}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <b aria-hidden="true">B</b>
        </Button>
        <Button
          size="sm"
          look={marca(estado.cursiva)}
          aria-label={t.cursiva}
          aria-pressed={estado.cursiva}
          title={t.cursiva}
          disabled={off}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i aria-hidden="true">I</i>
        </Button>
        <BotonDeEnlace
          editor={editor}
          activo={estado.enlace}
          conTexto={estado.conTexto}
          href={estado.href}
          t={t}
          off={off}
        />
        <span className="editor-clasico-separador" aria-hidden="true" />
        <Button
          size="sm"
          look={marca(estado.vinetas)}
          aria-label={t.vinetas}
          aria-pressed={estado.vinetas}
          title={t.vinetas}
          disabled={off}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <span aria-hidden="true">•≡</span>
        </Button>
        <Button
          size="sm"
          look={marca(estado.numerada)}
          aria-label={t.numerada}
          aria-pressed={estado.numerada}
          title={t.numerada}
          disabled={off}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <span aria-hidden="true">1≡</span>
        </Button>
        <span className="editor-clasico-separador" aria-hidden="true" />
        <Select
          size="sm"
          aria-label={t.tamano}
          // EL TAMAÑO ES DEL PÁRRAFO: un subtítulo ya tiene el suyo.
          disabled={off || !estado.enParrafo}
          wrapperClassName="editor-clasico-tamano"
          value={estado.tamano}
          options={[
            { value: "chico", label: t.chico },
            { value: "normal", label: t.normal },
            { value: "grande", label: t.grande },
          ]}
          onChange={(v) =>
            editor
              .chain()
              .focus()
              .ponerTamano(v === "normal" ? null : (v as Tamano))
              .run()
          }
        />
        <SelectorDeEmoji
          etiqueta={t.emoji}
          urlDeDatos={urlDeEmojis}
          disabled={off}
          onElegir={(emoji) => editor.chain().focus().insertContent(emoji).run()}
        />
        <span className="editor-clasico-separador" aria-hidden="true" />
        <Button
          size="sm"
          look="ghost"
          aria-label={t.deshacer}
          title={t.deshacer}
          disabled={off || !estado.puedeDeshacer}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <span aria-hidden="true">↶</span>
        </Button>
        <Button
          size="sm"
          look="ghost"
          aria-label={t.rehacer}
          title={t.rehacer}
          disabled={off || !estado.puedeRehacer}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <span aria-hidden="true">↷</span>
        </Button>
        {barraExtra}
      </div>
      <EditorContent editor={editor} className="editor-clasico-cuerpo contenido-clasico" />
    </div>
  );
};

function BotonDeEnlace({
  editor,
  activo,
  conTexto,
  href,
  t,
  off,
}: {
  editor: Editor;
  activo: boolean;
  conTexto: boolean;
  href: string;
  t: TextosDelEditor;
  off: boolean;
}) {
  const panel = usePanel(off);
  const abierto = panel.abierto;
  const [url, setUrl] = React.useState("");
  const valida = url.trim() === "" || enlacePermitido(url.trim());
  // DENTRO DE UN ENLACE SÍ, aunque no haya selección: es como se edita o se
  // quita. APAGADO Y NO `disabled`, que no enseña su `title` al pasar el ratón:
  // el clic llega, y no abre.
  const apagado = !activo && !conTexto;

  const aplicar = () => {
    const u = url.trim();
    if (u === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else if (enlacePermitido(u)) editor.chain().focus().extendMarkRange("link").setLink({ href: u }).run();
    else return;
    panel.cerrar(false);
  };

  return (
    <Dropdown
      ref={panel.raiz}
      className={panel.clase}
      open={abierto}
      onOpenChange={(v) => {
        if (v && apagado) return;
        if (v) setUrl(href);
        panel.setAbierto(v);
      }}
      trigger={
        <Button
          size="sm"
          look={activo ? "soft" : "ghost"}
          aria-label={t.enlace}
          aria-pressed={activo}
          aria-expanded={abierto}
          aria-disabled={apagado || undefined}
          title={apagado ? t.enlaceSinSeleccion : t.enlace}
          className={clsx(apagado && "editor-clasico-apagado")}
          disabled={off}
        >
          <span aria-hidden="true">🔗</span>
        </Button>
      }
      content={
        abierto ? (
          <div
            className="dropdown-content editor-clasico-enlace"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={panel.alTeclear}
          >
            <Input
              size="sm"
              aria-label={t.enlace}
              placeholder={t.enlaceUrl}
              value={url}
              autoFocus
              onChange={(e) => setUrl((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  aplicar();
                }
              }}
            />
            {!valida && <span className="editor-clasico-aviso">{t.enlaceInvalido}</span>}
            <span className="editor-clasico-enlace-botones">
              {activo && (
                <Button
                  size="xs"
                  look="ghost"
                  onClick={() => {
                    editor.chain().focus().extendMarkRange("link").unsetLink().run();
                    panel.cerrar(false);
                  }}
                >
                  {t.enlaceQuitar}
                </Button>
              )}
              <Button size="xs" tone="neutral" disabled={!valida} onClick={aplicar}>
                {t.enlaceAplicar}
              </Button>
            </span>
          </div>
        ) : null
      }
    />
  );
}

export default EditorClasico;
