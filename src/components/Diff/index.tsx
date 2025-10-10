import clsx from "clsx";
import * as React from "react";

export interface DiffProps {
  before: React.ReactNode | string;
  after: React.ReactNode | string;
  className: string;
}

const Diff: React.FC<DiffProps> = ({ before, after, className }) => {
  const renderSlot = (slot: React.ReactNode | string) => {
    if (typeof slot === "string") {
      return <img src={slot} alt={"img"} />;
    }
    return <div>{slot}</div>;
  };

  return (
    <figure className={clsx("diff", "aspect-16/9", className)} tabIndex={0}>
      <div className="diff-item-1" tabIndex={0} role={"img"}>
        {renderSlot(before)}
      </div>

      <div className="diff-resizer"></div>

      <div className="diff-item-2" role={"img"}>
        {renderSlot(after)}
      </div>
    </figure>
  );
};

export default Diff;
