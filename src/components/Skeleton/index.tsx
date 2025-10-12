import clsx from "clsx";
import * as React from "react";

export type SkeletonShape = "box" | "field" | "full";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: SkeletonShape;
  width?: number | string;
  height?: number | string;
}

const Skeleton = (props: SkeletonProps) => {
  const { shape = "box", width, height, className, style, ...rest } = props;
  const rounded =
    shape === "full" ? "rounded-full" : shape === "field" ? "rounded-field" : "rounded-box";

  const styleSize: React.CSSProperties = {
    ...(width !== undefined && { width: typeof width === "number" ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === "number" ? `${height}px` : height }),
    ...style,
  };

  return (
    <div
      className={clsx("skeleton", rounded, className)}
      style={styleSize}
      aria-hidden="true"
      {...rest}
    />
  );
};

export default Skeleton;
