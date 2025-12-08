// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import clsx from "clsx";
import * as React from "react";

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  label?: string;
  as?: keyof React.JSX.IntrinsicElements;
  ref?: React.Ref<HTMLDivElement>;
}

export interface NavbarSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

const NavbarStart = ({ className, ...rest }: NavbarSectionProps) => (
  <div className={clsx("navbar-start", className)} {...rest} />
);

const NavbarCenter = ({ className, ...rest }: NavbarSectionProps) => (
  <div className={clsx("navbar-center", className)} {...rest} />
);

const NavbarEnd = ({ className, ...rest }: NavbarSectionProps) => (
  <div className={clsx("navbar-end", className)} {...rest} />
);

const Navbar = ({
  as: Tag = "nav",
  label = "Primary",
  className,
  children,
  ...rest
}: NavbarProps) => {
  return (
    <Tag className={clsx("navbar", className)} role="navigation" aria-label={label} {...rest}>
      {children}
    </Tag>
  );
};

type NavbarCompound = typeof Navbar & {
  Start: typeof NavbarStart;
  Center: typeof NavbarCenter;
  End: typeof NavbarEnd;
};

(Navbar as NavbarCompound).Start = NavbarStart;
(Navbar as NavbarCompound).Center = NavbarCenter;
(Navbar as NavbarCompound).End = NavbarEnd;

export default Navbar as NavbarCompound;
