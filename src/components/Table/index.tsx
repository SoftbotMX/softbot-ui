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
  zebra?: boolean;
  rowHover?: boolean;
  pinRows?: "header" | "footer" | "both";
  pinCols?: boolean;
  size?: TableSize;
  rowClassName?: (row: T, index: number) => string | undefined;
  onRowClick?: (row: T, index: number) => void;
  valueGetter?: (row: T, key: string) => React.ReactNode;
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
    rowClassName,
    onRowClick,
    valueGetter = (row, key) => getByPath(row, key),
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
            return (
              <tr
                key={i}
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
