import clsx from "clsx";
import React from "react";
import type { ButtonHTMLAttributes } from "react";

export type MainProps = ButtonHTMLAttributes<HTMLDivElement>;

const Main = (props: MainProps) => {
  const { children, className, ...rest } = props;
  return (
    <main className={clsx(className)} {...rest}>
      {children}
    </main>
  );
};

export default Main;
