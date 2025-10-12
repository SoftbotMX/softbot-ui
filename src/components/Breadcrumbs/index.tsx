import clsx from "clsx";
import * as React from "react";

export type BreadcrumbSize = "sm" | "md" | "lg";
export type BreadcrumbListTag = "ol" | "ul" | "menu";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode | string;
  props?: React.HTMLAttributes<HTMLAnchorElement | HTMLSpanElement>;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[];
  size?: BreadcrumbSize;
  ariaLabel?: string;
  as?: BreadcrumbListTag;
  maxWidthClass?: string;
}

const sizeToClass: Record<BreadcrumbSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  size = "sm",
  ariaLabel = "Breadcrumb",
  as = "ol",
  className,
  maxWidthClass,
  ...rest
}) => {
  const ListTag = as;
  const last = items.length - 1;

  return (
    <nav aria-label={ariaLabel}>
      <div className={clsx("breadcrumbs", sizeToClass[size], maxWidthClass, className)} {...rest}>
        <ListTag>
          {items.map((it, i) => {
            const isLast = i === last;
            const content = (
              <>
                {it.icon ? (
                  it.icon === "string" ? (
                    <span className="icon-symbols">{it.icon}</span>
                  ) : (
                    it.icon
                  )
                ) : undefined}
                {it.label}
              </>
            );

            if (!isLast && it.href) {
              return (
                <li key={i}>
                  <a
                    href={it.href}
                    {...(it.props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                  >
                    {content}
                  </a>
                </li>
              );
            }

            return (
              <li key={i}>
                <span
                  className={clsx("inline-flex items-center gap-2")}
                  aria-current={isLast ? "page" : undefined}
                  {...(it.props as React.HTMLAttributes<HTMLSpanElement>)}
                >
                  {content}
                </span>
              </li>
            );
          })}
        </ListTag>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
