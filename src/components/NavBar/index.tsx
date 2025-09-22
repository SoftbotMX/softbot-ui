import clsx from "clsx";
import React from "react";
import type { ButtonHTMLAttributes } from "react";

export interface NavBarProps extends ButtonHTMLAttributes<HTMLDivElement> {
  logo?: string;
  username: string;
}

const NavBar = (props: NavBarProps) => {
  const { logo, username, className, ...rest } = props;
  return (
    <nav>
      <div className={clsx("logo", className)} {...rest}>
        <img src={logo} alt="logo" />
      </div>
    </nav>
  );
};

export default NavBar;
