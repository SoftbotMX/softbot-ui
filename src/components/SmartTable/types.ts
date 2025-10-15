import type { Column } from "../Table";

export type SortDir = "asc" | "desc";

export interface SmartColumn<T> extends Column<T> {
  sortable?: boolean;
  sortAccessor?: (row: T) => string | number | Date | boolean | null | undefined;
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

  initialSortKey?: string;
  initialSortDir?: SortDir;

  size?: "xs" | "sm" | "md" | "lg" | "xl";
  pinCols?: boolean;
  className?: string;
}
