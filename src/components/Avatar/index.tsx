import clsx from "clsx";
import * as React from "react";

export type AvatarRounded = "xl" | "full";
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarTone =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";
export type Presence = "online" | "offline" | "away" | "busy";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  rounded?: AvatarRounded;
  ring?: boolean;
  toneRing?: AvatarTone;
  background?: AvatarTone;
  presence?: Presence;
  placeholder?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = "md",
  rounded,
  ring = false,
  toneRing,
  background,
  presence,
  placeholder,
  className,
  imgProps,
  ...rest
}) => {
  const [broken, setBroken] = React.useState(false);
  const showImage = !!src && !broken && !placeholder;

  return (
    <div
      className={clsx(
        "avatar",
        placeholder && "avatar-placeholder",
        !showImage && "avatar-placeholder",
        presence && `avatar-${presence}`,
        className,
      )}
      {...rest}
    >
      <div
        className={clsx(
          `avatar-${size}`,
          rounded === "full" || presence || ring
            ? "rounded-full"
            : rounded === "xl"
              ? "rounded-xl"
              : "rounded",
          ring && "ring-offset-base-100 ring-2 ring-offset-2",
          toneRing && `ring-${toneRing}`,
          background ? `bg-${background}` : "bg-neutral",
        )}
      >
        {showImage && <img src={src} alt={alt} onError={() => setBroken(true)} {...imgProps} />}
        {!showImage && <span>{placeholder ? placeholder : "SB"}</span>}
      </div>

      {presence ? (
        <span
          className={clsx("avatar-presence", presence)}
          aria-label={presence}
          title={presence}
        />
      ) : null}
    </div>
  );
};

export default Avatar;

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  counterClassName?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max,
  className,
  counterClassName,
  children,
  ...rest
}) => {
  const items = React.Children.toArray(children);
  const show = typeof max === "number" ? items.slice(0, max) : items;
  const hidden = typeof max === "number" ? items.length - show.length : 0;

  return (
    <div className={clsx("avatar-group", className)} {...rest}>
      {show}
      {hidden > 0 ? (
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral w-12">
            <span className={clsx("avatar-placeholder", counterClassName)}>+{hidden}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
