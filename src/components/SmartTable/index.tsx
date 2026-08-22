import * as React from "react";

import Button from "../Button";
import Dropdown from "../Dropdown";
import Input from "../Input";
import Select from "../Select";
import Table from "../Table";
import { defaultSearch, makeComparator } from "./helpers";
import type { SmartTableProps, SmartColumn, SortDir } from "./types";

function SmartTable<T>(props: SmartTableProps<T>) {
  const {
    data,
    columns,
    searchable = true,
    searchPlaceholder = "Buscar...",
    searchFn = defaultSearch,
    initialPage = 1,
    initialPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    paginated = true,
    initialSortKey,
    initialSortDir = "asc",
    actions,
    expandable,
    size = "md",
    pinCols,
    className,
  } = props;

  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [sortKey, setSortKey] = React.useState<string | undefined>(initialSortKey);
  const [sortDir, setSortDir] = React.useState<SortDir>(initialSortDir);
  // POR CLAVE DEL REGISTRO Y NO POR POSICIÓN. Ver `SmartExpandable.rowKey`:
  // guardar la posición deja el panel abierto bajo otra fila en cuanto alguien
  // ordena o pasa de página.
  const [abiertas, setAbiertas] = React.useState<ReadonlySet<string>>(() => new Set());

  const alternar = (clave: string) => {
    setAbiertas((previas) => {
      const siguientes = new Set(previas);
      if (!siguientes.delete(clave)) siguientes.add(clave);
      return siguientes;
    });
  };

  const onChangeQuery = (v: string) => {
    setQuery(v);
    setPage(1);
  };

  const onChangePageSize = (v: string) => {
    const next = Number(v) || initialPageSize;
    setPageSize(next);
    setPage(1);
  };

  const toggleSort = (key: string | undefined, col: SmartColumn<T>) => {
    if (!col.sortable || !key) return;
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
    setPage(1);
  };

  const filtered = React.useMemo(
    () => (query ? data.filter((r) => searchFn(r, query)) : data),
    [data, query, searchFn],
  );

  const sorted = React.useMemo(() => {
    if (!sortKey) return filtered;
    const col = columns.find((c) => c.key === sortKey);
    if (!col || !col.sortable) return filtered;
    const cmp = makeComparator(col, sortDir);
    return [...filtered].sort(cmp);
  }, [filtered, columns, sortKey, sortDir]);

  const total = sorted.length;
  // Sin paginado la tabla enseña todo lo que tiene: una sola página con todas
  // las filas. Así el resto del cálculo no necesita ramas.
  const totalPages = paginated ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const clampedPage = Math.min(page, totalPages);
  const start = (clampedPage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = paginated ? sorted.slice(start, end) : sorted;

  const canPrev = clampedPage > 1;
  const canNext = clampedPage < totalPages;

  const tableColumns = React.useMemo(() => {
    const conFlecha = columns.map((c) => {
      const isSorted = sortKey === c.key;
      const upActive = isSorted && sortDir === "asc";
      const downActive = isSorted && sortDir === "desc";

      const header =
        c.sortable && c.key ? (
          <span
            onClick={() => toggleSort(String(c.key), c)}
            className="flex items-center justify-around! select-none cursor-pointer"
          >
            <span>{c.header ?? String(c.key)}</span>
            <span className="grid leading-none">
              <span className={`icon-symbols ${upActive ? "text-gray-400" : "text-gray-300"}`}>
                arrow_drop_up
              </span>
              <span
                className={`icon-symbols ${downActive ? "text-gray-400" : "text-gray-300"} -mt-2`}
              >
                arrow_drop_down
              </span>
            </span>
          </span>
        ) : (
          (c.header ?? String(c.key ?? ""))
        );

      return {
        ...c,
        header,
      } as SmartColumn<T>;
    });

    if (!expandable) return conFlecha;

    // La flecha va DELANTE y no detrás: es el mando de la fila, y quien lee la
    // tabla la busca donde empieza el renglón, no al final de siete columnas.
    const flecha: SmartColumn<T> = {
      key: "__desplegable",
      header: "",
      width: 1,
      cell: (row: T) => {
        const clave = expandable.rowKey(row);
        const abierta = abiertas.has(clave);
        return (
          <Button
            look="ghost"
            size="xs"
            iconLeft={abierta ? "expand_less" : "expand_more"}
            aria-expanded={abierta}
            aria-label={expandable.label ?? "Ver detalle"}
            onClick={(e) => {
              // La tabla puede llevar `onRowClick`. Sin esto, abrir el detalle
              // dispararía además lo que haga el clic en la fila.
              e.stopPropagation();
              alternar(clave);
            }}
          />
        );
      },
    };
    return [flecha, ...conFlecha];
  }, [columns, sortKey, sortDir, expandable, abiertas]);

  return (
    <div className={`bg-base-100 rounded-xl flex flex-col gap-4 ${className ?? ""}`}>
      <div className="grid grid-cols-3 items-center border-b-2! border-base-300! border-dotted p-5!">
        <div className="flex justify-start w-3/4">
          {searchable && (
            <Input
              left="search"
              placeholder={searchPlaceholder}
              value={query}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={(e) => onChangeQuery(e.target.value)}
            />
          )}
        </div>
        <div className="flex justify-center" />
        <div className="flex justify-end">
          {/* Sin `actions` no hay menú. Antes se pintaba siempre, con un `<ul />`
              vacío dentro: abría un desplegable sin contenido, se quedaba
              abierto y a partir de ahí los clics no hacían nada visible. */}
          {actions && (
            <Dropdown
              trigger={
                <Button look="ghost" className="text-xl! rounded-full!" iconLeft="more_vert" />
              }
              content={<ul>{actions}</ul>}
            />
          )}
        </div>
      </div>

      <Table<T>
        pinCols={pinCols}
        size={size}
        columns={tableColumns}
        data={pageRows}
        // LA MISMA CLAVE QUE EL ESTADO DE APERTURA, y hace falta que sea la
        // misma: `abiertas` dice QUÉ fila está abierta y esto dice a qué fila
        // pertenece el panel ya montado. Con una sola de las dos, ordenar deja
        // el panel bajo la fila correcta pero con el contenido del anterior.
        rowKey={expandable ? (row) => expandable.rowKey(row) : undefined}
        expandedContent={expandable ? (row) => expandable.content(row) : undefined}
        isExpanded={expandable ? (row) => abiertas.has(expandable.rowKey(row)) : undefined}
      />

      {paginated && (
        <div className="grid grid-cols-3 items-center border-t-2! border-base-300! border-dotted p-5!">
          <div className="flex justify-start w-3/4">
            <Select
              size="sm"
              options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
              value={String(pageSize)}
              onChange={(e) => onChangePageSize(e)}
              wrapperClassName="w-24!"
            />
          </div>

          <div className="flex justify-center text-sm text-base-content/60">
            Página <span className="mx-1! font-semibold">{clampedPage}</span> de
            <span className="mx-1! font-semibold">{totalPages}</span>
          </div>

          <div className="flex justify-end items-center gap-1">
            <Button
              look="ghost"
              iconLeft="chevron_left"
              size="sm"
              className="border-1 border-base-300! border-solid"
              disabled={!canPrev}
              onClick={() => canPrev && setPage((p) => Math.max(1, p - 1))}
            />
            <Input
              type="number"
              size="sm"
              containerClassName="w-16! border-1 border-base-300! border-solid"
              value={clampedPage}
              min={1}
              max={totalPages}
              onChange={(e) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const v = Math.max(1, Math.min(Number(e.target.value) || 1, totalPages));
                setPage(v);
              }}
            />
            <Button
              look="ghost"
              iconLeft="chevron_right"
              size="sm"
              className="border-1 border-base-300! border-solid"
              disabled={!canNext}
              onClick={() => canNext && setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartTable;
