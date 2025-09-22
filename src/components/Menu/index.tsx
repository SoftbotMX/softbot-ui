import clsx from "clsx";
import React, { Fragment, useState } from "react";
import type { ButtonHTMLAttributes } from "react";

import Option from "./option";
import Submenu from "./submenu";

export interface MenuProps extends ButtonHTMLAttributes<HTMLDivElement> {
  position?: "left" | "right";
  menu: Menu[];
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
              {data.section && <li className="title">{data.section}</li>}
              {data.isSubmenu ? (
                <Submenu
                  navigation={navigation}
                  options={(data.options as Submenu).options}
                  title={(data.options as Submenu).title}
                  deactivate={deactivate}
                />
              ) : (
                (data.options as Option[]).map((option, index) => (
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
