import clsx from "clsx";
import * as React from "react";

export type TableSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface Column<T> {
  key: string;
  header?: React.ReactNode;
  cell?: (row: T, rowIndex: number) => React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  width?: number | string;
}

/**
 * Todo lo de una tabla MENOS el desplegable.
 *
 * SE EXPORTA POR UNA RAZÓN CONCRETA: `TableProps` es una unión, y de una unión
 * no se puede `interface Mia extends TableProps<X>`. Quien envuelva `Table` en
 * un componente propio extiende esto y añade lo suyo. Ningún repo de la casa lo
 * hacía cuando esto se escribió —se comprobó uno por uno— pero el camino tiene
 * que existir antes de que alguien lo necesite y se encuentre la puerta cerrada.
 */
export interface TableBaseProps<T>
  extends Omit<React.HTMLAttributes<HTMLTableElement>, "children"> {
  columns: Column<T>[];
  data: T[];
  caption?: React.ReactNode;
  /**
   * Filas alternas sombreadas.
   *
   * OJO CON `expandedContent`: el sombreado lo hace el navegador contando
   * `<tr>`, y un panel desplegado es un `<tr>` más. Al abrir uno, las filas de
   * abajo cambian de color aunque no haya cambiado nada en ellas. Con detalle
   * desplegable conviene dejar el zebra apagado.
   */
  zebra?: boolean;
  rowHover?: boolean;
  pinRows?: "header" | "footer" | "both";
  pinCols?: boolean;
  size?: TableSize;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  valueGetter?: (row: T, key: string) => React.ReactNode;
}

/**
 * La identidad de cada fila, para el `key` de React.
 *
 * TIENE QUE SER ÚNICA Y ESTABLE mientras la tabla viva. Única porque dos filas
 * con la misma clave son, para React, la misma: hermanas con clave repetida
 * reconcilian de forma indeterminada. Y estable porque cambiarla desmonta la
 * fila —se pierde lo que hubiera dentro— mientras que reutilizarla para otro
 * registro le entrega el estado del anterior. Un id de la base sirve; el índice
 * del arreglo, no.
 */
type ClaveDeFila<T> = (row: T, index: number) => React.Key;

/**
 * Una tabla sin detalle desplegable. `rowKey` sigue mereciendo la pena —React
 * reconcilia mejor y no se pierde el foco al reordenar— pero no es obligatoria:
 * sin panel que conserve estado, identificar por posición no rompe nada visible.
 */
interface SinDetalle<T> {
  expandedContent?: never;
  isExpanded?: never;
  rowKey?: ClaveDeFila<T>;
}

/**
 * Con detalle desplegable, `rowKey` ES OBLIGATORIA, y el tipo es el que lo
 * impone porque la disciplina no bastó: la primera versión de esto la dejó
 * opcional, y entonces React identificaba las filas por posición. Al reordenar,
 * el panel se quedaba bajo la fila correcta CON EL ESTADO DEL REGISTRO ANTERIOR
 * —lo que había pedido, lo que el usuario hubiera escrito dentro—. No da ningún
 * error. Ahora no compila.
 */
interface ConDetalle<T> {
  /** Qué se pinta al abrir la fila. Solo se llama para las abiertas. */
  expandedContent: (row: T, index: number) => React.ReactNode;
  /** Qué filas están abiertas. */
  isExpanded: (row: T, index: number) => boolean;
  rowKey: ClaveDeFila<T>;
}

/**
 * Las props de `Table`.
 *
 * Es una UNIÓN y no una interfaz porque el desplegable exige `rowKey`. Para
 * extenderla desde fuera está `TableBaseProps`.
 */
export type TableProps<T> = TableBaseProps<T> & (SinDetalle<T> | ConDetalle<T>);

function getByPath(obj: any, path: string) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

