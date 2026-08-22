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

export interface TableProps<T> extends Omit<React.HTMLAttributes<HTMLTableElement>, "children"> {
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
  /**
   * La identidad de cada fila, para el `key` de React.
   *
   * SIN ESTO REACT IDENTIFICA LAS FILAS POR POSICIÓN, y al reordenar o paginar
   * reutiliza el subárbol de la posición 2 para lo que ahora vive ahí. Con
   * filas planas apenas se nota; con `expandedContent` sí: el panel abierto
   * conserva el estado del registro anterior —lo que había pedido, lo que el
   * usuario escribió dentro— bajo la fila de otro. No da ningún error.
   *
   * `SmartTable` la pasa sola cuando le dan `expandable`.
   */
  rowKey?: (row: T, index: number) => React.Key;

  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  valueGetter?: (row: T, key: string) => React.ReactNode;

  /**
   * El panel que se despliega DEBAJO de una fila, a todo lo ancho.
   *
   * Se pinta en un `<tr>` propio con un `<td colSpan>`, que es la única forma
   * de que una tabla admita detalle sin romper la rejilla de columnas: meterlo
   * dentro de una celda lo encajonaría en el ancho de esa columna.
   *
   * Solo se llama para las filas que `isExpanded` da por abiertas, así que un
   * detalle caro —una consulta, una lista larga— no se construye para las
   * filas cerradas.
   */
  expandedContent?: (row: T, index: number) => React.ReactNode;

  /** Qué filas están abiertas. Sin esto no se despliega ninguna. */
  isExpanded?: (row: T, index: number) => boolean;
}

function getByPath(obj: any, path: string) {
  if (!path) return undefined;
  return path.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), obj);
}

const Table = <T,>(props: TableProps<T>) => {
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
  } = props;

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
