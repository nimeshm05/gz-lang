import {
  createElement,
  type ComponentPropsWithoutRef,
  type ElementType,
} from "react";

type ScrollAreaProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
};

export function ScrollArea<T extends ElementType = "div">({
  as,
  className = "",
  ...props
}: ScrollAreaProps<T>) {
  const Component = as ?? "div";
  const classes = className ? `scroll-area ${className}` : "scroll-area";

  return createElement(Component, {
    ...props,
    className: classes,
  });
}
