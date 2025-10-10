import clsx from "clsx";
import React, { useState } from "react";

import type { OptionProps } from "./types";

const Option = (props: OptionProps) => {
  const { badge, icon, link, navigation, title, deactivate } = props;
  const [active, setActive] = useState<boolean>(false);

  const onClick = () => {
    deactivate({ option: setActive });
    setActive(true);
    navigation(link);
  };

  return (
    <li>
      <div className={clsx("option", active ? "active" : undefined)} onClick={onClick}>
        {icon && <span className="icon-symbols">{icon}</span>}
        {title}
        {badge && <span className="badge" />}
      </div>
    </li>
  );
};

export default Option;
