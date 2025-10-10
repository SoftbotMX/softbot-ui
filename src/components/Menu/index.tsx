import clsx from "clsx";
import React, { Fragment, useState } from "react";
import type { ButtonHTMLAttributes } from "react";

import Option from "./option";
import Submenu from "./submenu";
import type {
  MenuOptions,
  OptionActive,
  Submenu as SubmenuProps,
  Option as OptionProps,
} from "./types";

export interface MenuProps extends ButtonHTMLAttributes<HTMLDivElement> {
  position?: "left" | "right";
  menu: MenuOptions[];
  navigation: (link: string) => void;
}

const Menu = (props: MenuProps) => {
  const { menu, position = "left", className, navigation, ...rest } = props;

  const [active, setActive] = useState<OptionActive | null>(null);

  const deactivate = (option: OptionActive) => {
    if (active !== null) {
      active.option(false);
      setActive(option);
    } else {
      setActive(option);
    }
  };

  return (
    <aside className={clsx(position, className)} {...rest}>
      <ul className="menu" aria-label="Sidebar">
        {menu.map((data, sectionIndex) => {
          return (
            <Fragment key={sectionIndex}>
              {data.section && <li className="menu-title">{data.section}</li>}
              {data.isSubmenu ? (
                <Submenu
                  navigation={navigation}
                  options={(data.options as SubmenuProps).options}
                  title={(data.options as SubmenuProps).title}
                  deactivate={deactivate}
                />
              ) : (
                (data.options as OptionProps[]).map((option, index) => (
                  <Option key={index} {...option} navigation={navigation} deactivate={deactivate} />
                ))
              )}
            </Fragment>
          );
        })}
      </ul>
    </aside>
  );
};

export default Menu;
