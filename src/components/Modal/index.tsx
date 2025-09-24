import React from "react";

import "./styles.css";
import Button from "../Button";

interface ModalProps {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
  onClose: () => void;
}

const Modal = ({ children, className, onClose }: ModalProps) => {
  return (
    <div className={"modal"}>
      <div className={`modal-container ${className ? className : ""}`}>
        <Button onClick={onClose} className={"modal-close"}></Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
