import React, { useState } from "react";

import Option from "./option";
import type { SubmenuProps } from "./types";

const Submenu = (props: SubmenuProps) => {
  const { icon, deactivate, navigation, options, title } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <li className={`dropdown ${isOpen ? "open" : ""}`}>
      <div className={"option"} onClick={toggle}>
        {icon && <span className="icon-symbols">{icon}</span>}
        {title}
        <span className="trailing"></span>
      </div>
      {isOpen && (
        <ul className="submenu">
          {options.map((item, index) => (
            <Option {...item} navigation={navigation} deactivate={deactivate} key={index} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default Submenu;
