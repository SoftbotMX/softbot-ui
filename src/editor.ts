/** La entrada `@softbotmx/softbot-ui/editor`. Va aparte de la principal para
 *  que un proyecto que no edita texto con formato no cargue TipTap. */
export {
  default as EditorClasico,
  TAMANOS,
  TEXTOS_DEL_EDITOR,
  enlacePermitido,
  extensionesDelClasico,
} from "./components/EditorClasico";
export type { EditorClasicoProps, Tamano, TextosDelEditor } from "./components/EditorClasico";
export { TamanoDeTexto, PROTOCOLOS } from "./components/EditorClasico/extensiones";
