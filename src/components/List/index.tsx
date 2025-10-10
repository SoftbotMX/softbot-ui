import clsx from "clsx";
import * as React from "react";

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export interface ListRowProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

export interface ListColProps extends React.HTMLAttributes<HTMLDivElement> {
  grow?: boolean;
  wrap?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const ListCol = ({ className, grow, wrap, ...rest }: ListColProps) => (
  <div className={clsx(grow && "list-col-grow", wrap && "list-col-wrap", className)} {...rest} />
);

const ListRow = ({ className, ...rest }: ListRowProps) => (
  <div className={clsx("list-row", className)} {...rest} />
);

const List = ({ className, ...rest }: ListProps) => (
  <div className={clsx("list", className)} {...rest} />
);

List.Row = ListRow;
List.Col = ListCol;

export default List;
