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

interface TableBase<T> extends Omit<React.HTMLAttributes<HTMLTableElement>, "children"> {
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

export type TableProps<T> = TableBase<T> & (SinDetalle<T> | ConDetalle<T>);

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
  } = props as TableBase<T> & Partial<ConDetalle<T>>;

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
