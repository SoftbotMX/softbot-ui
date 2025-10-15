import type { SmartColumn, SortDir } from "./types";

export function defaultSearch<T>(row: T, q: string) {
  if (!q) return true;
  const haystack = JSON.stringify(row).toLowerCase();
  return haystack.includes(q.toLowerCase());
}

export function makeComparator<T>(col: SmartColumn<T>, dir: SortDir) {
  const sign = dir === "asc" ? 1 : -1;

  return (a: T, b: T) => {
    const va =
      typeof col.sortAccessor === "function"
        ? col.sortAccessor(a)
        : ((col.key && (a as any)[col.key]) ?? null);
    const vb =
      typeof col.sortAccessor === "function"
        ? col.sortAccessor(b)
        : ((col.key && (b as any)[col.key]) ?? null);

    const na = va instanceof Date ? va.getTime() : (va as any);
    const nb = vb instanceof Date ? vb.getTime() : (vb as any);

    if (na == null && nb == null) return 0;
    if (na == null) return -1 * sign;
    if (nb == null) return 1 * sign;

    if (typeof na === "number" && typeof nb === "number") {
      return na === nb ? 0 : na > nb ? sign : -sign;
    }

    const sa = String(na);
    const sb = String(nb);
    return sa.localeCompare(sb) * sign;
  };
}
