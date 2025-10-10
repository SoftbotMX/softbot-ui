type PageToken =
  | { type: "page"; page: number; active: boolean; key: string }
  | { type: "ellipsis"; key: string }
  | { type: "control"; kind: "first" | "prev" | "next" | "last"; disabled: boolean; key: string };

export const range = (start: number, end: number) => {
  const out: number[] = [];
  for (let i = start; i <= end; i++) out.push(i);
  return out;
};

export const getTokens = (
  total: number,
  current: number,
  siblingCount: number,
  showEdges: boolean,
  showPrevNext: boolean,
  disabledAll: boolean,
): PageToken[] => {
  const tokens: PageToken[] = [];

  const pushControl = (kind: "first" | "prev" | "next" | "last", disabled: boolean) =>
    tokens.push({ type: "control", kind, disabled: disabled || disabledAll, key: kind });

  const disabled = total <= 1;

  if (showEdges) pushControl("first", current === 1 || disabled);
  if (showPrevNext) pushControl("prev", current === 1 || disabled);

  const totalNumbers = siblingCount * 2 + 5;
  const totalBlocks = totalNumbers < total ? totalNumbers : total;

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const firstPage = 1;
  const lastPage = total;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = range(1, 3 + 2 * siblingCount);
    leftRange.forEach((p) =>
      tokens.push({ type: "page", page: p, active: p === current, key: `p${p}` }),
    );
    tokens.push({ type: "ellipsis", key: "el" });
    tokens.push({ type: "page", page: total, active: total === current, key: `p${total}` });
  } else if (showLeftEllipsis && !showRightEllipsis) {
    tokens.push({ type: "page", page: firstPage, active: firstPage === current, key: "p1" });
    tokens.push({ type: "ellipsis", key: "er" });
    const rightRange = range(total - (2 + 2 * siblingCount), total);
    rightRange.forEach((p) =>
      tokens.push({ type: "page", page: p, active: p === current, key: `p${p}` }),
    );
  } else if (showLeftEllipsis && showRightEllipsis) {
    tokens.push({ type: "page", page: firstPage, active: firstPage === current, key: "p1" });
    tokens.push({ type: "ellipsis", key: "el" });
    range(leftSibling, rightSibling).forEach((p) =>
      tokens.push({ type: "page", page: p, active: p === current, key: `p${p}` }),
    );
    tokens.push({ type: "ellipsis", key: "er" });
    tokens.push({
      type: "page",
      page: lastPage,
      active: lastPage === current,
      key: `p${lastPage}`,
    });
  } else {
    range(1, totalBlocks).forEach((p) =>
      tokens.push({ type: "page", page: p, active: p === current, key: `p${p}` }),
    );
  }

  if (showPrevNext) pushControl("next", current === total || disabled);
  if (showEdges) pushControl("last", current === total || disabled);

  return tokens;
};

export const labelForControl = (kind: "first" | "prev" | "next" | "last") =>
  kind === "first"
    ? "First page"
    : kind === "prev"
      ? "Previous page"
      : kind === "next"
        ? "Next page"
        : "Last page";

export const symbolForControl = (kind: "first" | "prev" | "next" | "last") =>
  kind === "first" ? "«" : kind === "prev" ? "‹" : kind === "next" ? "›" : "»";