const Table = <T,>(props: TableProps<T>) => {
  // La unión no se puede desestructurar directamente: TypeScript no sabe en qué
  // rama está hasta mirar los valores. Se ensancha a «todo opcional» para leer,
  // que es seguro porque el tipo público ya impidió la combinación mala.
  const {
    columns,
    data,
    caption,
    zebra,
    rowHover = true,
    pinRows,
    pinCols,
    size = "md",
    className,
    rowKey,
    rowClassName,
    onRowClick,
    valueGetter = (row, key) => getByPath(row, key),
    expandedContent,
    isExpanded,
    ...rest
  } = props as TableBaseProps<T> & Partial<ConDetalle<T>>;

  // DETALLE SIN IDENTIDAD: SE PARA AQUÍ, no se pinta mal.
  //
  // El tipo ya lo impide, pero se puede rodear: ensanchar el objeto a
  // `TableBaseProps` —o escribir un envoltorio genérico
  // `<P extends TableBaseProps<T>>`, que es lo que uno escribe sin pensar—
  // borra la comprobación de propiedades sobrantes y las props llegan igual en
  // ejecución. Entonces React vuelve a identificar las filas por posición y el
  // panel abierto se queda con el estado del registro de al lado.
  //
  // REVIENTA en vez de avisar por consola porque el síntoma es ENSEÑAR DATOS DE
  // OTRO REGISTRO como si fueran de este. Una tabla que no carga se arregla; una
  // que miente, no se nota.
  //
  // Y VA ANTES DE PINTAR NADA, no dentro del bucle de filas: con la tabla vacía
  // —que es como empieza casi siempre, mientras carga— no habría bucle y el
  // aviso no llegaría hasta que hubiera datos. Es decir, tarde.
  if (expandedContent && !rowKey) {
    throw new Error(
      "Table: `expandedContent` necesita `rowKey`. Sin ella React identifica las filas " +
        "por su posición y al reordenar el panel abierto conserva el estado de la fila " +
        "anterior.",
    );
  }

  const tableCls = clsx(
    "table",
    zebra && "table-zebra",
    size && `table-${size}`,
    pinCols && "table-pin-cols",
    className,
  );

  const theadCls = clsx(pinRows === "header" || pinRows === "both" ? "table-pin-rows" : null);
  const tfootCls = clsx(pinRows === "footer" || pinRows === "both" ? "table-pin-rows" : null);

  return (
    <div className="overflow-x-auto">
      <table className={tableCls} {...rest}>
        {caption ? <caption className="text-left mb-2">{caption}</caption> : null}

        <thead className={theadCls}>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  col.className,
                  col.align === "center" && "text-center",
                  col.align === "right" && "text-right",
                )}
                style={col.width != null ? { width: col.width } : undefined}
                scope="col"
              >
                {col.header ?? col.key}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            const rowCls = clsx(
              rowHover && "row-hover",
              typeof rowClassName === "function" ? rowClassName(row, i) : undefined,
              onRowClick && "cursor-pointer",
            );
            const abierta = isExpanded?.(row, i) ?? false;
            return (
              <React.Fragment key={rowKey ? rowKey(row, i) : i}>
                <tr
                  className={rowCls}
                  onClick={onRowClick ? () => onRowClick(row, i) : undefined}
                >
                  {columns.map((col) => {
                    const content = col.cell
                      ? col.cell(row, i)
                      : (valueGetter(row, col.key) as React.ReactNode);
                    return (
                      <td
                        key={col.key}
                        className={clsx(
                          col.className,
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                        )}
                        style={col.width != null ? { width: col.width } : undefined}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
                {abierta && expandedContent && (
                  // SIN `row-hover`: el panel no es una fila que se pueda
                  // elegir, y resaltarlo al pasar por encima lo hacía parecer
                  // otro registro de la tabla.
                  <tr className="row-expanded">
                    <td colSpan={columns.length}>{expandedContent(row, i)}</td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>

        {columns.some((c) => c.footer !== undefined) && (
          <tfoot className={tfootCls}>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx(
                    col.className,
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.footer ?? null}
                </th>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default Table;
