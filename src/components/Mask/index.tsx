import clsx from "clsx";
import * as React from "react";

export type MaskShape =
  | "squircle"
  | "decagon"
  | "diamond"
  | "heart"
  | "hexagon"
  | "hexagon-2"
  | "circle"
  | "pentagon"
  | "star"
  | "star-2"
  | "triangle"
  | "triangle-2"
  | "triangle-3"
  | "triangle-4";

export interface MaskBaseProps {
  shape?: MaskShape;
  half?: 1 | 2;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}

export interface MaskDivProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "width" | "height">,
    MaskBaseProps {
  as?: "div";
  children?: React.ReactNode;
}

export interface MaskImgProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "width" | "height">,
    MaskBaseProps {
  as: "img";
  src: string;
  alt?: string;
}

export type MaskProps = MaskDivProps | MaskImgProps;

const Mask = (props: MaskProps) => {
  const { shape = "squircle", half, width, height, className, style } = props;

  const halfCls = half === 1 ? "mask-half-1" : half === 2 ? "mask-half-2" : undefined;

  const commonClass = clsx("mask", shape && `mask-${shape}`, halfCls, className);

  const commonStyle: React.CSSProperties = {
    width,
    height,
    ...style,
  };

  if ((props as MaskImgProps).as === "img") {
    const { as: _as, src, alt = "", ...imgRest } = props as MaskImgProps;
    return <img src={src} alt={alt} className={commonClass} style={commonStyle} {...imgRest} />;
  }

  const { as: _asDiv, children, ...divRest } = props as MaskDivProps;
  return (
    <div className={commonClass} style={commonStyle} {...divRest}>
      {children}
    </div>
  );
};

export default Mask;
