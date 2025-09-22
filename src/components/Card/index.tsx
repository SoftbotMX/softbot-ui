import clsx from "clsx";
import React from "react";
import type { ButtonHTMLAttributes } from "react";

export type CardProps = ButtonHTMLAttributes<HTMLDivElement>;

const Card = (props: CardProps) => {
  const { className, children } = props;
  return <div className={clsx("card", className)}>{children}</div>;
};

export default Card;
