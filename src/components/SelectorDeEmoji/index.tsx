/** Un botón que abre la cuadrícula de emojis y entrega el elegido.
 *
 * DÓNDE SE ESCRIBE NO ES COSA DE ESTE COMPONENTE. Entrega el emoji por
 * `onElegir` y el que lo usa lo mete donde está su cursor: un `Textarea`, el
 * `EditorClasico`. Así sirve a los dos sin saber de ninguno.
 *
 * LOS DATOS SE DESCARGAN AL ABRIRLO. La cuadrícula es `frimousse`, que por
 * omisión pide la lista de emojis a jsdelivr. Con `urlDeDatos` se sirve desde
 * el servidor propio (la carpeta de `emojibase-data`): una mesa que depende de
 * un CDN ajeno para escribir un copy se queda sin emojis cuando el CDN falla.
 */
import clsx from "clsx";
import { EmojiPicker } from "frimousse";

import Button, { type ButtonSize } from "../Button";
import Dropdown, { type DropDownPlacement, type DropdownSide } from "../Dropdown";
import { usePanel } from "../Dropdown/usePanel";

/** Los idiomas de los nombres de los emojis. Se escriben aquí y no se importan
 *  de `frimousse`: va empaquetado dentro del kit, y un tipo suyo en las
 *  declaraciones obligaba a instalarlo a quien sólo usa el kit (codex). */
export type IdiomaDeEmoji =
  | "bn"
  | "da"
  | "de"
  | "en"
  | "en-gb"
  | "es"
  | "es-mx"
  | "et"
  | "fi"
  | "fr"
  | "hi"
  | "hu"
  | "it"
  | "ja"
  | "ko"
  | "lt"
  | "ms"
  | "nb"
  | "nl"
  | "pl"
  | "pt"
  | "ru"
  | "sv"
  | "th"
  | "uk"
  | "zh"
  | "zh-hant";

export interface SelectorDeEmojiProps {
  onElegir: (emoji: string) => void;
  /** El nombre del botón para el lector de pantalla. */
  etiqueta?: string;
  /** El texto del buscador. */
  buscar?: string;
  /** Lo que se lee mientras llegan los datos, y si la búsqueda no da nada. */
  cargando?: string;
  sinResultados?: string;
  locale?: IdiomaDeEmoji;
  urlDeDatos?: string;
  size?: ButtonSize;
  disabled?: boolean;
  placement?: DropDownPlacement;
  side?: DropdownSide;
  className?: string;
}

const SelectorDeEmoji = ({
  onElegir,
  etiqueta = "Insertar emoji",
  buscar = "Buscar emoji…",
  cargando = "Cargando…",
  sinResultados = "Ningún emoji coincide",
  locale = "es",
  urlDeDatos,
  size = "sm",
  disabled = false,
  placement = "end",
  side = "bottom",
  className,
}: SelectorDeEmojiProps) => {
  const panel = usePanel(disabled);
  const abierto = panel.abierto;

  return (
    <Dropdown
      ref={panel.raiz}
      open={abierto}
      onOpenChange={panel.setAbierto}
      placement={placement}
      side={side}
      className={clsx("selector-de-emoji", panel.clase, className)}
      trigger={
        <Button
          look="ghost"
          size={size}
          aria-label={etiqueta}
          aria-expanded={abierto}
          title={etiqueta}
          disabled={disabled}
        >
          <span aria-hidden="true">😊</span>
        </Button>
      }
      content={
        abierto ? (
          <div className="dropdown-content selector-de-emoji-caja" onKeyDown={panel.alTeclear}>
            <EmojiPicker.Root
              locale={locale}
              emojibaseUrl={urlDeDatos}
              columns={8}
              onEmojiSelect={({ emoji }) => {
                onElegir(emoji);
                // SIN DEVOLVER EL FOCO AL BOTÓN: quien lo usa lo pone donde
                // escribió, que es donde entró el emoji.
                panel.cerrar(false);
              }}
            >
              <EmojiPicker.Search
                className="input input-sm w-full"
                placeholder={buscar}
                aria-label={buscar}
                autoFocus
              />
              <EmojiPicker.Viewport className="selector-de-emoji-vista">
                <EmojiPicker.Loading className="selector-de-emoji-aviso">
                  {cargando}
                </EmojiPicker.Loading>
                <EmojiPicker.Empty className="selector-de-emoji-aviso">
                  {sinResultados}
                </EmojiPicker.Empty>
                <EmojiPicker.List className="selector-de-emoji-lista" />
              </EmojiPicker.Viewport>
            </EmojiPicker.Root>
          </div>
        ) : null
      }
    />
  );
};

export default SelectorDeEmoji;
