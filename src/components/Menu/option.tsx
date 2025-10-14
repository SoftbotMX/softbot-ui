import clsx from "clsx";
import React, { useState } from "react";

import type { OptionProps } from "./types";

const Option = (props: OptionProps) => {
  const { badge, icon, link, navigation, title, deactivate, disabled, onClick } = props;
  const [active, setActive] = useState<boolean>(false);

  const onPress = () => {
    deactivate({ option: setActive });
    setActive(true);
    if (link && !disabled) navigation(link);
    if (onClick && !disabled) onClick();
  };

  return (
    <li>
      <div
        className={clsx("option", active && "menu-active", disabled && "menu-disabled")}
        onClick={onPress}
      >
        {icon && <span className="icon-symbols">{icon}</span>}
        {title}
        {badge && <span className="badge" />}
      </div>
    </li>
  );
};

export default Option;
