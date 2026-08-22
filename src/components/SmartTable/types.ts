import type * as React from "react";

import type { Column } from "../Table";

export type SortDir = "asc" | "desc";

export interface SmartColumn<T> extends Column<T> {
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number | Date | boolean | null | undefined;
}

/**
 * El detalle que se despliega bajo una fila.
 *
 * `rowKey` NO ES OPCIONAL, y ahí está todo el asunto. Guardar «la fila 2 está
 * abierta» por su posición funciona hasta que alguien ordena por otra columna o
 * pasa de página: la posición 2 pasa a ser otro registro y el panel se queda
 * abierto bajo el equivocado, con los datos del anterior. No da ningún error y
 * es exactamente el fallo que una tabla de comparación no puede permitirse.
 * Con una clave propia del registro, ordenar y paginar no mueven nada.
 */
export interface SmartExpandable<T> {
  /** Identidad del registro. Un id, una clave — algo que no dependa del orden. */
  rowKey: (row: T) => string;
  /** Qué se pinta al abrirlo. Solo se llama para las filas abiertas. */
  content: (row: T) => React.ReactNode;
  /** Lo que lee un lector de pantalla en el botón. Por omisión «Ver detalle». */
  label?: string;
}

export interface SmartTableProps<T> {
  data: T[];
  columns: SmartColumn<T>[];

  searchable?: boolean;
  searchPlaceholder?: string;
  searchFn?: (row: T, query: string) => boolean;

  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];

  /**
   * Muestra el pie con el paginado. Por omisión sí.
   *
   * Se apaga con `paginated={false}` cuando la tabla enseña una lista corta y
   * completa: un pie que dice «Página 1 de 1» junto a dos flechas apagadas y un
   * selector de tamaño no informa de nada, ocupa el mismo alto que tres filas y
   * hace pensar que hay más datos en algún sitio.
   *
   * Se deja como decisión de quien usa el componente y no como automatismo
   * —esconderlo solo cuando hay una página— porque con pocos registros el
   * selector de tamaño todavía sirve para bajar a cinco y partir la lista, y
   * quitarlo por nuestra cuenta se lo llevaría por delante.
   */
  paginated?: boolean;

  initialSortKey?: string;
  initialSortDir?: SortDir;

  /**
   * Contenido del menú de acciones (los tres puntos de la cabecera).
   *
   * Sin esta prop el menú NO se renderiza. Antes se pintaba siempre con una
   * lista vacía dentro: al pulsarlo abría un desplegable sin nada, se quedaba
   * abierto y los clics siguientes ya no hacían nada visible. Un botón que no
   * hace nada y encima parece que la interfaz se colgó.
   *
   * Se espera un `<li>` por acción, que es lo que el `Dropdown` maqueta:
   *
   * ```tsx
   * <SmartTable
   *   actions={
   *     <>
   *       <li><a onClick={exportarCsv}>Exportar CSV</a></li>
   *       <li><a onClick={imprimir}>Imprimir</a></li>
   *     </>
   *   }
   * />
   * ```
   */
  actions?: React.ReactNode;

  /**
   * Detalle desplegable por fila.
   *
   * Añade una primera columna con la flecha que lo abre y lo cierra. Sin esta
   * prop la columna no existe: una tabla sin detalle no debe enseñar un botón
   * que no lleva a ninguna parte.
   *
   * ```tsx
   * <SmartTable
   *   expandable={{
   *     rowKey: (r) => r.variante,
   *     content: (r) => <Consumo variante={r.variante} />,
   *   }}
   * />
   * ```
   */
  expandable?: SmartExpandable<T>;

  size?: "xs" | "sm" | "md" | "lg" | "xl";
  pinCols?: boolean;
  className?: string;
}
