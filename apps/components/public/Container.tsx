import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.ComponentProps<"div"> {
  size?: "default" | "small" | "wide";
}

export function Container({
  className,
  size = "default",
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        size === "small" && "max-w-4xl",
        size === "default" && "max-w-7xl",
        size === "wide" && "max-w-384",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
