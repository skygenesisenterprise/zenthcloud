"use client";

// src/components/badge/badge.tsx
import React2 from "react";

// src/utils/cn.ts
import { cn } from "cn";
var toHex = (n) => n.toString(16).padStart(2, "0");
function safeRandomId() {
  const g = typeof globalThis !== "undefined" ? globalThis : {};
  const c = g.crypto;
  if (c && typeof c.randomUUID === "function") {
    return c.randomUUID();
  }
  if (c && typeof c.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    c.getRandomValues(bytes);
    bytes[6] = bytes[6] & 15 | 64;
    bytes[8] = bytes[8] & 63 | 128;
    const hex = Array.from(bytes, toHex).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
      12,
      16
    )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `r${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
}

// src/utils/resolve-variant.ts
function resolveVariant(variants, key, fallback) {
  const config = variants[key];
  if (config !== void 0)
    return config;
  if (false) {
    console.warn(
      `[kumo] Unknown variant "${key}". Expected one of: ${Object.keys(variants).join(", ")}. Falling back to "${fallback}".`
    );
  }
  return variants[fallback];
}

// src/utils/unwrap-lazy-element.ts
import React from "react";
var REACT_LAZY_TYPE = Symbol.for("react.lazy");
function isLazyReference(value) {
  return typeof value === "object" && value !== null && value.$$typeof === REACT_LAZY_TYPE;
}
function isThenable(value) {
  return typeof value === "object" && value !== null && typeof value.then === "function";
}
function unwrapLazyElement(value) {
  if (!isLazyReference(value))
    return value;
  let unwrapped;
  try {
    unwrapped = React.Children.toArray(value)[0];
  } catch (error) {
    if (isThenable(error))
      throw error;
    return value;
  }
  return React.isValidElement(unwrapped) ? unwrapped : value;
}

// src/components/badge/badge.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var KUMO_BADGE_BASE_STYLES = "inline-flex w-fit flex-none shrink-0 items-center justify-self-start gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap [a:hover_&]:ring [a:hover_&]:ring-current";
var KUMO_BADGE_VARIANTS = {
  variant: {
    /** Semantic token badges */
    primary: {
      classes: "bg-zenth-badge-inverted text-zenth-badge-inverted",
      description: "Primary badge"
    },
    secondary: {
      classes: "bg-zenth-fill text-zenth-badge-neutral-subtle",
      description: "Secondary badge"
    },
    error: {
      classes: "bg-zenth-danger-tint text-zenth-danger",
      description: "Error badge"
    },
    warning: {
      classes: "bg-zenth-warning-tint text-zenth-warning",
      description: "Warning badge"
    },
    success: {
      classes: "bg-zenth-success-tint text-zenth-success",
      description: "Success badge"
    },
    destructive: {
      classes: "bg-zenth-badge-red text-white",
      description: "Deprecated. Use red instead."
    },
    info: {
      classes: "bg-zenth-info-tint text-zenth-info",
      description: "Info badge"
    },
    beta: {
      classes: "border border-dashed border-zenth-brand bg-transparent text-zenth-link",
      description: "Indicates beta or experimental features"
    },
    outline: {
      classes: "border border-zenth-fill bg-zenth-base text-zenth-default",
      description: "Bordered badge with base background"
    },
    /** Other color token variants */
    red: {
      classes: "bg-zenth-badge-red text-white",
      description: "Red badge"
    },
    green: {
      classes: "bg-zenth-badge-green text-white",
      description: "Green badge"
    },
    neutral: {
      classes: "bg-zenth-badge-neutral text-white",
      description: "Neutral badge"
    },
    orange: {
      classes: "bg-zenth-badge-orange text-black",
      description: "Orange badge"
    },
    purple: {
      classes: "bg-zenth-badge-purple text-white",
      description: "Purple badge"
    },
    teal: {
      classes: "bg-zenth-badge-teal text-white",
      description: "Teal badge"
    },
    "teal-subtle": {
      classes: "bg-zenth-badge-teal-subtle text-zenth-badge-teal-subtle",
      description: "Subtle teal badge"
    },
    blue: {
      classes: "bg-zenth-badge-blue text-white",
      description: "Blue badge"
    }
  },
  appearance: {
    filled: {
      classes: "",
      description: "Filled badge with background color (default)"
    },
    dot: {
      classes: "gap-1.5 bg-transparent text-zenth-default ring ring-zenth-hairline",
      description: "Outlined badge with a colored circle dot indicating status"
    }
  },
  dotColor: {
    none: {
      classes: "",
      description: "No dot indicator (used when appearance is not dot, or variant has no dot color)"
    },
    success: {
      classes: "bg-zenth-success",
      description: "Green dot for success status"
    },
    warning: {
      classes: "bg-zenth-badge-orange",
      description: "Orange dot for warning status"
    },
    error: {
      classes: "bg-zenth-badge-red",
      description: "Red dot for error status"
    },
    neutral: {
      classes: "bg-zenth-badge-neutral",
      description: "Neutral dot for informational status"
    }
  }
};
var KUMO_BADGE_DEFAULT_VARIANTS = {
  variant: "primary",
  appearance: "filled",
  dotColor: "none"
};
function badgeVariants({
  variant = KUMO_BADGE_DEFAULT_VARIANTS.variant,
  appearance = KUMO_BADGE_DEFAULT_VARIANTS.appearance
} = {}) {
  const variantClasses = resolveVariant(
    KUMO_BADGE_VARIANTS.variant,
    variant,
    KUMO_BADGE_DEFAULT_VARIANTS.variant
  ).classes;
  const appearanceClasses = resolveVariant(
    KUMO_BADGE_VARIANTS.appearance,
    appearance,
    KUMO_BADGE_DEFAULT_VARIANTS.appearance
  ).classes;
  return cn(
    // Base styles (exported as KUMO_BADGE_BASE_STYLES for Figma plugin)
    KUMO_BADGE_BASE_STYLES,
    // The dot appearance overrides background/text colors from the variant,
    // so only apply variant classes when we're not in dot mode.
    appearance === "dot" ? "" : variantClasses,
    appearanceClasses
  );
}
var renderIconNode = (iconProp) => {
  const IconComponent = unwrapLazyElement(iconProp);
  if (!IconComponent)
    return null;
  const Component = IconComponent;
  const icon = React2.isValidElement(IconComponent) ? IconComponent : /* @__PURE__ */ jsx(Component, {});
  return /* @__PURE__ */ jsx("span", { className: "flex h-lh w-3 shrink-0 items-center justify-center [&>svg]:size-3", children: icon });
};
function Badge({
  variant = KUMO_BADGE_DEFAULT_VARIANTS.variant,
  appearance = KUMO_BADGE_DEFAULT_VARIANTS.appearance,
  className,
  icon,
  children
}) {
  const dotColor = appearance === "dot" ? resolveVariant(
    KUMO_BADGE_VARIANTS.dotColor,
    variant,
    KUMO_BADGE_DEFAULT_VARIANTS.dotColor
  ).classes : "";
  return /* @__PURE__ */ jsxs(
    "span",
    {
      "data-zenth-component": "Badge",
      className: cn(
        badgeVariants({ variant, appearance }),
        icon && "pl-1.5",
        className
      ),
      children: [
        dotColor ? /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": "true",
            className: cn("size-1.75 shrink-0 rounded-full", dotColor)
          }
        ) : null,
        renderIconNode(icon),
        children
      ]
    }
  );
}

// src/components/banner/banner.tsx
import {
  forwardRef as forwardRef4,
  isValidElement
} from "react";

// src/components/link/link.tsx
import { forwardRef as forwardRef2 } from "react";
import { useRender } from "@base-ui/react/use-render";
import { mergeProps } from "@base-ui/react/merge-props";

// src/utils/link-provider.tsx
import {
  createContext,
  forwardRef,
  useContext
} from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var DefaultLinkComponent = forwardRef(
  function DefaultAnchor({ to, href, ...rest }, ref) {
    return /* @__PURE__ */ jsx2("a", { ref, href: href ?? to ?? void 0, ...rest });
  }
);
var LinkComponentContext = createContext(DefaultLinkComponent);
function useLinkComponent() {
  return useContext(LinkComponentContext);
}
function LinkProvider({
  component,
  children
}) {
  return /* @__PURE__ */ jsx2(LinkComponentContext.Provider, { value: component ?? DefaultLinkComponent, children });
}

// src/components/link/link.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var ExternalIcon = (props) => /* @__PURE__ */ jsxs2(
  "svg",
  {
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: "zenth-link-external-icon",
    ...props,
    children: [
      /* @__PURE__ */ jsx3("path", { d: "M9 4H8.8C7.11984 4 6.27976 4 5.63803 4.32698C5.07354 4.6146 4.6146 5.07354 4.32698 5.63803C4 6.27976 4 7.11984 4 8.8V15.2C4 16.8802 4 17.7202 4.32698 18.362C4.6146 18.9265 5.07354 19.3854 5.63803 19.673C6.27976 20 7.11984 20 8.8 20H15.2C16.8802 20 17.7202 20 18.362 19.673C18.9265 19.3854 19.3854 18.9265 19.673 18.362C20 17.7202 20 16.8802 20 15.2V15" }),
      /* @__PURE__ */ jsx3("path", { d: "M14 4H20M20 4V10M20 4L11 13" })
    ]
  }
);
ExternalIcon.displayName = "Link.ExternalIcon";
var KUMO_LINK_VARIANTS = {
  variant: {
    inline: {
      classes: (
        // text-zenth-link provides defensive color that won't be overridden by global `a` styles
        "text-zenth-link underline underline-offset-[0.15em] decoration-[0.0625em] zenth-link-current transition-colors"
      ),
      description: "Inline text link that flows with content"
    },
    current: {
      classes: "text-current underline underline-offset-[0.15em] decoration-[0.0625em] zenth-link-current transition-colors",
      description: "Link that inherits color from parent text"
    },
    plain: {
      classes: (
        // text-zenth-link provides defensive color that won't be overridden by global `a` styles
        "text-zenth-link hover:text-zenth-link/70 transition-colors"
      ),
      description: "Link without underline decoration"
    }
  }
};
var KUMO_LINK_DEFAULT_VARIANTS = {
  variant: "inline"
};
function linkVariants({
  variant = KUMO_LINK_DEFAULT_VARIANTS.variant
} = {}) {
  return cn(
    resolveVariant(
      KUMO_LINK_VARIANTS.variant,
      variant,
      KUMO_LINK_DEFAULT_VARIANTS.variant
    ).classes
  );
}
var LinkBase = forwardRef2(function Link({ className, variant = "inline", render, ...props }, ref) {
  const LinkComponent = useLinkComponent();
  if (false) {
    useEffect(() => {
      if ("to" in props && props.to !== void 0) {
        console.warn(
          '[kumo] Link: The `to` prop is deprecated. Use `href` instead.\n\nIf your app uses a client-side router, configure a LinkProvider that\nmaps `href` to your router\'s navigation prop. See:\nhttps://kumo.cfops.it/utilities/link-provider\n\nMigration example:\n  Before: <Link to="/page">\u2026</Link>\n  After:  <Link href="/page">\u2026</Link>'
        );
      }
    }, []);
  }
  const defaultProps = {
    "data-zenth-component": "Link",
    className: cn(
      linkVariants({ variant }),
      "group/link inline-flex items-center gap-[0.1875em] has-[>[data-zenth-component=Badge]]:rounded-full"
    )
  };
  const element = useRender({
    render: render ?? /* @__PURE__ */ jsx3(LinkComponent, {}),
    ref,
    props: mergeProps(defaultProps, props, { className })
  });
  return element;
});
LinkBase.displayName = "Link";
var Link2 = Object.assign(LinkBase, {
  ExternalIcon
});

// src/components/banner/banner-action.tsx
import {
  createContext as createContext3,
  forwardRef as forwardRef3,
  useContext as useContext3
} from "react";

// src/components/button/button.tsx
import React3 from "react";
import { ArrowsClockwise } from "@phosphor-icons/react";

// src/components/loader/loader.tsx
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var KUMO_LOADER_VARIANTS = {
  size: {
    sm: {
      value: 16,
      description: "Small loader for inline use"
    },
    base: {
      value: 24,
      description: "Default loader size"
    },
    lg: {
      value: 32,
      description: "Large loader for prominent loading states"
    }
  }
};
var KUMO_LOADER_DEFAULT_VARIANTS = {
  size: "base"
};
function loaderVariants({
  size = KUMO_LOADER_DEFAULT_VARIANTS.size
} = {}) {
  if (typeof size === "number")
    return size;
  return resolveVariant(
    KUMO_LOADER_VARIANTS.size,
    size,
    KUMO_LOADER_DEFAULT_VARIANTS.size
  ).value;
}
var Loader = ({
  className,
  size = KUMO_LOADER_DEFAULT_VARIANTS.size,
  "aria-label": ariaLabel = "Loading"
}) => {
  const sizeValue = loaderVariants({ size });
  return /* @__PURE__ */ jsxs3(
    "svg",
    {
      width: sizeValue,
      height: sizeValue,
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      stroke: "currentColor",
      className,
      role: "status",
      "aria-label": ariaLabel,
      children: [
        /* @__PURE__ */ jsxs3(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "9.5",
            fill: "none",
            strokeWidth: "2",
            strokeLinecap: "round",
            children: [
              /* @__PURE__ */ jsx4(
                "animateTransform",
                {
                  attributeName: "transform",
                  type: "rotate",
                  from: "0 12 12",
                  to: "360 12 12",
                  dur: "2s",
                  repeatCount: "indefinite"
                }
              ),
              /* @__PURE__ */ jsx4(
                "animate",
                {
                  attributeName: "stroke-dasharray",
                  values: "0 150;42 150;42 150",
                  keyTimes: "0;0.5;1",
                  dur: "1.5s",
                  repeatCount: "indefinite"
                }
              ),
              /* @__PURE__ */ jsx4(
                "animate",
                {
                  attributeName: "stroke-dashoffset",
                  values: "0;-16;-59",
                  keyTimes: "0;0.5;1",
                  dur: "1.5s",
                  repeatCount: "indefinite"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx4(
          "circle",
          {
            cx: "12",
            cy: "12",
            r: "9.5",
            fill: "none",
            opacity: 0.1,
            strokeWidth: "2",
            strokeLinecap: "round"
          }
        )
      ]
    }
  );
};

// src/components/tooltip/tooltip.tsx
import { Tooltip as TooltipBase } from "@base-ui/react/tooltip";

// src/utils/portal-provider.tsx
import {
  createContext as createContext2,
  useContext as useContext2
} from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var PortalContainerContext = createContext2(null);
function KumoPortalProvider({
  container,
  children
}) {
  return /* @__PURE__ */ jsx5(PortalContainerContext.Provider, { value: container, children });
}
function usePortalContainer() {
  return useContext2(PortalContainerContext);
}

// src/components/tooltip/tooltip.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
var TooltipProvider = TooltipBase.Provider;
function Tooltip({
  content,
  children,
  align,
  asChild,
  render,
  side,
  className,
  container: containerProp,
  closeDelay,
  delay,
  ...props
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  const resolvedRender = render ?? (asChild ? children : void 0);
  const shouldUseRender = resolvedRender !== void 0;
  const triggerTabIndex = !shouldUseRender && props.disabled ? -1 : void 0;
  return /* @__PURE__ */ jsxs4(TooltipBase.Root, { ...props, children: [
    /* @__PURE__ */ jsx6(
      TooltipBase.Trigger,
      {
        closeDelay,
        delay,
        className: cn(
          // Defensive resets when rendering as button wrapper (not render/asChild)
          // These prevent global button styles from polluting the trigger
          // Consumer styles passed via className will override these.
          !shouldUseRender && "m-0 inline-flex h-auto min-h-0 items-center border-none bg-transparent p-0 shadow-none",
          // Tooltip triggers are disclosure elements, not actions — override
          // cursor: pointer (e.g. from Button used via render prop) so the
          // trigger doesn't appear clickable
          "cursor-default",
          className
        ),
        render: resolvedRender,
        tabIndex: triggerTabIndex,
        children: asChild ? void 0 : children
      }
    ),
    /* @__PURE__ */ jsx6(TooltipBase.Portal, { container, children: /* @__PURE__ */ jsx6(
      TooltipBase.Positioner,
      {
        align,
        side,
        sideOffset: 10,
        className: "max-w-[var(--available-width)]",
        children: /* @__PURE__ */ jsxs4(
          TooltipBase.Popup,
          {
            className: cn(
              "flex origin-[var(--transform-origin)] flex-col rounded-md bg-zenth-base px-2.5 py-1.5 text-sm text-zenth-default",
              "shadow-md outline outline-zenth-line",
              "transition-[transform,scale,opacity] duration-150",
              "data-[starting-style]:scale-90 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-90 data-[ending-style]:opacity-0",
              "data-[instant]:duration-0",
              "zenth-tooltip-popup"
            ),
            children: [
              /* @__PURE__ */ jsx6(
                TooltipBase.Arrow,
                {
                  className: cn(
                    "flex",
                    "data-[side=bottom]:top-[-8px]",
                    "data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
                    "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
                    "data-[side=top]:bottom-[-8px] data-[side=top]:rotate-180"
                  ),
                  children: /* @__PURE__ */ jsx6(ArrowSvg, {})
                }
              ),
              content
            ]
          }
        )
      }
    ) })
  ] });
}
function ArrowSvg(props) {
  return /* @__PURE__ */ jsxs4("svg", { width: "20", height: "10", viewBox: "0 0 20 10", fill: "none", ...props, children: [
    /* @__PURE__ */ jsx6(
      "path",
      {
        d: "M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z",
        className: "fill-zenth-base"
      }
    ),
    /* @__PURE__ */ jsx6(
      "path",
      {
        d: "M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z",
        className: "fill-zenth-arrow-edge"
      }
    ),
    /* @__PURE__ */ jsx6(
      "path",
      {
        d: "M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z",
        className: "fill-zenth-arrow-stroke"
      }
    )
  ] });
}

// src/components/button/button.tsx
import { Fragment, jsx as jsx7, jsxs as jsxs5 } from "react/jsx-runtime";
var KUMO_BUTTON_VARIANTS = {
  shape: {
    base: {
      classes: "",
      description: "Default rectangular button shape"
    },
    square: {
      classes: "items-center justify-center p-0",
      description: "Square button for icon-only actions"
    },
    circle: {
      classes: "items-center justify-center p-0 rounded-full",
      description: "Circular button for icon-only actions"
    }
  },
  size: {
    xs: {
      classes: "h-5 gap-1 rounded-sm px-1.5 text-xs",
      description: "Extra small button for compact UIs"
    },
    sm: {
      classes: "h-6.5 gap-1 rounded-md px-2 text-xs",
      description: "Small button for secondary actions"
    },
    base: {
      classes: "h-9 gap-1.5 rounded-lg px-3 text-base",
      description: "Default button size"
    },
    lg: {
      classes: "h-10 gap-2 rounded-lg px-4 text-base",
      description: "Large button for primary CTAs"
    }
  },
  compactSize: {
    xs: { classes: "size-3.5" },
    sm: { classes: "size-6.5" },
    base: { classes: "size-9" },
    lg: { classes: "size-10" }
  },
  variant: {
    primary: {
      classes: "relative overflow-hidden bg-(--zenth-button-emphasis-bg) !text-white ring ring-(--zenth-button-emphasis-ring) focus:ring-(--zenth-button-emphasis-ring) focus-visible:ring-(--zenth-button-emphasis-ring) active:ring-(--zenth-button-emphasis-ring) disabled:opacity-50",
      description: "High-emphasis button for primary actions"
    },
    secondary: {
      classes: "bg-zenth-base !text-zenth-default ring not-disabled:hover:bg-zenth-tint disabled:bg-zenth-base/50 disabled:!text-zenth-default/70 ring-zenth-line data-[state=open]:bg-zenth-base",
      description: "Default button style for most actions"
    },
    ghost: {
      classes: "text-zenth-default hover:bg-zenth-tint shadow-none bg-inherit",
      description: "Minimal button with no background"
    },
    destructive: {
      classes: "relative overflow-hidden bg-(--zenth-button-emphasis-bg) !text-white ring ring-(--zenth-button-emphasis-ring) focus:ring-(--zenth-button-emphasis-ring) focus-visible:ring-(--zenth-button-emphasis-ring) active:ring-(--zenth-button-emphasis-ring) disabled:opacity-50",
      description: "Danger button for destructive actions like delete"
    },
    "secondary-destructive": {
      classes: "bg-zenth-base !text-zenth-danger ring not-disabled:hover:!text-zenth-danger not-disabled:hover:ring-zenth-danger/30 disabled:bg-zenth-base/50 disabled:!text-zenth-danger/70 ring-zenth-line data-[state=open]:bg-zenth-base",
      description: "Secondary button with destructive text for less prominent dangerous actions"
    },
    outline: {
      classes: "bg-transparent text-zenth-default ring ring-zenth-line transition-colors not-disabled:hover:text-zenth-strong not-disabled:hover:ring-zenth-focus/25",
      description: "Bordered button with transparent background"
    }
  }
};
var KUMO_BUTTON_DEFAULT_VARIANTS = {
  shape: "base",
  size: "base",
  variant: "secondary"
};
function buttonVariants({
  variant = KUMO_BUTTON_DEFAULT_VARIANTS.variant,
  size = KUMO_BUTTON_DEFAULT_VARIANTS.size,
  shape = KUMO_BUTTON_DEFAULT_VARIANTS.shape
} = {}) {
  const isCompactShape = shape === "square" || shape === "circle";
  return cn(
    // Base styles
    "group flex w-max shrink-0 items-center font-medium select-none",
    "border-0 shadow-xs",
    "focus:ring-zenth-focus/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
    "cursor-pointer",
    // Disabled state
    "disabled:cursor-not-allowed disabled:text-zenth-subtle",
    resolveVariant(
      KUMO_BUTTON_VARIANTS.size,
      size,
      KUMO_BUTTON_DEFAULT_VARIANTS.size
    ).classes,
    resolveVariant(
      KUMO_BUTTON_VARIANTS.shape,
      shape,
      KUMO_BUTTON_DEFAULT_VARIANTS.shape
    ).classes,
    isCompactShape && resolveVariant(
      KUMO_BUTTON_VARIANTS.compactSize,
      size,
      KUMO_BUTTON_DEFAULT_VARIANTS.size
    ).classes,
    resolveVariant(
      KUMO_BUTTON_VARIANTS.variant,
      variant,
      KUMO_BUTTON_DEFAULT_VARIANTS.variant
    ).classes
  );
}
var TEXT_LIFT_CLASSES = {
  xs: "pb-px [--zenth-button-text-lift:0.5px]",
  sm: "pb-px [--zenth-button-text-lift:0.5px]",
  base: "pb-0.5 [--zenth-button-text-lift:1px]",
  lg: "pb-0.5 [--zenth-button-text-lift:1px]"
};
var ICON_LEADING_PADDING = {
  xs: "pl-1",
  sm: "pl-1.5",
  base: "pl-2.5",
  lg: "pl-3.5"
};
var ICON_CENTER_CLASSES = "[&>svg:first-child]:translate-y-(--zenth-button-text-lift) [&>span.relative>svg:first-child]:translate-y-(--zenth-button-text-lift)";
var getTextClasses = (shape, size, iconNode, children) => {
  const hasText = React3.Children.toArray(children).some(
    (child) => child !== ""
  );
  if (shape !== "base" || !hasText)
    return void 0;
  return cn(
    TEXT_LIFT_CLASSES[size],
    iconNode != null && [ICON_LEADING_PADDING[size], ICON_CENTER_CLASSES]
  );
};
var renderIconNode2 = (iconProp) => {
  const IconComponent = unwrapLazyElement(iconProp);
  if (!IconComponent)
    return null;
  if (React3.isValidElement(IconComponent))
    return IconComponent;
  const Comp = IconComponent;
  return /* @__PURE__ */ jsx7(Comp, {});
};
var getEmphasisToken = (variant) => {
  if (variant === "primary")
    return "var(--color-zenth-brand)";
  if (variant === "destructive")
    return "var(--color-zenth-danger)";
  return void 0;
};
var getEmphasisStyle = (variant) => {
  const token = getEmphasisToken(variant);
  if (!token)
    return void 0;
  return {
    "--zenth-button-emphasis-ring": `color-mix(in oklch, ${token}, black 10%)`,
    "--zenth-button-emphasis-bg": `color-mix(in oklch, ${token}, white 30%)`,
    "--zenth-button-emphasis-gradient-start": `color-mix(in oklch, ${token}, white 15%)`,
    "--zenth-button-emphasis-gradient-end": token
  };
};
var ANCHOR_ONLY_PROPS = /* @__PURE__ */ new Set([
  "href",
  "target",
  "rel",
  "download",
  "hrefLang",
  "media",
  "ping",
  "referrerPolicy",
  "linksExternal"
]);
var toDisabledButtonProps = (props) => {
  const result = {
    ...props
  };
  for (const key of Object.keys(result)) {
    if (key.startsWith("on") || ANCHOR_ONLY_PROPS.has(key)) {
      delete result[key];
    }
  }
  return result;
};
var renderButtonContent = (variant, iconNode, children) => {
  const childNode = children != null ? /* @__PURE__ */ jsx7("span", { className: "contents", children }) : null;
  if (!getEmphasisToken(variant)) {
    return /* @__PURE__ */ jsxs5(Fragment, { children: [
      iconNode,
      childNode
    ] });
  }
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsx7(
      "span",
      {
        "aria-hidden": "true",
        className: "absolute inset-0 rounded-[inherit] bg-linear-to-b from-(--zenth-button-emphasis-gradient-start) to-(--zenth-button-emphasis-gradient-end) shadow-[inset_0_1px_0_0_var(--zenth-button-emphasis-bg)] group-hover:from-(--zenth-button-emphasis-bg)"
      }
    ),
    /* @__PURE__ */ jsxs5("span", { className: "relative flex items-center gap-1.5", children: [
      iconNode,
      childNode
    ] })
  ] });
};
var getTitleLabel = (title) => {
  if (typeof title === "string")
    return title;
  if (typeof title === "number")
    return String(title);
  return void 0;
};
var Button = React3.forwardRef(
  ({
    children,
    className,
    disabled,
    loading,
    shape = "base",
    size = "base",
    variant = "secondary",
    icon: IconComponent,
    style,
    title,
    ...props
  }, ref) => {
    const { type, ...restProps } = props;
    const emphasisStyle = getEmphasisStyle(variant);
    const titleLabel = getTitleLabel(title);
    const buttonProps = {
      ...restProps,
      ...!React3.Children.count(children) && !restProps["aria-label"] && !restProps["aria-labelledby"] && titleLabel && { "aria-label": titleLabel }
    };
    const iconNode = loading ? /* @__PURE__ */ jsx7(Loader, { size: size === "lg" ? 16 : 14 }) : renderIconNode2(IconComponent);
    const button = /* @__PURE__ */ jsx7(
      "button",
      {
        ref,
        "data-zenth-component": "Button",
        className: cn(
          buttonVariants({ variant, size, shape }),
          getTextClasses(shape, size, iconNode, children),
          disabled && "cursor-not-allowed opacity-50",
          className
        ),
        disabled: loading || disabled,
        style: emphasisStyle ? { ...emphasisStyle, ...style } : style,
        type: type ?? "button",
        ...buttonProps,
        children: renderButtonContent(variant, iconNode, children)
      }
    );
    if (title && (disabled || loading)) {
      return /* @__PURE__ */ jsx7(Tooltip, { content: title, render: /* @__PURE__ */ jsx7("span", { className: "inline-flex" }), children: button });
    }
    if (title) {
      return /* @__PURE__ */ jsx7(Tooltip, { content: title, render: button });
    }
    return button;
  }
);
Button.displayName = "Button";
var RefreshButton = ({
  "aria-label": ariaLabel = "Refresh",
  loading,
  ...props
}) => /* @__PURE__ */ jsx7(Button, { shape: "square", "aria-label": ariaLabel, ...props, children: /* @__PURE__ */ jsx7(
  ArrowsClockwise,
  {
    className: cn({
      "zenth-animate-refresh": loading,
      "size-4.5": props.size === "base" || !props.size,
      "size-4": props.size === "sm",
      "size-5": props.size === "lg"
    })
  }
) });
var LinkButton = React3.forwardRef(
  ({
    children,
    className,
    disabled = false,
    external,
    href,
    shape = "base",
    size = "base",
    variant = "ghost",
    icon: IconComponent,
    style,
    title,
    // linksExternal = false,
    ...props
  }, ref) => {
    const LinkComponent = useLinkComponent();
    const emphasisStyle = getEmphasisStyle(variant);
    const externalProps = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
    if (disabled) {
      return /* @__PURE__ */ jsx7(
        Button,
        {
          ...toDisabledButtonProps(props),
          className: cn("select-text", className),
          "data-zenth-component": "LinkButton",
          disabled: true,
          icon: IconComponent,
          shape,
          size,
          style,
          title,
          variant,
          children
        }
      );
    }
    const iconNode = renderIconNode2(IconComponent);
    const link = /* @__PURE__ */ jsx7(
      LinkComponent,
      {
        ref,
        "data-zenth-component": "LinkButton",
        className: cn(
          buttonVariants({ variant, size, shape }),
          getTextClasses(shape, size, iconNode, children),
          "flex items-center no-underline! select-text",
          className
        ),
        href,
        style: emphasisStyle ? { ...emphasisStyle, ...style } : style,
        to: typeof href === "string" ? href : void 0,
        ...externalProps,
        ...props,
        children: renderButtonContent(variant, iconNode, children)
      }
    );
    if (title) {
      return /* @__PURE__ */ jsx7(Tooltip, { content: title, render: link });
    }
    return link;
  }
);
LinkButton.displayName = "LinkButton";

// src/components/banner/banner-action.tsx
import { jsx as jsx8 } from "react/jsx-runtime";
var BannerActionContext = createContext3({
  variant: "default",
  size: "sm"
});
var BANNER_ACTION_ACCENTS = {
  default: {
    accent: "var(--color-zenth-info)",
    secondary: "text-inherit ring-zenth-info/50 fill-zenth-info hover:!text-inherit hover:!ring-zenth-info/50 hover:bg-zenth-info/10",
    ghost: "text-inherit fill-zenth-info hover:bg-zenth-info/10"
  },
  alert: {
    accent: "var(--color-zenth-warning)",
    secondary: "text-inherit ring-zenth-warning/50 fill-zenth-warning hover:!text-inherit hover:!ring-zenth-warning/50 hover:bg-zenth-warning/10",
    ghost: "text-inherit fill-zenth-warning hover:bg-zenth-warning/10"
  },
  error: {
    accent: "var(--color-zenth-danger)",
    secondary: "text-inherit ring-zenth-danger/50 fill-zenth-danger hover:!text-inherit hover:!ring-zenth-danger/50 hover:bg-zenth-danger/10",
    ghost: "text-inherit fill-zenth-danger hover:bg-zenth-danger/10"
  },
  secondary: {
    accent: "var(--color-neutral-700, oklch(37.1% 0 0))",
    secondary: "text-inherit ring-zenth-focus/20 fill-zenth-subtle hover:!text-inherit hover:!ring-zenth-focus/20 hover:bg-zenth-contrast/10",
    ghost: "text-inherit fill-zenth-subtle hover:bg-zenth-contrast/10"
  }
};
function bannerActionAccentVars(accent) {
  return {
    "--zenth-button-emphasis-ring": `color-mix(in oklch, ${accent}, black 10%)`,
    "--zenth-button-emphasis-bg": `color-mix(in oklch, ${accent}, white 30%)`,
    "--zenth-button-emphasis-gradient-start": `color-mix(in oklch, ${accent}, white 15%)`,
    "--zenth-button-emphasis-gradient-end": accent
  };
}
var BannerAction = forwardRef3(function BannerAction2(props, ref) {
  const banner = useContext3(BannerActionContext);
  const variant = props.variant ?? "primary";
  const styles = BANNER_ACTION_ACCENTS[banner.variant];
  const shared = {
    variant: variant === "secondary" ? "outline" : variant,
    size: banner.size,
    className: cn(variant !== "primary" && styles[variant], props.className),
    style: variant === "primary" ? { ...bannerActionAccentVars(styles.accent), ...props.style } : props.style
  };
  if (props.href !== void 0) {
    return /* @__PURE__ */ jsx8(LinkButton, { ref, ...props, ...shared });
  }
  return /* @__PURE__ */ jsx8(Button, { ref, ...props, ...shared });
});
BannerAction.displayName = "Banner.Action";

// src/components/banner/banner.tsx
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var KUMO_BANNER_BASE_STYLES = "flex w-full";
var KUMO_BANNER_VARIANTS = {
  variant: {
    default: {
      classes: "bg-zenth-info-tint text-zenth-info",
      iconClasses: "fill-zenth-info",
      description: "Informational banner for general messages"
    },
    alert: {
      classes: "bg-zenth-warning-tint text-zenth-warning",
      iconClasses: "fill-zenth-warning",
      description: "Warning banner for cautionary messages"
    },
    error: {
      classes: "bg-zenth-danger-tint text-zenth-danger",
      iconClasses: "fill-zenth-danger",
      description: "Error banner for critical issues"
    },
    secondary: {
      classes: "bg-zenth-contrast/5 text-zenth-default/70",
      iconClasses: "fill-zenth-interact",
      description: "Neutral banner for secondary messages"
    }
  },
  size: {
    base: {
      classes: "items-start gap-3 rounded-lg px-4 py-3 text-base",
      description: "Default banner size"
    },
    sm: {
      classes: "items-center gap-2 rounded-md px-3 py-2 text-sm",
      description: "Compact banner for dialogs and tight spaces"
    }
  }
};
var KUMO_BANNER_DEFAULT_VARIANTS = {
  variant: "default",
  size: "base"
};
var BANNER_SIZE_PARTS = {
  base: {
    row: "gap-3",
    icon: "h-[1.375em]",
    description: "text-sm",
    action: "sm"
  },
  sm: {
    row: "gap-2",
    icon: "h-[1.25em]",
    description: "text-sm",
    action: "xs"
  }
};
function bannerVariants({
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
  size = KUMO_BANNER_DEFAULT_VARIANTS.size
} = {}) {
  const resolvedVariant = resolveVariant(
    KUMO_BANNER_VARIANTS.variant,
    variant,
    KUMO_BANNER_DEFAULT_VARIANTS.variant
  );
  const resolvedSize = resolveVariant(
    KUMO_BANNER_VARIANTS.size,
    size,
    KUMO_BANNER_DEFAULT_VARIANTS.size
  );
  return cn(
    // Structural base styles (exported as KUMO_BANNER_BASE_STYLES for Figma plugin)
    KUMO_BANNER_BASE_STYLES,
    // Apply variant styles from KUMO_BANNER_VARIANTS
    resolvedVariant.classes,
    // Apply size styles (spacing / radius / text) from KUMO_BANNER_VARIANTS
    resolvedSize.classes
  );
}
var BannerVariant = /* @__PURE__ */ ((BannerVariant2) => {
  BannerVariant2[BannerVariant2["DEFAULT"] = 0] = "DEFAULT";
  BannerVariant2[BannerVariant2["ALERT"] = 1] = "ALERT";
  BannerVariant2[BannerVariant2["ERROR"] = 2] = "ERROR";
  return BannerVariant2;
})(BannerVariant || {});
var BannerRoot = forwardRef4(function BannerRoot2({
  icon,
  title,
  description,
  action,
  children,
  text,
  variant = KUMO_BANNER_DEFAULT_VARIANTS.variant,
  size = KUMO_BANNER_DEFAULT_VARIANTS.size,
  className,
  ...props
}, ref) {
  const variantConfig = resolveVariant(
    KUMO_BANNER_VARIANTS.variant,
    variant,
    KUMO_BANNER_DEFAULT_VARIANTS.variant
  );
  const sizeParts = BANNER_SIZE_PARTS[size];
  const isCompact = size === "sm";
  const hasInlineLinkAction = isCompact && isValidElement(action) && action.type === Link2;
  if (title || description) {
    return /* @__PURE__ */ jsx9(BannerActionContext.Provider, { value: { variant, size: sizeParts.action }, children: /* @__PURE__ */ jsxs6(
      "div",
      {
        ref,
        className: cn(bannerVariants({ variant, size }), className),
        ...props,
        children: [
          icon && /* @__PURE__ */ jsx9(
            "span",
            {
              className: cn(
                "flex shrink-0 items-center",
                sizeParts.icon,
                variantConfig.iconClasses
              ),
              children: icon
            }
          ),
          /* @__PURE__ */ jsxs6(
            "div",
            {
              className: cn(
                "flex min-w-0 flex-1 items-center justify-between",
                sizeParts.row,
                !title && "pt-px"
              ),
              children: [
                isCompact ? /* @__PURE__ */ jsxs6("div", { className: "flex min-w-0 flex-wrap items-baseline gap-x-1.5", children: [
                  title && /* @__PURE__ */ jsxs6("span", { className: "leading-snug font-medium", children: [
                    title,
                    !description && hasInlineLinkAction && /* @__PURE__ */ jsx9("span", { className: "ml-1.5 [&_[data-zenth-component=Link]]:inline", children: action })
                  ] }),
                  description && /* @__PURE__ */ jsxs6("span", { className: cn(sizeParts.description, "leading-snug"), children: [
                    description,
                    hasInlineLinkAction && /* @__PURE__ */ jsx9("span", { className: "ml-1.5 [&_[data-zenth-component=Link]]:inline", children: action })
                  ] })
                ] }) : /* @__PURE__ */ jsxs6("div", { className: "flex flex-col gap-0.5", children: [
                  title && /* @__PURE__ */ jsx9("p", { className: "leading-snug font-medium", children: title }),
                  description && /* @__PURE__ */ jsx9("div", { className: cn(sizeParts.description, "leading-snug"), children: isValidElement(description) ? description : /* @__PURE__ */ jsx9("p", { children: description }) })
                ] }),
                !hasInlineLinkAction && action != null && /* @__PURE__ */ jsx9("div", { className: "flex shrink-0 items-center gap-2", children: action })
              ]
            }
          )
        ]
      }
    ) });
  }
  const value = children ?? text;
  const content = isValidElement(value) ? value : /* @__PURE__ */ jsx9("p", { children: value });
  return /* @__PURE__ */ jsx9(BannerActionContext.Provider, { value: { variant, size: sizeParts.action }, children: /* @__PURE__ */ jsxs6(
    "div",
    {
      ref,
      className: cn(bannerVariants({ variant, size }), className),
      ...props,
      children: [
        icon && /* @__PURE__ */ jsx9("span", { className: cn("shrink-0", variantConfig.iconClasses), children: icon }),
        content
      ]
    }
  ) });
});
BannerRoot.displayName = "Banner";
var Banner = Object.assign(BannerRoot, {
  Action: BannerAction
});

// src/components/date-range-picker/date-range-picker.tsx
import {
  CaretLeftIcon,
  CaretRightIcon,
  GlobeHemisphereWestIcon
} from "@phosphor-icons/react";
import { useCallback, useState } from "react";
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var KUMO_DATE_RANGE_PICKER_VARIANTS = {
  size: {
    sm: {
      classes: "p-3 gap-2",
      cellHeight: "h-[22px]",
      cellWidth: "w-6",
      calendarWidth: "w-[168px]",
      textSize: "text-xs",
      iconSize: 14,
      description: "Compact calendar for tight spaces"
    },
    base: {
      classes: "p-4 gap-2.5",
      cellHeight: "h-[26px]",
      cellWidth: "w-7",
      calendarWidth: "w-[196px]",
      textSize: "text-sm",
      iconSize: 16,
      description: "Default calendar size"
    },
    lg: {
      classes: "p-5 gap-3",
      cellHeight: "h-[32px]",
      cellWidth: "w-9",
      calendarWidth: "w-[252px]",
      textSize: "text-base",
      iconSize: 18,
      description: "Large calendar for prominent date selection"
    }
  },
  variant: {
    default: {
      classes: "bg-zenth-overlay",
      description: "Default calendar appearance"
    },
    subtle: {
      classes: "bg-zenth-base",
      description: "Subtle calendar with minimal background"
    }
  }
};
var KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default"
};
function dateRangePickerVariants({
  size = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  variant = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.variant
} = {}) {
  return cn(
    // Base styles
    "flex w-fit flex-col rounded-xl select-none",
    // Apply variant and size styles
    KUMO_DATE_RANGE_PICKER_VARIANTS.variant[variant].classes,
    KUMO_DATE_RANGE_PICKER_VARIANTS.size[size].classes
  );
}
function getSizeConfig(size) {
  return KUMO_DATE_RANGE_PICKER_VARIANTS.size[size];
}
var DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
function DateRangePicker({
  onStartDateChange,
  onEndDateChange,
  size = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  variant = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.variant,
  timezone = "New York, NY, USA (GMT-4)",
  className
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewingMonth, setViewingMonth] = useState(/* @__PURE__ */ new Date());
  const [hoveringDate, setHoveringDate] = useState(null);
  const sizeConfig = getSizeConfig(size);
  const handleStartDateChange = (date) => {
    setStartDate(date);
    onStartDateChange(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
    onEndDateChange(date);
  };
  const getMonthName = useCallback((date, monthOffset) => {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
    return copyDate.toLocaleString("default", { month: "long" });
  }, []);
  const getDateYear = useCallback((date, monthOffset) => {
    const copyDate = new Date(date);
    copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
    return copyDate.getFullYear();
  }, []);
  const getMonthsStartingDay = useCallback(
    (date, monthOffset) => {
      const copyDate = new Date(date);
      copyDate.setDate(1);
      copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
      return copyDate.getDay();
    },
    []
  );
  const getNumberOfDaysInMonth = useCallback(
    (date, monthOffset) => {
      const copyDate = new Date(date);
      copyDate.setDate(1);
      copyDate.setMonth(copyDate.getMonth() + (monthOffset || 0));
      copyDate.setMonth(copyDate.getMonth() + 1);
      copyDate.setDate(0);
      return copyDate.getDate();
    },
    []
  );
  const adjustMonth = useCallback((monthOffset) => {
    setViewingMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + monthOffset);
      return newDate;
    });
  }, []);
  const getDateFromIndex = useCallback(
    (date, monthOffset, index) => {
      const startingDay = getMonthsStartingDay(date, monthOffset);
      if (index < startingDay) {
        const previousMonth = new Date(date);
        previousMonth.setMonth(previousMonth.getMonth() + monthOffset);
        previousMonth.setDate(1);
        previousMonth.setDate(previousMonth.getDate() - (startingDay - index));
        return previousMonth;
      } else if (index > getNumberOfDaysInMonth(date, monthOffset) + startingDay - 1) {
        const nextMonth = new Date(date);
        nextMonth.setMonth(nextMonth.getMonth() + monthOffset);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        nextMonth.setDate(
          index - getNumberOfDaysInMonth(date, monthOffset) - startingDay + 1
        );
        return nextMonth;
      } else {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + monthOffset);
        newDate.setDate(index - startingDay + 1);
        return newDate;
      }
    },
    [getMonthsStartingDay, getNumberOfDaysInMonth]
  );
  const isDateEqual = useCallback((date1, date2) => {
    if (!date1 || !date2)
      return false;
    return date1.toDateString() === date2.toDateString();
  }, []);
  return /* @__PURE__ */ jsxs7("div", { className: cn(dateRangePickerVariants({ size, variant }), className), children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxs7("div", { className: cn("relative", sizeConfig.calendarWidth), children: [
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            "aria-label": "Previous month",
            className: "absolute top-0 left-0 cursor-pointer rounded bg-zenth-interact/85 p-1.5 hover:bg-zenth-interact",
            onClick: () => adjustMonth(-1),
            children: /* @__PURE__ */ jsx10(CaretLeftIcon, { size: sizeConfig.iconSize })
          }
        ),
        /* @__PURE__ */ jsx10(
          DateRangeMonthHeader,
          {
            month: getMonthName(viewingMonth),
            year: getDateYear(viewingMonth),
            size,
            updateCurrentMonth: (dateString) => {
              setViewingMonth(new Date(dateString));
            }
          }
        ),
        /* @__PURE__ */ jsx10("div", { className: "grid grid-cols-7 gap-0 gap-y-0.5", children: Array.from({ length: 42 }).map((_, index) => /* @__PURE__ */ jsx10(
          DateRangeDayCell,
          {
            date: getDateFromIndex(viewingMonth, 0, index),
            size,
            mode: (
              // After current month range
              startDate && endDate && getDateFromIndex(viewingMonth, 0, index) >= startDate && getDateFromIndex(viewingMonth, 0, index) <= endDate && index > getNumberOfDaysInMonth(viewingMonth, 0) + getMonthsStartingDay(viewingMonth, 0) - 1 || // Before current month range
              startDate && endDate && getDateFromIndex(viewingMonth, 0, index) >= startDate && getDateFromIndex(viewingMonth, 0, index) <= endDate && index < getMonthsStartingDay(viewingMonth, 0) ? 5 /* SELECTED_OUT_OF_RANGE */ : (
                // Before current month range
                index < getMonthsStartingDay(viewingMonth, 0) ? 0 /* OUT_OF_RANGE */ : (
                  // After current month range
                  index > getNumberOfDaysInMonth(viewingMonth, 0) + getMonthsStartingDay(viewingMonth, 0) - 1 ? 0 /* OUT_OF_RANGE */ : (
                    // Selected start date
                    isDateEqual(
                      getDateFromIndex(viewingMonth, 0, index),
                      startDate
                    ) ? 2 /* SELECTED_START_NODE */ : (
                      // Selected end date
                      isDateEqual(
                        getDateFromIndex(viewingMonth, 0, index),
                        endDate
                      ) ? 3 /* SELECTED_END_NODE */ : (
                        // Selected date range
                        startDate && getDateFromIndex(viewingMonth, 0, index) >= startDate && endDate && getDateFromIndex(viewingMonth, 0, index) <= endDate ? 4 /* SELECTED */ : (
                          // Hovering past a starting date and no end date selected
                          startDate && !endDate && hoveringDate && hoveringDate > startDate && getDateFromIndex(viewingMonth, 0, index) <= hoveringDate && getDateFromIndex(viewingMonth, 0, index) > startDate ? 4 /* SELECTED */ : (
                            // Default to enabled date
                            1 /* ENABLED */
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),
            onClick: (date) => {
              if (!startDate || date < startDate) {
                handleStartDateChange(date);
                setHoveringDate(date);
              } else {
                handleEndDateChange(date);
              }
            },
            isHoveringDate: (date) => {
              if (startDate && !endDate && date > startDate) {
                setHoveringDate(date);
              }
            }
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: cn("relative", sizeConfig.calendarWidth), children: [
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            "aria-label": "Next month",
            className: "absolute top-0 right-0 cursor-pointer rounded bg-zenth-interact/85 p-1.5 hover:bg-zenth-interact",
            onClick: () => adjustMonth(1),
            children: /* @__PURE__ */ jsx10(CaretRightIcon, { size: sizeConfig.iconSize })
          }
        ),
        /* @__PURE__ */ jsx10(
          DateRangeMonthHeader,
          {
            month: getMonthName(viewingMonth, 1),
            year: getDateYear(viewingMonth, 1),
            size,
            updateCurrentMonth: (dateString) => {
              const date = new Date(dateString);
              date.setMonth(date.getMonth() - 1);
              setViewingMonth(date);
            }
          }
        ),
        /* @__PURE__ */ jsx10("div", { className: "grid grid-cols-7 gap-0 gap-y-0.5", children: Array.from({ length: 42 }).map((_, index) => /* @__PURE__ */ jsx10(
          DateRangeDayCell,
          {
            date: getDateFromIndex(viewingMonth, 1, index),
            size,
            mode: (
              // After current month range
              startDate && endDate && getDateFromIndex(viewingMonth, 1, index) >= startDate && getDateFromIndex(viewingMonth, 1, index) <= endDate && index > getNumberOfDaysInMonth(viewingMonth, 1) + getMonthsStartingDay(viewingMonth, 1) - 1 || // Before current month range
              startDate && endDate && getDateFromIndex(viewingMonth, 1, index) >= startDate && getDateFromIndex(viewingMonth, 1, index) <= endDate && index < getMonthsStartingDay(viewingMonth, 1) ? 5 /* SELECTED_OUT_OF_RANGE */ : (
                // Before current month range
                index < getMonthsStartingDay(viewingMonth, 1) ? 0 /* OUT_OF_RANGE */ : (
                  // After current month range
                  index > getNumberOfDaysInMonth(viewingMonth, 1) + getMonthsStartingDay(viewingMonth, 1) - 1 ? 0 /* OUT_OF_RANGE */ : (
                    // Selected start date
                    isDateEqual(
                      getDateFromIndex(viewingMonth, 1, index),
                      startDate
                    ) ? 2 /* SELECTED_START_NODE */ : (
                      // Selected end date
                      isDateEqual(
                        getDateFromIndex(viewingMonth, 1, index),
                        endDate
                      ) ? 3 /* SELECTED_END_NODE */ : (
                        // Selected date range
                        startDate && getDateFromIndex(viewingMonth, 1, index) >= startDate && endDate && getDateFromIndex(viewingMonth, 1, index) <= endDate ? 4 /* SELECTED */ : (
                          // Hovering past a starting date and no end date selected
                          startDate && !endDate && hoveringDate && hoveringDate > startDate && getDateFromIndex(viewingMonth, 1, index) <= hoveringDate && getDateFromIndex(viewingMonth, 1, index) > startDate ? 4 /* SELECTED */ : (
                            // Default to enabled date
                            1 /* ENABLED */
                          )
                        )
                      )
                    )
                  )
                )
              )
            ),
            onClick: (date) => {
              if (!startDate || date < startDate) {
                handleStartDateChange(date);
                setHoveringDate(date);
              } else {
                handleEndDateChange(date);
              }
            },
            isHoveringDate: (date) => {
              if (startDate && !endDate && date > startDate) {
                setHoveringDate(date);
              }
            }
          },
          index
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsx10(
      DateRangeFooter,
      {
        timezone,
        size,
        reset: () => {
          handleStartDateChange(null);
          handleEndDateChange(null);
        }
      }
    )
  ] });
}
function DateRangeDayCell({
  date,
  mode,
  size = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  onClick,
  isHoveringDate
}) {
  const sizeConfig = getSizeConfig(size);
  const getDateNumberFromDate = useCallback((date2) => {
    return date2.getDate();
  }, []);
  const getBackgroundColor = useCallback(() => {
    switch (mode) {
      case 0 /* OUT_OF_RANGE */:
        return "bg-transparent";
      case 1 /* ENABLED */:
        return "bg-transparent";
      case 2 /* SELECTED_START_NODE */:
        return "!bg-zenth-contrast rounded-tl-[5px] rounded-bl-[5px]";
      case 3 /* SELECTED_END_NODE */:
        return "!bg-zenth-contrast rounded-tr-[5px] rounded-br-[5px]";
      case 4 /* SELECTED */:
        return "bg-zenth-interact";
      case 5 /* SELECTED_OUT_OF_RANGE */:
        return "bg-zenth-fill";
    }
  }, [mode]);
  const getTextColor = useCallback(() => {
    switch (mode) {
      case 0 /* OUT_OF_RANGE */:
      case 5 /* SELECTED_OUT_OF_RANGE */:
        return "!text-zenth-subtle";
      case 2 /* SELECTED_START_NODE */:
      case 3 /* SELECTED_END_NODE */:
        return "!text-zenth-inverse";
      default:
        return "text-zenth-default";
    }
  }, [mode]);
  const getAriaLabel = useCallback(() => {
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    switch (mode) {
      case 2 /* SELECTED_START_NODE */:
        return `${dateStr}, selected as start date`;
      case 3 /* SELECTED_END_NODE */:
        return `${dateStr}, selected as end date`;
      case 4 /* SELECTED */:
        return `${dateStr}, within selected range`;
      default:
        return dateStr;
    }
  }, [date, mode]);
  return /* @__PURE__ */ jsx10(
    "button",
    {
      type: "button",
      "aria-label": getAriaLabel(),
      id: date.toDateString(),
      className: cn(
        sizeConfig.cellHeight,
        sizeConfig.cellWidth,
        sizeConfig.textSize,
        "cursor-pointer text-center text-zenth-default transition-all duration-[50]",
        `leading-[${sizeConfig.cellHeight.replace("h-[", "").replace("]", "")}]`,
        mode !== 0 /* OUT_OF_RANGE */ && mode !== 5 /* SELECTED_OUT_OF_RANGE */ ? "hover:bg-zenth-interact" : "",
        getBackgroundColor(),
        getTextColor()
      ),
      onClick: () => onClick?.(date),
      onMouseOver: () => isHoveringDate?.(date),
      onFocus: () => isHoveringDate?.(date),
      children: getDateNumberFromDate(date)
    }
  );
}
function DateRangeMonthHeader({
  month,
  year,
  size = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  updateCurrentMonth
}) {
  const sizeConfig = getSizeConfig(size);
  return /* @__PURE__ */ jsxs7("div", { children: [
    /* @__PURE__ */ jsx10("div", { className: "mb-3 text-center", children: /* @__PURE__ */ jsx10(
      "input",
      {
        "aria-label": "Edit month and year",
        defaultValue: `${month} ${year}`,
        className: cn(
          "w-full rounded-md border-none bg-transparent py-1.5 text-center font-semibold text-zenth-default transition-all duration-200 focus:ring-[1.5px] focus:ring-zenth-focus/50 focus:outline-hidden",
          sizeConfig.textSize
        ),
        onBlur: (e) => {
          if (e.currentTarget.value.length === 0)
            return;
          updateCurrentMonth?.(e.currentTarget.value);
        }
      },
      `${month}-${year}`
    ) }),
    /* @__PURE__ */ jsx10("div", { className: "mt-2 grid grid-cols-7 gap-1", children: DAYS_OF_WEEK.map((day) => /* @__PURE__ */ jsx10(
      "div",
      {
        className: cn(
          "h-[22px] text-center text-zenth-subtle",
          sizeConfig.cellWidth,
          sizeConfig.textSize
        ),
        children: day
      },
      day
    )) })
  ] });
}
function DateRangeFooter({
  timezone,
  size = KUMO_DATE_RANGE_PICKER_DEFAULT_VARIANTS.size,
  reset
}) {
  const sizeConfig = getSizeConfig(size);
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      className: cn(
        "flex items-center gap-2 text-zenth-subtle",
        sizeConfig.textSize
      ),
      children: [
        /* @__PURE__ */ jsx10(GlobeHemisphereWestIcon, { size: sizeConfig.iconSize }),
        /* @__PURE__ */ jsxs7("span", { className: "flex-1", children: [
          "Timezone: ",
          timezone
        ] }),
        /* @__PURE__ */ jsx10(
          "button",
          {
            type: "button",
            onClick: reset,
            className: "cursor-pointer font-semibold text-zenth-default underline underline-offset-2",
            children: "Reset Dates"
          }
        )
      ]
    }
  );
}
var date_range_picker_default = DateRangePicker;

// src/components/checkbox/checkbox.tsx
import { forwardRef as forwardRef5, createContext as createContext5, useContext as useContext5 } from "react";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";

// src/components/label/label.tsx
import { Info } from "@phosphor-icons/react";

// src/utils/locale-provider.tsx
import { createContext as createContext4, useContext as useContext4, useMemo } from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
var defaultTranslations = {
  label: {
    optional: "(optional)",
    tooltip: "More information"
  },
  layerDialog: {
    close: "Close",
    cancel: "Cancel"
  }
};
var KumoLocaleContext = createContext4(defaultTranslations);
function KumoLocaleProvider({
  children,
  translations
}) {
  const value = useMemo(
    () => ({
      label: {
        ...defaultTranslations.label,
        ...translations?.label
      },
      layerDialog: {
        ...defaultTranslations.layerDialog,
        ...translations?.layerDialog
      }
    }),
    [translations]
  );
  return /* @__PURE__ */ jsx11(KumoLocaleContext.Provider, { value, children });
}
function useKumoLocale() {
  return useContext4(KumoLocaleContext);
}

// src/components/label/label.tsx
import { Fragment as Fragment2, jsx as jsx12, jsxs as jsxs8 } from "react/jsx-runtime";
var KUMO_LABEL_VARIANTS = {
  // Label currently has no variant options but structure is ready for future additions
};
var KUMO_LABEL_DEFAULT_VARIANTS = {};
function labelVariants(_props = {}) {
  return cn(
    // Base styles - when used standalone, apply text styling
    // When used inside Field, the parent FieldBase.Label provides these styles
    "m-0 text-base font-medium text-zenth-default"
  );
}
function labelContentVariants() {
  return cn(
    // Content wrapper styles - always applied
    "inline-flex items-center gap-1"
  );
}
function Label({
  children,
  showOptional = false,
  optionalLabel,
  tooltip,
  tooltipAriaLabel,
  className,
  htmlFor,
  asContent = false
}) {
  const { label } = useKumoLocale();
  const resolvedOptionalLabel = optionalLabel === void 0 ? label.optional : optionalLabel;
  const resolvedTooltipLabel = tooltipAriaLabel ?? label.tooltip;
  const content = /* @__PURE__ */ jsxs8(Fragment2, { children: [
    children,
    showOptional && /* @__PURE__ */ jsx12("span", { className: "font-normal text-zenth-subtle", children: resolvedOptionalLabel }),
    tooltip && /* @__PURE__ */ jsx12(
      Tooltip,
      {
        content: tooltip,
        render: /* @__PURE__ */ jsx12(
          Button,
          {
            variant: "ghost",
            size: "xs",
            shape: "square",
            "aria-label": resolvedTooltipLabel,
            children: /* @__PURE__ */ jsx12(Info, { className: "size-4" })
          }
        )
      }
    )
  ] });
  if (asContent) {
    return /* @__PURE__ */ jsx12("span", { className: cn(labelContentVariants(), className), children: content });
  }
  return /* @__PURE__ */ jsx12(
    "label",
    {
      htmlFor,
      className: cn(labelVariants(), labelContentVariants(), className),
      children: content
    }
  );
}
Label.displayName = "Label";

// src/components/checkbox/checkbox.tsx
import { Fieldset } from "@base-ui/react/fieldset";
import { Field as FieldBase } from "@base-ui/react/field";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { jsx as jsx13, jsxs as jsxs9 } from "react/jsx-runtime";
var CheckboxGroupContext = createContext5({
  controlFirst: void 0,
  appearance: "default",
  orientation: null
});
var CheckboxBase = forwardRef5(
  ({
    className,
    checked,
    indeterminate,
    disabled,
    variant = "default",
    label,
    labelTooltip,
    controlFirst = true,
    onCheckedChange,
    required,
    name,
    ...props
  }, ref) => {
    if (false) {
      const hasLabel = Boolean(label);
      const hasAriaLabel = Boolean(props["aria-label"]);
      const hasAriaLabelledBy = Boolean(props["aria-labelledby"]);
      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        console.warn(
          "[Kumo Checkbox]: Checkbox must have an accessible name. Provide either:\n  - label prop: <Checkbox label='Accept terms' />\n  - aria-label: <Checkbox aria-label='Select item' />\n  - aria-labelledby for custom label association\n  Note: When used inside Checkbox.Group, label is optional"
        );
      }
    }
    const checkboxControl = /* @__PURE__ */ jsx13(
      BaseCheckbox.Root,
      {
        ref,
        "data-zenth-component": "Checkbox",
        name,
        checked,
        indeterminate,
        disabled,
        onCheckedChange,
        className: cn(
          "relative flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-0 bg-zenth-base ring after:absolute after:-inset-x-3 after:-inset-y-2 focus:outline-hidden",
          label && "mt-0.5",
          variant === "error" ? "ring-zenth-danger" : "ring-zenth-hairline",
          !disabled && "hover:ring-zenth-hairline focus:ring-2 focus:ring-zenth-focus focus-visible:ring-2 focus-visible:ring-zenth-brand",
          "data-[checked]:bg-zenth-contrast data-[checked]:ring-zenth-contrast data-[indeterminate]:bg-zenth-contrast data-[indeterminate]:ring-zenth-contrast",
          disabled && "cursor-not-allowed opacity-50",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx13(
          BaseCheckbox.Indicator,
          {
            keepMounted: true,
            className: "flex items-center justify-center text-zenth-inverse data-[unchecked]:invisible",
            render: (renderProps, state) => /* @__PURE__ */ jsx13("span", { ...renderProps, children: state.indeterminate ? /* @__PURE__ */ jsx13(MinusIcon, { weight: "bold", size: 12 }) : /* @__PURE__ */ jsx13(CheckIcon, { weight: "bold", size: 12 }) })
          }
        )
      }
    );
    if (!label) {
      return checkboxControl;
    }
    return /* @__PURE__ */ jsx13(FieldBase.Root, { className: "inline-flex", children: /* @__PURE__ */ jsxs9(
      FieldBase.Label,
      {
        className: cn(
          "!m-0 inline-flex !min-h-0 items-start gap-2 !text-base",
          controlFirst ? "flex-row" : "flex-row-reverse justify-end",
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        ),
        children: [
          checkboxControl,
          /* @__PURE__ */ jsx13(
            Label,
            {
              showOptional: required === false,
              tooltip: labelTooltip,
              asContent: true,
              children: label
            }
          )
        ]
      }
    ) });
  }
);
CheckboxBase.displayName = "Checkbox";
var CheckboxItem = forwardRef5(
  ({
    className,
    checked,
    indeterminate,
    disabled,
    variant = "default",
    appearance: appearanceProp,
    label,
    description,
    value,
    onCheckedChange,
    name
  }, ref) => {
    const {
      controlFirst: groupControlFirst,
      appearance: groupAppearance,
      orientation
    } = useContext5(CheckboxGroupContext);
    const appearance = appearanceProp ?? groupAppearance;
    const isCard = appearance === "card";
    const controlFirst = groupControlFirst ?? !isCard;
    const isJoined = isCard && groupAppearance === "card" && orientation !== null;
    const indicator = /* @__PURE__ */ jsx13(
      BaseCheckbox.Indicator,
      {
        keepMounted: true,
        className: "flex items-center justify-center text-zenth-inverse data-[unchecked]:invisible",
        render: (renderProps, state) => /* @__PURE__ */ jsx13("span", { ...renderProps, children: state.indeterminate ? /* @__PURE__ */ jsx13(MinusIcon, { weight: "bold", size: 12 }) : /* @__PURE__ */ jsx13(CheckIcon, { weight: "bold", size: 12 }) })
      }
    );
    if (isCard) {
      return /* @__PURE__ */ jsxs9(
        "label",
        {
          "data-zenth-component": "Checkbox",
          "data-zenth-part": "item-label",
          className: cn(
            "group relative m-0 flex items-start gap-3 bg-zenth-base p-3 has-[[data-checked]]:bg-zenth-tint",
            isJoined ? cn(
              // bg-clip-padding keeps the checked tint from darkening the
              // translucent dividers.
              "border-b border-zenth-line bg-clip-padding last:border-b-0",
              // Two-column grid: the left column draws the column divider
              // (unless it's a lone last item), and the last row drops its
              // bottom divider.
              orientation === "horizontal" && "odd:border-r [&:last-child:nth-child(odd)]:border-r-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0"
            ) : "rounded-lg border border-zenth-hairline has-[[data-checked]]:border-zenth-interact",
            controlFirst && "flex-row-reverse",
            variant === "error" && cn(
              "has-[[data-checked]]:bg-zenth-base",
              !isJoined && "border-zenth-danger has-[[data-checked]]:border-zenth-danger"
            ),
            disabled ? "cursor-not-allowed opacity-50" : cn(
              "cursor-pointer has-[[data-disabled]]:cursor-not-allowed has-[[data-disabled]]:opacity-50",
              // The checked row keeps its tint while hovered.
              variant !== "error" && "hover:not-has-[[data-disabled]]:not-has-[[data-checked]]:bg-zenth-elevated"
            ),
            className
          ),
          children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [
              /* @__PURE__ */ jsx13("span", { className: "text-base font-medium text-zenth-default", children: label }),
              description && /* @__PURE__ */ jsx13("span", { className: "text-sm leading-snug text-pretty text-zenth-subtle", children: description })
            ] }),
            /* @__PURE__ */ jsx13(
              BaseCheckbox.Root,
              {
                ref,
                "data-zenth-component": "Checkbox",
                "data-zenth-part": "item",
                value,
                name,
                checked,
                indeterminate,
                disabled,
                onCheckedChange,
                className: cn(
                  "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-0 bg-zenth-base ring focus:ring-zenth-focus focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
                  variant === "error" ? "ring-zenth-danger" : "ring-zenth-line",
                  !disabled && variant !== "error" && "group-hover:ring-zenth-hairline",
                  "data-[checked]:bg-zenth-contrast data-[checked]:ring-zenth-contrast data-[indeterminate]:bg-zenth-contrast data-[indeterminate]:ring-zenth-contrast"
                ),
                children: indicator
              }
            )
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs9(
      "label",
      {
        "data-zenth-component": "Checkbox",
        "data-zenth-part": "item-label",
        className: cn(
          "relative m-0 inline-flex items-start gap-2",
          // Control first (default): checkbox before label
          // Label first: label before checkbox using flex-row-reverse
          !controlFirst && "flex-row-reverse justify-end",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        ),
        children: [
          /* @__PURE__ */ jsx13(
            BaseCheckbox.Root,
            {
              ref,
              "data-zenth-component": "Checkbox",
              "data-zenth-part": "item",
              value,
              name,
              checked,
              indeterminate,
              disabled,
              onCheckedChange,
              className: cn(
                "peer relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-0 bg-zenth-base ring after:absolute after:-inset-x-3 after:-inset-y-2",
                variant === "error" ? "ring-zenth-danger" : "ring-zenth-hairline",
                !disabled && "group-hover:ring-zenth-hairline hover:ring-zenth-hairline focus:ring-2 focus:ring-zenth-focus focus-visible:ring-2 focus-visible:ring-zenth-brand",
                "data-[checked]:bg-zenth-contrast data-[checked]:ring-zenth-contrast data-[indeterminate]:bg-zenth-contrast data-[indeterminate]:ring-zenth-contrast"
              ),
              children: indicator
            }
          ),
          /* @__PURE__ */ jsx13("span", { className: "text-base text-zenth-default", children: label })
        ]
      }
    );
  }
);
CheckboxItem.displayName = "Checkbox.Item";
function CheckboxLegend({ children, className }) {
  return /* @__PURE__ */ jsx13(
    Fieldset.Legend,
    {
      className: cn("text-base font-medium text-zenth-default", className),
      children
    }
  );
}
CheckboxLegend.displayName = "Checkbox.Legend";
function CheckboxGroup({
  legend,
  children,
  error,
  description,
  defaultValue,
  value,
  onValueChange,
  allValues,
  disabled,
  orientation = "vertical",
  appearance = "default",
  controlFirst,
  className
}) {
  return /* @__PURE__ */ jsx13(
    CheckboxGroupContext.Provider,
    {
      value: { controlFirst, appearance, orientation },
      children: /* @__PURE__ */ jsx13(
        BaseCheckboxGroup,
        {
          defaultValue,
          value,
          onValueChange,
          allValues,
          disabled,
          children: /* @__PURE__ */ jsxs9(
            Fieldset.Root,
            {
              className: cn(
                "flex flex-col p-0",
                // Card groups match Field's label-to-control gap.
                appearance === "card" ? "gap-2" : "gap-4",
                className
              ),
              children: [
                legend && /* @__PURE__ */ jsx13(Fieldset.Legend, { className: "text-base font-medium text-zenth-default", children: legend }),
                /* @__PURE__ */ jsx13(
                  "div",
                  {
                    className: cn(
                      orientation === "vertical" ? appearance === "card" ? "flex flex-col overflow-hidden rounded-lg ring ring-zenth-line" : "flex flex-col gap-2" : appearance === "card" ? "grid grid-cols-2 overflow-hidden rounded-lg bg-zenth-base ring ring-zenth-line" : "flex flex-row flex-wrap gap-2"
                    ),
                    children
                  }
                ),
                error && /* @__PURE__ */ jsx13("p", { className: "text-sm text-zenth-danger", children: error }),
                description && /* @__PURE__ */ jsx13("p", { className: "text-sm leading-snug text-pretty text-zenth-subtle", children: description })
              ]
            }
          )
        }
      )
    }
  );
}
var Checkbox = Object.assign(CheckboxBase, {
  Item: CheckboxItem,
  Group: CheckboxGroup,
  Legend: CheckboxLegend
});
Checkbox.displayName = "Checkbox";

// src/components/clipboard-text/clipboard-text.tsx
import {
  CheckIcon as CheckIcon2,
  CopyIcon,
  EyeIcon,
  EyeSlashIcon
} from "@phosphor-icons/react";
import { forwardRef as forwardRef13, useCallback as useCallback3, useEffect as useEffect3, useRef as useRef2, useState as useState2 } from "react";
import { Toast } from "@base-ui/react/toast";
import { Tooltip as Tooltip2 } from "@base-ui/react/tooltip";

// src/components/input/input.tsx
import {
  forwardRef as forwardRef6
} from "react";
import { Input as BaseInput } from "@base-ui/react/input";

// src/components/field/field.tsx
import { Field as FieldBase2 } from "@base-ui/react/field";
import { jsx as jsx14, jsxs as jsxs10 } from "react/jsx-runtime";
function normalizeFieldError(error) {
  if (!error)
    return void 0;
  if (typeof error === "string")
    return { message: error, match: true };
  return error;
}
var KUMO_FIELD_VARIANTS = {
  // Field currently has no variant options but structure is ready for future additions
};
var KUMO_FIELD_DEFAULT_VARIANTS = {};
function fieldVariants({
  controlFirst = false
} = {}) {
  return cn(
    // Base styles - vertical layout (default)
    "grid gap-2",
    // Horizontal layout for checkbox and switch
    // Default: Grid auto-reverses in RTL (desired)
    "has-[input[type=checkbox]]:grid-cols-[auto_1fr] has-[input[type=checkbox]]:items-center",
    "has-[[role=switch]]:grid-cols-[auto_1fr] has-[[role=switch]]:items-center",
    // Control first: use flexbox with row-reverse to flip visual order without affecting text direction
    // flex-row-reverse in LTR: Control→Label, in RTL: Label→Control (opposite of grid default)
    controlFirst && [
      "has-[input[type=checkbox]]:flex has-[input[type=checkbox]]:flex-row-reverse has-[input[type=checkbox]]:flex-wrap has-[input[type=checkbox]]:items-center",
      "has-[[role=switch]]:flex has-[[role=switch]]:flex-row-reverse has-[[role=switch]]:flex-wrap has-[[role=switch]]:items-center",
      "[&>label]:flex-1"
    ]
  );
}
function rendersNothing(node) {
  return node == null || typeof node === "boolean" || node === "";
}
function Field({
  children,
  label,
  required,
  labelTooltip,
  error,
  description,
  controlFirst = false,
  hideLabel = false
}) {
  const showOptional = required === false;
  const hasLabelContent = !rendersNothing(label) || showOptional || !rendersNothing(labelTooltip);
  return /* @__PURE__ */ jsxs10(FieldBase2.Root, { className: fieldVariants({ controlFirst }), children: [
    !hideLabel && hasLabelContent && /* @__PURE__ */ jsx14(FieldBase2.Label, { className: "m-0 text-base font-medium text-zenth-default select-none", children: /* @__PURE__ */ jsx14(Label, { showOptional, tooltip: labelTooltip, asContent: true, children: label }) }),
    children,
    error ? /* @__PURE__ */ jsx14(
      FieldBase2.Error,
      {
        className: cn(
          "text-sm leading-snug text-zenth-danger",
          // Span full width in horizontal layout
          "col-span-full"
        ),
        match: error.match,
        children: error.message
      }
    ) : description && /* @__PURE__ */ jsx14(
      FieldBase2.Description,
      {
        className: cn(
          "text-sm leading-snug text-zenth-subtle",
          // Span full width in horizontal layout
          "col-span-full"
        ),
        children: description
      }
    )
  ] });
}

// src/components/input/input.tsx
import { jsx as jsx15 } from "react/jsx-runtime";
var KUMO_INPUT_VARIANTS = {
  size: {
    xs: {
      classes: "h-5 gap-1 rounded-sm px-1.5 text-xs",
      description: "Extra small input for compact UIs"
    },
    sm: {
      classes: "h-6.5 gap-1 rounded-md px-2 text-xs",
      description: "Small input for secondary fields"
    },
    base: {
      classes: "h-9 gap-1.5 rounded-lg px-3 text-base",
      description: "Default input size"
    },
    lg: {
      classes: "h-10 gap-2 rounded-lg px-4 text-base",
      description: "Large input for prominent fields"
    }
  },
  variant: {
    default: {
      classes: "focus:ring-zenth-focus/50 focus:ring-[1.5px]",
      description: "Default input appearance"
    },
    error: {
      classes: "!ring-zenth-danger focus:ring-zenth-danger/50 focus:ring-[1.5px]",
      description: "Error state for validation failures"
    }
  }
};
var KUMO_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default"
};
function inputVariants({
  variant = KUMO_INPUT_DEFAULT_VARIANTS.variant,
  size = KUMO_INPUT_DEFAULT_VARIANTS.size,
  parentFocusIndicator = false,
  focusIndicator = false
} = {}) {
  return cn(
    // Base styles
    "border-0 bg-zenth-control text-zenth-default ring ring-zenth-line outline-none focus:outline-hidden",
    // Disabled state and placeholder styles (using vanilla CSS class for Chrome compatibility)
    "zenth-input-placeholder disabled:text-zenth-inactive",
    // Apply size styles from KUMO_INPUT_VARIANTS
    resolveVariant(
      KUMO_INPUT_VARIANTS.size,
      size,
      KUMO_INPUT_DEFAULT_VARIANTS.size
    ).classes,
    // Apply variant styles from KUMO_INPUT_VARIANTS
    resolveVariant(
      KUMO_INPUT_VARIANTS.variant,
      variant,
      KUMO_INPUT_DEFAULT_VARIANTS.variant
    ).classes,
    // Retain an outline when forced colors suppress the shared focus ring.
    parentFocusIndicator && "has-focus-visible:outline-hidden",
    // Focus state handling
    parentFocusIndicator && (variant === "error" ? "focus-within:ring-[1.5px] focus-within:ring-zenth-danger/50" : "focus-within:ring-[1.5px] focus-within:ring-zenth-focus/50"),
    focusIndicator && (variant === "error" ? "focus:ring-[1.5px] focus:ring-zenth-danger/50" : "focus:ring-[1.5px] focus:ring-zenth-focus/50")
  );
}
var Input = forwardRef6((props, ref) => {
  const {
    className,
    size = "base",
    variant: variantProp,
    label,
    labelTooltip,
    description,
    error,
    passwordManagerIgnore = false,
    ...inputProps
  } = props;
  if (false) {
    console.warn(
      '[Kumo Input]: variant="error" is deprecated. Error styling is now automatically applied when the `error` prop is truthy. Simply remove the variant prop and pass an error message instead.'
    );
  }
  const variant = variantProp ?? (error ? "error" : "default");
  const { required } = inputProps;
  if (false) {
    const hasLabel = Boolean(label);
    const hasAriaLabel = Boolean(inputProps["aria-label"]);
    const hasAriaLabelledBy = Boolean(inputProps["aria-labelledby"]);
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      console.warn(
        "[Kumo Input]: Input must have an accessible name. Provide either:\n  - label prop: <Input label='Email' />\n  - aria-label: <Input aria-label='Email address' />\n  - aria-labelledby for custom label association"
      );
    }
  }
  const input = /* @__PURE__ */ jsx15(
    BaseInput,
    {
      ref,
      className: cn(
        inputVariants({ size, variant, focusIndicator: true }),
        passwordManagerIgnore && "keeper-ignore",
        className
      ),
      ...passwordManagerIgnore ? {
        "data-1p-ignore": "true",
        "data-bwignore": "true",
        "data-form-type": "other",
        "data-lpignore": "true"
      } : {},
      ...inputProps
    }
  );
  if (label || error || description) {
    return /* @__PURE__ */ jsx15(
      Field,
      {
        label,
        required,
        labelTooltip,
        description,
        error: normalizeFieldError(error),
        children: input
      }
    );
  }
  return input;
});
Input.displayName = "Input";

// src/components/input/input-area.tsx
import {
  useCallback as useCallback2,
  useEffect as useEffect2,
  useLayoutEffect,
  useRef
} from "react";
import * as React4 from "react";
import { Field as FieldBase3 } from "@base-ui/react/field";
import { jsx as jsx16 } from "react/jsx-runtime";
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect2;
function parsePx(value) {
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
function useTextareaAutoResize({
  enabled,
  minRows,
  maxRows
}) {
  const textareaRef = useRef(null);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const minRowsRef = useRef(minRows);
  minRowsRef.current = minRows;
  const maxRowsRef = useRef(maxRows);
  maxRowsRef.current = maxRows;
  const resize = useCallback2(() => {
    const textarea = textareaRef.current;
    if (!enabledRef.current || !textarea || typeof window === "undefined")
      return;
    const style = window.getComputedStyle(textarea);
    const borders = parsePx(style.borderTopWidth) + parsePx(style.borderBottomWidth);
    const padding = parsePx(style.paddingTop) + parsePx(style.paddingBottom);
    const isBorderBox = style.boxSizing === "border-box";
    textarea.style.height = "auto";
    let height = isBorderBox ? textarea.scrollHeight + borders : textarea.scrollHeight - padding;
    const currentMinRows = minRowsRef.current;
    const currentMaxRows = maxRowsRef.current;
    if (currentMinRows > 0 || currentMaxRows && currentMaxRows > 0) {
      const fontSize = parsePx(style.fontSize);
      const rawLineHeight = style.lineHeight;
      const lineHeight = rawLineHeight === "normal" || rawLineHeight === "" ? fontSize * 1.2 : rawLineHeight.endsWith("px") ? parsePx(rawLineHeight) : parsePx(rawLineHeight) * fontSize;
      const boxSpacing = isBorderBox ? padding + borders : 0;
      const minHeight = lineHeight * currentMinRows + boxSpacing;
      height = Math.max(height, minHeight);
      if (currentMaxRows && currentMaxRows > 0) {
        const maxHeight = lineHeight * currentMaxRows + boxSpacing;
        if (height > maxHeight) {
          height = maxHeight;
          textarea.style.overflowY = "auto";
        } else {
          textarea.style.overflowY = "hidden";
        }
      } else {
        textarea.style.overflowY = "hidden";
      }
    } else {
      textarea.style.overflowY = "hidden";
    }
    textarea.style.height = `${height}px`;
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (enabled)
      resize();
  });
  useIsomorphicLayoutEffect(() => {
    if (!enabled)
      return;
    const textarea = textareaRef.current;
    if (!textarea)
      return;
    let lastWidth = textarea.clientWidth;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => {
      if (textarea.clientWidth !== lastWidth) {
        lastWidth = textarea.clientWidth;
        resize();
      }
    }) : null;
    observer?.observe(textarea);
    return () => {
      observer?.disconnect();
      textarea.style.height = "";
      textarea.style.overflowY = "";
    };
  }, [enabled, resize]);
  return { textareaRef, resize };
}
var InputArea = React4.forwardRef(
  (props, ref) => {
    const {
      className,
      onValueChange,
      size = "base",
      variant: variantProp,
      onChange,
      label,
      labelTooltip,
      description,
      error,
      autoResize = false,
      minRows = 1,
      maxRows,
      rows,
      ...inputProps
    } = props;
    if (false) {
      console.warn(
        '[Kumo InputArea]: variant="error" is deprecated. Error styling is now automatically applied when the `error` prop is truthy. Simply remove the variant prop and pass an error message instead.'
      );
    }
    const variant = variantProp ?? (error ? "error" : "default");
    const { required } = inputProps;
    const { textareaRef, resize } = useTextareaAutoResize({
      enabled: autoResize,
      minRows,
      maxRows
    });
    const refCleanup = useRef(void 0);
    const setTextareaRef = useCallback2(
      (node) => {
        textareaRef.current = node;
        if (typeof ref === "function") {
          if (node) {
            refCleanup.current = ref(node);
          } else if (refCleanup.current) {
            refCleanup.current();
            refCleanup.current = void 0;
          } else {
            ref(null);
          }
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, textareaRef]
    );
    const isControlled = inputProps.value !== void 0;
    const handleChange = useCallback2(
      (event) => {
        onChange?.(event);
        onValueChange?.(event.target.value);
        if (!isControlled)
          resize();
      },
      [onChange, onValueChange, resize, isControlled]
    );
    const textareaClassName = cn(
      inputVariants({ size, variant, focusIndicator: true }),
      "h-auto py-2",
      // Input variant always comes with size, but it does not apply for textarea
      autoResize && "field-sizing-content w-full resize-none scroll-pb-2 [scrollbar-width:thin] [scrollbar-color:var(--color-zenth-line)_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-corner]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zenth-line [&::-webkit-scrollbar-track]:my-2",
      className
    );
    if (label || error || description) {
      return /* @__PURE__ */ jsx16(
        Field,
        {
          label,
          required,
          labelTooltip,
          description,
          error: normalizeFieldError(error),
          children: /* @__PURE__ */ jsx16(
            FieldBase3.Control,
            {
              render: (controlProps) => /* @__PURE__ */ jsx16(
                "textarea",
                {
                  ...controlProps,
                  ref: setTextareaRef,
                  className: textareaClassName,
                  onChange: handleChange,
                  rows: autoResize ? minRows : rows,
                  ...inputProps
                }
              )
            }
          )
        }
      );
    }
    return /* @__PURE__ */ jsx16(
      "textarea",
      {
        ref: setTextareaRef,
        className: textareaClassName,
        onChange: handleChange,
        rows: autoResize ? minRows : rows,
        ...inputProps
      }
    );
  }
);
InputArea.displayName = "InputArea";
var Textarea = InputArea;

// src/components/input-group/input-group.tsx
import {
  forwardRef as forwardRef12,
  useId,
  useMemo as useMemo2
} from "react";

// src/components/input-group/context.ts
import {
  Children,
  createContext as createContext6,
  isValidElement as isValidElement2,
  useContext as useContext6
} from "react";
var INPUT_GROUP_SIZE = {
  xs: {
    inputOuter: "px-1.5",
    addonOuterStart: "pl-1.5",
    addonOuterEnd: "pr-1.5",
    addonButtonOuterStart: "pl-1",
    addonButtonOuterEnd: "pr-1",
    suffixPad: "pr-1.5",
    fontSize: "text-xs",
    iconSize: 10
  },
  sm: {
    inputOuter: "px-2",
    addonOuterStart: "pl-1.5",
    addonOuterEnd: "pr-1.5",
    addonButtonOuterStart: "pl-1",
    addonButtonOuterEnd: "pr-1",
    suffixPad: "pr-2",
    fontSize: "text-xs",
    iconSize: 13
  },
  base: {
    inputOuter: "px-3",
    addonOuterStart: "pl-2",
    addonOuterEnd: "pr-2",
    addonButtonOuterStart: "pl-1",
    addonButtonOuterEnd: "pr-1",
    suffixPad: "pr-3",
    fontSize: "text-base",
    iconSize: 18
  },
  lg: {
    inputOuter: "px-4",
    addonOuterStart: "pl-2.5",
    addonOuterEnd: "pr-2.5",
    addonButtonOuterStart: "pl-1.5",
    addonButtonOuterEnd: "pr-0.5",
    suffixPad: "pr-4",
    fontSize: "text-base",
    iconSize: 20
  }
};
var INPUT_GROUP_HAS_CLASSES = {
  xs: [
    "has-[[data-slot=input-group-addon-start]]:[&_input]:pl-1",
    "has-[[data-slot=input-group-addon-end]]:[&_input]:pr-1"
  ].join(" "),
  sm: [
    "has-[[data-slot=input-group-addon-start]]:[&_input]:pl-1.5",
    "has-[[data-slot=input-group-addon-end]]:[&_input]:pr-1.5"
  ].join(" "),
  base: [
    "has-[[data-slot=input-group-addon-start]]:[&_input]:pl-2",
    "has-[[data-slot=input-group-addon-end]]:[&_input]:pr-2"
  ].join(" "),
  lg: [
    "has-[[data-slot=input-group-addon-start]]:[&_input]:pl-2.5",
    "has-[[data-slot=input-group-addon-end]]:[&_input]:pr-2.5"
  ].join(" ")
};
var InputGroupContext = createContext6(
  null
);
var InputGroupAddonContext = createContext6(false);
function useInputGroupContext(componentName) {
  const context = useContext6(InputGroupContext);
  if (false) {
    console.warn(
      `<InputGroup.${componentName}> must be used within <InputGroup>. Falling back to default values.`
    );
  }
  return context;
}
function partitionChildren(children) {
  const containerZone = [];
  const individualZone = [];
  Children.forEach(children, (child) => {
    if (isValidElement2(child) && child.type?.displayName === "InputGroup.Button") {
      individualZone.push(child);
    } else {
      containerZone.push(child);
    }
  });
  return { containerZone, individualZone };
}
function detectFocusMode(children) {
  let hasNonGhostDirectButton = false;
  let hasAddon = false;
  Children.forEach(children, (child) => {
    if (!isValidElement2(child))
      return;
    const type = child.type;
    const displayName = typeof type === "function" || typeof type === "object" ? type.displayName : void 0;
    if (displayName === "InputGroup.Addon") {
      hasAddon = true;
      return;
    }
    if (displayName !== "InputGroup.Button")
      return;
    const variant = child.props.variant;
    if (variant !== void 0 && variant !== "ghost") {
      hasNonGhostDirectButton = true;
    }
  });
  if (hasNonGhostDirectButton && hasAddon)
    return "hybrid";
  if (hasNonGhostDirectButton)
    return "individual";
  return "container";
}

// src/components/input-group/input-group-input.tsx
import { forwardRef as forwardRef8 } from "react";
import { jsx as jsx17 } from "react/jsx-runtime";
var Input2 = forwardRef8(
  (props, ref) => {
    const context = useInputGroupContext("Input");
    if (false) {
      if (props.size !== void 0) {
        console.warn(
          "InputGroup.Input: Set `size` on <InputGroup> instead of <InputGroup.Input>."
        );
      }
      if (props.disabled !== void 0) {
        console.warn(
          "InputGroup.Input: Set `disabled` on <InputGroup> instead of <InputGroup.Input>."
        );
      }
      if (props.label !== void 0) {
        console.warn(
          "InputGroup.Input: Use the `label` prop on <InputGroup> instead of <InputGroup.Input>."
        );
      }
      if (props.description !== void 0) {
        console.warn(
          "InputGroup.Input: Use <InputGroup.Suffix> instead of passing `description` to <InputGroup.Input>."
        );
      }
    }
    const size = context?.size ?? "base";
    const tokens = INPUT_GROUP_SIZE[size];
    const isIndividual = context?.focusMode === "individual";
    const hasError = Boolean(context?.error);
    const inputId = props.id ?? context?.inputId;
    return /* @__PURE__ */ jsx17(
      Input,
      {
        ref,
        size: context?.size,
        disabled: context?.disabled || props.disabled,
        "aria-invalid": hasError || props["aria-invalid"],
        ...props,
        id: inputId,
        className: cn(
          // Base input layout: fill height, allow shrinking, strip native border/radius
          "flex h-full min-w-0 grow items-center rounded-none border-0 bg-transparent font-sans",
          // Always use full outer padding — the container's has-[] rules reduce pl/pr to inputSeam on sides that touch an addon.
          tokens.inputOuter,
          // Truncate overflowing text with "…" instead of expanding the input
          "text-ellipsis",
          // Individual mode: each element owns its own border instead of sharing a container ring
          isIndividual ? [
            // Own border replaces the container's shared ring; suppress the base Input's focus:ring so only the border-swap shows
            "relative ring-0 focus:ring-0 border border-zenth-line",
            "first:rounded-l-[inherit] last:rounded-r-[inherit]",
            // Negative margin (not border-l-0) so the border is still paintable on focus
            "not-first:-ml-px",
            "hover:z-1 hover:border-zenth-line",
            // z-[2] lifts above hovered siblings so focus border isn't clipped
            "focus:z-2 focus:border-zenth-focus/50"
          ].join(" ") : (
            // Container mode: kill all focus indicators — the container handles them z-1 lifts the input above the invisible label overlay so cursor/selection work
            "relative z-1 shadow-none ring-0! outline-none focus:ring-0! focus:outline-none"
          ),
          props.className
        )
      }
    );
  }
);
Input2.displayName = "InputGroup.Input";

// src/components/input-group/input-group-button.tsx
import React5, {
  forwardRef as forwardRef9,
  useContext as useContext7
} from "react";
import { jsx as jsx18 } from "react/jsx-runtime";
var COMPACT_BUTTON_SIZE = {
  xs: "xs",
  sm: "xs",
  base: "sm",
  lg: "base"
};
var Button2 = forwardRef9(
  ({
    children,
    className,
    variant,
    size,
    disabled,
    tooltip,
    tooltipSide = "bottom",
    icon: iconProp,
    ...props
  }, ref) => {
    const context = useInputGroupContext("Button");
    const isInsideAddon = useContext7(InputGroupAddonContext);
    const isDisabled = disabled ?? context?.disabled;
    const isIndividual = context?.focusMode === "individual" || context?.focusMode === "hybrid";
    const effectiveVariant = variant ?? "ghost";
    if (false) {
      console.warn(
        "InputGroup.Button: Ghost buttons should be wrapped in <InputGroup.Addon> for correct spacing."
      );
    }
    if (false) {
      console.warn(
        "InputGroup.Button: Set `size` on <InputGroup> instead of <InputGroup.Button>."
      );
    }
    const tooltipAriaLabel = typeof tooltip === "string" && !props["aria-label"] ? tooltip : void 0;
    const contextIconSize = context ? INPUT_GROUP_SIZE[context.size ?? "base"].iconSize : void 0;
    const icon = unwrapLazyElement(iconProp);
    const sizedIcon = icon && contextIconSize && (typeof icon === "function" || typeof icon === "object" && icon !== null && !React5.isValidElement(icon)) ? React5.createElement(icon, {
      size: contextIconSize
    }) : icon;
    const btn = /* @__PURE__ */ jsx18(
      Button,
      {
        ref,
        type: "button",
        disabled: isDisabled,
        "aria-label": tooltipAriaLabel,
        ...props,
        icon: sizedIcon,
        variant: variant ?? "ghost",
        size: size ?? (isIndividual ? context?.size ?? "sm" : COMPACT_BUTTON_SIZE[context?.size ?? "base"] ?? "sm"),
        className: cn(
          // Ensure clicks register even when parent has pointer-events-none (e.g. disabled overlay)
          "pointer-events-auto",
          // Suppress the base Button's drop shadow so InputGroup matches the flat
          // appearance of the standalone Input (ghost already sets shadow-none,
          // but secondary/primary/outline etc. inherit shadow-xs from Button base)
          "shadow-none",
          // Suppress the base Button's non-visible focus ring in all modes
          "focus:ring-0",
          // Container-zone buttons: use a subtle ring as focus indicator
          // The base Button also retains a forced-colors outline.
          !isIndividual && "focus-visible:ring-[1.5px] focus-visible:ring-zenth-focus/50",
          // Individual mode: each button owns its own border and focus indicator
          isIndividual && [
            // Own border replaces the container's shared ring; force full height
            "relative h-full! rounded-none border border-zenth-line ring-0 focus-visible:ring-0",
            "first:rounded-l-[inherit] last:rounded-r-[inherit]",
            // Negative margin (not border-l-0) so the border is still paintable on focus
            "not-first:-ml-px",
            "hover:z-1",
            // z-2 lifts above hovered siblings so focus border isn't clipped
            "focus:z-2",
            "focus-visible:border-zenth-focus/50",
            "disabled:bg-zenth-overlay disabled:text-zenth-inactive!"
          ],
          className
        ),
        children
      }
    );
    if (tooltip) {
      return /* @__PURE__ */ jsx18(Tooltip, { content: tooltip, side: tooltipSide, asChild: true, children: btn });
    }
    return btn;
  }
);
Button2.displayName = "InputGroup.Button";

// src/components/input-group/input-group-addon.tsx
import {
  Children as Children2,
  cloneElement,
  forwardRef as forwardRef10,
  isValidElement as isValidElement3
} from "react";
import { jsx as jsx19 } from "react/jsx-runtime";
var Addon = forwardRef10(
  ({ align = "start", className, children }, ref) => {
    const context = useInputGroupContext("Addon");
    const size = context?.size ?? "base";
    const tokens = INPUT_GROUP_SIZE[size];
    let containsButton = false;
    const sizedChildren = Children2.map(children, (child) => {
      if (!isValidElement3(child))
        return child;
      if (child.type === Button2) {
        containsButton = true;
        return child;
      }
      const props = child.props;
      if (props.size !== void 0)
        return child;
      return cloneElement(child, {
        size: tokens.iconSize
      });
    });
    return /* @__PURE__ */ jsx19(
      "div",
      {
        ref,
        "data-slot": align === "start" ? "input-group-addon-start" : "input-group-addon-end",
        className: cn(
          "pointer-events-none relative z-[1] flex shrink-0 items-center gap-1.5",
          "text-zenth-subtle",
          tokens.fontSize,
          "*:pointer-events-auto",
          align === "start" ? cn(
            "-order-1",
            containsButton ? tokens.addonButtonOuterStart : tokens.addonOuterStart,
            "pr-0"
          ) : cn(
            "order-1",
            "pl-0",
            containsButton ? tokens.addonButtonOuterEnd : tokens.addonOuterEnd
          ),
          className
        ),
        children: /* @__PURE__ */ jsx19(InputGroupAddonContext.Provider, { value: true, children: sizedChildren })
      }
    );
  }
);
Addon.displayName = "InputGroup.Addon";

// src/components/input-group/input-group-suffix.tsx
import { forwardRef as forwardRef11 } from "react";
import { jsx as jsx20 } from "react/jsx-runtime";
var Suffix = forwardRef11(
  ({ className, children }, ref) => {
    const context = useInputGroupContext("Suffix");
    const size = context?.size ?? "base";
    const tokens = INPUT_GROUP_SIZE[size];
    return /* @__PURE__ */ jsx20(
      "div",
      {
        ref,
        "data-slot": "input-group-suffix",
        className: cn(
          "pointer-events-none flex min-w-0 grow items-center text-zenth-subtle select-none",
          tokens.fontSize,
          tokens.suffixPad,
          className
        ),
        children: /* @__PURE__ */ jsx20("span", { className: "truncate", children })
      }
    );
  }
);
Suffix.displayName = "InputGroup.Suffix";

// src/components/input-group/input-group.tsx
import { Fragment as Fragment3, jsx as jsx21, jsxs as jsxs11 } from "react/jsx-runtime";
var Root = forwardRef12(
  ({
    size = "base",
    children,
    className,
    disabled = false,
    label,
    description,
    error,
    required,
    labelTooltip,
    ...rest
  }, forwardedRef) => {
    const inputId = useId();
    const focusMode = detectFocusMode(children);
    const contextValue = useMemo2(
      () => ({
        size,
        focusMode,
        disabled,
        error,
        inputId
      }),
      [size, focusMode, disabled, error, inputId]
    );
    const containerClassName = cn(
      // Establish positioning context and make the whole area a click target
      "relative w-full cursor-text",
      // inputVariants provides base ring-zenth-line; must come before state overrides
      inputVariants({ size }),
      // Disabled state: prevent interaction and dim the entire group
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // Container mode: clip children to rounded corners and show a shared focus ring
      // Individual mode: disable container ring/shadow so each child owns its own border
      focusMode === "container" ? [
        "overflow-hidden",
        // Focus state must come AFTER inputVariants to override ring-zenth-line
        "focus-within:ring-[1.5px] focus-within:ring-zenth-focus/50 has-focus-visible:outline-hidden"
      ] : (
        // isolate creates a new stacking context so z-index in children doesn't leak out
        "isolate overflow-visible shadow-none ring-0"
      ),
      // Error state must also come after inputVariants
      "has-[input[aria-invalid=true]]:ring-zenth-danger",
      // Reset horizontal padding — children handle their own spacing
      "px-0",
      // Horizontal layout with no gap — children control their own internal spacing
      "flex items-center gap-0",
      // When a suffix is present, let the input shrink to its content width
      // so the suffix stays visually adjacent
      "has-[[data-slot=input-group-suffix]]:[&_input]:[field-sizing:content]",
      "has-[[data-slot=input-group-suffix]]:[&_input]:max-w-full",
      "has-[[data-slot=input-group-suffix]]:[&_input]:grow-0",
      "has-[[data-slot=input-group-suffix]]:[&_input]:pr-0",
      // Size-specific padding adjustments when addons or suffixes are present
      INPUT_GROUP_HAS_CLASSES[size],
      // Reset bottom margin to avoid inherited spacing from parent <label> styles
      "!mb-0",
      className
    );
    const dataProps = {
      "data-slot": "input-group",
      "data-focus-mode": focusMode,
      "data-disabled": disabled ? "" : void 0
    };
    if (focusMode === "hybrid") {
      const { containerZone, individualZone } = partitionChildren(children);
      const containerZoneContext = {
        ...contextValue,
        focusMode: "container"
      };
      const hybridContent = /* @__PURE__ */ jsxs11(Fragment3, { children: [
        /* @__PURE__ */ jsx21(InputGroupContext.Provider, { value: containerZoneContext, children: /* @__PURE__ */ jsxs11(
          "div",
          {
            "data-slot": "input-group-container-zone",
            className: cn(
              // Base input sizing/shape from shared variant function
              inputVariants({ size }),
              // Clip children to rounded corners within the zone
              "overflow-hidden",
              // Show red ring on validation error
              "has-[input[aria-invalid=true]]:ring-zenth-danger",
              // Reset horizontal padding — children handle their own spacing
              "px-0",
              // Fill available width but allow shrinking when sibling buttons are present
              "flex min-w-0 flex-1 items-center gap-0",
              // Use a clean 1px CSS border instead of ring+shadow from inputVariants
              // so the zone matches adjacent individual-mode buttons exactly.
              "shadow-none ring-0",
              "border border-zenth-line",
              "focus-within:border-zenth-focus/50 has-focus-visible:outline-hidden",
              // z-[2] lifts above adjacent button's -ml-px overlap so focus border shows
              "focus-within:z-2",
              // Negative margin (not border-l-0) so the border is still paintable on focus
              "not-first:-ml-px",
              // Outer edges inherit radius; inner edges are flat against sibling buttons
              "rounded-none first:rounded-l-[inherit] last:rounded-r-[inherit]",
              // Size-specific padding adjustments when addons or suffixes are present
              INPUT_GROUP_HAS_CLASSES[size],
              // When a suffix is present, let the input shrink to its content width
              "has-data-[slot=input-group-suffix]:[&_input]:field-sizing-content",
              "has-data-[slot=input-group-suffix]:[&_input]:max-w-full",
              "has-data-[slot=input-group-suffix]:[&_input]:grow-0",
              "has-data-[slot=input-group-suffix]:[&_input]:pr-0"
            ),
            children: [
              label && // Invisible overlay for click-to-focus; the visible Field label handles a11y
              // eslint-disable-next-line jsx-a11y/label-has-associated-control
              /* @__PURE__ */ jsx21(
                "label",
                {
                  htmlFor: inputId,
                  className: "absolute inset-0 z-0 mb-0! cursor-text",
                  "aria-hidden": "true"
                }
              ),
              containerZone
            ]
          }
        ) }),
        individualZone
      ] });
      const hybridContainer = /* @__PURE__ */ jsx21(InputGroupContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx21(
        "div",
        {
          ref: forwardedRef,
          ...dataProps,
          className: containerClassName,
          ...rest,
          children: hybridContent
        }
      ) });
      if (label) {
        return /* @__PURE__ */ jsx21(
          Field,
          {
            label,
            description,
            error,
            required,
            labelTooltip,
            children: hybridContainer
          }
        );
      }
      return hybridContainer;
    }
    const useLabelContainer = !label && focusMode === "container";
    const container = /* @__PURE__ */ jsx21(InputGroupContext.Provider, { value: contextValue, children: label ? /* @__PURE__ */ jsxs11(
      "div",
      {
        ref: forwardedRef,
        ...dataProps,
        className: containerClassName,
        ...rest,
        children: [
          /* @__PURE__ */ jsx21(
            "label",
            {
              htmlFor: inputId,
              className: "absolute inset-0 z-0 mb-0!",
              "aria-hidden": "true"
            }
          ),
          children
        ]
      }
    ) : useLabelContainer ? (
      // Standalone container mode: <label> enables click-to-focus on empty space.
      /* @__PURE__ */ jsx21(
        "label",
        {
          ref: forwardedRef,
          ...dataProps,
          className: cn(containerClassName, "mb-0!"),
          ...rest,
          children
        }
      )
    ) : (
      // Individual mode: <div> avoids :hover propagating to the first labelable sibling.
      /* @__PURE__ */ jsx21(
        "div",
        {
          ref: forwardedRef,
          ...dataProps,
          className: containerClassName,
          ...rest,
          children
        }
      )
    ) });
    if (label) {
      return /* @__PURE__ */ jsx21(
        Field,
        {
          label,
          description,
          error,
          required,
          labelTooltip,
          children: container
        }
      );
    }
    return container;
  }
);
Root.displayName = "InputGroup";
var Label2 = forwardRef12((props, ref) => /* @__PURE__ */ jsx21(Addon, { ref, align: "start", ...props }));
Label2.displayName = "InputGroup.Label";
var Description = forwardRef12((props, ref) => /* @__PURE__ */ jsx21(Suffix, { ref, ...props }));
Description.displayName = "InputGroup.Description";
var InputGroup = Object.assign(Root, {
  Input: Input2,
  Button: Button2,
  Addon,
  Suffix,
  /** @deprecated Use `InputGroup.Addon` instead. */
  Label: Label2,
  /** @deprecated Use `InputGroup.Suffix` instead. */
  Description
});

// src/components/clipboard-text/clipboard-text.tsx
import { jsx as jsx22, jsxs as jsxs12 } from "react/jsx-runtime";
var clipboardToastManager = Toast.createToastManager();
var COPIED_FEEDBACK_MS = 1500;
var KUMO_CLIPBOARD_TEXT_VARIANTS = {
  size: {
    sm: {
      classes: "text-xs",
      buttonSize: "sm",
      description: "Small clipboard text for compact UIs"
    },
    base: {
      classes: "text-sm",
      buttonSize: "base",
      description: "Default clipboard text size"
    },
    lg: {
      classes: "text-sm",
      buttonSize: "lg",
      description: "Large clipboard text for prominent display"
    }
  }
};
var KUMO_CLIPBOARD_TEXT_DEFAULT_VARIANTS = {
  size: "lg"
};
var clipboardTextAnimations = {
  slide: {
    initial: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 translate-y-full",
    animate: "translate-y-0 opacity-100",
    end: "pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 -translate-y-full"
  }
};
function clipboardTextVariants({
  size = KUMO_CLIPBOARD_TEXT_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    // Base styles
    "flex items-center gap-0 overflow-hidden bg-zenth-base px-0 font-mono",
    // Apply size styles from KUMO_CLIPBOARD_TEXT_VARIANTS
    resolveVariant(
      KUMO_CLIPBOARD_TEXT_VARIANTS.size,
      size,
      KUMO_CLIPBOARD_TEXT_DEFAULT_VARIANTS.size
    ).classes
  );
}
function AnchoredToasts() {
  const { toasts } = Toast.useToastManager();
  return /* @__PURE__ */ jsx22(Toast.Viewport, { className: "pointer-events-none fixed inset-0 isolate", children: toasts.map((toast) => {
    const updateKey = toast.updateKey ?? 0;
    return /* @__PURE__ */ jsx22(Toast.Positioner, { toast, className: "absolute", children: /* @__PURE__ */ jsx22(
      Toast.Root,
      {
        toast,
        className: cn(
          "flex origin-[var(--transform-origin)] flex-col rounded-md bg-zenth-base px-3 py-1.5 font-sans text-xs text-zenth-default",
          "shadow-lg outline outline-zenth-line",
          updateKey > 0 && "zenth-animate-clipboard-toast-bump"
        ),
        children: /* @__PURE__ */ jsx22(Toast.Description, {})
      },
      updateKey
    ) }, toast.id);
  }) });
}
function TooltipWrapper({ children }) {
  return /* @__PURE__ */ jsx22(Tooltip2.Provider, { children: /* @__PURE__ */ jsxs12(Toast.Provider, { toastManager: clipboardToastManager, children: [
    /* @__PURE__ */ jsx22(AnchoredToasts, {}),
    children
  ] }) });
}
var ClipboardText = forwardRef13(
  ({
    text,
    textToCopy,
    masked = false,
    className,
    size = KUMO_CLIPBOARD_TEXT_DEFAULT_VARIANTS.size,
    onCopy,
    tooltip,
    labels: {
      copyAction = "Copy to clipboard",
      revealAction = "Reveal value",
      hideAction = "Hide value"
    } = {}
  }, ref) => {
    const [copied, setCopied] = useState2(false);
    const [revealed, setRevealed] = useState2(false);
    const buttonRef = useRef2(null);
    const resetTimeoutRef = useRef2(null);
    const toastIdRef = useRef2(null);
    const sizeConfig = resolveVariant(
      KUMO_CLIPBOARD_TEXT_VARIANTS.size,
      size,
      KUMO_CLIPBOARD_TEXT_DEFAULT_VARIANTS.size
    );
    const {
      text: tooltipText = "Copy",
      copiedText = "Copied",
      side: tooltipSide = "top"
    } = tooltip ?? {};
    useEffect3(() => {
      return () => {
        if (resetTimeoutRef.current !== null) {
          clearTimeout(resetTimeoutRef.current);
        }
      };
    }, []);
    const scheduleCopiedReset = useCallback3(() => {
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
      }
      resetTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        resetTimeoutRef.current = null;
      }, COPIED_FEEDBACK_MS);
    }, []);
    const copyToClipboard = useCallback3(async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(textToCopy ?? text);
        } else if (typeof document !== "undefined") {
          const textarea = document.createElement("textarea");
          textarea.value = textToCopy ?? text;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "absolute";
          textarea.style.left = "-9999px";
          document.body.appendChild(textarea);
          const selection = document.getSelection();
          const previousRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
          textarea.select();
          try {
            document.execCommand("copy");
          } finally {
            document.body.removeChild(textarea);
            if (previousRange) {
              selection?.removeAllRanges();
              selection?.addRange(previousRange);
            }
          }
        }
        setCopied(true);
        if (tooltip) {
          toastIdRef.current = clipboardToastManager.add({
            id: toastIdRef.current ?? void 0,
            description: copiedText,
            positionerProps: {
              anchor: buttonRef.current,
              side: tooltipSide,
              sideOffset: 8
            },
            timeout: COPIED_FEEDBACK_MS,
            onClose() {
              toastIdRef.current = null;
              setCopied(false);
            }
          });
        } else {
          scheduleCopiedReset();
        }
        onCopy?.();
      } catch (error) {
        console.warn("Clipboard copy failed", error);
      }
    }, [
      text,
      textToCopy,
      onCopy,
      tooltip,
      copiedText,
      tooltipSide,
      scheduleCopiedReset
    ]);
    const copyButton = /* @__PURE__ */ jsxs12(
      Button,
      {
        ref: buttonRef,
        size: sizeConfig.buttonSize,
        variant: "ghost",
        className: cn(
          "relative isolate overflow-hidden rounded-l-none rounded-r-[inherit] border-l! border-zenth-line! px-3 transition-all duration-200",
          "focus:ring-zenth-focus/50 focus:ring-inset",
          "focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:ring-inset"
        ),
        onClick: copyToClipboard,
        "aria-label": copyAction,
        children: [
          /* @__PURE__ */ jsx22(
            "span",
            {
              className: cn(
                "flex items-center gap-1 transition-all duration-200",
                copied ? clipboardTextAnimations.slide.animate : clipboardTextAnimations.slide.initial
              ),
              children: /* @__PURE__ */ jsx22(CheckIcon2, {})
            }
          ),
          /* @__PURE__ */ jsx22(
            "span",
            {
              className: cn(
                "flex items-center justify-center transition-all duration-200",
                copied ? clipboardTextAnimations.slide.end : clipboardTextAnimations.slide.animate
              ),
              children: /* @__PURE__ */ jsx22(CopyIcon, {})
            }
          )
        ]
      }
    );
    const visibilityButton = masked ? /* @__PURE__ */ jsx22(
      Button,
      {
        size: sizeConfig.buttonSize,
        variant: "ghost",
        className: cn(
          "rounded-none border-l! border-zenth-line! px-3",
          "focus:ring-zenth-focus/50 focus:ring-inset",
          "focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:ring-inset"
        ),
        onClick: () => setRevealed((value) => !value),
        "aria-label": revealed ? hideAction : revealAction,
        "aria-pressed": revealed,
        children: revealed ? /* @__PURE__ */ jsx22(EyeSlashIcon, {}) : /* @__PURE__ */ jsx22(EyeIcon, {})
      }
    ) : null;
    return /* @__PURE__ */ jsxs12(
      "div",
      {
        ref,
        className: cn(
          inputVariants({ size: sizeConfig.buttonSize }),
          clipboardTextVariants({ size }),
          className
        ),
        children: [
          /* @__PURE__ */ jsx22("span", { className: "grow truncate ps-4 pe-2", children: masked && !revealed ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : text }),
          visibilityButton,
          tooltip ? /* @__PURE__ */ jsx22(TooltipWrapper, { children: /* @__PURE__ */ jsxs12(
            Tooltip2.Root,
            {
              disabled: copied,
              onOpenChange: (open, eventDetails) => {
                if (eventDetails.reason === "trigger-press") {
                  eventDetails.cancel();
                }
              },
              children: [
                /* @__PURE__ */ jsx22(Tooltip2.Trigger, { render: copyButton }),
                /* @__PURE__ */ jsx22(Tooltip2.Portal, { children: /* @__PURE__ */ jsx22(Tooltip2.Positioner, { side: tooltipSide, sideOffset: 8, children: /* @__PURE__ */ jsx22(
                  Tooltip2.Popup,
                  {
                    className: cn(
                      "flex origin-[var(--transform-origin)] flex-col rounded-md bg-zenth-base px-3 py-1.5 text-xs text-zenth-default",
                      "shadow-md outline outline-zenth-line"
                    ),
                    children: tooltipText
                  }
                ) }) })
              ]
            }
          ) }) : copyButton,
          /* @__PURE__ */ jsx22("span", { className: "sr-only", "aria-live": "polite", children: copied ? copiedText : "" })
        ]
      }
    );
  }
);
ClipboardText.displayName = "ClipboardText";

// src/components/inline-copy-text/inline-copy-text.tsx
import { CheckIcon as CheckIcon3, CopySimpleIcon } from "@phosphor-icons/react";
import {
  forwardRef as forwardRef15,
  useCallback as useCallback4,
  useEffect as useEffect4,
  useRef as useRef3,
  useState as useState3
} from "react";

// src/components/text/text.tsx
import {
  forwardRef as forwardRef14,
  useMemo as useMemo3
} from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
var KUMO_TEXT_VARIANTS = {
  variant: {
    heading: {
      classes: "text-lg font-semibold",
      description: "Heading text (16px by default, 20px at large size)"
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading1: {
      classes: "text-3xl font-semibold",
      description: "Deprecated large heading for page titles; use heading instead"
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading2: {
      classes: "text-2xl font-semibold",
      description: "Deprecated medium heading for section titles; use heading instead"
    },
    /** @deprecated Use `heading` and set `size` and `as` explicitly. */
    heading3: {
      classes: "text-lg font-semibold",
      description: "Deprecated small heading for subsections; use heading instead"
    },
    body: {
      classes: "text-zenth-default",
      description: "Default body text"
    },
    secondary: {
      classes: "text-zenth-subtle",
      description: "Muted text for secondary information"
    },
    success: {
      classes: "text-zenth-link",
      description: "Success state text"
    },
    error: {
      classes: "text-zenth-danger",
      description: "Error state text"
    },
    mono: {
      classes: "font-mono",
      description: "Monospace text for code"
    },
    "mono-secondary": {
      classes: "font-mono text-zenth-subtle",
      description: "Muted monospace text"
    }
  },
  size: {
    xs: {
      classes: "text-xs/[inherit]",
      description: "Extra small text"
    },
    sm: {
      classes: "text-sm/[inherit]",
      description: "Small text"
    },
    base: {
      classes: "text-base/[inherit]",
      description: "Default text size"
    },
    lg: {
      classes: "text-lg/[inherit]",
      description: "Large text"
    }
  }
};
var KUMO_TEXT_DEFAULT_VARIANTS = {
  variant: "body",
  size: "base"
};
var DEPRECATED_HEADING_VARIANTS = [
  "heading1",
  "heading2",
  "heading3"
];
function isDeprecatedHeadingVariant(variant) {
  return DEPRECATED_HEADING_VARIANTS.includes(
    variant
  );
}
function resolveTextSizeClasses(variant, size) {
  if (variant === "heading") {
    return size === "lg" ? "text-xl" : "";
  }
  if (isDeprecatedHeadingVariant(variant)) {
    return "";
  }
  if (["mono", "mono-secondary"].includes(variant)) {
    return size === "lg" ? KUMO_TEXT_VARIANTS.size.base.classes : KUMO_TEXT_VARIANTS.size.sm.classes;
  }
  return resolveVariant(
    KUMO_TEXT_VARIANTS.size,
    size,
    KUMO_TEXT_DEFAULT_VARIANTS.size
  ).classes;
}
function _Text({
  variant = "body",
  bold = false,
  size = "base",
  truncate = false,
  children,
  DANGEROUS_className,
  DANGEROUS_style,
  as,
  ...props
}, ref) {
  const isCopy = ["body", "secondary", "success", "error"].includes(variant);
  const Component = useMemo3(() => {
    if (as)
      return as;
    if (["mono", "mono-secondary"].includes(variant))
      return "span";
    if (variant === "heading" || isDeprecatedHeadingVariant(variant)) {
      return "span";
    }
    return "p";
  }, [variant, as]);
  return /* @__PURE__ */ jsx23(
    Component,
    {
      ref,
      className: cn(
        "text-zenth-default",
        resolveVariant(
          KUMO_TEXT_VARIANTS.variant,
          variant,
          KUMO_TEXT_DEFAULT_VARIANTS.variant
        ).classes,
        resolveTextSizeClasses(variant, size),
        isCopy && bold ? "font-medium" : "",
        truncate && "min-w-0 truncate",
        DANGEROUS_className
      ),
      style: DANGEROUS_style,
      ...props,
      children
    }
  );
}
var Text = forwardRef14(_Text);

// src/components/inline-copy-text/inline-copy-text.tsx
import { jsx as jsx24, jsxs as jsxs13 } from "react/jsx-runtime";
var COPIED_FEEDBACK_MS2 = 1500;
function resolveCopyValue(children, value) {
  if (value !== void 0)
    return value;
  if (typeof children === "string")
    return children;
  throw new Error(
    "InlineCopyText requires a value prop when children is not a string."
  );
}
var KUMO_INLINE_COPY_TEXT_VARIANTS = {};
var KUMO_INLINE_COPY_TEXT_DEFAULT_VARIANTS = {};
var KUMO_INLINE_COPY_TEXT_STYLING = {
  baseClasses: "group/inline-copy flex min-w-0 max-w-full cursor-pointer items-center gap-1 rounded-xs border-0 bg-transparent p-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand"
};
var InlineCopyText = forwardRef15(
  ({
    children,
    value,
    variant = "mono-secondary",
    size,
    bold,
    truncate = true,
    as = "span",
    className,
    onClick,
    onCopy,
    labels: {
      copyAction = "Copy to clipboard",
      copied: copiedLabel = "Copied"
    } = {},
    ...props
  }, ref) => {
    const [copied, setCopied] = useState3(false);
    const resetTimeoutRef = useRef3(null);
    const valueToCopy = resolveCopyValue(children, value);
    useEffect4(() => {
      return () => {
        if (resetTimeoutRef.current !== null) {
          clearTimeout(resetTimeoutRef.current);
        }
      };
    }, []);
    const copyToClipboard = useCallback4(async () => {
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
      }
      try {
        await navigator.clipboard.writeText(valueToCopy);
        setCopied(true);
        resetTimeoutRef.current = setTimeout(() => {
          setCopied(false);
          resetTimeoutRef.current = null;
        }, COPIED_FEEDBACK_MS2);
        onCopy?.();
      } catch (error) {
        setCopied(false);
        console.warn("Clipboard copy failed", error);
      }
    }, [onCopy, valueToCopy]);
    const textHoverClasses = variant === "mono-secondary" ? "group-hover/inline-copy:text-zenth-default group-focus-visible/inline-copy:text-zenth-default" : void 0;
    const renderedText = variant === "mono" || variant === "mono-secondary" ? /* @__PURE__ */ jsx24(
      Text,
      {
        as,
        size: size === "lg" ? size : void 0,
        truncate,
        variant,
        DANGEROUS_className: textHoverClasses,
        children
      }
    ) : /* @__PURE__ */ jsx24(
      Text,
      {
        as,
        bold,
        size,
        truncate,
        variant,
        DANGEROUS_className: textHoverClasses,
        children
      }
    );
    return /* @__PURE__ */ jsxs13(
      "button",
      {
        ...props,
        ref,
        type: "button",
        "data-zenth-component": "InlineCopyText",
        className: cn(KUMO_INLINE_COPY_TEXT_STYLING.baseClasses, className),
        onClick: (event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            void copyToClipboard();
          }
        },
        "aria-label": copied ? copiedLabel : copyAction,
        children: [
          renderedText,
          copied ? /* @__PURE__ */ jsx24(CheckIcon3, { "aria-hidden": true, size: 14, className: "shrink-0" }) : /* @__PURE__ */ jsx24(
            CopySimpleIcon,
            {
              "aria-hidden": true,
              size: 14,
              className: cn(
                "shrink-0 opacity-0 transition-opacity motion-reduce:transition-none",
                "group-hover/inline-copy:opacity-100 group-focus-visible/inline-copy:opacity-100",
                "group-focus-within:opacity-100 group-hover:opacity-100"
              )
            }
          ),
          /* @__PURE__ */ jsx24("span", { className: "sr-only", "aria-live": "polite", children: copied ? copiedLabel : "" })
        ]
      }
    );
  }
);
InlineCopyText.displayName = "InlineCopyText";

// src/components/code/code.tsx
import { jsx as jsx25 } from "react/jsx-runtime";
var KUMO_CODE_VARIANTS = {
  lang: {
    ts: {
      classes: "",
      description: "TypeScript code"
    },
    tsx: {
      classes: "",
      description: "TypeScript JSX code"
    },
    jsonc: {
      classes: "",
      description: "JSON with comments"
    },
    bash: {
      classes: "",
      description: "Shell/Bash commands"
    },
    css: {
      classes: "",
      description: "CSS styles"
    }
  }
};
var KUMO_CODE_DEFAULT_VARIANTS = {
  lang: "ts"
};
function codeVariants({
  lang = KUMO_CODE_DEFAULT_VARIANTS.lang
} = {}) {
  return cn(
    // Base styles
    "m-0 w-auto rounded-none border-none bg-transparent p-0 font-mono text-sm leading-[20px] text-zenth-subtle",
    // Apply lang-specific styles (fallback to default if lang not in map)
    resolveVariant(
      KUMO_CODE_VARIANTS.lang,
      lang,
      KUMO_CODE_DEFAULT_VARIANTS.lang
    ).classes
  );
}
function CodeComponent({
  code,
  lang = KUMO_CODE_DEFAULT_VARIANTS.lang,
  className,
  style
}) {
  return /* @__PURE__ */ jsx25("pre", { className: cn(codeVariants({ lang }), className), style, children: code });
}
CodeComponent.displayName = "Code";
function CodeBlockComponent({ code, lang }) {
  return /* @__PURE__ */ jsx25("div", { className: "min-w-0 rounded-md border border-zenth-fill bg-zenth-base [&>pre]:p-2.5!", children: /* @__PURE__ */ jsx25(CodeComponent, { lang, code }) });
}
CodeBlockComponent.displayName = "CodeBlock";
var Code = Object.assign(CodeComponent, {
  Block: CodeBlockComponent
});
var CodeBlock = CodeBlockComponent;

// src/components/combobox/combobox.tsx
import { Combobox as ComboboxBase } from "@base-ui/react/combobox";
import { CaretUpDownIcon, CheckIcon as CheckIcon4, XIcon } from "@phosphor-icons/react";
import {
  Fragment as Fragment4,
  createContext as createContext7,
  useContext as useContext8
} from "react";
import { jsx as jsx26, jsxs as jsxs14 } from "react/jsx-runtime";
var KUMO_COMBOBOX_VARIANTS = {
  size: KUMO_INPUT_VARIANTS.size,
  inputSide: {
    right: {
      classes: "",
      description: "Input positioned inline to the right of chips"
    },
    top: {
      classes: "",
      description: "Input positioned above chips"
    }
  }
};
var ComboboxContext = createContext7({ size: "base", hasError: false });
function Root2({
  label,
  required,
  labelTooltip,
  description,
  error,
  children,
  size = "base",
  ...props
}) {
  const comboboxControl = /* @__PURE__ */ jsx26(ComboboxContext.Provider, { value: { size, hasError: Boolean(error) }, children: /* @__PURE__ */ jsx26(ComboboxBase.Root, { ...props, required, children }) });
  if (label) {
    return /* @__PURE__ */ jsx26(
      Field,
      {
        label,
        required,
        labelTooltip,
        description,
        error: error ? typeof error === "string" ? { message: error, match: true } : error : void 0,
        children: comboboxControl
      }
    );
  }
  return comboboxControl;
}
function Content({
  children,
  className,
  align = "start",
  sideOffset = 4,
  alignOffset,
  side,
  anchor,
  positionMethod,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  sticky,
  disableAnchorTracking,
  container: containerProp
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  return /* @__PURE__ */ jsx26(ComboboxBase.Portal, { container, children: /* @__PURE__ */ jsx26(
    ComboboxBase.Positioner,
    {
      className: "",
      align,
      sideOffset,
      alignOffset,
      side,
      anchor,
      positionMethod,
      collisionAvoidance,
      collisionBoundary,
      collisionPadding,
      sticky,
      disableAnchorTracking,
      children: /* @__PURE__ */ jsx26(
        ComboboxBase.Popup,
        {
          className: cn(
            "flex flex-col",
            // flexbox layout for sticky input + scrollable list
            "max-h-[min(var(--available-height),24rem)] max-w-(--available-width) min-w-(--anchor-width) py-1.5",
            "bg-zenth-base text-zenth-default",
            // background
            "rounded-lg shadow-lg ring ring-zenth-line",
            // border part
            className
          ),
          children
        }
      )
    }
  ) });
}
var triggerValueIconStyles = {
  xs: { padding: "pr-5", iconSize: 12, iconRight: "right-1" },
  sm: { padding: "pr-6", iconSize: 14, iconRight: "right-1.5" },
  base: { padding: "pr-8", iconSize: 16, iconRight: "right-2" },
  lg: { padding: "pr-10", iconSize: 18, iconRight: "right-3" }
};
function omitUndefined(props) {
  return Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== void 0)
  );
}
function TriggerValue({
  className,
  children,
  placeholder,
  ...triggerProps
}) {
  const { size, hasError } = useContext8(ComboboxContext);
  const iconStyles = triggerValueIconStyles[size];
  return /* @__PURE__ */ jsxs14(
    ComboboxBase.Trigger,
    {
      "data-zenth-component": "Combobox",
      "data-zenth-part": "trigger",
      ...omitUndefined(triggerProps),
      className: cn(
        inputVariants({ size, variant: hasError ? "error" : "default" }),
        "relative flex items-center",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        "data-[placeholder]:text-zenth-placeholder",
        iconStyles.padding,
        className
      ),
      children: [
        /* @__PURE__ */ jsx26(ComboboxBase.Value, { placeholder, children }),
        /* @__PURE__ */ jsx26(
          ComboboxBase.Icon,
          {
            className: cn(
              "absolute top-1/2 flex -translate-y-1/2 items-center text-zenth-subtle",
              iconStyles.iconRight
            ),
            children: /* @__PURE__ */ jsx26(CaretUpDownIcon, { size: iconStyles.iconSize, className: "fill-current" })
          }
        )
      ]
    }
  );
}
var triggerInputIconStyles = {
  xs: {
    padding: "pr-7",
    iconSize: 12,
    clearRight: "right-5",
    caretRight: "right-1"
  },
  sm: {
    padding: "pr-9",
    iconSize: 14,
    clearRight: "right-6",
    caretRight: "right-1.5"
  },
  base: {
    padding: "pr-12",
    iconSize: 16,
    clearRight: "right-8",
    caretRight: "right-2"
  },
  lg: {
    padding: "pr-14",
    iconSize: 18,
    clearRight: "right-9",
    caretRight: "right-3"
  }
};
function TriggerInput({
  clearLabel = "Clear selection",
  showOptionsLabel = "Show options",
  ...props
}) {
  const { size, hasError } = useContext8(ComboboxContext);
  const iconStyles = triggerInputIconStyles[size];
  return /* @__PURE__ */ jsxs14(
    "div",
    {
      className: cn(
        "relative inline-block w-full",
        "has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        props.className
      ),
      children: [
        /* @__PURE__ */ jsx26(
          ComboboxBase.Input,
          {
            ...props,
            className: cn(
              inputVariants({ size, variant: hasError ? "error" : "default" }),
              "w-full",
              iconStyles.padding,
              "disabled:cursor-not-allowed"
            )
          }
        ),
        /* @__PURE__ */ jsx26(
          ComboboxBase.Clear,
          {
            "data-zenth-component": "Combobox",
            "data-zenth-part": "clear",
            "aria-label": clearLabel,
            className: cn(
              "absolute top-1/2 flex -translate-y-1/2 cursor-pointer bg-transparent p-0",
              "data-[disabled]:pointer-events-none data-[disabled]:opacity-0",
              iconStyles.clearRight
            ),
            children: /* @__PURE__ */ jsx26(XIcon, { size: iconStyles.iconSize })
          }
        ),
        /* @__PURE__ */ jsx26(
          ComboboxBase.Trigger,
          {
            "data-zenth-component": "Combobox",
            "data-zenth-part": "trigger",
            "aria-label": showOptionsLabel,
            className: cn(
              "absolute top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center text-zenth-subtle",
              "m-0 bg-transparent p-0",
              // Reset Stratus global button styles
              iconStyles.caretRight
            ),
            children: /* @__PURE__ */ jsx26(ComboboxBase.Icon, { className: "flex items-center", children: /* @__PURE__ */ jsx26(
              CaretUpDownIcon,
              {
                size: iconStyles.iconSize,
                className: "fill-current"
              }
            ) })
          }
        )
      ]
    }
  );
}
function Item({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs14(
    ComboboxBase.Item,
    {
      "data-zenth-component": "Combobox",
      "data-zenth-part": "item",
      ...props,
      className: cn(
        "group mx-1.5 grid grid-cols-[1fr_16px] gap-2 rounded px-2 py-1.5 text-base",
        "cursor-pointer data-highlighted:bg-zenth-tint",
        // Disabled rows: muted text, no pointer, suppress highlight bg even
        // when keyboard nav lands on them. Base UI sets `data-disabled` on
        // the element when the `disabled` prop is true.
        "data-[disabled]:cursor-not-allowed data-[disabled]:text-zenth-subtle data-[disabled]:opacity-60 data-[disabled]:data-highlighted:bg-transparent",
        className
      ),
      children: [
        /* @__PURE__ */ jsx26("div", { className: "col-start-1", children }),
        /* @__PURE__ */ jsx26(ComboboxBase.ItemIndicator, { className: "col-start-2 flex items-center", children: /* @__PURE__ */ jsx26(CheckIcon4, {}) })
      ]
    }
  );
}
function Empty(props) {
  return /* @__PURE__ */ jsx26(
    ComboboxBase.Empty,
    {
      ...props,
      className: cn(
        "mx-1.5 shrink-0 px-4 py-2 text-[0.925rem] leading-4 text-zenth-subtle empty:m-0 empty:p-0"
      ),
      children: props.children ?? "No labels found."
    }
  );
}
function Input3(props) {
  return /* @__PURE__ */ jsx26(
    ComboboxBase.Input,
    {
      ...props,
      className: cn(
        inputVariants(),
        "mx-0 -mt-1.5 w-full shrink-0 rounded-b-none first:mb-2",
        props.className
      )
    }
  );
}
function List({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx26(
    ComboboxBase.List,
    {
      ...props,
      className: cn(
        "min-h-0 flex-1 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain",
        className
      )
    }
  );
}
function GroupLabel(props) {
  return /* @__PURE__ */ jsx26(
    ComboboxBase.GroupLabel,
    {
      ...props,
      className: cn(
        "mx-1.5 px-2 py-1.5 text-sm text-zenth-subtle",
        props.className
      )
    }
  );
}
function Group(props) {
  return /* @__PURE__ */ jsx26(
    ComboboxBase.Group,
    {
      ...props,
      className: "mt-2 border-t border-zenth-hairline pt-2 first:mt-0 first:border-t-0 first:pt-0"
    }
  );
}
function Chip({
  removeLabel = "Remove",
  ...props
}) {
  return /* @__PURE__ */ jsxs14(
    ComboboxBase.Chip,
    {
      ...props,
      className: cn(
        "flex items-center gap-2.5",
        // Layout
        "h-6 pr-[3px] pl-2",
        // Dimensions
        "rounded-sm ring-1 ring-zenth-hairline",
        // Border
        "bg-zenth-overlay",
        // Background
        "text-sm"
        // Typography
      ),
      children: [
        props.children,
        /* @__PURE__ */ jsx26(
          ComboboxBase.ChipRemove,
          {
            "data-zenth-component": "Combobox",
            "data-zenth-part": "chip-remove",
            "aria-label": removeLabel,
            className: cn(
              "cursor-pointer rounded-md p-1 hover:bg-zenth-fill-hover",
              "flex bg-transparent"
            ),
            children: /* @__PURE__ */ jsx26(XIcon, { size: 10 })
          }
        )
      ]
    }
  );
}
var sizeToMinHeight = {
  xs: "min-h-5",
  sm: "min-h-6.5",
  base: "min-h-9",
  lg: "min-h-10"
};
function TriggerMultipleWithInput({
  placeholder,
  renderItem,
  className,
  inputSide = "right",
  value: controlledValue,
  ...inputProps
}) {
  const { size, hasError } = useContext8(ComboboxContext);
  const chipsToRender = controlledValue;
  const renderTriggerInput = (className2) => /* @__PURE__ */ jsx26(
    ComboboxBase.Input,
    {
      ...omitUndefined(inputProps),
      placeholder,
      className: className2
    }
  );
  return /* @__PURE__ */ jsxs14(
    ComboboxBase.Chips,
    {
      className: cn(
        inputVariants({ size, variant: hasError ? "error" : "default" }),
        "flex flex-col",
        "gap-1 px-1.5 py-1",
        sizeToMinHeight[size],
        "h-auto",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      ),
      children: [
        inputSide === "top" && renderTriggerInput("w-full border-0 bg-inherit px-2 py-1"),
        /* @__PURE__ */ jsxs14("div", { className: "flex flex-1 flex-wrap items-center gap-1.5", children: [
          chipsToRender !== void 0 && chipsToRender.length > 0 && chipsToRender.map((item) => renderItem(item)),
          /* @__PURE__ */ jsx26(ComboboxBase.Value, { children: (internalValue) => {
            if (chipsToRender !== void 0)
              return null;
            return /* @__PURE__ */ jsx26(Fragment4, { children: internalValue.map((item) => renderItem(item)) });
          } }),
          inputSide === "right" && renderTriggerInput(
            "min-w-[100px] flex-1 border-0 bg-inherit px-2 py-1"
          )
        ] })
      ]
    }
  );
}
Root2.displayName = "Combobox.Root";
Content.displayName = "Combobox.Content";
TriggerValue.displayName = "Combobox.TriggerValue";
TriggerInput.displayName = "Combobox.TriggerInput";
Item.displayName = "Combobox.Item";
Chip.displayName = "Combobox.Chip";
TriggerMultipleWithInput.displayName = "Combobox.TriggerMultipleWithInput";
var Combobox = Object.assign(Root2, {
  // Helper components
  Content,
  TriggerValue,
  TriggerInput,
  TriggerMultipleWithInput,
  // Slightly modified BaseUI
  Chip,
  Item,
  // Styled BaseUI
  Input: Input3,
  Empty,
  GroupLabel,
  Group,
  // Styled BaseUI
  List,
  // BaseUI
  Collection: ComboboxBase.Collection,
  Trigger: ComboboxBase.Trigger,
  Value: ComboboxBase.Value,
  Icon: ComboboxBase.Icon,
  // Filtering
  useFilter: ComboboxBase.useFilter,
  createItems: ComboboxBase.createItems
});

// src/components/toolbar/toolbar.tsx
import React6, {
  Children as Children3,
  cloneElement as cloneElement2,
  createContext as createContext8,
  isValidElement as isValidElement4
} from "react";
import { Toolbar as ToolbarBase } from "@base-ui/react/toolbar";
import { jsx as jsx27 } from "react/jsx-runtime";
var KUMO_TOOLBAR_VARIANTS = {
  size: {
    xs: {
      classes: "text-xs",
      description: "Extra small toolbar for compact UIs"
    },
    sm: {
      classes: "text-xs",
      description: "Small toolbar for secondary controls"
    },
    base: {
      classes: "text-base",
      description: "Default toolbar size"
    },
    lg: {
      classes: "text-base",
      description: "Large toolbar for prominent controls"
    }
  }
};
var KUMO_TOOLBAR_DEFAULT_VARIANTS = {
  size: "base"
};
var ToolbarSizeContext = createContext8({
  size: KUMO_TOOLBAR_DEFAULT_VARIANTS.size
});
var TOOLBAR_CONTROL_STYLES = cn(
  "relative min-w-0 rounded-none border-0 bg-transparent shadow-none ring-0",
  "focus-within:z-2 focus:z-2 focus-visible:z-2 has-[:focus-visible]:z-2"
);
var Root3 = React6.forwardRef(
  ({
    children,
    className,
    size = KUMO_TOOLBAR_DEFAULT_VARIANTS.size,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx27(
      ToolbarBase.Root,
      {
        ref,
        "data-zenth-component": "Toolbar",
        className: cn(
          "inline-flex w-fit items-stretch rounded-lg bg-zenth-control shadow-xs ring ring-zenth-line",
          "[&>*:first-child]:rounded-l-lg [&>*:not([aria-hidden='true']):not([type='hidden']):not(:has(~_:not([aria-hidden='true']):not([type='hidden'])))]:rounded-r-lg",
          "[&>*_[data-zenth-toolbar-input]:focus]:rounded-[inherit]",
          "[&>*:not([aria-hidden='true']):not(:first-child)]:border-l [&>*:not([aria-hidden='true']):not(:first-child)]:border-zenth-line",
          KUMO_TOOLBAR_VARIANTS.size[size].classes,
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx27(ToolbarSizeContext.Provider, { value: { size }, children })
      }
    );
  }
);
Root3.displayName = "Toolbar";
var Button3 = React6.forwardRef(
  ({
    children,
    className,
    disabled,
    loading,
    shape,
    icon: IconComponent,
    type,
    ...props
  }, ref) => {
    const toolbar = React6.useContext(ToolbarSizeContext);
    const resolvedShape = shape ?? (children == null && IconComponent ? "square" : "base");
    const ariaLabel = props["aria-label"];
    const buttonProps = {
      disabled,
      loading,
      icon: IconComponent,
      size: toolbar.size,
      type: type ?? "button",
      variant: "ghost"
    };
    const button = resolvedShape === "base" ? /* @__PURE__ */ jsx27(Button, { shape: "base", ...buttonProps }) : /* @__PURE__ */ jsx27(
      Button,
      {
        "aria-label": ariaLabel,
        shape: resolvedShape,
        ...buttonProps
      }
    );
    return /* @__PURE__ */ jsx27(
      ToolbarBase.Button,
      {
        ref,
        "data-zenth-component": "Toolbar.Button",
        disabled: loading || disabled,
        className: cn(className, TOOLBAR_CONTROL_STYLES),
        render: button,
        ...props,
        children
      }
    );
  }
);
Button3.displayName = "Toolbar.Button";
var Link3 = React6.forwardRef(
  ({ children, className, shape, icon: IconComponent, ...props }, ref) => {
    const toolbar = React6.useContext(ToolbarSizeContext);
    const resolvedShape = shape ?? (children == null && IconComponent ? "square" : "base");
    return /* @__PURE__ */ jsx27(
      ToolbarBase.Link,
      {
        ref,
        "data-zenth-component": "Toolbar.Link",
        className: cn(className, TOOLBAR_CONTROL_STYLES),
        render: /* @__PURE__ */ jsx27(
          LinkButton,
          {
            icon: IconComponent,
            shape: resolvedShape,
            size: toolbar.size,
            variant: "ghost"
          }
        ),
        ...props,
        children
      }
    );
  }
);
Link3.displayName = "Toolbar.Link";
var Input4 = React6.forwardRef(
  ({ className, style, ...props }, ref) => {
    const toolbar = React6.useContext(ToolbarSizeContext);
    const inputClassName = typeof className === "function" ? (state) => cn(className(state), TOOLBAR_CONTROL_STYLES) : cn(className, TOOLBAR_CONTROL_STYLES);
    return /* @__PURE__ */ jsx27(
      ToolbarBase.Input,
      {
        ref,
        "data-zenth-component": "Toolbar.Input",
        render: /* @__PURE__ */ jsx27(
          Input,
          {
            className: inputClassName,
            size: toolbar.size,
            style
          }
        ),
        ...props,
        "data-zenth-toolbar-input": ""
      }
    );
  }
);
Input4.displayName = "Toolbar.Input";
var InputGroupRoot = React6.forwardRef(
  ({ children, className, ...props }, ref) => {
    const toolbar = React6.useContext(ToolbarSizeContext);
    const ariaLabel = props["aria-label"];
    const ariaLabelledBy = props["aria-labelledby"];
    const toolbarChildren = Children3.map(children, (child) => {
      if (!isValidElement4(child) || child.type?.displayName !== "InputGroup.Input") {
        return child;
      }
      return /* @__PURE__ */ jsx27(
        ToolbarBase.Input,
        {
          "aria-label": child.props["aria-label"] ?? ariaLabel,
          "aria-labelledby": child.props["aria-labelledby"] ?? ariaLabelledBy,
          render: cloneElement2(child)
        }
      );
    });
    return /* @__PURE__ */ jsx27(
      InputGroup,
      {
        ref,
        className: cn(TOOLBAR_CONTROL_STYLES, className),
        size: toolbar.size,
        ...props,
        children: toolbarChildren
      }
    );
  }
);
InputGroupRoot.displayName = "Toolbar.InputGroup";
var Toolbar = Object.assign(Root3, {
  Button: Button3,
  Link: Link3,
  Input: Input4,
  InputGroup: InputGroupRoot
});
Toolbar.displayName = "Toolbar";

// src/components/dialog/dialog.tsx
import {
  createContext as createContext9,
  useContext as useContext9
} from "react";
import { Dialog as DialogBase } from "@base-ui/react/dialog";
import { AlertDialog as AlertDialogBase } from "@base-ui/react/alert-dialog";

// src/components/layer-card/layer-card.tsx
import {
  Children as Children4,
  Fragment as Fragment5,
  forwardRef as forwardRef16,
  isValidElement as isValidElement5
} from "react";
import { mergeProps as mergeProps2 } from "@base-ui/react/merge-props";
import { useRender as useRender2 } from "@base-ui/react/use-render";
import { jsx as jsx28 } from "react/jsx-runtime";
var LAYER_CARD_SURFACE_CLASSES = "overflow-hidden rounded-lg bg-zenth-base shadow-xs ring ring-zenth-line";
var LAYER_CARD_LAYERED_ROOT_CLASSES = "flex w-full flex-col overflow-hidden rounded-lg bg-zenth-elevated text-base ring ring-zenth-hairline";
var LAYER_CARD_SECONDARY_CLASSES = "-my-2 flex items-center gap-2 bg-zenth-elevated p-4 text-base font-medium text-zenth-subtle";
var LAYER_CARD_PRIMARY_CLASSES = "relative flex flex-col gap-2 overflow-hidden rounded-lg bg-zenth-base p-4 pr-3 text-inherit no-underline ring ring-zenth-fill";
function layerCardVariants(_props = {}) {
  return cn(LAYER_CARD_SURFACE_CLASSES);
}
function hasLayerCardSections(children) {
  return Children4.toArray(children).some((child) => {
    if (!isValidElement5(child)) {
      return false;
    }
    if (child.type === LayerCardPrimary || child.type === LayerCardSecondary) {
      return true;
    }
    if (child.type === Fragment5) {
      const fragmentChild = child;
      return hasLayerCardSections(fragmentChild.props.children);
    }
    return false;
  });
}
var LayerCardRoot = forwardRef16(
  function LayerCard({ children, className, render, ...props }, ref) {
    const hasStructuredLayers = hasLayerCardSections(children);
    const defaultProps = {
      className: cn(
        hasStructuredLayers ? LAYER_CARD_LAYERED_ROOT_CLASSES : layerCardVariants(),
        className
      )
    };
    return useRender2({
      defaultTagName: "div",
      render,
      ref,
      props: mergeProps2(defaultProps, props, { children })
    });
  }
);
function LayerCardSecondary({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx28("div", { className: cn(LAYER_CARD_SECONDARY_CLASSES, className), ...props, children });
}
function LayerCardPrimary({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx28("div", { className: cn(LAYER_CARD_PRIMARY_CLASSES, className), ...props, children });
}
LayerCardRoot.displayName = "LayerCard";
LayerCardSecondary.displayName = "LayerCard.Secondary";
LayerCardPrimary.displayName = "LayerCard.Primary";
var LayerCard2 = Object.assign(LayerCardRoot, {
  Primary: LayerCardPrimary,
  Secondary: LayerCardSecondary
});

// src/components/dialog/dialog.tsx
import { jsx as jsx29, jsxs as jsxs15 } from "react/jsx-runtime";
var KUMO_DIALOG_VARIANTS = {
  size: {
    base: {
      classes: "sm:w-96",
      description: "Default dialog width (384px)"
    },
    sm: {
      classes: "sm:w-72",
      description: "Small dialog for simple confirmations (288px)"
    },
    lg: {
      classes: "sm:w-[32rem]",
      description: "Large dialog for complex content (512px)"
    },
    xl: {
      classes: "sm:w-[48rem]",
      description: "Extra large dialog for detailed views (768px)"
    }
  },
  role: {
    dialog: {
      classes: "",
      description: "Standard dialog for general-purpose modals"
    },
    alertdialog: {
      classes: "",
      description: "Alert dialog for confirmation flows requiring explicit user acknowledgment"
    }
  }
};
var KUMO_DIALOG_DEFAULT_VARIANTS = {
  size: "base",
  role: "dialog"
};
var DialogRoleContext = createContext9("dialog");
function useDialogRole() {
  return useContext9(DialogRoleContext);
}
function dialogVariants({
  size = KUMO_DIALOG_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    // Bound the panel to the dynamic viewport and scroll tall content.
    // LayerCard sections must retain their height instead of shrinking and clipping.
    "shadow-m ring ring-zenth-line fixed top-8 left-1/2 sm:top-16 w-full max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-6rem)] -translate-x-1/2 overflow-x-hidden overflow-y-auto overscroll-contain *:shrink-0 rounded-xl bg-zenth-base text-zenth-default duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0",
    // Apply size from KUMO_DIALOG_VARIANTS
    resolveVariant(
      KUMO_DIALOG_VARIANTS.size,
      size,
      KUMO_DIALOG_DEFAULT_VARIANTS.size
    ).classes
  );
}
function DialogContent({
  className,
  children,
  style,
  size = KUMO_DIALOG_DEFAULT_VARIANTS.size,
  container: containerProp
}) {
  const role = useDialogRole();
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  const BasePortal = role === "alertdialog" ? AlertDialogBase.Portal : DialogBase.Portal;
  const BaseBackdrop = role === "alertdialog" ? AlertDialogBase.Backdrop : DialogBase.Backdrop;
  const BasePopup = role === "alertdialog" ? AlertDialogBase.Popup : DialogBase.Popup;
  return /* @__PURE__ */ jsxs15(BasePortal, { container, children: [
    /* @__PURE__ */ jsx29(BaseBackdrop, { className: "fixed inset-0 bg-zenth-recessed opacity-80 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" }),
    /* @__PURE__ */ jsx29(
      LayerCard2,
      {
        render: /* @__PURE__ */ jsx29(BasePopup, {}),
        className: cn(dialogVariants({ size }), className),
        style: {
          transitionProperty: "scale, opacity",
          transitionTimingFunction: "var(--default-transition-timing-function)",
          "--tw-shadow": "0 20px 25px -5px rgb(0 0 0 / 0.03), 0 8px 10px -6px rgb(0 0 0 / 0.03)",
          ...style
        },
        children
      }
    )
  ] });
}
function DialogRoot(props) {
  if (props.role === "alertdialog") {
    const { children: children2, role: role2, ...rootProps2 } = props;
    return /* @__PURE__ */ jsx29(DialogRoleContext.Provider, { value: role2, children: /* @__PURE__ */ jsx29(AlertDialogBase.Root, { ...rootProps2, children: children2 }) });
  }
  const {
    children,
    role = KUMO_DIALOG_DEFAULT_VARIANTS.role,
    ...rootProps
  } = props;
  return /* @__PURE__ */ jsx29(DialogRoleContext.Provider, { value: role, children: /* @__PURE__ */ jsx29(DialogBase.Root, { ...rootProps, children }) });
}
DialogRoot.displayName = "Dialog.Root";
function DialogTrigger({ children, ...props }) {
  const role = useDialogRole();
  if (role === "alertdialog") {
    return /* @__PURE__ */ jsx29(
      AlertDialogBase.Trigger,
      {
        "data-zenth-component": "Dialog",
        "data-zenth-part": "trigger",
        ...props,
        children
      }
    );
  }
  return /* @__PURE__ */ jsx29(
    DialogBase.Trigger,
    {
      "data-zenth-component": "Dialog",
      "data-zenth-part": "trigger",
      ...props,
      children
    }
  );
}
DialogTrigger.displayName = "Dialog.Trigger";
function DialogTitle({ className, ...props }) {
  const role = useDialogRole();
  const BaseTitle = role === "alertdialog" ? AlertDialogBase.Title : DialogBase.Title;
  return /* @__PURE__ */ jsx29(BaseTitle, { className, ...props });
}
DialogTitle.displayName = "Dialog.Title";
function DialogDescription({ className, ...props }) {
  const role = useDialogRole();
  const BaseDescription = role === "alertdialog" ? AlertDialogBase.Description : DialogBase.Description;
  return /* @__PURE__ */ jsx29(BaseDescription, { className, ...props });
}
DialogDescription.displayName = "Dialog.Description";
function DialogClose({ children, ...props }) {
  const role = useDialogRole();
  const BaseClose = role === "alertdialog" ? AlertDialogBase.Close : DialogBase.Close;
  return /* @__PURE__ */ jsx29(BaseClose, { "data-zenth-component": "Dialog", "data-zenth-part": "close", ...props, children });
}
DialogClose.displayName = "Dialog.Close";
var Dialog = Object.assign(DialogContent, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose
});

// src/components/dropdown/dropdown.tsx
import { Menu as DropdownMenuPrimitive } from "@base-ui/react/menu";
import * as React7 from "react";
import {
  CaretRightIcon as CaretRight,
  CheckIcon as CheckIcon5,
  CheckIcon as Check
} from "@phosphor-icons/react";
import { Fragment as Fragment6, jsx as jsx30, jsxs as jsxs16 } from "react/jsx-runtime";
var KUMO_DROPDOWN_VARIANTS = {
  variant: {
    default: {
      classes: "",
      description: "Default dropdown item appearance"
    },
    danger: {
      classes: "text-zenth-danger data-highlighted:bg-zenth-danger/5 data-highlighted:text-zenth-danger",
      description: "Destructive action item"
    }
  }
};
var KUMO_DROPDOWN_DEFAULT_VARIANTS = {
  variant: "default"
};
function dropdownVariants({
  variant = KUMO_DROPDOWN_DEFAULT_VARIANTS.variant
} = {}) {
  return cn(
    resolveVariant(
      KUMO_DROPDOWN_VARIANTS.variant,
      variant,
      KUMO_DROPDOWN_DEFAULT_VARIANTS.variant
    ).classes
  );
}
var renderIconNode3 = (iconProp) => {
  const IconComponent = unwrapLazyElement(iconProp);
  if (!IconComponent)
    return null;
  let icon;
  if (React7.isValidElement(IconComponent)) {
    icon = React7.cloneElement(IconComponent, {
      className: cn("h-4 w-4", IconComponent.props.className)
    });
  } else {
    const Comp = IconComponent;
    icon = /* @__PURE__ */ jsx30(Comp, { className: "h-4 w-4" });
  }
  return /* @__PURE__ */ jsx30("span", { "data-zenth-part": "icon", className: "inline-flex shrink-0 items-center", children: icon });
};
var autoInsetClasses = "group-has-[[data-zenth-part=icon]]/menu:not-has-[[data-zenth-part=icon]]:pl-8";
var menuRowClasses = cn(
  "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-base outline-hidden select-none",
  // base styles
  "focus:text-zenth-default focus-visible:ring-2 focus-visible:ring-zenth-brand",
  // focus state
  "data-highlighted:bg-zenth-tint",
  // highlight state
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  // disabled state
  autoInsetClasses
);
var POPUP_PADDING = 6;
function isBlockSide(side) {
  return side === "top" || side === "bottom";
}
var submenuSideOffset = ({ side }) => isBlockSide(side) ? 8 : 2;
var submenuAlignOffset = ({ side }) => isBlockSide(side) ? 0 : -POPUP_PADDING;
var DropdownMenuSubTrigger = React7.forwardRef(({ className, inset, children, icon: IconComponent, ...props }, ref) => /* @__PURE__ */ jsxs16(
  DropdownMenuPrimitive.SubmenuTrigger,
  {
    ref,
    "data-zenth-component": "DropdownMenu",
    "data-zenth-part": "submenu-trigger",
    className: cn(
      menuRowClasses,
      "data-popup-open:bg-zenth-tint",
      // keep highlighted while the submenu is open
      inset && "pl-8",
      // conditional inset
      className
    ),
    ...props,
    children: [
      renderIconNode3(IconComponent),
      children,
      /* @__PURE__ */ jsx30(CaretRight, { className: "ml-auto h-4 w-4" })
    ]
  }
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubmenuTrigger.displayName;
function DropdownMenuPortal({
  container: containerProp,
  ...props
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  return /* @__PURE__ */ jsx30(DropdownMenuPrimitive.Portal, { container, ...props });
}
DropdownMenuPortal.displayName = "DropdownMenuPortal";
var DropdownMenuPositioner = React7.forwardRef(({ className, sideOffset = 8, ...props }, ref) => /* @__PURE__ */ jsx30(
  DropdownMenuPrimitive.Positioner,
  {
    ref,
    "data-zenth-component": "DropdownMenu",
    "data-zenth-part": "positioner",
    className: (state) => cn(
      "outline-hidden",
      typeof className === "function" ? className(state) : className
    ),
    sideOffset,
    ...props
  }
));
DropdownMenuPositioner.displayName = "DropdownMenuPositioner";
var DropdownMenuPopup = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  DropdownMenuPrimitive.Popup,
  {
    ref,
    "data-zenth-component": "DropdownMenu",
    "data-zenth-part": "popup",
    className: cn(
      "group/menu overflow-hidden bg-zenth-control text-zenth-default outline-hidden",
      // background; Base UI focuses the popup when the pointer leaves the items
      "max-h-[var(--available-height)] overflow-y-auto",
      // limit height when list is too long and might go off screen
      "rounded-lg shadow-lg ring ring-zenth-line",
      // border part
      "min-w-36 p-1.5",
      // spacing
      "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150 motion-reduce:transition-none",
      // animation
      "data-starting-style:scale-95 data-starting-style:opacity-0",
      // enter
      "data-ending-style:scale-95 data-ending-style:opacity-0",
      // exit
      "data-instant:duration-0",
      // Base UI skips the animation for keyboard and dismiss transitions
      className
    ),
    ...props
  }
));
DropdownMenuPopup.displayName = "DropdownMenuPopup";
var DropdownMenuContent = React7.forwardRef(({ className, children, container, ...props }, ref) => /* @__PURE__ */ jsx30(DropdownMenuPortal, { container, children: /* @__PURE__ */ jsx30(DropdownMenuPositioner, { ref, ...props, children: /* @__PURE__ */ jsx30(DropdownMenuPopup, { className, children }) }) }));
DropdownMenuContent.displayName = "DropdownMenuContent";
var DropdownMenuSubContent = React7.forwardRef(
  ({
    sideOffset = submenuSideOffset,
    alignOffset = submenuAlignOffset,
    ...props
  }, ref) => /* @__PURE__ */ jsx30(
    DropdownMenuContent,
    {
      ref,
      sideOffset,
      alignOffset,
      ...props
    }
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";
var DropdownMenuItem = React7.forwardRef(
  ({
    className,
    inset,
    icon: IconComponent,
    children,
    selected,
    render,
    href,
    variant = "default",
    ...props
  }, ref) => {
    const LinkComponent = useLinkComponent();
    const innerContent = React7.useMemo(
      () => /* @__PURE__ */ jsxs16(Fragment6, { children: [
        IconComponent && renderIconNode3(IconComponent),
        children,
        selected && /* @__PURE__ */ jsx30("span", { className: "inline-flex", children: /* @__PURE__ */ jsx30(Check, {}) })
      ] }),
      [IconComponent, children, selected]
    );
    const linkContent = React7.useMemo(() => {
      if (!href)
        return void 0;
      const isExternal = /^(https?:)?\/\//.test(href);
      const styles = cn(
        "flex items-center gap-2",
        variant === "danger" && "text-zenth-danger data-highlighted:bg-zenth-danger/5 data-highlighted:text-zenth-danger"
      );
      if (isExternal) {
        return /* @__PURE__ */ jsx30(
          "a",
          {
            className: cn(styles, "w-full text-inherit! no-underline!"),
            href,
            target: "_blank",
            rel: "noreferrer",
            onClick: (e) => e.stopPropagation(),
            children: innerContent
          }
        );
      }
      return /* @__PURE__ */ jsx30(
        LinkComponent,
        {
          className: cn(styles, "w-full text-inherit! no-underline!"),
          href,
          to: href,
          onClick: (e) => e.stopPropagation(),
          children: innerContent
        }
      );
    }, [href, innerContent, variant, LinkComponent]);
    const useRenderProp = href || render;
    return /* @__PURE__ */ jsx30(
      DropdownMenuPrimitive.Item,
      {
        ref,
        "data-zenth-component": "DropdownMenu",
        "data-zenth-part": "item",
        className: cn(
          menuRowClasses,
          inset && "pl-8",
          dropdownVariants({ variant }),
          className
        ),
        render: href ? linkContent : render,
        ...props,
        children: useRenderProp ? void 0 : innerContent
      }
    );
  }
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuLinkItem = React7.forwardRef(
  ({
    className,
    inset,
    icon: IconComponent,
    children,
    variant = "default",
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxs16(
      DropdownMenuPrimitive.LinkItem,
      {
        ref,
        "data-zenth-component": "DropdownMenu",
        "data-zenth-part": "link-item",
        className: cn(
          menuRowClasses,
          "text-inherit no-underline",
          inset && "pl-8",
          dropdownVariants({ variant }),
          className
        ),
        ...props,
        children: [
          IconComponent && renderIconNode3(IconComponent),
          children
        ]
      }
    );
  }
);
DropdownMenuLinkItem.displayName = "DropdownMenuLinkItem";
var DropdownMenuCheckboxItem = React7.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs16(
  DropdownMenuPrimitive.CheckboxItem,
  {
    ref,
    "data-zenth-component": "DropdownMenu",
    "data-zenth-part": "checkbox-item",
    className: cn(menuRowClasses, "pl-8 transition-colors", className),
    checked,
    ...props,
    children: [
      /* @__PURE__ */ jsx30(DropdownMenuPrimitive.CheckboxItemIndicator, { className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center text-inherit", children: /* @__PURE__ */ jsx30(CheckIcon5, { weight: "bold", size: 12 }) }),
      children
    ]
  }
));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuLabel = React7.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx30(
  DropdownMenuPrimitive.GroupLabel,
  {
    ref,
    className: cn(
      "px-2 py-1.5 text-base font-semibold",
      autoInsetClasses,
      inset && "pl-8",
      className
    ),
    ...props
  }
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.GroupLabel.displayName;
var DropdownMenuSeparator = React7.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx30(
  DropdownMenuPrimitive.Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-zenth-hairline", className),
    ...props
  }
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
var DropdownMenuShortcut = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ jsx30(
    "span",
    {
      className: cn("ml-auto text-xs tracking-widest opacity-60", className),
      ...props
    }
  );
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var DropdownMenuRadioItem = React7.forwardRef(({ className, children, inset, icon: IconComponent, ...props }, ref) => /* @__PURE__ */ jsxs16(
  DropdownMenuPrimitive.RadioItem,
  {
    ref,
    "data-zenth-component": "DropdownMenu",
    "data-zenth-part": "radio-item",
    className: cn(menuRowClasses, inset && "pl-8", className),
    ...props,
    children: [
      IconComponent && renderIconNode3(IconComponent),
      children
    ]
  }
));
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";
var DropdownMenuRadioItemIndicator = React7.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx30(
  DropdownMenuPrimitive.RadioItemIndicator,
  {
    ref,
    className: cn("ml-auto", className),
    ...props,
    children: children ?? /* @__PURE__ */ jsx30(Check, { className: "h-4 w-4" })
  }
));
DropdownMenuRadioItemIndicator.displayName = "DropdownMenuRadioItemIndicator";
var DropdownMenuTrigger = React7.forwardRef(({ children, render, ...props }, ref) => {
  if (render) {
    return /* @__PURE__ */ jsx30(DropdownMenuPrimitive.Trigger, { ref, ...props, render, children });
  }
  const childElement = React7.isValidElement(children) ? children : null;
  return /* @__PURE__ */ jsx30(
    DropdownMenuPrimitive.Trigger,
    {
      ref,
      ...props,
      ...childElement && {
        render: childElement
      },
      children: childElement ? void 0 : children
    }
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
var DropdownMenu = Object.assign(DropdownMenuPrimitive.Root, {
  Trigger: DropdownMenuTrigger,
  Portal: DropdownMenuPortal,
  Positioner: DropdownMenuPositioner,
  Popup: DropdownMenuPopup,
  Sub: DropdownMenuPrimitive.SubmenuRoot,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  LinkItem: DropdownMenuLinkItem,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuPrimitive.RadioGroup,
  RadioItem: DropdownMenuRadioItem,
  RadioItemIndicator: DropdownMenuRadioItemIndicator,
  Label: DropdownMenuLabel,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Group: DropdownMenuPrimitive.Group
});

// src/components/collapsible/collapsible.tsx
import { Collapsible as CollapsibleBase } from "@base-ui/react/collapsible";
import { CaretDownIcon } from "@phosphor-icons/react";
import {
  forwardRef as forwardRef18
} from "react";
import { jsx as jsx31, jsxs as jsxs17 } from "react/jsx-runtime";
function CollapsibleRoot({ className, ...props }) {
  return /* @__PURE__ */ jsx31(CollapsibleBase.Root, { className, ...props });
}
CollapsibleRoot.displayName = "Collapsible.Root";
var CollapsibleTrigger = forwardRef18(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx31(
    CollapsibleBase.Trigger,
    {
      ref,
      "data-zenth-component": "Collapsible",
      "data-zenth-part": "trigger",
      className: cn("cursor-pointer", className),
      ...props
    }
  );
});
CollapsibleTrigger.displayName = "Collapsible.Trigger";
var CollapsiblePanel = forwardRef18(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsx31(CollapsibleBase.Panel, { ref, className, ...props });
  }
);
CollapsiblePanel.displayName = "Collapsible.Panel";
var CollapsibleDefaultTrigger = forwardRef18(({ children, className }, ref) => {
  return /* @__PURE__ */ jsxs17(
    CollapsibleBase.Trigger,
    {
      ref,
      "data-zenth-component": "Collapsible",
      "data-zenth-part": "default-trigger",
      className: cn(
        // Defensive resets to prevent global button styles from polluting the trigger
        "m-0 border-none bg-transparent p-0 shadow-none",
        // Base styles for the trigger
        "flex cursor-pointer items-center gap-1 text-base font-medium text-zenth-default select-none",
        className
      ),
      children: [
        /* @__PURE__ */ jsx31("span", { children }),
        /* @__PURE__ */ jsx31("span", { className: "inline-grid w-4 shrink-0 place-items-center", children: /* @__PURE__ */ jsx31(
          CaretDownIcon,
          {
            "aria-hidden": true,
            size: 12,
            weight: "bold",
            className: "block size-3 origin-center transition-transform duration-100 ease-out [[data-panel-open]_&]:rotate-180"
          }
        ) })
      ]
    }
  );
});
CollapsibleDefaultTrigger.displayName = "Collapsible.DefaultTrigger";
var CollapsibleDefaultPanel = forwardRef18(({ children, className, ...props }, ref) => {
  return /* @__PURE__ */ jsx31(
    CollapsibleBase.Panel,
    {
      ref,
      className: cn(
        "h-[var(--collapsible-panel-height)] overflow-hidden transition-[height,opacity] duration-100 ease-out data-ending-style:h-0 data-ending-style:opacity-0 data-starting-style:h-0 data-starting-style:opacity-0 [&[hidden]:not([hidden='until-found'])]:hidden",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx31("div", { className: "my-2 space-y-4 border-l-2 border-zenth-fill py-1 pr-1 pl-4", children })
    }
  );
});
CollapsibleDefaultPanel.displayName = "Collapsible.DefaultPanel";
var Collapsible = Object.assign(CollapsibleRoot, {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
  DefaultTrigger: CollapsibleDefaultTrigger,
  DefaultPanel: CollapsibleDefaultPanel
});

// src/blocks/delete-resource/delete-resource.tsx
import { useState as useState5, useCallback as useCallback6, useEffect as useEffect6, useRef as useRef5 } from "react";
import {
  CheckIcon as CheckIcon6,
  CopyIcon as CopyIcon2,
  WarningCircleIcon,
  XIcon as XIcon2
} from "@phosphor-icons/react";

// src/utils/use-copy-feedback.ts
import { useCallback as useCallback5, useEffect as useEffect5, useRef as useRef4, useState as useState4 } from "react";
function useCopyFeedback(duration = 2e3) {
  const [copied, setCopied] = useState4(false);
  const resetTimeoutRef = useRef4(null);
  const attemptRef = useRef4(0);
  useEffect5(() => {
    return () => {
      attemptRef.current += 1;
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);
  const runCopy = useCallback5(
    async (operation, onError) => {
      const attempt = ++attemptRef.current;
      if (resetTimeoutRef.current !== null) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
      try {
        const isCurrent = () => attemptRef.current === attempt;
        await operation(isCurrent);
        if (attemptRef.current !== attempt)
          return false;
        setCopied(true);
        resetTimeoutRef.current = setTimeout(() => {
          if (attemptRef.current !== attempt)
            return;
          setCopied(false);
          resetTimeoutRef.current = null;
        }, duration);
        return true;
      } catch (error) {
        if (attemptRef.current !== attempt)
          return false;
        setCopied(false);
        onError?.(error);
        return false;
      }
    },
    [duration]
  );
  const reset = useCallback5(() => {
    attemptRef.current += 1;
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    setCopied(false);
  }, []);
  return { copied, runCopy, reset };
}

// src/blocks/delete-resource/delete-resource.tsx
import { jsx as jsx32, jsxs as jsxs18 } from "react/jsx-runtime";
var KUMO_DELETE_RESOURCE_VARIANTS = {
  size: {
    sm: {
      classes: "",
      description: "Small dialog for simple delete confirmations"
    },
    base: {
      classes: "",
      description: "Default delete confirmation dialog size"
    }
  }
};
var KUMO_DELETE_RESOURCE_DEFAULT_VARIANTS = {
  size: "base"
};
function DeleteResource({
  open,
  onOpenChange,
  resourceType,
  resourceName,
  onDelete,
  isDeleting = false,
  caseSensitive = true,
  deleteButtonText,
  size = KUMO_DELETE_RESOURCE_DEFAULT_VARIANTS.size,
  errorMessage,
  className
}) {
  const [confirmationInput, setConfirmationInput] = useState5("");
  const { copied, runCopy, reset: resetCopyFeedback } = useCopyFeedback(1500);
  const openRef = useRef5(open);
  openRef.current = open;
  useEffect6(() => {
    if (!open) {
      resetCopyFeedback();
      setConfirmationInput("");
    }
  }, [open, resetCopyFeedback]);
  const normalizeForComparison = useCallback6(
    (str) => caseSensitive ? str : str.toLowerCase(),
    [caseSensitive]
  );
  const isConfirmed = normalizeForComparison(confirmationInput) === normalizeForComparison(resourceName);
  const handleDelete = useCallback6(async () => {
    if (!isConfirmed || isDeleting)
      return;
    await onDelete();
  }, [isConfirmed, isDeleting, onDelete]);
  const handleCopy = useCallback6(async () => {
    if (!openRef.current)
      return;
    await runCopy(
      () => navigator.clipboard.writeText(resourceName),
      (error) => console.warn("Clipboard copy failed", error)
    );
  }, [resourceName, runCopy]);
  return /* @__PURE__ */ jsx32(DialogRoot, { open, onOpenChange, children: /* @__PURE__ */ jsxs18(Dialog, { size, className: cn("p-0", className), children: [
    /* @__PURE__ */ jsxs18("div", { className: "flex items-center justify-between border-b border-zenth-line px-6 py-4", children: [
      /* @__PURE__ */ jsxs18(DialogTitle, { className: "text-lg font-semibold", children: [
        "Delete ",
        resourceName
      ] }),
      /* @__PURE__ */ jsx32(
        DialogClose,
        {
          render: (props) => /* @__PURE__ */ jsx32(
            Button,
            {
              ...props,
              variant: "ghost",
              shape: "square",
              size: "sm",
              "aria-label": "Close",
              disabled: isDeleting,
              children: /* @__PURE__ */ jsx32(XIcon2, { size: 18 })
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-4 p-6", children: [
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-2", children: [
        errorMessage && /* @__PURE__ */ jsx32(Banner, { icon: /* @__PURE__ */ jsx32(WarningCircleIcon, {}), variant: "error", children: errorMessage }),
        /* @__PURE__ */ jsxs18("p", { className: "max-w-prose text-base text-pretty text-zenth-subtle", children: [
          "This action cannot be undone. This will permanently delete the",
          " ",
          /* @__PURE__ */ jsx32("span", { className: "font-medium text-zenth-default", children: resourceName }),
          " ",
          resourceType.toLowerCase(),
          "."
        ] })
      ] }),
      /* @__PURE__ */ jsxs18("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsx32("div", { className: "flex items-center gap-1.5 text-base", children: /* @__PURE__ */ jsxs18("span", { children: [
          "Type",
          " ",
          /* @__PURE__ */ jsxs18(
            "button",
            {
              className: "group inline rounded-md bg-zenth-tint px-2 py-1 font-mono text-sm font-semibold hover:cursor-pointer hover:bg-zenth-fill",
              onClick: handleCopy,
              "aria-label": `Copy ${resourceName} to clipboard`,
              children: [
                resourceName,
                copied ? /* @__PURE__ */ jsx32(
                  CheckIcon6,
                  {
                    size: 12,
                    weight: "bold",
                    className: "ml-1.5 inline"
                  }
                ) : /* @__PURE__ */ jsx32(
                  CopyIcon2,
                  {
                    size: 12,
                    weight: "bold",
                    className: "ml-1.5 inline text-zenth-subtle group-hover:text-zenth-default"
                  }
                )
              ]
            }
          ),
          " ",
          "to confirm:"
        ] }) }),
        /* @__PURE__ */ jsx32(
          Input,
          {
            placeholder: resourceName,
            value: confirmationInput,
            onChange: (e) => setConfirmationInput(e.target.value),
            disabled: isDeleting,
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: false,
            "aria-label": `Type ${resourceName} to confirm deletion`,
            className: "w-full"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs18("div", { className: "flex justify-end gap-3 border-t border-zenth-line px-6 py-4", children: [
      /* @__PURE__ */ jsx32(
        DialogClose,
        {
          render: (props) => /* @__PURE__ */ jsx32(Button, { ...props, variant: "secondary", disabled: isDeleting, children: "Cancel" })
        }
      ),
      /* @__PURE__ */ jsx32(
        Button,
        {
          variant: "destructive",
          onClick: handleDelete,
          disabled: !isConfirmed || isDeleting,
          loading: isDeleting,
          children: deleteButtonText || `Delete ${resourceType}`
        }
      )
    ] })
  ] }) });
}
DeleteResource.displayName = "DeleteResource";

// src/components/loader/skeleton-line.tsx
import { useMemo as useMemo5 } from "react";
import { jsx as jsx33, jsxs as jsxs19 } from "react/jsx-runtime";
var KUMO_SKELETON_LINE_VARIANTS = {
  variant: {
    default: {
      classes: "zenth-skeleton-line",
      description: "Flat grey bar with a sliding shimmer"
    },
    sketch: {
      classes: "relative h-2 w-(--skeleton-width)",
      description: "Wireframe-style bar: rounded fill with a sliding shimmer, a 1px outline, and construction strokes that overshoot each corner by 4px"
    }
  }
};
var KUMO_SKELETON_LINE_DEFAULT_VARIANTS = {
  variant: "default"
};
var SKETCH_STROKE = "absolute bg-zenth-fill";
var getRandomWidth = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
var getRandomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
var SkeletonLine = ({
  variant = KUMO_SKELETON_LINE_DEFAULT_VARIANTS.variant,
  minWidth = 30,
  maxWidth = 100,
  minDuration = 1.3,
  maxDuration = 1.7,
  minDelay = 0,
  maxDelay = 0.5,
  blockHeight,
  className
}) => {
  const { width, duration, delay } = useMemo5(() => {
    return {
      width: getRandomWidth(minWidth, maxWidth),
      duration: getRandomFloat(minDuration, maxDuration),
      delay: getRandomFloat(minDelay, maxDelay)
    };
  }, [minWidth, maxWidth, minDuration, maxDuration, minDelay, maxDelay]);
  const lineStyle = {
    "--skeleton-width": `${width}%`,
    "--shimmer-duration": `${duration}s`,
    "--shimmer-delay": `${delay}s`
  };
  const rootClasses = resolveVariant(
    KUMO_SKELETON_LINE_VARIANTS.variant,
    variant,
    KUMO_SKELETON_LINE_DEFAULT_VARIANTS.variant
  ).classes;
  const line = variant === "sketch" ? /* @__PURE__ */ jsxs19(
    "div",
    {
      className: cn(rootClasses, className),
      style: lineStyle,
      "data-variant": "sketch",
      children: [
        /* @__PURE__ */ jsx33("div", { className: "absolute inset-0 overflow-hidden rounded-lg bg-zenth-recessed", children: /* @__PURE__ */ jsx33("div", { className: "absolute inset-0 animate-[shimmer_var(--shimmer-duration,1.5s)_var(--shimmer-delay,0s)_infinite_ease-in-out] bg-linear-to-r from-transparent via-zenth-contrast/8 to-transparent motion-reduce:animate-none" }) }),
        /* @__PURE__ */ jsx33("div", { className: cn(SKETCH_STROKE, "-inset-x-1 top-0 h-px") }),
        /* @__PURE__ */ jsx33("div", { className: cn(SKETCH_STROKE, "-inset-x-1 bottom-0 h-px") }),
        /* @__PURE__ */ jsx33("div", { className: cn(SKETCH_STROKE, "-inset-y-1 left-0 w-px") }),
        /* @__PURE__ */ jsx33("div", { className: cn(SKETCH_STROKE, "-inset-y-1 right-0 w-px") }),
        /* @__PURE__ */ jsx33("div", { className: "absolute inset-0 rounded-lg border border-zenth-interact" })
      ]
    }
  ) : /* @__PURE__ */ jsx33("div", { className: cn(rootClasses, className), style: lineStyle });
  if (blockHeight !== void 0) {
    const height = typeof blockHeight === "number" ? `${blockHeight}px` : blockHeight;
    return /* @__PURE__ */ jsx33("div", { className: "flex items-center", style: { height }, children: line });
  }
  return line;
};

// src/components/menubar/menubar.tsx
import { IconContext } from "@phosphor-icons/react";
import { useRef as useRef7 } from "react";

// src/components/menubar/use-menu-navigation.ts
import { useEffect as useEffect7, useRef as useRef6 } from "react";
var useMenuNavigation = ({
  menuRef,
  direction = "horizontal"
}) => {
  const activeElementRef = useRef6(null);
  useEffect7(() => {
    if (!menuRef.current)
      return;
    const focusableElements = Array.from(
      menuRef.current.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      )
    );
    if (focusableElements.length === 0)
      return;
    const handleKeyDown = (e) => {
      if (!activeElementRef.current)
        return;
      const currentIndex = focusableElements.indexOf(activeElementRef.current);
      let nextIndex = currentIndex;
      const isHorizontal = direction === "horizontal";
      const forwardKey = isHorizontal ? "ArrowRight" : "ArrowDown";
      const backwardKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      if (e.key === forwardKey) {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % focusableElements.length;
      } else if (e.key === backwardKey) {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
      } else {
        return;
      }
      const nextElement = focusableElements[nextIndex];
      activeElementRef.current = nextElement;
      nextElement.focus();
    };
    const addKeyListener = () => document.addEventListener("keydown", handleKeyDown);
    const removeKeyListener = () => document.removeEventListener("keydown", handleKeyDown);
    const handleFocusIn = () => {
      activeElementRef.current = document.activeElement;
      addKeyListener();
    };
    const handleFocusOut = () => {
      activeElementRef.current = null;
      removeKeyListener();
    };
    menuRef.current.addEventListener("focusin", handleFocusIn);
    menuRef.current.addEventListener("focusout", handleFocusOut);
    return () => {
      menuRef.current?.removeEventListener("focusin", handleFocusIn);
      menuRef.current?.removeEventListener("focusout", handleFocusOut);
      removeKeyListener();
    };
  }, [menuRef, direction]);
};

// src/components/menubar/menubar.tsx
import { jsx as jsx34 } from "react/jsx-runtime";
var MenuOption = ({
  icon,
  id,
  isActive,
  onClick,
  tooltip
}) => {
  const button = /* @__PURE__ */ jsx34(
    "button",
    {
      "data-zenth-component": "MenuBar",
      "data-zenth-part": "option",
      "aria-label": tooltip,
      className: cn(
        "relative -ml-px flex h-full w-11 cursor-pointer items-center justify-center rounded-md border-none bg-zenth-recessed transition-colors first:rounded-l-lg last:rounded-r-lg focus:z-3 focus:ring-zenth-focus/50 focus:outline-hidden focus-visible:z-3 focus-visible:ring-2 focus-visible:ring-zenth-brand",
        {
          "z-2 bg-zenth-base shadow-xs transition-colors": isActive === id
        }
      ),
      onClick,
      children: /* @__PURE__ */ jsx34(IconContext.Provider, { value: { size: 18 }, ...{}, children: icon })
    }
  );
  return /* @__PURE__ */ jsx34(Tooltip, { content: tooltip, render: button });
};
var MenuBar = ({
  className,
  isActive,
  options,
  optionIds = false
  // if option needs an extra unique ID
}) => {
  const menuRef = useRef7(null);
  useMenuNavigation({ menuRef, direction: "horizontal" });
  return /* @__PURE__ */ jsx34(
    "nav",
    {
      className: cn(
        "isolate flex rounded-lg bg-zenth-recessed pl-px shadow-xs ring ring-zenth-line transition-colors",
        className
      ),
      ref: menuRef,
      children: options.map((option, index) => /* @__PURE__ */ jsx34(
        MenuOption,
        {
          ...option,
          isActive,
          id: optionIds ? option.id : index
        },
        index
      ))
    }
  );
};

// src/components/meter/meter.tsx
import { Meter as BaseMeter } from "@base-ui/react/meter";
import { Fragment as Fragment7, jsx as jsx35, jsxs as jsxs20 } from "react/jsx-runtime";
function Meter({
  value,
  customValue,
  label,
  showValue = true,
  className,
  trackClassName,
  indicatorClassName,
  ...props
}) {
  return /* @__PURE__ */ jsxs20(
    BaseMeter.Root,
    {
      value,
      ...props,
      className: cn("flex w-full flex-col gap-2", className),
      children: [
        /* @__PURE__ */ jsxs20("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsx35(BaseMeter.Label, { className: "text-xs text-zenth-subtle", children: label }),
          customValue ? /* @__PURE__ */ jsx35("span", { className: "text-sm font-medium text-zenth-default tabular-nums", children: customValue }) : /* @__PURE__ */ jsx35(Fragment7, { children: showValue && /* @__PURE__ */ jsx35(BaseMeter.Value, { className: "text-sm font-medium text-zenth-default tabular-nums" }) })
        ] }),
        /* @__PURE__ */ jsx35(
          BaseMeter.Track,
          {
            className: cn(
              "relative h-2 w-full overflow-hidden rounded-full bg-zenth-fill",
              trackClassName
            ),
            children: /* @__PURE__ */ jsx35(
              BaseMeter.Indicator,
              {
                className: cn(
                  "absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-zenth-brand via-zenth-brand to-zenth-brand transition-[width] duration-300 ease-out",
                  indicatorClassName
                )
              }
            )
          }
        )
      ]
    }
  );
}

// src/components/pagination/pagination.tsx
import {
  createContext as createContext10,
  useContext as useContext10,
  useEffect as useEffect8,
  useMemo as useMemo6,
  useState as useState6
} from "react";
import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon as CaretLeftIcon2,
  CaretRightIcon as CaretRightIcon2
} from "@phosphor-icons/react";

// src/components/select/select.tsx
import { Select as SelectBase } from "@base-ui/react/select";
import { CaretUpDownIcon as CaretUpDownIcon2, CheckIcon as CheckIcon7 } from "@phosphor-icons/react";
import { forwardRef as forwardRef19, useId as useId2 } from "react";
import { jsx as jsx36, jsxs as jsxs21 } from "react/jsx-runtime";
var KUMO_SELECT_VARIANTS = {
  size: KUMO_INPUT_VARIANTS.size
};
var KUMO_SELECT_DEFAULT_VARIANTS = {
  size: "base"
};
function selectVariants({
  size = KUMO_SELECT_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    buttonVariants({ size }),
    "bg-zenth-control disabled:bg-zenth-control/50 data-[state=open]:bg-zenth-control",
    "justify-between font-normal",
    "focus:opacity-100 focus:ring-zenth-focus/50 focus-visible:ring-inset *:in-focus:opacity-100"
  );
}
var triggerIconStyles = {
  xs: { iconSize: 12, className: "text-zenth-subtle" },
  sm: { iconSize: 14, className: "text-zenth-subtle" },
  base: { iconSize: 16, className: "text-zenth-subtle" },
  lg: { iconSize: 18, className: "text-zenth-subtle" }
};
function isItemDescriptor(value) {
  if (value === null || value === void 0)
    return false;
  if (typeof value !== "object" || Array.isArray(value))
    return false;
  if ("$$typeof" in value)
    return false;
  if (value instanceof Promise)
    return false;
  const candidate = value;
  return "label" in candidate && candidate.label !== void 0;
}
function normalizeItems(items) {
  if (Array.isArray(items)) {
    return items;
  }
  return Object.entries(items).map(([key, entry]) => ({
    value: key,
    label: isItemDescriptor(entry) ? entry.label : entry
  }));
}
function renderOptionsFromItems(items) {
  const normalizedItems = normalizeItems(items);
  const disabledLookup = /* @__PURE__ */ new Map();
  if (!Array.isArray(items)) {
    for (const [key, entry] of Object.entries(items)) {
      if (isItemDescriptor(entry)) {
        disabledLookup.set(key, { disabled: entry.disabled });
      }
    }
  }
  return normalizedItems.filter((item) => item.value !== null).map((item, index) => {
    const key = typeof item.value === "string" ? item.value : `option-${index}`;
    const meta = typeof item.value === "string" ? disabledLookup.get(item.value) : void 0;
    return /* @__PURE__ */ jsx36(Option, { value: item.value, disabled: meta?.disabled, children: item.label }, key);
  });
}
function Select({
  children,
  className,
  render,
  renderValue,
  label,
  hideLabel,
  placeholder,
  loading,
  size = KUMO_SELECT_DEFAULT_VARIANTS.size,
  labelTooltip,
  description,
  error,
  required,
  container: containerProp,
  side = "bottom",
  sideOffset = 4,
  align = "start",
  alignOffset,
  alignItemWithTrigger = false,
  anchor,
  arrowPadding,
  positionMethod,
  collisionAvoidance,
  collisionBoundary,
  collisionPadding,
  sticky,
  disableAnchorTracking,
  ...props
}) {
  const labelId = useId2();
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  const propLookup = props;
  const ariaLabel = propLookup["aria-label"];
  const ariaLabelledby = propLookup["aria-labelledby"];
  const fallbackLabel = typeof label === "string" ? label : placeholder;
  if (false) {
    console.warn(
      '[Kumo Select]: `hideLabel` is deprecated. For hidden labels, use `aria-label` instead of `label` + `hideLabel={true}`.\n  Migration:\n  - For visible labels: <Select label="Country" /> (hideLabel no longer needed)\n  - For hidden labels: <Select aria-label="Select a country" /> (remove label and hideLabel)'
    );
  }
  const useFieldWrapper = label && hideLabel !== true;
  const triggerLabelledBy = useFieldWrapper ? void 0 : ariaLabelledby ?? (label ? labelId : void 0);
  const triggerAriaLabel = ariaLabel ?? (!triggerLabelledBy ? fallbackLabel : void 0);
  const normalizedItems = props.items ? normalizeItems(props.items) : void 0;
  const renderedChildren = children ? children : props.items ? renderOptionsFromItems(props.items) : null;
  const valueChildrenFn = renderValue ? (value) => {
    const placeholderNode = placeholder != null ? /* @__PURE__ */ jsx36("span", { className: "text-zenth-placeholder", children: placeholder }) : null;
    if (value == null || value === "") {
      return placeholderNode;
    }
    const rendered = renderValue(value);
    if (rendered == null) {
      return placeholderNode;
    }
    return rendered;
  } : void 0;
  const { items: _items, ...baseProps } = props;
  const showOptional = required === false;
  const selectLabelNode = label ? /* @__PURE__ */ jsx36(SelectBase.Label, { className: "m-0 text-base font-medium text-zenth-default select-none", children: /* @__PURE__ */ jsx36(
    Label,
    {
      showOptional,
      tooltip: hideLabel ? void 0 : labelTooltip,
      asContent: true,
      children: label
    }
  ) }) : null;
  const selectTrigger = /* @__PURE__ */ jsxs21(
    SelectBase.Trigger,
    {
      "data-zenth-component": "Select",
      "data-zenth-part": "trigger",
      render,
      className: cn(
        selectVariants({ size }),
        props.disabled && "cursor-not-allowed opacity-50",
        error && "!ring-zenth-danger focus:ring-[1.5px] focus:ring-zenth-danger/50",
        className
      ),
      "aria-label": triggerAriaLabel,
      "aria-labelledby": triggerLabelledBy,
      children: [
        loading ? /* @__PURE__ */ jsx36(SkeletonLine, { className: "w-32" }) : /* @__PURE__ */ jsx36(
          SelectBase.Value,
          {
            placeholder,
            className: "min-w-0 truncate data-[placeholder]:text-zenth-placeholder",
            children: valueChildrenFn
          }
        ),
        /* @__PURE__ */ jsx36(
          SelectBase.Icon,
          {
            className: cn(
              "flex shrink-0 items-center",
              triggerIconStyles[size].className
            ),
            children: /* @__PURE__ */ jsx36(
              CaretUpDownIcon2,
              {
                size: triggerIconStyles[size].iconSize,
                className: "fill-current"
              }
            )
          }
        )
      ]
    }
  );
  const selectControl = /* @__PURE__ */ jsxs21(
    SelectBase.Root,
    {
      ...baseProps,
      items: normalizedItems,
      disabled: loading || props.disabled,
      required,
      children: [
        selectLabelNode,
        selectTrigger,
        /* @__PURE__ */ jsx36(SelectBase.Portal, { container, children: /* @__PURE__ */ jsx36(
          SelectBase.Positioner,
          {
            side,
            sideOffset,
            align,
            alignOffset,
            alignItemWithTrigger,
            anchor,
            arrowPadding,
            positionMethod,
            collisionAvoidance,
            collisionBoundary,
            collisionPadding,
            sticky,
            disableAnchorTracking,
            children: /* @__PURE__ */ jsx36(
              SelectBase.Popup,
              {
                className: cn(
                  "flex flex-col",
                  "max-h-[var(--available-height)] bg-zenth-base text-zenth-default",
                  "rounded-lg shadow-lg ring ring-zenth-line",
                  "max-w-(--available-width) min-w-(--anchor-width) py-1.5"
                ),
                children: /* @__PURE__ */ jsx36(
                  SelectBase.List,
                  {
                    className: cn(
                      "min-h-0 flex-1 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-none"
                    ),
                    children: renderedChildren
                  }
                )
              }
            )
          }
        ) })
      ]
    }
  );
  if (useFieldWrapper) {
    return /* @__PURE__ */ jsx36(
      Field,
      {
        label,
        required,
        labelTooltip,
        description,
        error: error ? typeof error === "string" ? { message: error, match: true } : error : void 0,
        hideLabel: true,
        children: selectControl
      }
    );
  }
  const normalizedError = error ? typeof error === "string" ? { message: error, match: true } : error : void 0;
  return /* @__PURE__ */ jsxs21("div", { className: "grid gap-2", children: [
    label && /* @__PURE__ */ jsx36("span", { id: labelId, className: "sr-only", children: label }),
    selectControl,
    normalizedError ? /* @__PURE__ */ jsx36("span", { className: "text-sm text-zenth-danger", children: normalizedError.message }) : description && /* @__PURE__ */ jsx36("span", { className: "text-sm leading-snug text-zenth-subtle", children: description })
  ] });
}
function Option({ children, value, disabled, className }) {
  return /* @__PURE__ */ jsxs21(
    SelectBase.Item,
    {
      "data-zenth-component": "Select",
      "data-zenth-part": "option",
      value,
      disabled,
      className: cn(
        "group mx-1.5 flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-base outline-none focus-visible:outline-hidden",
        "focus-visible:z-50 focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:ring-inset",
        "data-highlighted:bg-zenth-tint",
        "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
        className
      ),
      children: [
        /* @__PURE__ */ jsx36(SelectBase.ItemText, { children }),
        /* @__PURE__ */ jsx36(SelectBase.ItemIndicator, { children: /* @__PURE__ */ jsx36(CheckIcon7, {}) })
      ]
    }
  );
}
var Group2 = forwardRef19(
  ({ children, className }, ref) => /* @__PURE__ */ jsx36(SelectBase.Group, { ref, className: cn(className), children })
);
Group2.displayName = "Select.Group";
var GroupLabel2 = forwardRef19(
  ({ children, className }, ref) => /* @__PURE__ */ jsx36(
    SelectBase.GroupLabel,
    {
      ref,
      className: cn(
        "px-3.5 py-1.5 text-sm font-semibold text-zenth-subtle",
        className
      ),
      children
    }
  )
);
GroupLabel2.displayName = "Select.GroupLabel";
var Separator = forwardRef19(
  ({ className }, ref) => /* @__PURE__ */ jsx36(
    SelectBase.Separator,
    {
      ref,
      className: cn("my-1 h-px bg-zenth-hairline", className)
    }
  )
);
Separator.displayName = "Select.Separator";
Select.Option = Option;
Select.Group = Group2;
Select.GroupLabel = GroupLabel2;
Select.Separator = Separator;
Select.Option.displayName = "Select.Option";

// src/components/pagination/pagination.tsx
import { Fragment as Fragment8, jsx as jsx37, jsxs as jsxs22 } from "react/jsx-runtime";
var DEFAULT_PAGE_SIZE_OPTIONS = [25, 50, 100, 250];
var clamp = (value, min, max) => Math.min(Math.max(value, min), max);
var DEFAULT_LABELS = {
  navigation: "Pagination",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  pageNumber: "Page number",
  pageSize: "Page size"
};
var KUMO_PAGINATION_DEFAULT_VARIANTS = {
  controls: "full"
};
var PaginationContext = createContext10(null);
function usePaginationContext() {
  const context = useContext10(PaginationContext);
  if (!context) {
    throw new Error(
      "Pagination compound components must be used within a Pagination component"
    );
  }
  return context;
}
function PaginationInfo({ children, className }) {
  const { page, perPage, totalCount, pageShowingRange } = usePaginationContext();
  const content = children ? children({ page, perPage, totalCount, pageShowingRange }) : totalCount && totalCount > 0 ? /* @__PURE__ */ jsxs22(Fragment8, { children: [
    "Showing ",
    /* @__PURE__ */ jsx37("span", { className: "tabular-nums", children: pageShowingRange }),
    " of",
    " ",
    /* @__PURE__ */ jsx37("span", { className: "tabular-nums", children: totalCount })
  ] }) : null;
  return /* @__PURE__ */ jsx37(
    "div",
    {
      "data-slot": "pagination-info",
      className: cn("text-sm text-zenth-subtle", className),
      children: content
    }
  );
}
PaginationInfo.displayName = "Pagination.Info";
function PaginationPageSize({
  value,
  onChange,
  options = DEFAULT_PAGE_SIZE_OPTIONS,
  label = "Per page:",
  className
}) {
  const { labels } = usePaginationContext();
  return /* @__PURE__ */ jsxs22(
    "div",
    {
      "data-slot": "pagination-page-size",
      className: cn("flex items-center gap-2", className),
      children: [
        label && /* @__PURE__ */ jsx37("span", { className: "text-sm text-zenth-subtle", children: label }),
        /* @__PURE__ */ jsx37(
          Select,
          {
            "aria-label": labels.pageSize,
            value,
            onValueChange: (v) => onChange(v),
            children: options.map((size) => /* @__PURE__ */ jsx37(Select.Option, { value: size, children: size }, size))
          }
        )
      ]
    }
  );
}
PaginationPageSize.displayName = "Pagination.PageSize";
function PaginationControls({
  controls = KUMO_PAGINATION_DEFAULT_VARIANTS.controls,
  pageSelector = "input",
  className
}) {
  const {
    page,
    totalCount,
    hasNextPage,
    maxPage,
    setPage,
    editingPage,
    setEditingPage,
    labels
  } = usePaginationContext();
  const hasKnownTotal = totalCount != null;
  const isUnknownTotal = !hasKnownTotal && hasNextPage !== void 0;
  const showFullControls = controls === "full" && !isUnknownTotal;
  const isNextDisabled = hasKnownTotal ? page >= maxPage : hasNextPage !== true;
  const commitEditingPage = () => {
    const value = editingPage.trim();
    if (!/^\d+$/.test(value)) {
      setEditingPage(String(page));
      return;
    }
    const clamped = clamp(Number(value), 1, maxPage);
    setPage(clamped);
    setEditingPage(String(clamped));
  };
  return /* @__PURE__ */ jsx37(
    "div",
    {
      "data-slot": "pagination-controls",
      className: cn("flex grow flex-col items-end", className),
      children: /* @__PURE__ */ jsx37("nav", { "aria-label": labels.navigation, children: /* @__PURE__ */ jsxs22(InputGroup, { children: [
        showFullControls && /* @__PURE__ */ jsx37(
          InputGroup.Button,
          {
            variant: "secondary",
            "aria-label": labels.firstPage,
            disabled: page <= 1,
            onClick: () => {
              setPage(1);
              setEditingPage("1");
            },
            children: /* @__PURE__ */ jsx37(CaretDoubleLeftIcon, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsx37(
          InputGroup.Button,
          {
            variant: "secondary",
            "aria-label": labels.previousPage,
            disabled: page <= 1,
            onClick: () => {
              const previousPage = Math.max(page - 1, 1);
              setPage(previousPage);
              setEditingPage(String(previousPage));
            },
            children: /* @__PURE__ */ jsx37(CaretLeftIcon2, { size: 16 })
          }
        ),
        showFullControls && (pageSelector === "dropdown" ? /* @__PURE__ */ jsx37(
          Select,
          {
            "aria-label": labels.pageNumber,
            className: "rounded-none ring-zenth-hairline",
            value: page,
            onValueChange: (value) => {
              const num = value;
              setPage(num);
              setEditingPage(String(num));
            },
            children: Array.from({ length: maxPage }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx37(Select.Option, { value: p, children: p }, p))
          }
        ) : /* @__PURE__ */ jsx37(
          InputGroup.Input,
          {
            style: { width: 50 },
            className: "text-center",
            "aria-label": labels.pageNumber,
            value: editingPage,
            onValueChange: (value) => {
              setEditingPage(value);
            },
            onBlur: commitEditingPage,
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                commitEditingPage();
              }
            },
            autoComplete: "off",
            "data-1p-ignore": true,
            "data-lpignore": "true",
            "data-form-type": "other"
          }
        )),
        /* @__PURE__ */ jsx37(
          InputGroup.Button,
          {
            variant: "secondary",
            "aria-label": labels.nextPage,
            disabled: isNextDisabled,
            onClick: () => {
              const nextPage = hasKnownTotal ? Math.min(page + 1, maxPage) : page + 1;
              setPage(nextPage);
              setEditingPage(String(nextPage));
            },
            children: /* @__PURE__ */ jsx37(CaretRightIcon2, { size: 16 })
          }
        ),
        showFullControls && /* @__PURE__ */ jsx37(
          InputGroup.Button,
          {
            variant: "secondary",
            "aria-label": labels.lastPage,
            disabled: page >= maxPage,
            onClick: () => {
              setPage(maxPage);
              setEditingPage(String(maxPage));
            },
            children: /* @__PURE__ */ jsx37(CaretDoubleRightIcon, { size: 16 })
          }
        )
      ] }) })
    }
  );
}
PaginationControls.displayName = "Pagination.Controls";
function PaginationSeparator({ className }) {
  return /* @__PURE__ */ jsx37(
    "div",
    {
      "data-slot": "pagination-separator",
      className: cn("mx-2 h-6 border-l border-zenth-hairline", className)
    }
  );
}
PaginationSeparator.displayName = "Pagination.Separator";
function PaginationRoot(props) {
  const {
    page = 1,
    perPage,
    totalCount,
    hasNextPage,
    setPage,
    children,
    className,
    labels: labelsProp
  } = props;
  const text = "text" in props ? props.text : void 0;
  const controls = "controls" in props ? props.controls ?? KUMO_PAGINATION_DEFAULT_VARIANTS.controls : KUMO_PAGINATION_DEFAULT_VARIANTS.controls;
  const [editingPage, setEditingPage] = useState6(String(page));
  const labels = useMemo6(
    () => ({ ...DEFAULT_LABELS, ...labelsProp }),
    [labelsProp]
  );
  useEffect8(() => {
    setEditingPage(String(page));
  }, [page]);
  const pageShowingRange = useMemo6(() => {
    let lower = page * (perPage ?? 1) - (perPage ?? 0) + 1;
    let upper = Math.min(page * (perPage ?? 0), totalCount ?? 0);
    if (Number.isNaN(lower))
      lower = 0;
    if (Number.isNaN(upper))
      upper = 0;
    return `${lower}-${upper}`;
  }, [page, perPage, totalCount]);
  const maxPage = useMemo6(() => {
    return Math.max(Math.ceil((totalCount ?? 1) / (perPage ?? 1)), 1);
  }, [totalCount, perPage]);
  const contextValue = {
    page,
    perPage,
    totalCount,
    hasNextPage,
    maxPage,
    pageShowingRange,
    setPage,
    editingPage,
    setEditingPage,
    labels
  };
  if (children) {
    return /* @__PURE__ */ jsx37(PaginationContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx37(
      "div",
      {
        "data-slot": "pagination",
        className: cn("flex w-full items-center gap-2", className),
        children
      }
    ) });
  }
  const getPaginationText = () => {
    if (text) {
      return text({ page, perPage, totalCount, pageShowingRange });
    } else if (totalCount && totalCount > 0) {
      return /* @__PURE__ */ jsxs22(Fragment8, { children: [
        "Showing ",
        /* @__PURE__ */ jsx37("span", { className: "tabular-nums", children: pageShowingRange }),
        " of",
        " ",
        /* @__PURE__ */ jsx37("span", { className: "tabular-nums", children: totalCount })
      ] });
    }
    return null;
  };
  return /* @__PURE__ */ jsx37(PaginationContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxs22(
    "div",
    {
      "data-slot": "pagination",
      className: cn("flex w-full items-center gap-2", className),
      children: [
        /* @__PURE__ */ jsx37(
          "div",
          {
            "aria-live": "polite",
            "aria-atomic": "true",
            "data-slot": "pagination-info",
            className: "grow text-sm text-zenth-subtle",
            children: getPaginationText()
          }
        ),
        /* @__PURE__ */ jsx37(PaginationControls, { controls })
      ]
    }
  ) });
}
PaginationRoot.displayName = "Pagination";
var Pagination = Object.assign(PaginationRoot, {
  Info: PaginationInfo,
  PageSize: PaginationPageSize,
  Controls: PaginationControls,
  Separator: PaginationSeparator
});

// src/components/surface/surface.tsx
import { createElement } from "react";
import { jsx as jsx38 } from "react/jsx-runtime";
var Surface = function Surface2({
  color = "primary",
  className,
  render,
  as,
  ...props
}) {
  const resolvedRender = render ?? (as ? createElement(as) : void 0);
  return /* @__PURE__ */ jsx38(
    LayerCard2,
    {
      className: cn("overflow-visible rounded-none", className),
      render: resolvedRender,
      ...props,
      "data-surface-color": color,
      "data-deprecated": "surface"
    }
  );
};
Surface.displayName = "Surface";

// src/components/switch/switch.tsx
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import {
  forwardRef as forwardRef20,
  createContext as createContext11,
  useContext as useContext11
} from "react";
import { Fieldset as Fieldset2 } from "@base-ui/react/fieldset";
import { jsx as jsx39, jsxs as jsxs23 } from "react/jsx-runtime";
var SwitchGroupContext = createContext11({
  controlFirst: true
});
var SwitchBase = forwardRef20(
  ({
    className,
    checked,
    disabled,
    size = "base",
    variant = "default",
    label,
    labelTooltip,
    required,
    controlFirst = true,
    onCheckedChange,
    transitioning,
    id,
    ...props
  }, ref) => {
    const ariaLabelFallback = typeof label === "string" ? label : "Switch";
    const switchControl = /* @__PURE__ */ jsx39(
      BaseSwitch.Root,
      {
        ref,
        id,
        checked,
        disabled,
        onCheckedChange,
        nativeButton: true,
        render: (rootProps, state) => {
          const {
            ref: rootRef,
            className: baseClassName,
            role: baseRole,
            "aria-checked": _ariaChecked,
            "aria-pressed": _ariaPressed,
            ...restRootProps
          } = rootProps;
          const isNeutral = variant === "neutral";
          const squircleRadius = "rounded-[5px] supports-[corner-shape:squircle]:rounded-[10px] [corner-shape:squircle]";
          const sizeStyles = {
            sm: { track: "h-4 w-8", thumb: "w-4", slide: "left-4" },
            base: { track: "h-4.5 w-9", thumb: "w-4.5", slide: "left-4.5" },
            lg: { track: "h-5 w-10", thumb: "w-5", slide: "left-5" }
          };
          const s = sizeStyles[size];
          const trackColors = isNeutral ? state.checked ? "bg-neutral-500 dark:bg-zenth-base ring-neutral-600 dark:ring-neutral-700" : "bg-neutral-150 dark:bg-zenth-base ring-zenth-hairline" : state.checked ? "bg-blue-500 dark:bg-blue-600 ring-blue-600 dark:ring-blue-500" : "bg-neutral-200 dark:bg-neutral-700 ring-neutral-300 dark:ring-neutral-600";
          const thumbColors = isNeutral ? state.checked ? "bg-zenth-base dark:bg-neutral-400" : "bg-zenth-base dark:bg-neutral-850" : state.checked ? "bg-zenth-base dark:bg-blue-300" : "bg-zenth-base dark:bg-neutral-850";
          const trackClassName = cn(
            "relative inline-flex cursor-pointer items-center border-none p-0 ring",
            "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
            "transition-colors duration-150 ease-out motion-reduce:transition-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            s.track,
            squircleRadius,
            trackColors,
            className,
            baseClassName
          );
          const thumbClassName = cn(
            "absolute top-0 bottom-0 shadow-[0_0_1px_0.5px_var(--color-zenth-shadow-edge),0_1px_2px_var(--color-zenth-shadow-drop)]",
            s.thumb,
            squircleRadius,
            thumbColors,
            "transition-all duration-150 ease-out motion-reduce:transition-none",
            state.checked ? s.slide : "left-0"
          );
          const role = props.role ?? baseRole ?? "switch";
          const checkedA11yProps = role === "switch" ? { "aria-checked": state.checked } : { "aria-pressed": state.checked };
          return /* @__PURE__ */ jsx39(
            "button",
            {
              ...restRootProps,
              ...props,
              ref: rootRef,
              "data-zenth-component": "Switch",
              type: "button",
              role,
              ...checkedA11yProps,
              "aria-busy": transitioning || void 0,
              "aria-label": props["aria-label"] ?? ariaLabelFallback,
              className: trackClassName,
              children: /* @__PURE__ */ jsx39("div", { className: thumbClassName })
            }
          );
        }
      }
    );
    if (!label) {
      return switchControl;
    }
    return /* @__PURE__ */ jsx39(
      Field,
      {
        label,
        required,
        labelTooltip,
        controlFirst,
        children: switchControl
      }
    );
  }
);
SwitchBase.displayName = "Switch";
var SwitchItem = forwardRef20(
  ({
    className,
    checked,
    disabled,
    size = "base",
    variant = "default",
    label,
    onCheckedChange,
    transitioning
  }, ref) => {
    const { controlFirst } = useContext11(SwitchGroupContext);
    return /* @__PURE__ */ jsxs23(
      "label",
      {
        "data-zenth-component": "Switch",
        "data-zenth-part": "item-label",
        className: cn(
          "relative m-0 inline-flex items-center gap-2",
          // Control first (default): switch before label
          // Label first: label before switch using flex-row-reverse
          !controlFirst && "flex-row-reverse justify-end",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className
        ),
        children: [
          /* @__PURE__ */ jsx39(
            BaseSwitch.Root,
            {
              ref,
              checked,
              disabled,
              onCheckedChange,
              nativeButton: true,
              render: (rootProps, state) => {
                const {
                  ref: rootRef,
                  className: baseClassName,
                  role: baseRole,
                  "aria-checked": _ariaChecked,
                  "aria-pressed": _ariaPressed,
                  ...restRootProps
                } = rootProps;
                const isNeutral = variant === "neutral";
                const squircleRadius = "rounded-[5px] supports-[corner-shape:squircle]:rounded-[10px] [corner-shape:squircle]";
                const sizeStyles = {
                  sm: { track: "h-4 w-8", thumb: "w-4", slide: "left-4" },
                  base: { track: "h-4.5 w-9", thumb: "w-4.5", slide: "left-4.5" },
                  lg: { track: "h-5 w-10", thumb: "w-5", slide: "left-5" }
                };
                const s = sizeStyles[size];
                const trackColors = isNeutral ? state.checked ? "bg-neutral-500 dark:bg-zenth-base ring-neutral-600 dark:ring-neutral-700" : "bg-neutral-150 dark:bg-zenth-base ring-zenth-hairline" : state.checked ? "bg-blue-500 dark:bg-blue-600 ring-blue-600 dark:ring-blue-500" : "bg-neutral-200 dark:bg-neutral-700 ring-neutral-300 dark:ring-neutral-600";
                const thumbColors = isNeutral ? state.checked ? "bg-zenth-base dark:bg-neutral-400" : "bg-zenth-base dark:bg-neutral-850" : state.checked ? "bg-zenth-base dark:bg-blue-300" : "bg-zenth-base dark:bg-neutral-850";
                const trackClassName = cn(
                  "relative inline-flex cursor-pointer items-center border-none p-0 ring",
                  "focus:ring-zenth-focus/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
                  "transition-colors duration-150 ease-out motion-reduce:transition-none",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  s.track,
                  squircleRadius,
                  trackColors,
                  baseClassName
                );
                const thumbClassName = cn(
                  "absolute top-0 bottom-0 shadow-[0_0_1px_0.5px_var(--color-zenth-shadow-edge),0_1px_2px_var(--color-zenth-shadow-drop)]",
                  s.thumb,
                  squircleRadius,
                  thumbColors,
                  "transition-all duration-150 ease-out motion-reduce:transition-none",
                  state.checked ? s.slide : "left-0"
                );
                const role = baseRole ?? "switch";
                const checkedA11yProps = role === "switch" ? { "aria-checked": state.checked } : { "aria-pressed": state.checked };
                return /* @__PURE__ */ jsx39(
                  "button",
                  {
                    ...restRootProps,
                    ref: rootRef,
                    "data-zenth-component": "Switch",
                    "data-zenth-part": "item",
                    type: "button",
                    role,
                    ...checkedA11yProps,
                    "aria-busy": transitioning || void 0,
                    className: trackClassName,
                    children: /* @__PURE__ */ jsx39("div", { className: thumbClassName })
                  }
                );
              }
            }
          ),
          /* @__PURE__ */ jsx39("span", { className: "text-base font-medium text-zenth-default", children: label })
        ]
      }
    );
  }
);
SwitchItem.displayName = "Switch.Item";
function SwitchLegend({ children, className }) {
  return /* @__PURE__ */ jsx39(
    Fieldset2.Legend,
    {
      className: cn("text-base font-medium text-zenth-default", className),
      children
    }
  );
}
SwitchLegend.displayName = "Switch.Legend";
function SwitchGroup({
  legend,
  children,
  error,
  description,
  disabled,
  controlFirst = true,
  className
}) {
  return /* @__PURE__ */ jsx39(SwitchGroupContext.Provider, { value: { controlFirst }, children: /* @__PURE__ */ jsxs23(
    Fieldset2.Root,
    {
      className: cn("flex flex-col gap-4", className),
      disabled,
      children: [
        legend && /* @__PURE__ */ jsx39(Fieldset2.Legend, { className: "text-base font-medium text-zenth-default", children: legend }),
        /* @__PURE__ */ jsx39("div", { className: "flex flex-col gap-2", children }),
        error && /* @__PURE__ */ jsx39("p", { className: "text-sm text-zenth-danger", children: error }),
        description && /* @__PURE__ */ jsx39("p", { className: "text-sm leading-snug text-pretty text-zenth-subtle", children: description })
      ]
    }
  ) });
}
var Switch = Object.assign(SwitchBase, {
  Item: SwitchItem,
  Group: SwitchGroup,
  Legend: SwitchLegend
});
Switch.displayName = "Switch";

// src/components/tabs/tabs.tsx
import {
  useEffect as useEffect9,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef8,
  useState as useState7
} from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { Fragment as Fragment9, jsx as jsx40, jsxs as jsxs24 } from "react/jsx-runtime";
var KUMO_TABS_DEFAULT_VARIANTS = {
  variant: "segmented",
  size: "base"
};
var DEFAULT_LABELS2 = {
  scrollStart: "Scroll tabs left",
  scrollEnd: "Scroll tabs right"
};
function Tabs({
  tabs,
  value,
  selectedValue,
  onValueChange,
  activateOnFocus,
  className,
  listClassName,
  indicatorClassName,
  labels: labelsProp,
  variant = KUMO_TABS_DEFAULT_VARIANTS.variant,
  size = KUMO_TABS_DEFAULT_VARIANTS.size
}) {
  const items = tabs ?? [];
  if (items.length === 0) {
    return null;
  }
  const fallbackValue = items[0]?.value;
  const isControlled = value !== void 0;
  const rootProps = {
    value: isControlled ? value : void 0,
    defaultValue: isControlled ? void 0 : selectedValue ?? fallbackValue
  };
  const isSegmented = variant === "segmented";
  const isUnderline = variant === "underline";
  const isSm = size === "sm";
  const labels = { ...DEFAULT_LABELS2, ...labelsProp };
  const overflowWatchKey = items.map((item) => item.value).join("|");
  const {
    ref: listRef,
    isOverflowing,
    canScrollStart,
    canScrollEnd
  } = useOverflowDetect(true, overflowWatchKey);
  const bindDrag = useHorizontalDragScroll(listRef, isOverflowing);
  return /* @__PURE__ */ jsxs24(
    TabsPrimitive.Root,
    {
      ...rootProps,
      className: cn(
        "relative isolate min-w-0 font-medium",
        isSegmented && (isSm ? "rounded-md" : "rounded-lg") + " ring ring-zenth-hairline/70",
        className
      ),
      onValueChange: (nextValue) => {
        const stringValue = String(nextValue);
        onValueChange?.(stringValue);
      },
      children: [
        isSegmented && /* @__PURE__ */ jsx40(
          "div",
          {
            className: cn(
              "absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 rounded-lg bg-zenth-recessed",
              isSm ? "h-6.5" : "h-9"
            )
          }
        ),
        /* @__PURE__ */ jsxs24(
          TabsPrimitive.List,
          {
            ref: listRef,
            activateOnFocus,
            "data-overflowing": isOverflowing ? "" : void 0,
            "data-overflow-start": canScrollStart ? "" : void 0,
            "data-overflow-end": canScrollEnd ? "" : void 0,
            ...bindDrag(),
            className: cn(
              "zenth-tabs-list relative flex min-w-0 shrink scroll-px-(--scroll-fade-width) items-stretch overflow-x-auto overflow-y-hidden [--scroll-fade-width:3rem]",
              isSegmented && "rounded-lg bg-zenth-recessed px-0.5",
              isSegmented && (isSm ? "h-6.5 rounded-md" : "h-9"),
              isOverflowing && "cursor-grab active:cursor-grabbing",
              isUnderline && "gap-4 border-b border-zenth-hairline pb-2",
              isUnderline && (isSm ? "h-6.5" : "h-7.5"),
              listClassName
            ),
            children: [
              items.map((tab) => /* @__PURE__ */ jsx40(
                TabsPrimitive.Tab,
                {
                  "data-zenth-component": "Tabs",
                  "data-zenth-part": "tab",
                  value: tab.value,
                  render: tab.render,
                  nativeButton: tab.nativeButton,
                  onClick: (e) => {
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                      inline: "nearest"
                    });
                  },
                  className: cn(
                    "relative z-2 flex items-center rounded bg-transparent whitespace-nowrap focus:ring-zenth-focus/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
                    // The scrolling list clips external outlines; keep the forced-colors
                    // fallback inside the tab, like the segmented variant's focus ring.
                    "forced-colors:focus-visible:-outline-offset-2",
                    isOverflowing ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
                    isSm ? "text-xs" : "text-base",
                    isSegmented && "my-0.5 text-zenth-subtle hover:text-zenth-default focus-visible:ring-inset aria-selected:text-zenth-default",
                    isSegmented && (isSm ? "rounded-sm px-2" : "rounded-md px-2.5"),
                    isUnderline && "text-zenth-subtle hover:bg-zenth-tint hover:text-zenth-default aria-selected:font-medium aria-selected:text-zenth-default aria-selected:hover:bg-zenth-tint",
                    isUnderline && (isSm ? "px-1.5 py-2.5" : "px-2 py-3"),
                    tab.className
                  ),
                  children: tab.label
                },
                tab.value
              )),
              /* @__PURE__ */ jsx40(
                TabsPrimitive.Indicator,
                {
                  render: (props) => /* @__PURE__ */ jsx40(
                    "div",
                    {
                      ...props,
                      className: cn(
                        "absolute left-0 z-1",
                        "w-(--active-tab-width) translate-x-(--active-tab-left) transition-all duration-200",
                        isSegmented && cn(
                          "top-(--active-tab-top) h-(--active-tab-height) bg-zenth-base shadow-sm ring ring-zenth-line",
                          isSm ? "rounded" : "rounded-md"
                        ),
                        isUnderline && "bottom-0 h-0.5 bg-zenth-brand",
                        indicatorClassName
                      )
                    }
                  )
                }
              )
            ]
          }
        ),
        isSegmented && /* @__PURE__ */ jsxs24(Fragment9, { children: [
          /* @__PURE__ */ jsx40(
            TabsOverflowControl,
            {
              side: "start",
              visible: canScrollStart,
              variant,
              size,
              label: labels.scrollStart,
              onClick: () => scrollTabs(listRef, "start")
            }
          ),
          /* @__PURE__ */ jsx40(
            TabsOverflowControl,
            {
              side: "end",
              visible: canScrollEnd,
              variant,
              size,
              label: labels.scrollEnd,
              onClick: () => scrollTabs(listRef, "end")
            }
          )
        ] })
      ]
    }
  );
}
function TabsOverflowControl({
  side,
  visible,
  variant,
  size,
  label,
  onClick
}) {
  const isStart = side === "start";
  const isSegmented = variant === "segmented";
  return /* @__PURE__ */ jsx40(
    "button",
    {
      type: "button",
      "data-zenth-component": "Tabs",
      "data-zenth-part": "overflow-control",
      "data-side": side,
      "aria-label": label,
      "aria-hidden": !visible,
      tabIndex: visible ? 0 : -1,
      onClick,
      className: cn(
        "absolute inset-y-0 z-3 flex items-center border-0 bg-transparent p-0 transition-opacity duration-150 focus:outline-hidden focus-visible:[&>span]:ring-2 focus-visible:[&>span]:ring-zenth-brand",
        isStart ? "left-0 justify-start bg-linear-to-r" : "right-0 justify-end bg-linear-to-l",
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        isSegmented ? "from-zenth-recessed via-zenth-recessed/95 to-transparent" : "from-zenth-base via-zenth-base/95 to-transparent",
        isSegmented && (size === "sm" ? "w-8 rounded-md" : "w-10 rounded-lg"),
        !isSegmented && "w-8"
      ),
      children: /* @__PURE__ */ jsx40(
        "span",
        {
          className: cn(
            "flex items-center justify-center text-zenth-subtle transition-colors hover:text-zenth-default",
            size === "sm" ? "size-5" : "size-6",
            isSegmented ? size === "sm" ? "rounded-sm" : "rounded-md" : "rounded",
            isStart ? "ml-1" : "mr-1"
          ),
          children: /* @__PURE__ */ jsx40(
            "svg",
            {
              viewBox: "0 0 16 16",
              fill: "none",
              className: "size-3.5",
              "aria-hidden": "true",
              children: /* @__PURE__ */ jsx40(
                "path",
                {
                  d: isStart ? "M9.25 4.25L5.75 8L9.25 11.75" : "M6.75 4.25L10.25 8L6.75 11.75",
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2"
                }
              )
            }
          )
        }
      )
    }
  );
}
function scrollTabs(ref, direction) {
  const el = ref.current;
  if (!el)
    return;
  const tabEls = Array.from(
    el.querySelectorAll('[data-zenth-part="tab"]')
  );
  const distance = getTabsScrollSize(el.clientWidth, tabEls);
  el.scrollBy({
    left: direction === "start" ? -distance : distance,
    behavior: "smooth"
  });
}
function getTabsScrollSize(containerWidth, tabs) {
  let totalWidth = 0;
  for (const tab of tabs) {
    const tabWidth = tab.offsetWidth;
    if (totalWidth + tabWidth > containerWidth) {
      return totalWidth || containerWidth;
    }
    totalWidth += tabWidth;
  }
  return Math.max(80, Math.floor(containerWidth * 0.8));
}
function useHorizontalDragScroll(ref, enabled) {
  const dragState = useRef8(null);
  const shouldSuppressClick = useRef8(false);
  return () => ({
    onPointerDownCapture: (event) => {
      const el = ref.current;
      if (!el || !enabled)
        return;
      if (event.pointerType !== "mouse" || event.button !== 0)
        return;
      dragState.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        scrollLeft: el.scrollLeft,
        dragging: false
      };
      shouldSuppressClick.current = false;
    },
    onPointerMoveCapture: (event) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !enabled || !state || state.pointerId !== event.pointerId)
        return;
      const movementX = event.clientX - state.startX;
      if (!state.dragging) {
        if (Math.abs(movementX) <= 3)
          return;
        state.dragging = true;
        shouldSuppressClick.current = true;
        el.setPointerCapture(event.pointerId);
      }
      event.preventDefault();
      el.scrollLeft = state.scrollLeft - movementX;
    },
    onPointerUpCapture: (event) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId)
        return;
      dragState.current = null;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
      if (shouldSuppressClick.current) {
        window.setTimeout(() => {
          shouldSuppressClick.current = false;
        }, 0);
      }
    },
    onPointerCancelCapture: (event) => {
      const el = ref.current;
      const state = dragState.current;
      if (!el || !state || state.pointerId !== event.pointerId)
        return;
      dragState.current = null;
      if (el.hasPointerCapture(event.pointerId)) {
        el.releasePointerCapture(event.pointerId);
      }
    },
    onClickCapture: (event) => {
      if (!shouldSuppressClick.current) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      shouldSuppressClick.current = false;
    }
  });
}
function useOverflowDetect(enabled, watchKey) {
  const ref = useRef8(null);
  const [overflowState, setOverflowState] = useState7({
    isOverflowing: false,
    canScrollStart: false,
    canScrollEnd: false
  });
  useLayoutEffect2(() => {
    if (!enabled)
      return;
    const el = ref.current;
    if (!el)
      return;
    setOverflowState((prevState) => getNextOverflowState(el, prevState));
  }, [enabled, watchKey]);
  useEffect9(() => {
    if (!enabled)
      return;
    const el = ref.current;
    if (!el)
      return;
    const check = () => {
      setOverflowState((prevState) => getNextOverflowState(el, prevState));
    };
    const ro = new ResizeObserver(check);
    ro.observe(el);
    const mo = new MutationObserver(check);
    mo.observe(el, { childList: true, characterData: true, subtree: true });
    el.addEventListener("scroll", check, { passive: true });
    check();
    return () => {
      ro.disconnect();
      mo.disconnect();
      el.removeEventListener("scroll", check);
    };
  }, [enabled]);
  return { ref, ...overflowState };
}
function getNextOverflowState(el, prevState) {
  const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
  const scrollLeft = Math.min(Math.max(0, el.scrollLeft), maxScrollLeft);
  const nextState = {
    isOverflowing: maxScrollLeft > 1,
    canScrollStart: scrollLeft > 1,
    canScrollEnd: maxScrollLeft - scrollLeft > 1
  };
  return prevState.isOverflowing === nextState.isOverflowing && prevState.canScrollStart === nextState.canScrollStart && prevState.canScrollEnd === nextState.canScrollEnd ? prevState : nextState;
}

// src/components/table/table.tsx
import { forwardRef as forwardRef21 } from "react";
import { jsx as jsx41 } from "react/jsx-runtime";
var KUMO_TABLE_VARIANTS = {
  layout: {
    auto: {
      classes: "",
      description: "Auto table layout - columns resize based on content"
    },
    fixed: {
      classes: "table-fixed",
      description: "Fixed table layout - columns have equal width, controlled via colgroup"
    }
  },
  variant: {
    default: {
      classes: "even:bg-zenth-elevated [--zenth-table-row-bg:var(--color-zenth-base)] even:[--zenth-table-row-bg:var(--color-zenth-elevated)]",
      description: "Default row variant"
    },
    selected: {
      classes: "bg-zenth-tint [--zenth-table-row-bg:var(--color-zenth-tint)]",
      description: "Selected row variant"
    }
  },
  sticky: {
    left: {
      classes: "sticky left-0",
      description: "Pin column to the left edge of the scroll container"
    },
    right: {
      classes: "sticky right-0",
      description: "Pin column to the right edge of the scroll container"
    }
  }
};
var stickyColumnClasses = (side, element) => {
  const base = resolveVariant(KUMO_TABLE_VARIANTS.sticky, side, "left").classes;
  const z = element === "head" ? "z-2" : "z-1";
  const fadePosition = side === "right" ? "before:-left-6" : "before:-right-6";
  const fadeBase = "before:pointer-events-none before:absolute before:inset-y-0 before:w-6";
  if (element === "cell") {
    const fade2 = side === "right" ? "before:bg-gradient-to-r before:from-transparent before:to-(--zenth-table-row-bg)" : "before:bg-gradient-to-l before:from-transparent before:to-(--zenth-table-row-bg)";
    return cn(
      base,
      z,
      "bg-(--zenth-table-row-bg)",
      fadeBase,
      fadePosition,
      fade2
    );
  }
  const bg = "bg-zenth-base group-data-[compact]/header:bg-zenth-elevated";
  const fade = side === "right" ? "before:bg-gradient-to-r before:from-transparent before:to-zenth-base group-data-[compact]/header:before:to-zenth-elevated" : "before:bg-gradient-to-l before:from-transparent before:to-zenth-base group-data-[compact]/header:before:to-zenth-elevated";
  return cn(base, z, bg, fadeBase, fadePosition, fade);
};
var KUMO_TABLE_DEFAULT_VARIANTS = {
  layout: "auto",
  variant: "default"
};
var TableRoot = forwardRef21(({ layout = "auto", ...props }, ref) => {
  const className = cn(
    "isolate w-full",
    // isolate creates a stacking context so z-0/z-1/z-2 never leak out
    resolveVariant(
      KUMO_TABLE_VARIANTS.layout,
      layout,
      KUMO_TABLE_DEFAULT_VARIANTS.layout
    ).classes,
    "[&_td]:p-3",
    // Cell padding
    "[&_th]:border-b [&_th]:border-zenth-fill [&_th]:p-3 [&_th]:text-base [&_th]:font-semibold",
    // Header styles
    "[&_th]:bg-zenth-base",
    // Header background color
    "text-left text-base text-zenth-default",
    props.className
  );
  return /* @__PURE__ */ jsx41("table", { ref, ...props, className });
});
var TableHeader = forwardRef21(({ variant = "default", sticky, ...props }, ref) => {
  const isCompact = variant === "compact";
  const className = cn(
    "group/header",
    isCompact && "text-xs text-zenth-strong [&_th]:bg-zenth-elevated [&_th]:py-2",
    sticky && "[&_th]:sticky [&_th]:top-0 [&_th]:z-1",
    props.className
  );
  return /* @__PURE__ */ jsx41(
    "thead",
    {
      ref,
      ...props,
      className,
      ...isCompact && { "data-compact": "" }
    }
  );
});
var TableHead = forwardRef21(({ sticky, ...props }, ref) => {
  const className = cn(
    "group relative",
    sticky && stickyColumnClasses(sticky, "head"),
    props.className
  );
  return /* @__PURE__ */ jsx41("th", { ref, ...props, className });
});
var TableRow = forwardRef21(({ variant = KUMO_TABLE_DEFAULT_VARIANTS.variant, ...props }, ref) => {
  const className = cn(
    resolveVariant(
      KUMO_TABLE_VARIANTS.variant,
      variant,
      KUMO_TABLE_DEFAULT_VARIANTS.variant
    ).classes,
    props.className
  );
  return /* @__PURE__ */ jsx41("tr", { ref, ...props, className });
});
var TableBody = forwardRef21((props, ref) => {
  return /* @__PURE__ */ jsx41("tbody", { ref, ...props });
});
var TableCell = forwardRef21(({ sticky, ...props }, ref) => {
  const className = cn(
    sticky && stickyColumnClasses(sticky, "cell"),
    props.className
  );
  return /* @__PURE__ */ jsx41("td", { ref, ...props, className });
});
var TableFooter = forwardRef21((props, ref) => {
  return /* @__PURE__ */ jsx41("tfoot", { ref, ...props });
});
var TableResizeHandle = forwardRef21((props, ref) => {
  return /* @__PURE__ */ jsx41(
    "button",
    {
      ref,
      ...props,
      type: "button",
      "aria-label": "Resize column",
      className: cn(
        "invisible h-full group-hover:visible",
        // Make the handle invisible by default
        "w-[10px]",
        // Hitting area
        "flex items-center justify-center",
        // Center the handle
        "cursor-col-resize touch-none select-none",
        // Prevent selection and touch events
        "absolute top-0 right-0",
        // Position the handle
        "m-0 bg-zenth-base p-0",
        // Override the stratus button styles
        "focus-visible:ring-2 focus-visible:ring-zenth-brand"
        // Consistent keyboard focus styling
      ),
      children: /* @__PURE__ */ jsx41("span", { className: "h-5 w-[2px] rounded bg-zenth-hairline" })
    }
  );
});
var TableCheckCell = forwardRef21(
  ({
    checked,
    indeterminate,
    onCheckedChange,
    onValueChange,
    label,
    disabled,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx41(
      TableCell,
      {
        ref,
        ...props,
        className: cn("w-10 leading-none", props.className),
        children: /* @__PURE__ */ jsx41(
          Checkbox,
          {
            checked,
            indeterminate,
            onCheckedChange: (newChecked, eventDetails) => {
              onCheckedChange?.(newChecked, eventDetails);
              onValueChange?.(newChecked);
            },
            "aria-label": label ?? "Select row",
            disabled,
            className: "relative before:absolute before:-inset-3 before:content-['']"
          }
        )
      }
    );
  }
);
var TableCheckHead = forwardRef21(
  ({
    checked,
    indeterminate,
    onCheckedChange,
    onValueChange,
    label,
    disabled,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx41(
      TableHead,
      {
        ref,
        ...props,
        className: cn("w-10 leading-none", props.className),
        children: /* @__PURE__ */ jsx41(
          Checkbox,
          {
            checked,
            indeterminate,
            onCheckedChange: (newChecked, eventDetails) => {
              onCheckedChange?.(newChecked, eventDetails);
              onValueChange?.(newChecked);
            },
            "aria-label": label ?? "Select all rows",
            disabled,
            className: "relative before:absolute before:-inset-3 before:content-['']"
          }
        )
      }
    );
  }
);
TableRoot.displayName = "Table";
TableBody.displayName = "Table.Body";
TableHead.displayName = "Table.Head";
TableRow.displayName = "Table.Row";
TableCell.displayName = "Table.Cell";
TableFooter.displayName = "Table.Footer";
TableHeader.displayName = "Table.Header";
TableResizeHandle.displayName = "Table.ResizeHandle";
TableCheckCell.displayName = "Table.CheckCell";
TableCheckHead.displayName = "Table.CheckHead";
var Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Head: TableHead,
  Row: TableRow,
  Body: TableBody,
  Cell: TableCell,
  CheckCell: TableCheckCell,
  CheckHead: TableCheckHead,
  Footer: TableFooter,
  ResizeHandle: TableResizeHandle
});

// src/components/toast/toast.tsx
import {
  Toast as Toast2
} from "@base-ui/react/toast";
import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon as XIcon3
} from "@phosphor-icons/react/dist/ssr";
import { Fragment as Fragment10, jsx as jsx42, jsxs as jsxs25 } from "react/jsx-runtime";
var KUMO_TOAST_VARIANTS = {
  root: {
    classes: "rounded-lg border border-zenth-fill bg-zenth-control p-4 shadow-lg text-zenth-default",
    description: "Toast container with background, border, and shadow"
  },
  title: {
    classes: "text-[0.975rem] leading-5 font-medium text-zenth-default",
    description: "Toast title with primary text color"
  },
  description: {
    classes: "text-[0.925rem] leading-5 text-zenth-subtle",
    description: "Toast description with muted text color"
  },
  close: {
    classes: "absolute top-2 right-2 size-5 rounded text-zenth-subtle hover:bg-current/15",
    description: "Button-based close control with variant-aware hover tint"
  },
  variant: {
    default: {
      classes: "border-zenth-fill bg-zenth-base",
      description: "Default toast style"
    },
    success: {
      classes: "ring-[0.3px] ring-zenth-success bg-zenth-base [&_[data-toast-icon]]:text-zenth-success [&_[data-toast-title]]:text-zenth-success",
      description: "Success toast for confirmations and positive outcomes",
      icon: CheckCircleIcon
    },
    error: {
      classes: "ring-[0.3px] ring-zenth-danger bg-zenth-base [&_[data-toast-icon]]:text-zenth-danger [&_[data-toast-title]]:text-zenth-danger",
      description: "Error toast for critical issues",
      icon: WarningOctagonIcon
    },
    warning: {
      classes: "ring-[0.3px] ring-zenth-warning bg-zenth-base [&_[data-toast-icon]]:text-zenth-warning [&_[data-toast-title]]:text-zenth-warning",
      description: "Warning toast for cautionary messages",
      icon: WarningIcon
    },
    info: {
      classes: "ring-[0.3px] ring-zenth-info bg-zenth-control [&_[data-toast-icon]]:text-zenth-info [&_[data-toast-title]]:text-zenth-info",
      description: "Info toast for neutral informational messages",
      icon: InfoIcon
    }
  }
};
var KUMO_TOAST_DEFAULT_VARIANTS = {
  variant: "default"
};
function toastVariants({
  variant = KUMO_TOAST_DEFAULT_VARIANTS.variant
} = {}) {
  return cn(
    // Base styles for the toast surface
    "rounded-xl ring ring-zenth-line bg-clip-padding p-4 shadow-lg",
    // Apply variant styles from KUMO_TOAST_VARIANTS
    resolveVariant(
      KUMO_TOAST_VARIANTS.variant,
      variant,
      KUMO_TOAST_DEFAULT_VARIANTS.variant
    ).classes
  );
}
var KUMO_TOAST_AUTO_BUMP = Symbol("zenth-toast-auto-bump");
function withBumpIntent(options, autoBump) {
  return {
    ...options,
    // Keep `bump` operation-scoped instead of inheriting a previous value
    // through Base UI's partial update merge.
    bump: options.bump,
    [KUMO_TOAST_AUTO_BUMP]: autoBump
  };
}
function wrapManagerMethods(manager) {
  return {
    ...manager,
    add: (options) => {
      const existingToast = options.id ? manager.toasts?.find((toast) => toast.id === options.id) : void 0;
      if (existingToast) {
        if (existingToast.transitionStatus !== "ending") {
          const bumpOptions = options.timeout !== void 0 ? { timeout: options.timeout } : {};
          manager.update(existingToast.id, withBumpIntent(bumpOptions, true));
        }
        return existingToast.id;
      }
      return manager.add(withBumpIntent(options, true));
    },
    update: (id, options) => {
      return manager.update(
        id,
        typeof options === "function" ? (prevToast) => withBumpIntent(options(prevToast), false) : withBumpIntent(options, false)
      );
    },
    promise: (promise, options) => {
      return manager.promise(promise, {
        loading: withBumpIntent(options.loading, false),
        success: typeof options.success === "function" ? (data) => withBumpIntent(
          options.success(data),
          false
        ) : withBumpIntent(options.success, false),
        error: typeof options.error === "function" ? (error) => withBumpIntent(
          options.error(error),
          false
        ) : withBumpIntent(options.error, false)
      });
    }
  };
}
var useKumoToastManager = () => {
  const manager = Toast2.useToastManager();
  return {
    ...wrapManagerMethods(manager),
    toasts: manager.toasts
  };
};
var createKumoToastManager = () => {
  return wrapManagerMethods(Toast2.createToastManager());
};
function Toasty({
  children,
  container: containerProp,
  toastManager
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  return /* @__PURE__ */ jsxs25(Toast2.Provider, { toastManager, children: [
    children,
    /* @__PURE__ */ jsx42(Toast2.Portal, { container, children: /* @__PURE__ */ jsx42(Toast2.Viewport, { className: "fixed top-auto right-4 bottom-4 z-1 mx-auto flex w-[calc(100%-2rem)] sm:right-8 sm:bottom-8 sm:w-[340px]", children: /* @__PURE__ */ jsx42(ToastList, {}) }) })
  ] });
}
var ToastProvider = Toasty;
function getBumpAnimation(toast) {
  const updateKey = toast.updateKey ?? 0;
  const internalToast = toast;
  const shouldBump = toast.bump === true || toast.bump !== false && internalToast[KUMO_TOAST_AUTO_BUMP] === true && updateKey > 0;
  return shouldBump && (updateKey % 2 === 0 ? "zenth-animate-toast-bump-alternate" : "zenth-animate-toast-bump");
}
function ToastList() {
  const { toasts } = useKumoToastManager();
  return toasts.map((toast) => /* @__PURE__ */ jsx42(
    Toast2.Root,
    {
      toast,
      className: cn(
        "absolute right-0 bottom-0 left-auto z-[calc(1000-var(--toast-index))] mr-0 h-[var(--height)] w-full origin-bottom rounded-xl select-none motion-reduce:[transition-property:opacity]",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,height_0.15s]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-[ending-style]:opacity-0 data-[expanded]:h-[var(--toast-height)] data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--offset-y)))] data-[limited]:opacity-0 data-[starting-style]:[transform:translateY(150%)]",
        "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))] data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))] data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]"
      ),
      children: /* @__PURE__ */ jsxs25(
        "div",
        {
          "data-zenth-part": "surface",
          className: cn(
            "relative h-full w-full",
            toastVariants({ variant: toast.variant }),
            getBumpAnimation(toast)
          ),
          children: [
            /* @__PURE__ */ jsx42(ToastBackground, { variant: toast.variant }),
            /* @__PURE__ */ jsxs25(Toast2.Content, { className: "isolate flex flex-col gap-1 transition-opacity [transition-duration:250ms] data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100", children: [
              toast.content ?? /* @__PURE__ */ jsx42(Fragment10, { children: /* @__PURE__ */ jsxs25("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsx42(ToastIcon, { variant: toast.variant }),
                /* @__PURE__ */ jsxs25("div", { className: "flex flex-col gap-1 overflow-hidden", children: [
                  /* @__PURE__ */ jsx42(
                    Toast2.Title,
                    {
                      "data-toast-title": true,
                      className: "text-[0.975rem] leading-5 font-medium text-zenth-default"
                    }
                  ),
                  /* @__PURE__ */ jsx42(Toast2.Description, { className: "text-[0.925rem] leading-5 text-zenth-default/70" }),
                  !!toast.actions && /* @__PURE__ */ jsx42("div", { className: "mt-2 flex min-w-0 flex-nowrap gap-2 overflow-x-auto p-px", children: toast.actions.map((actionProps, idx) => /* @__PURE__ */ jsx42(Button, { ...actionProps }, idx)) })
                ] })
              ] }) }),
              /* @__PURE__ */ jsx42(
                Toast2.Close,
                {
                  "data-zenth-part": "close",
                  "aria-label": "Close",
                  render: /* @__PURE__ */ jsx42(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      shape: "square",
                      "aria-label": "Close",
                      className: cn(
                        "absolute top-2 right-2 size-5 rounded text-zenth-subtle hover:bg-current/15",
                        toast.variant && TOAST_CLOSE_CLASSES[toast.variant]
                      ),
                      icon: /* @__PURE__ */ jsx42(XIcon3, { className: "h-3 w-3" })
                    }
                  )
                }
              )
            ] })
          ]
        }
      )
    },
    toast.id
  ));
}
var TOAST_CLOSE_CLASSES = {
  success: "text-zenth-success",
  error: "text-zenth-danger",
  warning: "text-zenth-warning",
  info: "text-zenth-info"
};
var TOAST_BACKGROUND_CLASSES = {
  success: "bg-zenth-success-tint/20",
  error: "bg-zenth-danger-tint/50",
  warning: "bg-zenth-warning-tint/50",
  info: "bg-zenth-info-tint/50"
};
function ToastBackground({ variant }) {
  const background = variant && TOAST_BACKGROUND_CLASSES[variant];
  return /* @__PURE__ */ jsx42(
    "div",
    {
      className: cn(
        "absolute inset-0 rounded-xl bg-zenth-base/90",
        background
      )
    }
  );
}
function ToastIcon({ variant }) {
  if (!variant || variant === "default")
    return null;
  const variantConfig = resolveVariant(
    KUMO_TOAST_VARIANTS.variant,
    variant,
    KUMO_TOAST_DEFAULT_VARIANTS.variant
  );
  if (!("icon" in variantConfig))
    return null;
  const Icon = variantConfig.icon;
  return /* @__PURE__ */ jsx42(Icon, { "data-toast-icon": true, className: "mt-0.5 h-4 w-4 shrink-0", weight: "fill" });
}

// src/components/toast/index.ts
import { Toast as Toast3 } from "@base-ui/react/toast";

// src/components/popover/popover.tsx
import { Popover as PopoverBase } from "@base-ui/react/popover";
import { jsx as jsx43, jsxs as jsxs26 } from "react/jsx-runtime";
var KUMO_POPOVER_VARIANTS = {
  side: {
    top: {
      classes: "",
      description: "Popover appears above the trigger"
    },
    bottom: {
      classes: "",
      description: "Popover appears below the trigger"
    },
    left: {
      classes: "",
      description: "Popover appears to the left of the trigger"
    },
    right: {
      classes: "",
      description: "Popover appears to the right of the trigger"
    }
  }
};
var KUMO_POPOVER_DEFAULT_VARIANTS = {
  side: "bottom"
};
function PopoverRoot({ children, ...props }) {
  return /* @__PURE__ */ jsx43(PopoverBase.Root, { ...props, children });
}
PopoverRoot.displayName = "Popover";
function PopoverTrigger({
  children,
  className,
  asChild,
  render,
  ...props
}) {
  const resolvedRender = render ?? (asChild ? children : void 0);
  return /* @__PURE__ */ jsx43(
    PopoverBase.Trigger,
    {
      "data-zenth-component": "Popover",
      "data-zenth-part": "trigger",
      className,
      render: resolvedRender,
      ...props,
      children: asChild ? void 0 : children
    }
  );
}
PopoverTrigger.displayName = "Popover.Trigger";
function PopoverPortal({
  container: containerProp,
  ...props
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  return /* @__PURE__ */ jsx43(PopoverBase.Portal, { container, ...props });
}
PopoverPortal.displayName = "Popover.Portal";
function PopoverBackdrop(props) {
  return /* @__PURE__ */ jsx43(PopoverBase.Backdrop, { ...props });
}
PopoverBackdrop.displayName = "Popover.Backdrop";
function PopoverPositioner({
  side = KUMO_POPOVER_DEFAULT_VARIANTS.side,
  sideOffset = 8,
  ...props
}) {
  return /* @__PURE__ */ jsx43(PopoverBase.Positioner, { side, sideOffset, ...props });
}
PopoverPositioner.displayName = "Popover.Positioner";
var popupBaseClassName = "flex flex-col rounded-lg bg-zenth-base px-4 py-3 text-sm text-zenth-default shadow-md outline outline-zenth-line zenth-popover-popup";
function PopoverPopup({ className, ...props }) {
  return /* @__PURE__ */ jsx43(
    PopoverBase.Popup,
    {
      "data-zenth-component": "Popover",
      "data-zenth-part": "popup",
      className: (state) => cn(
        popupBaseClassName,
        "origin-(--transform-origin) transition-[transform,scale,opacity] duration-150",
        "data-starting-style:scale-90 data-starting-style:opacity-0",
        "data-ending-style:scale-90 data-ending-style:opacity-0",
        "data-instant:duration-0",
        typeof className === "function" ? className(state) : className
      ),
      ...props
    }
  );
}
PopoverPopup.displayName = "Popover.Popup";
function PopoverArrow({
  className,
  children = /* @__PURE__ */ jsx43(ArrowSvg2, {}),
  ...props
}) {
  return /* @__PURE__ */ jsx43(
    PopoverBase.Arrow,
    {
      "data-zenth-component": "Popover",
      "data-zenth-part": "arrow",
      className: (state) => cn(
        "flex",
        "data-[side=bottom]:-top-2",
        "data-[side=left]:right-[-13px] data-[side=left]:rotate-90",
        "data-[side=right]:left-[-13px] data-[side=right]:-rotate-90",
        "data-[side=top]:-bottom-2 data-[side=top]:rotate-180",
        typeof className === "function" ? className(state) : className
      ),
      ...props,
      children
    }
  );
}
PopoverArrow.displayName = "Popover.Arrow";
function PopoverViewport(props) {
  return /* @__PURE__ */ jsx43(PopoverBase.Viewport, { ...props });
}
PopoverViewport.displayName = "Popover.Viewport";
function PopoverContent({
  children,
  side = KUMO_POPOVER_DEFAULT_VARIANTS.side,
  align = "center",
  sideOffset = 8,
  alignOffset = 0,
  positionMethod = "absolute",
  anchor,
  className,
  container: containerProp
}) {
  return /* @__PURE__ */ jsx43(PopoverPortal, { container: containerProp, children: /* @__PURE__ */ jsx43(
    PopoverPositioner,
    {
      anchor,
      align,
      alignOffset,
      side,
      sideOffset,
      positionMethod,
      children: /* @__PURE__ */ jsxs26(
        PopoverBase.Popup,
        {
          "data-zenth-component": "Popover",
          "data-zenth-part": "popup",
          className: cn(
            popupBaseClassName,
            "transition-opacity duration-150",
            "data-starting-style:opacity-0",
            "data-ending-style:opacity-0",
            "data-instant:duration-0",
            className
          ),
          children: [
            /* @__PURE__ */ jsx43(PopoverArrow, {}),
            children
          ]
        }
      )
    }
  ) });
}
PopoverContent.displayName = "Popover.Content";
function PopoverTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx43(
    PopoverBase.Title,
    {
      className: cn("m-0 text-base leading-6 font-medium", className),
      ...props
    }
  );
}
PopoverTitle.displayName = "Popover.Title";
function PopoverDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx43(
    PopoverBase.Description,
    {
      className: cn("m-0 text-base leading-6 text-zenth-subtle", className),
      ...props
    }
  );
}
PopoverDescription.displayName = "Popover.Description";
function PopoverClose({
  children,
  className,
  asChild,
  render,
  ...props
}) {
  const resolvedRender = render ?? (asChild ? children : void 0);
  return /* @__PURE__ */ jsx43(PopoverBase.Close, { className, render: resolvedRender, ...props, children: asChild ? void 0 : children });
}
PopoverClose.displayName = "Popover.Close";
function ArrowSvg2(props) {
  return /* @__PURE__ */ jsxs26("svg", { width: "20", height: "10", viewBox: "0 0 20 10", fill: "none", ...props, children: [
    /* @__PURE__ */ jsx43(
      "path",
      {
        d: "M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z",
        className: "fill-zenth-base"
      }
    ),
    /* @__PURE__ */ jsx43(
      "path",
      {
        d: "M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z",
        className: "fill-zenth-arrow-edge"
      }
    ),
    /* @__PURE__ */ jsx43(
      "path",
      {
        d: "M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z",
        className: "fill-zenth-arrow-stroke"
      }
    )
  ] });
}
var Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Backdrop: PopoverBackdrop,
  Positioner: PopoverPositioner,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Viewport: PopoverViewport,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose
});

// src/components/sensitive-input/sensitive-input.tsx
import { Eye, EyeSlash } from "@phosphor-icons/react";
import {
  forwardRef as forwardRef22,
  useCallback as useCallback7,
  useId as useId3,
  useRef as useRef9,
  useState as useState8
} from "react";
import { Input as BaseInput2 } from "@base-ui/react/input";
import { Fragment as Fragment11, jsx as jsx44, jsxs as jsxs27 } from "react/jsx-runtime";
var KUMO_SENSITIVE_INPUT_VARIANTS = KUMO_INPUT_VARIANTS;
var KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS = {
  size: "base",
  variant: "default"
};
var SensitiveInput = forwardRef22(
  ({
    value: controlledValue,
    defaultValue = "",
    onChange,
    onValueChange,
    onCopy,
    size = KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS.size,
    variant: variantProp,
    disabled = false,
    readOnly = false,
    id,
    autoComplete = "off",
    className,
    label,
    labelTooltip,
    description,
    error,
    required,
    ...inputProps
  }, ref) => {
    if (false) {
      console.warn(
        '[Kumo SensitiveInput]: variant="error" is deprecated. Error styling is now automatically applied when the `error` prop is truthy. Simply remove the variant prop and pass an error message instead.'
      );
    }
    const variant = variantProp ?? (error ? "error" : "default");
    const ariaLabelFallback = typeof label === "string" ? label : "Sensitive value";
    const isControlled = controlledValue !== void 0;
    const [internalValue, setInternalValue] = useState8(defaultValue);
    const value = isControlled ? controlledValue : internalValue;
    const hasValue = value.length > 0;
    const [mode, setMode] = useState8(
      () => hasValue ? "masked" : "empty"
    );
    const { copied, runCopy } = useCopyFeedback();
    const inputRef = useRef9(null);
    const containerRef = useRef9(null);
    const liveRegionId = useId3();
    const generatedId = useId3();
    const inputId = id ?? generatedId;
    const maskedInstructionId = useId3();
    const mergedRef = useCallback7(
      (node) => {
        inputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );
    const copyToClipboard = useCallback7(
      async (e) => {
        e.stopPropagation();
        const didCopy = await runCopy(
          async (isCurrent) => {
            try {
              if (typeof navigator !== "undefined" && navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
                await navigator.clipboard.writeText(value);
                return;
              }
            } catch {
            }
            if (!isCurrent())
              return;
            if (typeof document === "undefined") {
              throw new Error("Clipboard API is unavailable");
            }
            const textarea = document.createElement("textarea");
            textarea.value = value;
            textarea.setAttribute("readonly", "");
            textarea.style.position = "absolute";
            textarea.style.left = "-9999px";
            document.body.appendChild(textarea);
            const selection = document.getSelection();
            const previousRange = selection?.rangeCount ? selection.getRangeAt(0) : null;
            textarea.select();
            try {
              if (!document.execCommand("copy")) {
                throw new Error("Copy command was not accepted");
              }
            } finally {
              document.body.removeChild(textarea);
              if (previousRange) {
                selection?.removeAllRanges();
                selection?.addRange(previousRange);
              }
            }
          },
          (error2) => console.warn("Clipboard copy failed", error2)
        );
        if (didCopy) {
          onCopy?.();
        }
      },
      [value, onCopy, runCopy]
    );
    const prevHasValueRef = useRef9(hasValue);
    if (prevHasValueRef.current !== hasValue) {
      prevHasValueRef.current = hasValue;
      if (!hasValue && mode === "masked") {
        setMode("empty");
      }
    }
    const handleContainerClick = useCallback7(
      (e) => {
        if (disabled)
          return;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const isClickInsideContainer = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
          if (!isClickInsideContainer)
            return;
        }
        if (mode === "masked" && hasValue) {
          setMode("revealed");
          if (!readOnly) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }
      },
      [mode, hasValue, disabled, readOnly]
    );
    const handleToggleVisibility = useCallback7(
      (e) => {
        e.stopPropagation();
        if (mode === "revealed") {
          setMode("masked");
        } else if (mode === "empty" && hasValue) {
          setMode("revealed");
        }
      },
      [mode, hasValue]
    );
    const handleChange = useCallback7(
      (e) => {
        const newValue = e.target.value;
        if (!isControlled) {
          setInternalValue(newValue);
        }
        if (mode === "empty" && newValue.length > 0) {
          setMode("revealed");
        }
        onChange?.(e);
        onValueChange?.(newValue);
      },
      [isControlled, onChange, onValueChange, mode]
    );
    const handleBlur = useCallback7(
      (e) => {
        if (containerRef.current && e.relatedTarget instanceof Node && containerRef.current.contains(e.relatedTarget)) {
          return;
        }
        if (hasValue) {
          setMode("masked");
        }
      },
      [hasValue]
    );
    const handleContainerKeyDown = useCallback7(
      (e) => {
        if (disabled)
          return;
        if (mode === "masked" && hasValue) {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setMode("revealed");
            if (!readOnly) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }
      },
      [mode, hasValue, disabled, readOnly]
    );
    const handleInputKeyDown = useCallback7(
      (e) => {
        if (mode === "revealed" && e.key === "Escape") {
          setMode("masked");
          setTimeout(() => containerRef.current?.focus(), 0);
        }
      },
      [mode]
    );
    const isMaskedWithValue = mode === "masked" && hasValue;
    const showEyeButton = !disabled && (mode === "revealed" || mode === "empty" && hasValue);
    const iconSize = size === "xs" || size === "sm" ? "size-3" : "size-4";
    const containerClassName = cn(
      inputVariants({ size, variant, parentFocusIndicator: true }),
      "group/container relative flex w-full items-center",
      // Show browser-native focus outline on container when child input is focused
      "focus-within:outline-2 focus-within:outline-zenth-focus",
      isMaskedWithValue && !disabled && "cursor-pointer",
      disabled && "cursor-not-allowed",
      className
    );
    const containerContent = /* @__PURE__ */ jsxs27(Fragment11, { children: [
      /* @__PURE__ */ jsx44(
        BaseInput2,
        {
          ref: mergedRef,
          id: inputId,
          type: mode === "revealed" ? "text" : "password",
          value,
          onChange: handleChange,
          onBlur: handleBlur,
          onKeyDown: handleInputKeyDown,
          disabled,
          readOnly: readOnly || isMaskedWithValue,
          autoComplete,
          tabIndex: isMaskedWithValue ? -1 : 0,
          className: cn(
            "zenth-input-placeholder w-full border-0 bg-transparent p-0 text-zenth-default ring-0 outline-none disabled:cursor-not-allowed disabled:text-zenth-subtle",
            size === "xs" && "pr-5",
            size === "sm" && "pr-6",
            size === "base" && "pr-8",
            size === "lg" && "pr-10",
            isMaskedWithValue && "pointer-events-none text-transparent"
          ),
          "aria-hidden": isMaskedWithValue,
          ...inputProps
        }
      ),
      /* @__PURE__ */ jsx44(
        "span",
        {
          className: cn(
            "pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden select-none",
            // Match input pr padding (space for icon)
            size === "xs" && "right-5",
            size === "sm" && "right-6",
            size === "base" && "right-8",
            size === "lg" && "right-10",
            // Match the padding from inputVariants
            size === "xs" && "px-1.5",
            size === "sm" && "px-2",
            size === "base" && "px-3",
            size === "lg" && "px-4",
            // Hidden when not masked
            !isMaskedWithValue && "invisible",
            // When masked: enable pointer events
            isMaskedWithValue && "pointer-events-auto",
            // Text color - use text-zenth-default to contrast with bg-zenth-control input background
            "text-zenth-default",
            // Hover state - pure CSS, no React state (group for children)
            "group/mask"
          ),
          "aria-hidden": "true",
          children: /* @__PURE__ */ jsxs27("span", { className: "relative", children: [
            /* @__PURE__ */ jsx44(
              "span",
              {
                className: cn(
                  isMaskedWithValue && !disabled && "group-focus-within/container:invisible group-hover/mask:invisible"
                ),
                children: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              }
            ),
            isMaskedWithValue && !disabled && /* @__PURE__ */ jsx44("span", { className: "invisible absolute top-0 left-0 whitespace-nowrap text-zenth-subtle group-focus-within/container:visible group-hover/mask:visible", children: "Click to reveal" })
          ] })
        }
      ),
      /* @__PURE__ */ jsx44(
        "button",
        {
          type: "button",
          "data-zenth-component": "SensitiveInput",
          "data-zenth-part": "toggle-visibility",
          onClick: handleToggleVisibility,
          onKeyDown: (e) => e.stopPropagation(),
          "aria-label": mode === "revealed" ? "Hide value" : "Reveal value",
          tabIndex: showEyeButton ? 0 : -1,
          className: cn(
            "absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer text-zenth-subtle hover:text-zenth-default focus:text-zenth-default focus:ring-zenth-focus/50 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-zenth-brand",
            // Defensive styles to prevent global CSS pollution (e.g., button { background: gray })
            "m-0 inline-flex h-auto min-h-0 items-center justify-center border-none bg-transparent p-0 shadow-none",
            // Match right padding from inputVariants
            size === "xs" && "right-1.5",
            size === "sm" && "right-2",
            size === "base" && "right-3",
            size === "lg" && "right-4",
            iconSize,
            !showEyeButton && "pointer-events-none opacity-0"
          ),
          children: mode === "revealed" ? /* @__PURE__ */ jsx44(EyeSlash, { className: "size-full" }) : /* @__PURE__ */ jsx44(Eye, { className: "size-full" })
        }
      ),
      hasValue && !disabled && /* @__PURE__ */ jsx44(
        "button",
        {
          type: "button",
          "data-zenth-component": "SensitiveInput",
          "data-zenth-part": "copy",
          onClick: copyToClipboard,
          onKeyDown: (e) => e.stopPropagation(),
          "aria-label": copied ? "Copied" : "Copy to clipboard",
          className: cn(
            "absolute -top-px right-2 -translate-y-full cursor-pointer rounded-t-md bg-zenth-brand px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-focus-within/container:opacity-100 group-hover/container:opacity-100 hover:brightness-120 focus:ring-zenth-focus/50 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
            // Defensive styles to prevent global CSS pollution
            "m-0 h-auto min-h-0 border-none shadow-none"
          ),
          children: copied ? "Copied" : "Copy"
        }
      )
    ] });
    const input = /* @__PURE__ */ jsxs27("div", { children: [
      isMaskedWithValue ? /* @__PURE__ */ jsx44(
        "div",
        {
          ref: containerRef,
          role: "button",
          "data-zenth-component": "SensitiveInput",
          "data-zenth-part": "masked-container",
          tabIndex: disabled ? -1 : 0,
          className: containerClassName,
          onClick: handleContainerClick,
          onKeyDown: handleContainerKeyDown,
          "aria-label": `${ariaLabelFallback}, masked.`,
          "aria-describedby": `${maskedInstructionId} ${liveRegionId}`,
          "aria-disabled": disabled,
          children: containerContent
        }
      ) : /* @__PURE__ */ jsx44("div", { ref: containerRef, className: containerClassName, children: containerContent }),
      isMaskedWithValue && /* @__PURE__ */ jsx44("span", { id: maskedInstructionId, className: "sr-only", children: "Click or press Enter to reveal." }),
      /* @__PURE__ */ jsxs27("span", { id: liveRegionId, className: "sr-only", "aria-live": "polite", children: [
        mode === "masked" && hasValue && "Value hidden",
        copied && "Copied to clipboard"
      ] })
    ] });
    if (label) {
      return /* @__PURE__ */ jsx44(
        Field,
        {
          label,
          required,
          labelTooltip,
          description,
          error: error ? typeof error === "string" ? { message: error, match: true } : error : void 0,
          children: input
        }
      );
    }
    return input;
  }
);
SensitiveInput.displayName = "SensitiveInput";

// src/components/radio/radio.tsx
import {
  Children as Children5,
  forwardRef as forwardRef23,
  createContext as createContext12,
  isValidElement as isValidElement7,
  useContext as useContext12
} from "react";
import { Fieldset as Fieldset3 } from "@base-ui/react/fieldset";
import {
  RadioGroup as BaseRadioGroup
} from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { jsx as jsx45, jsxs as jsxs28 } from "react/jsx-runtime";
var KUMO_RADIO_VARIANTS = {
  variant: {
    default: {
      classes: "ring-zenth-hairline",
      description: "Default radio appearance"
    },
    error: {
      classes: "ring-zenth-danger",
      description: "Error state for validation failures"
    }
  },
  appearance: {
    default: {
      classes: "",
      description: "Standard inline radio item"
    },
    card: {
      classes: "rounded-lg border border-zenth-hairline bg-zenth-base p-3 hover:not-has-data-checked:bg-zenth-elevated has-data-checked:border-zenth-interact has-data-checked:bg-zenth-tint",
      description: "Choice card appearance with border, padding, and highlighted selection state"
    },
    segmented: {
      classes: "group relative z-0 my-0 mr-0 -ml-px first:ml-0 inline-flex h-8.5 shrink-0 cursor-pointer items-center border-r last:border-r-0 border-zenth-line/60 bg-transparent px-3 first:pl-2.75 last:pr-2.75 first:rounded-l-lg last:rounded-r-lg text-sm font-medium whitespace-nowrap text-zenth-default select-none has-data-checked:text-zenth-inverse has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-zenth-brand before:absolute before:-z-10 before:left-0 first:before:-left-px before:-right-px before:-inset-y-px first:before:rounded-l-[9px] last:before:rounded-r-[9px] hover:not-has-data-disabled:not-has-data-checked:before:bg-zenth-contrast/7 has-data-checked:before:bg-zenth-contrast",
      description: "Compact grouped-button appearance for short, mutually exclusive options"
    }
  }
};
var KUMO_RADIO_DEFAULT_VARIANTS = {
  variant: "default",
  appearance: "default"
};
function radioVariants({
  variant = KUMO_RADIO_DEFAULT_VARIANTS.variant,
  appearance = KUMO_RADIO_DEFAULT_VARIANTS.appearance
} = {}) {
  return cn(
    resolveVariant(
      KUMO_RADIO_VARIANTS.variant,
      variant,
      KUMO_RADIO_DEFAULT_VARIANTS.variant
    ).classes,
    resolveVariant(
      KUMO_RADIO_VARIANTS.appearance,
      appearance,
      KUMO_RADIO_DEFAULT_VARIANTS.appearance
    ).classes
  );
}
var RadioGroupContext = createContext12({
  controlPosition: void 0,
  appearance: "default",
  orientation: null
});
function _RadioItem({
  className,
  disabled,
  variant = "default",
  appearance: appearanceProp,
  label,
  description,
  value
}, ref) {
  const {
    controlPosition,
    appearance: groupAppearance,
    orientation
  } = useContext12(RadioGroupContext);
  const appearance = groupAppearance === "segmented" ? groupAppearance : appearanceProp ?? groupAppearance;
  const isCard = appearance === "card";
  const isJoined = isCard && groupAppearance === "card" && orientation !== null;
  const effectiveControlPosition = controlPosition ?? (isCard ? "end" : "start");
  if (appearance === "segmented") {
    return /* @__PURE__ */ jsxs28(
      "label",
      {
        "data-zenth-component": "Radio",
        "data-zenth-part": "item-label",
        className: cn(
          "group relative z-0 my-0 mr-0 -ml-px inline-flex h-8.5 shrink-0 cursor-pointer items-center border-r border-zenth-line/60 bg-transparent first:ml-0 last:border-r-0",
          "px-3 text-sm font-medium whitespace-nowrap text-zenth-default select-none first:rounded-l-lg first:pl-2.75 last:rounded-r-lg last:pr-2.75 has-data-checked:text-zenth-inverse has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
          "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-zenth-brand",
          "before:absolute before:-inset-y-px before:-right-px before:left-0 before:-z-10 first:before:-left-px first:before:rounded-l-[9px] last:before:rounded-r-[9px] hover:not-has-data-disabled:not-has-data-checked:before:bg-zenth-contrast/7 has-data-checked:before:bg-zenth-contrast",
          variant === "error" && "ring ring-zenth-danger hover:not-has-data-disabled:ring-zenth-danger has-data-checked:ring-zenth-danger",
          className
        ),
        children: [
          /* @__PURE__ */ jsx45(
            BaseRadio.Root,
            {
              ref,
              "data-zenth-component": "Radio",
              "data-zenth-part": "item",
              value,
              disabled,
              className: "sr-only"
            }
          ),
          /* @__PURE__ */ jsx45("span", { children: label })
        ]
      }
    );
  }
  if (isCard) {
    const controlAtStart = effectiveControlPosition === "start";
    return /* @__PURE__ */ jsxs28(
      "label",
      {
        "data-zenth-component": "Radio",
        "data-zenth-part": "item-label",
        className: cn(
          "group relative m-0 flex items-start gap-3 bg-zenth-base p-3 has-data-checked:bg-zenth-tint",
          isJoined ? cn(
            // bg-clip-padding keeps the checked tint from darkening the
            // translucent dividers.
            "border-b border-zenth-line bg-clip-padding last:border-b-0",
            // Two-column grid: the left column draws the column divider
            // (unless it's a lone last item), and the last row drops its
            // bottom divider.
            orientation === "horizontal" && "odd:border-r [&:last-child:nth-child(odd)]:border-r-0 [&:nth-last-child(2):nth-child(odd)]:border-b-0"
          ) : "rounded-lg border border-zenth-hairline has-data-checked:border-zenth-interact",
          controlAtStart && "flex-row-reverse",
          variant === "error" && cn(
            "has-data-checked:bg-zenth-base",
            !isJoined && "border-zenth-danger has-data-checked:border-zenth-danger"
          ),
          disabled ? "cursor-not-allowed opacity-50" : cn(
            "cursor-pointer has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50",
            // The checked row keeps its tint while hovered.
            variant !== "error" && "hover:not-has-data-disabled:not-has-data-checked:bg-zenth-elevated"
          ),
          className
        ),
        children: [
          /* @__PURE__ */ jsxs28("div", { className: "flex min-w-0 flex-1 flex-col gap-0.5", children: [
            /* @__PURE__ */ jsx45("span", { className: "text-base font-medium text-zenth-default", children: label }),
            description && /* @__PURE__ */ jsx45("span", { className: "text-sm leading-snug text-pretty text-zenth-subtle", children: description })
          ] }),
          /* @__PURE__ */ jsx45(
            BaseRadio.Root,
            {
              ref,
              "data-zenth-component": "Radio",
              "data-zenth-part": "item",
              value,
              disabled,
              className: cn(
                "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-0 bg-zenth-base ring focus:ring-zenth-focus focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand",
                variant === "error" ? "ring-zenth-danger" : "ring-zenth-line",
                !disabled && variant !== "error" && "group-hover:ring-zenth-hairline focus-visible:outline-offset-3",
                !disabled && variant === "error" && "focus-visible:outline-offset-3",
                "data-checked:bg-zenth-contrast"
              ),
              children: /* @__PURE__ */ jsx45(
                BaseRadio.Indicator,
                {
                  keepMounted: true,
                  className: "flex items-center justify-center",
                  children: /* @__PURE__ */ jsx45("span", { className: "h-2 w-2 rounded-full bg-zenth-base" })
                }
              )
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs28(
    "label",
    {
      "data-zenth-component": "Radio",
      "data-zenth-part": "item-label",
      className: cn(
        "group relative m-0 inline-flex items-start gap-2",
        // "start" (default): radio before label
        // "end": label before radio using flex-row-reverse
        effectiveControlPosition === "end" && "flex-row-reverse justify-end",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className
      ),
      children: [
        /* @__PURE__ */ jsx45(
          BaseRadio.Root,
          {
            ref,
            "data-zenth-component": "Radio",
            "data-zenth-part": "item",
            value,
            disabled,
            className: cn(
              "relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-0 bg-zenth-base ring after:absolute after:-inset-x-3 after:-inset-y-2 focus:outline-hidden",
              variant === "error" ? "ring-zenth-danger" : "ring-zenth-line",
              !disabled && variant !== "error" && "group-hover:ring-zenth-hairline focus:ring-2 focus:ring-zenth-focus focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:outline-offset-3",
              !disabled && variant === "error" && "focus:ring-2 focus:ring-zenth-focus focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:outline-offset-3",
              "data-checked:bg-zenth-contrast"
            ),
            children: /* @__PURE__ */ jsx45(
              BaseRadio.Indicator,
              {
                keepMounted: true,
                className: "flex items-center justify-center",
                children: /* @__PURE__ */ jsx45("span", { className: "h-2 w-2 rounded-full bg-zenth-base" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsx45("span", { className: "text-base text-zenth-default", children: label })
      ]
    }
  );
}
var RadioItem = forwardRef23(_RadioItem);
RadioItem.displayName = "Radio.Item";
function RadioLegend({ children, className }) {
  return /* @__PURE__ */ jsx45(
    Fieldset3.Legend,
    {
      className: cn("text-base font-medium text-zenth-default", className),
      children
    }
  );
}
RadioLegend.displayName = "Radio.Legend";
function RadioGroup({
  legend,
  children,
  orientation = "vertical",
  appearance = "default",
  error,
  description,
  defaultValue,
  value,
  onValueChange,
  disabled,
  controlPosition,
  name,
  className
}) {
  const segmentedChildren = appearance === "segmented" ? Children5.toArray(children) : null;
  const composableLegends = segmentedChildren?.filter(
    (child) => isValidElement7(child) && child.type === RadioLegend
  );
  const itemChildren = segmentedChildren ? segmentedChildren.filter(
    (child) => !(isValidElement7(child) && child.type === RadioLegend)
  ) : children;
  return /* @__PURE__ */ jsx45(
    RadioGroupContext.Provider,
    {
      value: { controlPosition, appearance, orientation },
      children: /* @__PURE__ */ jsx45(
        BaseRadioGroup,
        {
          defaultValue,
          value,
          onValueChange: (newValue, eventDetails) => onValueChange?.(newValue, eventDetails),
          disabled,
          name,
          children: /* @__PURE__ */ jsxs28(
            Fieldset3.Root,
            {
              disabled,
              className: cn(
                "flex flex-col p-0",
                // Card and segmented groups match Field's label-to-control gap.
                appearance === "card" || appearance === "segmented" ? "gap-2" : "gap-4",
                className
              ),
              children: [
                legend && /* @__PURE__ */ jsx45(Fieldset3.Legend, { className: "text-base font-medium text-zenth-default", children: legend }),
                composableLegends,
                /* @__PURE__ */ jsx45(
                  "div",
                  {
                    "data-zenth-component": "Radio",
                    "data-zenth-part": "items",
                    className: cn(
                      appearance === "segmented" ? "inline-flex w-max flex-row flex-nowrap items-center self-start rounded-lg bg-zenth-control shadow-xs ring ring-zenth-line" : orientation === "vertical" ? appearance === "card" ? "flex flex-col overflow-hidden rounded-lg ring ring-zenth-line" : "flex flex-col gap-2" : appearance === "card" ? "grid grid-cols-2 overflow-hidden rounded-lg bg-zenth-base ring ring-zenth-line" : "flex flex-row flex-wrap gap-2"
                    ),
                    children: itemChildren
                  }
                ),
                error && /* @__PURE__ */ jsx45("p", { className: "text-sm text-zenth-danger", children: error }),
                description && /* @__PURE__ */ jsx45("p", { className: "text-sm leading-snug text-pretty text-zenth-subtle", children: description })
              ]
            }
          )
        }
      )
    }
  );
}
RadioGroup.displayName = "Radio.Group";
var Radio = Object.assign(RadioGroup, {
  Item: RadioItem,
  Group: RadioGroup,
  Legend: RadioLegend
});

// src/components/command-palette/command-palette.tsx
import {
  useRef as useRef10,
  useCallback as useCallback8,
  createContext as createContext13,
  useContext as useContext13,
  forwardRef as forwardRef24
} from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { Dialog as DialogBase2 } from "@base-ui/react/dialog";
import {
  MagnifyingGlassIcon,
  ArrowRightIcon,
  ArrowSquareOutIcon,
  CaretRightIcon as CaretRightIcon3
} from "@phosphor-icons/react";
import { Fragment as Fragment12, jsx as jsx46, jsxs as jsxs29 } from "react/jsx-runtime";
var DialogContext = createContext13({});
function Dialog2({
  open,
  onOpenChange,
  onBackdropClick,
  children,
  container: containerProp
}) {
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  const handleBackdropClick = (e) => {
    if (onBackdropClick) {
      onBackdropClick(e);
    } else {
      onOpenChange(false);
    }
  };
  const handleClose = useCallback8(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  return /* @__PURE__ */ jsx46(DialogBase2.Root, { open, onOpenChange, modal: true, children: /* @__PURE__ */ jsxs29(DialogBase2.Portal, { container, children: [
    /* @__PURE__ */ jsx46(
      DialogBase2.Backdrop,
      {
        className: "fixed inset-0 bg-zenth-overlay opacity-80 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
        onClick: handleBackdropClick
      }
    ),
    /* @__PURE__ */ jsx46(
      LayerCard2,
      {
        render: /* @__PURE__ */ jsx46(DialogBase2.Popup, {}),
        className: cn(
          "fixed top-[10vh] left-1/2 w-full max-w-2xl -translate-x-1/2",
          "overflow-hidden rounded-lg",
          "duration-150 data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0"
        ),
        style: {
          transitionProperty: "scale, opacity",
          transitionTimingFunction: "var(--default-transition-timing-function)"
        },
        children: /* @__PURE__ */ jsx46(DialogContext.Provider, { value: { onClose: handleClose }, children })
      }
    )
  ] }) });
}
function Root4({
  open,
  onOpenChange,
  onBackdropClick,
  children,
  items,
  value,
  onValueChange,
  onItemHighlighted,
  itemToStringValue,
  filter,
  onSelect,
  getSelectableItems,
  container
}) {
  return /* @__PURE__ */ jsx46(
    Dialog2,
    {
      open,
      onOpenChange,
      onBackdropClick,
      container,
      children: /* @__PURE__ */ jsx46(
        Panel,
        {
          items,
          value,
          onValueChange,
          onItemHighlighted,
          itemToStringValue,
          filter,
          open,
          onSelect,
          getSelectableItems,
          children
        }
      )
    }
  );
}
function InputHeader({
  children,
  leading,
  trailing
}) {
  return /* @__PURE__ */ jsxs29("div", { className: "flex items-center gap-3 bg-zenth-base px-4 py-3 focus-within:ring-2 focus-within:ring-zenth-brand", children: [
    leading ?? /* @__PURE__ */ jsx46(
      MagnifyingGlassIcon,
      {
        className: "h-4 w-4 text-zenth-subtle",
        weight: "bold"
      }
    ),
    children,
    trailing
  ] });
}
var List2 = forwardRef24(function List3({ children, className }, ref) {
  return /* @__PURE__ */ jsx46(
    "div",
    {
      ref,
      className: cn(
        "relative min-h-0 flex-1 scroll-py-2 overflow-y-auto rounded-b-lg bg-zenth-base px-2 py-2 ring-1 ring-zenth-hairline",
        className
      ),
      children
    }
  );
});
List2.displayName = "CommandPalette.List";
function Group3({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx46(Autocomplete.Group, { className: cn("space-y-0.5", className), ...props, children });
}
function GroupLabel3({
  children,
  className
}) {
  return /* @__PURE__ */ jsx46(
    Autocomplete.GroupLabel,
    {
      className: cn(
        "mb-2 px-2 pt-1 text-xs font-semibold text-zenth-subtle",
        className
      ),
      children
    }
  );
}
function Item2({
  value,
  disabled,
  children,
  className,
  onClick
}) {
  return /* @__PURE__ */ jsx46(
    Autocomplete.Item,
    {
      value,
      disabled,
      onClick,
      className: cn(
        "group flex w-full items-center gap-3 px-2 py-1.5 text-left text-base transition-colors",
        "cursor-pointer data-[highlighted]:bg-zenth-overlay",
        "rounded-lg",
        disabled && "cursor-default opacity-50",
        className
      ),
      children
    }
  );
}
function Empty2({ children }) {
  return /* @__PURE__ */ jsx46(Autocomplete.Empty, { children: /* @__PURE__ */ jsx46("div", { className: "p-8 text-center", children: /* @__PURE__ */ jsx46("p", { className: "text-zenth-subtle", children: children ?? "No results found" }) }) });
}
function Loading({ children }) {
  return /* @__PURE__ */ jsx46("div", { className: "flex items-center justify-center p-8", children: children ?? /* @__PURE__ */ jsx46(Loader, { size: 24 }) });
}
function Footer({ children }) {
  return /* @__PURE__ */ jsx46("div", { className: "flex items-center justify-between rounded-b-lg bg-zenth-elevated px-4 py-3 text-xs text-zenth-subtle", children });
}
function HighlightedText({
  text,
  highlights,
  className
}) {
  if (!highlights || highlights.length === 0) {
    return /* @__PURE__ */ jsx46("span", { className, children: text });
  }
  const sortedHighlights = [...highlights].sort((a, b) => a[0] - b[0]);
  const mergedHighlights = [];
  for (const range of sortedHighlights) {
    const last = mergedHighlights[mergedHighlights.length - 1];
    if (last && range[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], range[1]);
    } else {
      mergedHighlights.push([...range]);
    }
  }
  const parts = [];
  let lastIndex = 0;
  mergedHighlights.forEach((range, i) => {
    const [start, end] = range;
    if (start > lastIndex) {
      parts.push(/* @__PURE__ */ jsx46("span", { children: text.slice(lastIndex, start) }, `text-${i}`));
    }
    parts.push(
      /* @__PURE__ */ jsx46(
        "mark",
        {
          className: "rounded-sm bg-zenth-warning/50 text-zenth-default",
          children: text.slice(start, end + 1)
        },
        `highlight-${i}`
      )
    );
    lastIndex = end + 1;
  });
  if (lastIndex < text.length) {
    parts.push(/* @__PURE__ */ jsx46("span", { children: text.slice(lastIndex) }, "text-end"));
  }
  return /* @__PURE__ */ jsx46("span", { className, children: parts });
}
function ResultItem({
  title,
  breadcrumbs,
  titleHighlights,
  breadcrumbHighlights,
  description,
  icon,
  value,
  onClick,
  showArrow = true,
  external = false,
  nonInteractive = false
}) {
  return /* @__PURE__ */ jsxs29(
    Autocomplete.Item,
    {
      value,
      onClick: nonInteractive ? void 0 : (e) => onClick(e),
      className: cn(
        "group flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors",
        nonInteractive ? "cursor-default" : "cursor-pointer data-[highlighted]:bg-zenth-overlay"
      ),
      children: [
        icon && /* @__PURE__ */ jsx46("div", { className: "flex flex-shrink-0 items-center text-zenth-subtle", children: icon }),
        /* @__PURE__ */ jsx46("div", { className: "min-w-0 flex-1", children: /* @__PURE__ */ jsxs29("div", { className: "flex items-center gap-2 truncate", children: [
          breadcrumbs?.map((crumb, index) => /* @__PURE__ */ jsxs29("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx46(
              HighlightedText,
              {
                text: crumb,
                highlights: breadcrumbHighlights?.[index],
                className: "text-base text-zenth-default"
              }
            ),
            /* @__PURE__ */ jsx46(
              CaretRightIcon3,
              {
                className: "h-3 w-3 flex-shrink-0 text-zenth-subtle",
                weight: "bold"
              }
            )
          ] }, index)),
          /* @__PURE__ */ jsx46(
            HighlightedText,
            {
              text: title,
              highlights: titleHighlights,
              className: "text-base text-zenth-default"
            }
          ),
          external && /* @__PURE__ */ jsx46(ArrowSquareOutIcon, { className: "h-3.5 w-3.5 flex-shrink-0 text-zenth-subtle" }),
          description && /* @__PURE__ */ jsxs29(Fragment12, { children: [
            /* @__PURE__ */ jsx46("span", { className: "text-zenth-subtle", children: "\u2014" }),
            /* @__PURE__ */ jsx46("span", { className: "truncate text-sm text-zenth-subtle", children: description })
          ] })
        ] }) }),
        showArrow && !external && !nonInteractive && /* @__PURE__ */ jsx46(ArrowRightIcon, { className: "h-4 w-4 flex-shrink-0 text-zenth-subtle opacity-0 transition-opacity group-data-[highlighted]:opacity-100" })
      ]
    }
  );
}
function Container({
  children,
  className
}) {
  return /* @__PURE__ */ jsx46(
    "div",
    {
      className: cn(
        "flex max-h-[60vh] flex-col overflow-hidden rounded-lg bg-zenth-elevated",
        className
      ),
      children
    }
  );
}
var PanelContext = createContext13({});
var defaultFilter = () => true;
function Panel({
  children,
  items,
  value,
  onValueChange,
  onItemHighlighted,
  itemToStringValue,
  filter = defaultFilter,
  open = true,
  className,
  onSelect,
  getSelectableItems
}) {
  const highlightedIndexRef = useRef10(-1);
  const handleItemHighlighted = useCallback8(
    (item, details) => {
      highlightedIndexRef.current = details.index;
      onItemHighlighted?.(item, details);
    },
    [onItemHighlighted]
  );
  const handleInputKeyDown = useCallback8(
    (e) => {
      const isEnter = e.key === "Enter";
      const withModifier = e.metaKey || e.ctrlKey;
      if (isEnter && withModifier && onSelect && getSelectableItems) {
        const selectableItems = getSelectableItems(items);
        const highlightedItem = selectableItems[highlightedIndexRef.current];
        if (highlightedItem !== void 0) {
          e.preventDefault();
          onSelect(highlightedItem, { newTab: true });
        }
      }
    },
    [items, onSelect, getSelectableItems]
  );
  return /* @__PURE__ */ jsx46(Container, { className, children: /* @__PURE__ */ jsx46(
    Autocomplete.Root,
    {
      items,
      value,
      onValueChange,
      onItemHighlighted: handleItemHighlighted,
      itemToStringValue,
      filter,
      autoHighlight: "always",
      keepHighlight: true,
      open,
      children: /* @__PURE__ */ jsx46(PanelContext.Provider, { value: { onInputKeyDown: handleInputKeyDown }, children })
    }
  ) });
}
function PanelInput({
  autoFocus = true,
  placeholder,
  className,
  onKeyDown: onKeyDownProp,
  leading,
  trailing,
  ...props
}) {
  const { onInputKeyDown } = useContext13(PanelContext);
  const { onClose } = useContext13(DialogContext);
  const handleKeyDown = useCallback8(
    (e) => {
      onKeyDownProp?.(e);
      if (e.defaultPrevented)
        return;
      if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
        return;
      }
      onInputKeyDown?.(e);
    },
    [onInputKeyDown, onKeyDownProp, onClose]
  );
  return /* @__PURE__ */ jsx46(InputHeader, { leading, trailing, children: /* @__PURE__ */ jsx46(
    Autocomplete.Input,
    {
      placeholder,
      className: cn(
        "zenth-input-placeholder flex-1 border-none bg-transparent text-base",
        "outline-none",
        className
      ),
      onKeyDown: handleKeyDown,
      autoFocus,
      ...props
    }
  ) });
}
function Results({
  children,
  className
}) {
  return /* @__PURE__ */ jsx46(Autocomplete.List, { className: cn("space-y-3", className), children });
}
var Items = Autocomplete.Collection;
var KUMO_COMMAND_PALETTE_VARIANTS = {};
var KUMO_COMMAND_PALETTE_DEFAULT_VARIANTS = {};
var CommandPalette = {
  /** Modal dialog wrapper - use with Panel for content that can swap */
  Dialog: Dialog2,
  /** Dialog + Panel combined - for simple single-view command palettes */
  Root: Root4,
  /** Autocomplete panel without dialog - use inside Dialog for swappable content */
  Panel,
  /** Input for use inside Panel */
  Input: PanelInput,
  /** Scrollable results container */
  List: List2,
  /** Category grouping */
  Group: Group3,
  /** Section header text */
  GroupLabel: GroupLabel3,
  /** Basic item */
  Item: Item2,
  /** Rich item with breadcrumbs, highlights, icons */
  ResultItem,
  /** Text with highlighted portions */
  HighlightedText,
  /** Empty state */
  Empty: Empty2,
  /** Loading state */
  Loading,
  /** Footer for keyboard hints */
  Footer,
  /** Render prop iterator for groups */
  Results,
  /** Render prop iterator for items within a group */
  Items
};

// src/components/breadcrumbs/breadcrumbs.tsx
import {
  Children as Children6,
  cloneElement as cloneElement4,
  isValidElement as isValidElement8
} from "react";
import { CheckIcon as CheckIcon8, CopyIcon as CopyIcon3 } from "@phosphor-icons/react";
import { jsx as jsx47, jsxs as jsxs30 } from "react/jsx-runtime";
var KUMO_BREADCRUMBS_VARIANTS = {
  size: {
    sm: {
      classes: "text-sm h-10 gap-0.5",
      description: "Compact breadcrumbs for dense UIs"
    },
    base: {
      classes: "text-base h-12 gap-1",
      description: "Default breadcrumbs size"
    }
  }
};
var KUMO_BREADCRUMBS_DEFAULT_VARIANTS = {
  size: "base"
};
function breadcrumbsVariants({
  size = KUMO_BREADCRUMBS_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    "group mr-4 flex min-w-0 grow items-center overflow-hidden whitespace-nowrap",
    resolveVariant(
      KUMO_BREADCRUMBS_VARIANTS.size,
      size,
      KUMO_BREADCRUMBS_DEFAULT_VARIANTS.size
    ).classes
  );
}
var Link4 = ({
  href,
  icon,
  children
}) => {
  const LinkComponent = useLinkComponent();
  return /* @__PURE__ */ jsxs30(
    LinkComponent,
    {
      "data-zenth-component": "Breadcrumbs",
      "data-zenth-part": "link",
      to: href,
      className: "flex shrink-0 items-center gap-1 whitespace-nowrap text-zenth-subtle no-underline",
      children: [
        !!icon && /* @__PURE__ */ jsx47("span", { className: "flex shrink-0 items-center", children: icon }),
        /* @__PURE__ */ jsx47("span", { children })
      ]
    }
  );
};
function Current({
  children,
  icon,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxs30("div", { className: "flex w-[125px] min-w-0 items-center gap-1", children: [
      icon && /* @__PURE__ */ jsx47("span", { className: "flex shrink-0 items-center", children: icon }),
      /* @__PURE__ */ jsx47(SkeletonLine, {})
    ] });
  }
  return /* @__PURE__ */ jsxs30(
    "div",
    {
      className: "flex max-w-full min-w-0 items-center gap-1 font-medium",
      "aria-current": "page",
      children: [
        icon && /* @__PURE__ */ jsx47("span", { className: "flex shrink-0 items-center", children: icon }),
        /* @__PURE__ */ jsx47("span", { className: "truncate", children })
      ]
    }
  );
}
function Separator2() {
  return /* @__PURE__ */ jsx47(
    "span",
    {
      className: "flex shrink-0 items-center text-zenth-inactive",
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsx47("svg", { width: "24", height: "24", fill: "none", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx47(
        "path",
        {
          stroke: "currentColor",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: "1.5",
          d: "M10.75 8.75L14.25 12L10.75 15.25"
        }
      ) })
    }
  );
}
function MobileEllipsis() {
  return /* @__PURE__ */ jsx47("span", { className: "flex shrink-0 items-center text-zenth-subtle", "aria-hidden": true, children: "..." });
}
function Clipboard({ text }) {
  const { copied: isCopied, runCopy } = useCopyFeedback();
  const handleCopyDeeplink = async () => {
    if (!text)
      return;
    await runCopy(
      () => navigator.clipboard.writeText(text),
      (error) => console.error("Failed to copy deeplink:", error)
    );
  };
  return /* @__PURE__ */ jsx47(
    Button,
    {
      variant: "ghost",
      shape: "square",
      size: "sm",
      className: "opacity-0 transition-[opacity] group-hover:opacity-100",
      onClick: handleCopyDeeplink,
      title: "Click to copy",
      "aria-label": "Copy",
      children: isCopied ? /* @__PURE__ */ jsx47(CheckIcon8, { weight: "bold", className: "text-zenth-success" }) : /* @__PURE__ */ jsx47(CopyIcon3, { weight: "regular" })
    }
  );
}
function Breadcrumb({
  children,
  size = "base",
  className
}) {
  const childArray = Children6.toArray(children);
  const mobileChildren = getMobileBreadcrumbChildren(childArray);
  return /* @__PURE__ */ jsxs30(
    "nav",
    {
      className: cn(breadcrumbsVariants({ size }), className),
      "aria-label": "breadcrumb",
      children: [
        /* @__PURE__ */ jsx47("div", { className: "contents sm:hidden", children: mobileChildren }),
        /* @__PURE__ */ jsx47("div", { className: "hidden sm:contents", children: childArray })
      ]
    }
  );
}
function isComponentElement(child, component) {
  return isValidElement8(child) && child.type === component;
}
function getMobileBreadcrumbChildren(children) {
  const breadcrumbItems = children.filter(
    (child) => isComponentElement(child, Link4) || isComponentElement(child, Current)
  );
  if (breadcrumbItems.length <= 2) {
    return children;
  }
  const [parentItem, currentItem] = breadcrumbItems.slice(-2);
  const trailingItems = [
    /* @__PURE__ */ jsx47(MobileEllipsis, {}, "zenth-breadcrumb-mobile-ellipsis"),
    /* @__PURE__ */ jsx47(Separator2, {}, "zenth-breadcrumb-mobile-separator-leading"),
    cloneElement4(parentItem, { key: "zenth-breadcrumb-mobile-parent" }),
    /* @__PURE__ */ jsx47(Separator2, {}, "zenth-breadcrumb-mobile-separator-trailing"),
    cloneElement4(currentItem, { key: "zenth-breadcrumb-mobile-current" })
  ];
  const extras = children.filter(
    (child) => !isComponentElement(child, Link4) && !isComponentElement(child, Current) && !isComponentElement(child, Separator2)
  );
  return [...trailingItems, ...extras];
}
Breadcrumb.Link = Link4;
Breadcrumb.Current = Current;
Breadcrumb.Separator = Separator2;
Breadcrumb.Clipboard = Clipboard;

// src/components/empty/empty.tsx
import { CheckIcon as CheckIcon9, CopyIcon as CopyIcon4 } from "@phosphor-icons/react";
import { useCallback as useCallback9 } from "react";
import { jsx as jsx48, jsxs as jsxs31 } from "react/jsx-runtime";
var KUMO_EMPTY_VARIANTS = {
  size: {
    sm: {
      classes: "px-6 py-8 gap-4",
      description: "Compact empty state for smaller containers"
    },
    base: {
      classes: "px-10 py-16 gap-6",
      description: "Default empty state size"
    },
    lg: {
      classes: "px-12 py-20 gap-8",
      description: "Large empty state for prominent placement"
    }
  }
};
var KUMO_EMPTY_DEFAULT_VARIANTS = {
  size: "base"
};
function emptyVariants({
  size = KUMO_EMPTY_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    "flex w-full flex-col items-center rounded-xl border border-zenth-fill bg-zenth-control text-zenth-default",
    resolveVariant(
      KUMO_EMPTY_VARIANTS.size,
      size,
      KUMO_EMPTY_DEFAULT_VARIANTS.size
    ).classes
  );
}
function Empty3({
  icon,
  title,
  description,
  commandLine,
  contents,
  size = "base",
  className
}) {
  const { copied: emptyStateCopied, runCopy } = useCopyFeedback(1e3);
  const handleCopy = useCallback9(async () => {
    if (!commandLine)
      return;
    await runCopy(
      () => navigator.clipboard.writeText(commandLine),
      (error) => console.warn("Clipboard copy failed", error)
    );
  }, [commandLine, runCopy]);
  return /* @__PURE__ */ jsxs31("div", { className: cn(emptyVariants({ size }), className), children: [
    icon,
    /* @__PURE__ */ jsxs31("div", { className: "flex flex-col items-center gap-2.5", children: [
      description ? /* @__PURE__ */ jsx48(Text, { variant: "heading", size: "lg", as: "h2", children: title }) : /* @__PURE__ */ jsx48(Text, { variant: "secondary", size: "base", as: "h2", children: title }),
      description && /* @__PURE__ */ jsx48(
        Text,
        {
          variant: "secondary",
          size: "base",
          DANGEROUS_className: "max-w-140 text-center text-balance leading-normal",
          children: description
        }
      )
    ] }),
    commandLine && /* @__PURE__ */ jsxs31(
      "div",
      {
        className: cn(
          "relative inline-flex h-10 max-w-8/10 transform-gpu items-center gap-2 rounded-lg border border-white bg-zenth-overlay pr-2 pl-3 font-mono shadow-xs ring ring-zenth-line"
        ),
        children: [
          /* @__PURE__ */ jsxs31("span", { className: "inline-flex min-w-0 items-baseline gap-2", children: [
            /* @__PURE__ */ jsx48("span", { className: "text-zenth-subtle select-none", children: "$" }),
            /* @__PURE__ */ jsx48("span", { className: "zenth-no-scrollbar overflow-scroll text-base whitespace-nowrap", children: commandLine })
          ] }),
          /* @__PURE__ */ jsx48(
            Button,
            {
              className: "text-zenth-subtle",
              size: "sm",
              variant: "ghost",
              shape: "square",
              "aria-label": "Copy command",
              onClick: handleCopy,
              children: emptyStateCopied ? /* @__PURE__ */ jsx48(
                CheckIcon9,
                {
                  size: 16,
                  className: "zenth-animate-bounce-in text-zenth-success"
                }
              ) : /* @__PURE__ */ jsx48(CopyIcon4, { size: 16 })
            }
          )
        ]
      }
    ),
    contents
  ] });
}

// src/components/grid/grid.tsx
import React11 from "react";
import { jsx as jsx49 } from "react/jsx-runtime";
var KUMO_GRID_VARIANTS = {
  variant: {
    "2up": {
      classes: "grid-cols-1 md:grid-cols-2",
      description: "Grid items stack on small screens, display side-by-side on medium screens and up"
    },
    "side-by-side": {
      classes: "grid-cols-2",
      description: "Grid items always displayed side-by-side"
    },
    "2-1": {
      classes: "grid-cols-1 md:grid-cols-[2fr_1fr]",
      description: "Two-thirds / one-third split (66%/33%) on medium screens and up"
    },
    "1-2": {
      classes: "grid-cols-1 md:grid-cols-[1fr_2fr]",
      description: "One-third / two-thirds split (33%/66%) on medium screens and up"
    },
    "1-3up": {
      classes: "grid-cols-1 lg:grid-cols-3",
      description: "Grid items stack on small screens, expand to 3 across on large screens"
    },
    "3up": {
      classes: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      description: "Grid items stack on small screens, 2 across on medium, 3 across on large"
    },
    "4up": {
      classes: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      description: "Grid items stack on small screens, progressively increase columns at larger breakpoints"
    },
    "6up": {
      classes: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
      description: "Grid items start at 2 across, expand to 6 across on XL"
    },
    "1-2-4up": {
      classes: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      description: "Grid items stack on small screens, 2 across on medium, 4 across on large"
    }
  },
  gap: {
    none: {
      classes: "gap-0",
      description: "No gap between grid items"
    },
    sm: {
      classes: "gap-3",
      description: "Small gap between grid items"
    },
    base: {
      classes: "gap-2 md:gap-6 lg:gap-8",
      description: "Default responsive gap between grid items"
    },
    lg: {
      classes: "gap-8",
      description: "Large gap between grid items"
    }
  }
};
var KUMO_GRID_DEFAULT_VARIANTS = {
  gap: "base"
};
var GridContext = React11.createContext({
  gap: "base"
});
function gridVariants({
  variant,
  gap = KUMO_GRID_DEFAULT_VARIANTS.gap
} = {}) {
  return cn(
    "grid",
    variant && resolveVariant(KUMO_GRID_VARIANTS.variant, variant, "2up").classes,
    resolveVariant(KUMO_GRID_VARIANTS.gap, gap, KUMO_GRID_DEFAULT_VARIANTS.gap).classes
  );
}
function gridItemVariants({
  variant,
  mobileDivider
} = {}) {
  return cn(
    mobileDivider && variant === "4up" && "border-b border-zenth-hairline pb-8 md:border-b-0 md:pb-0"
  );
}
var Grid = React11.forwardRef(
  ({
    children,
    className,
    mobileDivider,
    gap = KUMO_GRID_DEFAULT_VARIANTS.gap,
    variant,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx49(GridContext.Provider, { value: { variant, gap, mobileDivider }, children: /* @__PURE__ */ jsx49(
      "div",
      {
        ref,
        className: cn(gridVariants({ variant, gap }), className),
        ...props,
        children
      }
    ) });
  }
);
Grid.displayName = "Grid";
var GridItem = React11.forwardRef(
  ({ children, className, ...props }, ref) => {
    const { variant, mobileDivider } = React11.useContext(GridContext);
    return /* @__PURE__ */ jsx49(
      "div",
      {
        ref,
        className: cn(gridItemVariants({ variant, mobileDivider }), className),
        ...props,
        children
      }
    );
  }
);
GridItem.displayName = "GridItem";

// src/components/zenthcloud-logo/zenthcloud-logo.tsx
import { forwardRef as forwardRef25 } from "react";
import { jsx as jsx50, jsxs as jsxs32 } from "react/jsx-runtime";
var ZENTHCLOUD_BLUE = "#1769E0";
var ZENTHCLOUD_BLUE_LIGHT = "#4B91F0";
var ZENTHCLOUD_TEXT_GRAPHITE = "#111318";
var ZENTHCLOUD_GLYPH_PRIMARY_PATH = "M33.204 20.4C33.3649 19.9741 33.4217 19.5159 33.3695 19.0636C33.3173 18.6113 33.1577 18.1781 32.904 17.8C32.6435 17.4876 32.3239 17.2297 31.9636 17.0409C31.6032 16.8522 31.2092 16.7363 30.804 16.7L13.404 16.5C13.304 16.5 13.204 16.4 13.104 16.4C13.0808 16.3825 13.0618 16.3599 13.0488 16.3339C13.0358 16.3078 13.029 16.2791 13.029 16.25C13.029 16.2209 13.0358 16.1922 13.0488 16.1662C13.0618 16.1401 13.0808 16.1175 13.104 16.1C13.204 15.9 13.304 15.8 13.504 15.8L31.004 15.6C32.115 15.4767 33.1731 15.0597 34.0695 14.3918C34.9659 13.7239 35.6681 12.8293 36.104 11.8L37.104 9.20002C37.104 9.10002 37.204 9.00001 37.104 8.90001C36.5604 6.47843 35.2411 4.30052 33.3466 2.69721C31.4521 1.09391 29.086 0.152865 26.6079 0.0170769C24.1298 -0.118712 21.675 0.558179 19.6167 1.94489C17.5584 3.33161 16.009 5.35233 15.204 7.70002C14.159 6.95365 12.8843 6.59957 11.604 6.70002C10.4291 6.83102 9.33369 7.35777 8.49774 8.19372C7.66179 9.02966 7.13505 10.1251 7.00404 11.3C6.93745 11.9014 6.97125 12.5097 7.10404 13.1C5.20298 13.1526 3.39743 13.9448 2.07147 15.3081C0.745511 16.6714 0.00377461 18.4982 0.00403983 20.4C-0.0123708 20.7695 0.0212659 21.1395 0.104038 21.5C0.10863 21.5781 0.141713 21.6517 0.19701 21.707C0.252307 21.7623 0.325975 21.7954 0.404041 21.8H32.504C32.704 21.8 32.904 21.7 32.904 21.5L33.204 20.4Z";
var ZENTHCLOUD_GLYPH_ACCENT_PATH = "M38.704 9.20002H38.204C38.104 9.20002 38.004 9.30001 37.904 9.40001L37.204 11.8C37.0431 12.2259 36.9864 12.6841 37.0386 13.1364C37.0908 13.5887 37.2504 14.0219 37.504 14.4C37.7646 14.7124 38.0842 14.9704 38.4445 15.1591C38.8049 15.3479 39.1989 15.4637 39.604 15.5L43.304 15.7C43.404 15.7 43.504 15.8 43.604 15.8C43.6273 15.8175 43.6462 15.8401 43.6592 15.8662C43.6723 15.8922 43.679 15.9209 43.679 15.95C43.679 15.9791 43.6723 16.0078 43.6592 16.0339C43.6462 16.0599 43.6273 16.0826 43.604 16.1C43.504 16.3 43.404 16.4 43.204 16.4L39.404 16.6C38.293 16.7233 37.2349 17.1403 36.3386 17.8082C35.4422 18.4761 34.74 19.3707 34.304 20.4L34.104 21.3C34.004 21.4 34.104 21.6 34.304 21.6H47.504C47.5448 21.6058 47.5863 21.6021 47.6254 21.5891C47.6644 21.5761 47.6999 21.5541 47.729 21.525C47.7581 21.4959 47.7801 21.4604 47.7931 21.4214C47.8061 21.3823 47.8099 21.3408 47.804 21.3C48.0421 20.4527 48.1764 19.5797 48.204 18.7C48.1882 16.1854 47.1822 13.7782 45.404 12C43.6259 10.2218 41.2187 9.21587 38.704 9.20002Z";
var ZENTHCLOUD_WORDMARK_PATHS = [
  // L
  "M47.34 108.53 L56.88 108.53 L56.88 134.59 L73.54 134.59 L73.54 142.94 L47.34 142.94 L47.34 108.53",
  // O
  "M83.42,125.84v-.10c0-9.88,8-17.9,18.58-17.9s18.48,7.92,18.48,17.8v.1c0,9.88-8,17.89-18.58,17.89s-18.48-7.91-18.48-17.79m27.33,0v-.1c0-5-3.59-9.29-8.85-9.29s-8.7,4.23-8.7,9.19v.1c0,5,3.59,9.29,8.8,9.29s8.75-4.23,8.75-9.19",
  // U
  "M132.15,127.85V108.53h9.69v19.13c0,5,2.51,7.32,6.34,7.32s6.34-2.26,6.34-7.08V108.53h9.69v19.08c0,11.11-6.34,16-16.13,16s-15.93-5-15.93-15.73",
  // D
  "M178.8,108.53h13.27c12.29,0,19.42,7.08,19.42,17v.1c0,9.93-7.22,17.3-19.61,17.3H178.8Zm13.42,26c5.71,0,9.49-3.15,9.49-8.7v-.1c0-5.51-3.78-8.7-9.49-8.7h-3.88v17.5Z",
  // F
  "M225.35 108.53 L252.88 108.53 L252.88 116.89 L234.89 116.89 L234.89 122.74 L251.16 122.74 L251.16 130.65 L234.89 130.65 L234.89 142.94 L225.35 142.94 L225.35 108.53",
  // L
  "M266.15 108.53 L275.69 108.53 L275.69 134.59 L292.35 134.59 L292.35 142.94 L266.15 142.94 L266.15 108.53",
  // A
  "M317.27,108.29h9.19l14.65,34.65H330.89l-2.51-6.14H315.11l-2.46,6.14h-10Zm8.36,21.09-3.84-9.79-3.88,9.79Z",
  // R
  "M353.4,108.53h16.27c5.26,0,8.89,1.38,11.21,3.74a10.69,10.69,0,0,1,3,8v.1A10.89,10.89,0,0,1,376.85,131l8.21,12H374l-6.93-10.42h-4.18v10.42H353.4Zm15.83,16.52c3.24,0,5.11-1.57,5.11-4.08v-.1c0-2.7-2-4.08-5.16-4.08h-6.25v8.26Z",
  // E
  "M397.68 108.53 L425.36 108.53 L425.36 116.64 L407.12 116.64 L407.12 121.85 L423.64 121.85 L423.64 129.38 L407.12 129.38 L407.12 134.83 L425.61 134.83 L425.61 142.94 L397.68 142.94 L397.68 108.53",
  // C
  "M26.46,129.87A8.44,8.44,0,0,1,18.58,135c-5.21,0-8.8-4.33-8.8-9.29v-.1c0-5,3.49-9.19,8.7-9.19a8.63,8.63,0,0,1,8.18,5.7H36.72c-1.61-8.19-8.81-14.31-18.14-14.31C8,107.84,0,115.86,0,125.74v.09c0,9.89,7.86,17.8,18.48,17.8,9.08,0,16.18-5.88,18.05-13.76Z"
];
var ZENTHCLOUD_FULL_LOGO_PRIMARY_PATH = "M360.8,90.69l1-3.6c1.24-4.28.78-8.24-1.3-11.15a11.32,11.32,0,0,0-9-4.43l-73.35-.94a1.49,1.49,0,0,1-1.16-.61,1.51,1.51,0,0,1-.15-1.33,2,2,0,0,1,1.7-1.3l74-.94c8.78-.4,18.29-7.53,21.62-16.22l4.22-11a2.51,2.51,0,0,0,.16-.94,2.35,2.35,0,0,0-.05-.52,48.21,48.21,0,0,0-92.7-5,21.69,21.69,0,0,0-34.58,15.15,22,22,0,0,0,.56,7.59,30.83,30.83,0,0,0-29.93,30.82,31.22,31.22,0,0,0,.32,4.46A1.44,1.44,0,0,0,223.68,92H359.13A1.79,1.79,0,0,0,360.8,90.69Z";
var ZENTHCLOUD_FULL_LOGO_ACCENT_PATH = "M385.24,40c-.68,0-1.36,0-2,0a1.55,1.55,0,0,0-.31.07,1.14,1.14,0,0,0-.74.78l-2.89,10c-1.24,4.28-.77,8.24,1.31,11.14a11.3,11.3,0,0,0,9,4.44l15.63.94a1.44,1.44,0,0,1,1.12.6,1.5,1.5,0,0,1,.16,1.34,2,2,0,0,1-1.7,1.3l-16.24.94c-8.82.4-18.33,7.52-21.66,16.21l-1.17,3.07a.87.87,0,0,0,.77,1.18h55.94a1.49,1.49,0,0,0,1.45-1.07A40.15,40.15,0,0,0,385.24,40Z";
var ZENTHCLOUD_GLYPH_VIEWBOX = "0 0 49 22";
var ZENTHCLOUD_FULL_LOGO_VIEWBOX = "0 0 425.6 143.63";
var KUMO_ZENTHCLOUD_LOGO_VARIANTS = {
  variant: {
    glyph: {
      description: "Cloud glyph only (logomark)"
    },
    full: {
      description: "Full logo with cloud glyph and wordmark stacked"
    }
  },
  color: {
    color: {
      description: "Brand colors (blue gradient cloud, graphite text)"
    },
    black: {
      description: "Solid black logo"
    },
    white: {
      description: "Solid white logo (for dark backgrounds)"
    }
  }
};
var KUMO_ZENTHCLOUD_LOGO_DEFAULT_VARIANTS = {
  variant: "full",
  color: "color"
};
var ZenthcloudLogo = forwardRef25(
  ({
    variant = KUMO_ZENTHCLOUD_LOGO_DEFAULT_VARIANTS.variant,
    color = KUMO_ZENTHCLOUD_LOGO_DEFAULT_VARIANTS.color,
    className,
    ...props
  }, ref) => {
    const isGlyph = variant === "glyph";
    const fillPrimary = color === "color" ? ZENTHCLOUD_BLUE : "currentColor";
    const fillAccent = color === "color" ? ZENTHCLOUD_BLUE_LIGHT : "currentColor";
    const fillText = "currentColor";
    if (isGlyph) {
      return /* @__PURE__ */ jsxs32(
        "svg",
        {
          ref,
          viewBox: ZENTHCLOUD_GLYPH_VIEWBOX,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          role: "img",
          "aria-label": "Zenthcloud logo",
          className: cn(
            color === "white" && "text-white",
            color === "black" && "text-black",
            className
          ),
          ...props,
          children: [
            /* @__PURE__ */ jsx50(
              "path",
              {
                d: "M33.204 20.4C33.3649 19.9741 33.4217 19.5159 33.3695 19.0636C33.3173 18.6113 33.1577 18.1781 32.904 17.8C32.6435 17.4876 32.3239 17.2297 31.9636 17.0409C31.6032 16.8522 31.2092 16.7363 30.804 16.7L13.404 16.5C13.304 16.5 13.204 16.4 13.104 16.4C13.0808 16.3825 13.0618 16.3599 13.0488 16.3339C13.0358 16.3078 13.029 16.2791 13.029 16.25C13.029 16.2209 13.0358 16.1922 13.0488 16.1662C13.0618 16.1401 13.0808 16.1175 13.104 16.1C13.204 15.9 13.304 15.8 13.504 15.8L31.004 15.6C32.115 15.4767 33.1731 15.0597 34.0695 14.3918C34.9659 13.7239 35.6681 12.8293 36.104 11.8L37.104 9.20002C37.104 9.10002 37.204 9.00001 37.104 8.90001C36.5604 6.47843 35.2411 4.30052 33.3466 2.69721C31.4521 1.09391 29.086 0.152865 26.6079 0.0170769C24.1298 -0.118712 21.675 0.558179 19.6167 1.94489C17.5584 3.33161 16.009 5.35233 15.204 7.70002C14.159 6.95365 12.8843 6.59957 11.604 6.70002C10.4291 6.83102 9.33369 7.35777 8.49774 8.19372C7.66179 9.02966 7.13505 10.1251 7.00404 11.3C6.93745 11.9014 6.97125 12.5097 7.10404 13.1C5.20298 13.1526 3.39743 13.9448 2.07147 15.3081C0.745511 16.6714 0.00377461 18.4982 0.00403983 20.4C-0.0123708 20.7695 0.0212659 21.1395 0.104038 21.5C0.10863 21.5781 0.141713 21.6517 0.19701 21.707C0.252307 21.7623 0.325975 21.7954 0.404041 21.8H32.504C32.704 21.8 32.904 21.7 32.904 21.5L33.204 20.4Z",
                fill: fillPrimary
              }
            ),
            /* @__PURE__ */ jsx50(
              "path",
              {
                d: "M38.704 9.20002H38.204C38.104 9.20002 38.004 9.30001 37.904 9.40001L37.204 11.8C37.0431 12.2259 36.9864 12.6841 37.0386 13.1364C37.0908 13.5887 37.2504 14.0219 37.504 14.4C37.7646 14.7124 38.0842 14.9704 38.4445 15.1591C38.8049 15.3479 39.1989 15.4637 39.604 15.5L43.304 15.7C43.404 15.7 43.504 15.8 43.604 15.8C43.6273 15.8175 43.6462 15.8401 43.6592 15.8662C43.6723 15.8922 43.679 15.9209 43.679 15.95C43.679 15.9791 43.6723 16.0078 43.6592 16.0339C43.6462 16.0599 43.6273 16.0826 43.604 16.1C43.504 16.3 43.404 16.4 43.204 16.4L39.404 16.6C38.293 16.7233 37.2349 17.1403 36.3386 17.8082C35.4422 18.4761 34.74 19.3707 34.304 20.4L34.104 21.3C34.004 21.4 34.104 21.6 34.304 21.6H47.504C47.5448 21.6058 47.5863 21.6021 47.6254 21.5891C47.6644 21.5761 47.6999 21.5541 47.729 21.525C47.7581 21.4959 47.7801 21.4604 47.7931 21.4214C47.8061 21.3823 47.8099 21.3408 47.804 21.3C48.0421 20.4527 48.1764 19.5797 48.204 18.7C48.1882 16.1854 47.1822 13.7782 45.404 12C43.6259 10.2218 41.2187 9.21587 38.704 9.20002Z",
                fill: fillAccent
              }
            )
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs32(
      "svg",
      {
        ref,
        viewBox: ZENTHCLOUD_FULL_LOGO_VIEWBOX,
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        role: "img",
        "aria-label": "Zenthcloud logo",
        className: cn(
          // Wordmark text color - respects dark mode
          color === "color" && "text-zenth-default",
          color === "white" && "text-white",
          color === "black" && "text-black",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx50("path", { d: ZENTHCLOUD_FULL_LOGO_PRIMARY_PATH, fill: fillPrimary }),
          /* @__PURE__ */ jsx50("path", { d: ZENTHCLOUD_FULL_LOGO_ACCENT_PATH, fill: fillAccent }),
          ZENTHCLOUD_WORDMARK_PATHS.map((d, i) => /* @__PURE__ */ jsx50("path", { d, fill: fillText }, i))
        ]
      }
    );
  }
);
ZenthcloudLogo.displayName = "ZenthcloudLogo";
var PoweredByZenthcloud = forwardRef25(
  ({
    color = "color",
    href = "https://github.com/skygenesisenterprise/zenthcloud",
    className,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsxs32(
      "a",
      {
        ref,
        href,
        target: "_blank",
        rel: "noopener noreferrer",
        className: cn(
          // Base badge styles
          "inline-flex items-center gap-2 rounded-lg py-2 pr-3 pl-2.5 text-sm font-medium",
          "ring-1 transition-all ring-inset hover:shadow-sm",
          // Color variants using semantic tokens
          color === "color" && "bg-zenth-base text-zenth-default ring-zenth-hairline",
          color === "black" && "bg-white text-black ring-black/20",
          color === "white" && "bg-black text-white ring-white/20",
          className
        ),
        ...props,
        children: [
          /* @__PURE__ */ jsx50(ZenthcloudLogo, { variant: "glyph", color, className: "h-4 w-auto" }),
          /* @__PURE__ */ jsxs32("span", { children: [
            "Powered by ",
            /* @__PURE__ */ jsx50("span", { className: "font-semibold", children: "Zenthcloud" })
          ] })
        ]
      }
    );
  }
);
PoweredByZenthcloud.displayName = "PoweredByZenthcloud";
function generateZenthcloudLogoSvg(options = {}) {
  const { variant = "full", color = "color" } = options;
  const isGlyph = variant === "glyph";
  const fillPrimary = color === "color" ? ZENTHCLOUD_BLUE : color;
  const fillAccent = color === "color" ? ZENTHCLOUD_BLUE_LIGHT : color;
  const fillText = color === "color" ? ZENTHCLOUD_TEXT_GRAPHITE : color;
  if (isGlyph) {
    return `<svg viewBox="${ZENTHCLOUD_GLYPH_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zenthcloud logo">
  <path d="${ZENTHCLOUD_GLYPH_PRIMARY_PATH}" fill="${fillPrimary}"/>
  <path d="${ZENTHCLOUD_GLYPH_ACCENT_PATH}" fill="${fillAccent}"/>
</svg>`;
  }
  const wordmarkPaths = ZENTHCLOUD_WORDMARK_PATHS.map(
    (d) => `  <path d="${d}" fill="${fillText}"/>`
  ).join("\n");
  return `<svg viewBox="${ZENTHCLOUD_FULL_LOGO_VIEWBOX}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zenthcloud logo">
  <path d="${ZENTHCLOUD_FULL_LOGO_PRIMARY_PATH}" fill="${fillPrimary}"/>
  <path d="${ZENTHCLOUD_FULL_LOGO_ACCENT_PATH}" fill="${fillAccent}"/>
${wordmarkPaths}
</svg>`;
}

// src/components/date-picker/date-picker.tsx
import {
  CaretDownIcon as CaretDownIcon2,
  CaretLeftIcon as CaretLeftIcon3,
  CaretRightIcon as CaretRightIcon4,
  CaretUpIcon
} from "@phosphor-icons/react";
import { useMemo as useMemo7 } from "react";
import {
  DayPicker,
  getDefaultClassNames
} from "react-day-picker";
import { jsx as jsx51 } from "react/jsx-runtime";
var CHEVRON_ICONS = {
  left: CaretLeftIcon3,
  right: CaretRightIcon4,
  up: CaretUpIcon,
  down: CaretDownIcon2
};
var Chevron = ({
  className,
  orientation = "left"
}) => {
  const Icon = CHEVRON_ICONS[orientation];
  return /* @__PURE__ */ jsx51(Icon, { size: 16, className, "aria-hidden": true });
};
function withRangeMarkers(CustomDay) {
  return function Day({ day, modifiers, ...props }) {
    const markers = {
      "data-range-start": modifiers.range_start || void 0,
      "data-range-middle": modifiers.range_middle || void 0,
      "data-range-end": modifiers.range_end || void 0
    };
    return CustomDay ? /* @__PURE__ */ jsx51(CustomDay, { day, modifiers, ...props, ...markers }) : /* @__PURE__ */ jsx51("td", { ...props, ...markers });
  };
}
var navButtonClassName = cn(
  buttonVariants({ variant: "ghost", shape: "square" }),
  "size-(--cell-size) rounded-md aria-disabled:cursor-not-allowed aria-disabled:opacity-50"
);
var dayButtonClassName = cn(
  "flex size-(--cell-size) items-center justify-center rounded-md text-base text-zenth-default tabular-nums transition-colors outline-none focus-visible:outline-hidden",
  "cursor-pointer hover:bg-zenth-tint",
  "focus-visible:relative focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-zenth-brand",
  "[td[data-day][data-disabled]_&]:cursor-not-allowed [td[data-day][data-disabled]_&]:text-zenth-inactive [td[data-day][data-disabled]_&]:hover:bg-transparent",
  // Days from other months are as quiet as disabled ones.
  "[td[data-day][data-outside]:not([data-selected])_&]:text-zenth-inactive",
  // Today keeps its weight when disabled, so it can still be found.
  "[td[data-day][data-today]:not([data-selected],[data-outside])_&]:font-semibold [td[data-day][data-today]:not([data-selected],[data-outside],[data-disabled])_&]:text-zenth-link",
  // Selected days are filled, except the days inside a range, which show the
  // band painted on their cells.
  "[td[data-day][data-selected]:not([data-range-middle])_&]:bg-zenth-contrast [td[data-day][data-selected]:not([data-range-middle])_&]:text-zenth-inverse [td[data-day][data-selected]:not([data-range-middle])_&]:hover:bg-zenth-contrast",
  "[td[data-day][data-range-middle]:not([data-disabled])_&]:hover:bg-zenth-interact",
  // Range ends are square on the side that meets the band. A one-day range,
  // or an end at the edge of a week, has no band beside it, so it stays round.
  "[td[data-day][data-range-start]:not([data-range-end],:last-of-type)_&]:rounded-e-none",
  "[td[data-day][data-range-end]:not([data-range-start],:first-of-type)_&]:rounded-s-none"
);
function DatePicker({
  className,
  classNames,
  onChange,
  ...props
}) {
  const defaults = getDefaultClassNames();
  const hasDropdowns = props.captionLayout?.startsWith("dropdown") ?? false;
  const hasNavAround = props.navLayout === "around";
  const customDay = props.components?.Day;
  const Day = useMemo7(() => withRangeMarkers(customDay), [customDay]);
  return /* @__PURE__ */ jsx51(
    DayPicker,
    {
      showOutsideDays: (props.numberOfMonths ?? 1) === 1,
      animate: true,
      ...props,
      onSelect: onChange,
      classNames: {
        // Days are --cell-size squares centered in --cell-width columns, so
        // they get a little air on each side while the nav buttons, weekday
        // labels and days still share one grid.
        // isolate keeps the nav's and focused days' z-index inside the
        // calendar.
        months: cn(
          defaults.months,
          "relative isolate flex flex-col gap-4 sm:flex-row"
        ),
        // navLayout="after" and "around" render the buttons inside a month,
        // so the month positions them. Otherwise it stays unpositioned, so it
        // doesn't cover the nav.
        month: cn(
          defaults.month,
          "flex flex-col gap-3",
          props.navLayout && "relative"
        ),
        // Both buttons sit together at the end of the header, so switching
        // months is a short mouse trip. The inset matches the columns' side
        // air, so the last button lines up with the last day square and the
        // caption with the first. The buttons sit above the caption, so a
        // long month name in a dropdown can't cover them. The nav's chevrons
        // don't follow the text direction, so they flip in RTL;
        // navLayout="around" flips its own.
        nav: cn(
          defaults.nav,
          "absolute end-0.5 top-0 z-1 flex items-center gap-1 rtl:[&_svg]:rotate-180"
        ),
        button_previous: cn(
          defaults.button_previous,
          navButtonClassName,
          hasNavAround && "absolute start-0.5 top-0 z-1"
        ),
        button_next: cn(
          defaults.button_next,
          navButtonClassName,
          hasNavAround && "absolute end-0.5 top-0 z-1"
        ),
        month_caption: cn(
          defaults.month_caption,
          "flex h-(--cell-size) items-center px-0.5",
          hasNavAround && "justify-center px-(--cell-size)"
        ),
        caption_label: cn(
          defaults.caption_label,
          "text-base font-medium text-zenth-default",
          hasDropdowns && "flex h-7 items-center gap-1 rounded-md ps-2 pe-1 [&>svg]:text-zenth-subtle"
        ),
        dropdowns: cn(defaults.dropdowns, "flex items-center gap-1.5"),
        dropdown_root: cn(
          defaults.dropdown_root,
          "relative rounded-md ring ring-zenth-line has-focus-visible:ring-2 has-focus-visible:ring-zenth-brand"
        ),
        dropdown: cn(
          defaults.dropdown,
          "absolute inset-0 cursor-pointer opacity-0"
        ),
        month_grid: cn(defaults.month_grid, "border-collapse"),
        weekdays: cn(defaults.weekdays, "flex"),
        weekday: cn(
          defaults.weekday,
          "flex h-5 w-(--cell-width) items-center justify-center text-xs font-normal text-zenth-subtle"
        ),
        week: cn(defaults.week, "mt-2 flex"),
        week_number_header: cn(defaults.week_number_header, "w-(--cell-width)"),
        week_number: cn(
          defaults.week_number,
          "flex h-(--cell-size) w-(--cell-width) items-center justify-center text-xs text-zenth-subtle"
        ),
        // The range band is painted on the cells: full width in the middle,
        // the inner half at each end so it meets the end squares, and
        // rounded where a week wraps, so it reads as one continuous strip.
        // Days are td elements, so first-of-type skips a week number cell.
        day: cn(
          defaults.day,
          "relative flex h-(--cell-size) w-(--cell-width) justify-center p-0 text-center",
          "data-selected:first-of-type:rounded-s-md data-selected:last-of-type:rounded-e-md",
          // A range that starts and ends on the same day has no band.
          "data-range-start:data-range-end:bg-none"
        ),
        day_button: cn(defaults.day_button, dayButtonClassName),
        range_start: cn(
          defaults.range_start,
          "bg-linear-to-r from-transparent from-50% to-zenth-fill to-50% last-of-type:bg-none rtl:bg-linear-to-l"
        ),
        range_middle: cn(defaults.range_middle, "bg-zenth-fill"),
        range_end: cn(
          defaults.range_end,
          "bg-linear-to-l from-transparent from-50% to-zenth-fill to-50% first-of-type:bg-none rtl:bg-linear-to-r"
        ),
        hidden: cn(defaults.hidden, "invisible"),
        footer: cn(defaults.footer, "w-0 min-w-full pt-3"),
        ...classNames,
        root: cn(
          defaults.root,
          "w-fit rounded-xl bg-zenth-base text-sm select-none [--cell-size:--spacing(8)] [--cell-width:--spacing(9)]",
          classNames?.root,
          className
        )
      },
      components: {
        Chevron,
        ...props.components,
        Day
      }
    }
  );
}
DatePicker.displayName = "DatePicker";

// src/components/flow/diagram.tsx
import {
  createContext as createContext15,
  useCallback as useCallback11,
  useContext as useContext15,
  useEffect as useEffect11,
  useId as useId6,
  useMemo as useMemo9,
  useRef as useRef12,
  useState as useState10
} from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform
} from "motion/react";

// src/components/flow/connectors.tsx
import { forwardRef as forwardRef26, useId as useId4 } from "react";
import { jsx as jsx52, jsxs as jsxs33 } from "react/jsx-runtime";
var FLAT_THRESHOLD = 2;
function createRoundedPath({ x1, y1, x2, y2 }, {
  cornerRadius: maxCornerRadius = 8,
  midOffset = 32,
  arrowheadOffset = 8,
  isBottom = false,
  single = false,
  orientation = "vertical"
} = {}) {
  const cornerRadius = Math.min(
    maxCornerRadius,
    Math.abs(orientation === "horizontal" ? (y2 - y1) / 2 : (x2 - x1) / 2)
  );
  if (orientation === "horizontal") {
    if (Math.abs(y2 - y1) <= FLAT_THRESHOLD)
      return `M ${x1} ${y1} L ${x2 - arrowheadOffset} ${y2}`;
    const verticalX = single || isBottom ? x2 - midOffset : x1 + midOffset;
    const isGoingRight2 = x2 > x1;
    const horizontalSign2 = isGoingRight2 ? 1 : -1;
    const isGoingDown2 = y2 > y1;
    const verticalSign2 = isGoingDown2 ? 1 : -1;
    const firstHorizontalEnd = verticalX - horizontalSign2 * cornerRadius;
    const verticalStart = y1 + verticalSign2 * cornerRadius;
    const verticalEnd = y2 - verticalSign2 * cornerRadius;
    const secondHorizontalStart = verticalX + horizontalSign2 * cornerRadius;
    const pathEndX = x2 - horizontalSign2 * arrowheadOffset;
    const bottomCurveCommands2 = [
      `L ${firstHorizontalEnd} ${y1}`,
      `Q ${verticalX} ${y1} ${verticalX} ${verticalStart}`,
      single ? `L ${verticalX} ${verticalEnd} Q ${verticalX} ${y2} ${secondHorizontalStart} ${y2}` : `L ${verticalX} ${y2}`
    ];
    const topCurveCommands2 = [
      single ? `L ${firstHorizontalEnd} ${y1} Q ${verticalX} ${y1} ${verticalX} ${verticalStart}` : `L ${verticalX} ${y1}`,
      `L ${verticalX} ${verticalEnd}`,
      `Q ${verticalX} ${y2} ${secondHorizontalStart} ${y2}`
    ];
    const commands2 = [
      `M ${x1} ${y1}`,
      ...isBottom ? bottomCurveCommands2 : topCurveCommands2,
      `L ${pathEndX} ${y2}`
    ];
    return commands2.join(" ");
  }
  if (Math.abs(x2 - x1) <= FLAT_THRESHOLD)
    return `M ${x1} ${y1} L ${x2} ${y2 - arrowheadOffset}`;
  const horizontalY = single || isBottom ? y2 - midOffset : y1 + midOffset;
  const isGoingRight = x2 > x1;
  const horizontalSign = isGoingRight ? 1 : -1;
  const isGoingDown = y2 > y1;
  const verticalSign = isGoingDown ? 1 : -1;
  const firstVerticalEnd = horizontalY - cornerRadius;
  const horizontalStart = x1 + horizontalSign * cornerRadius;
  const horizontalEnd = x2 - horizontalSign * cornerRadius;
  const secondVerticalStart = horizontalY + cornerRadius;
  const pathEndY = y2 - verticalSign * arrowheadOffset;
  const bottomCurveCommands = [
    `L ${x1} ${firstVerticalEnd}`,
    `Q ${x1} ${horizontalY} ${horizontalStart} ${horizontalY}`,
    single ? `L ${horizontalEnd} ${horizontalY} Q ${x2} ${horizontalY} ${x2} ${secondVerticalStart}` : `L ${x2} ${horizontalY}`
  ];
  const topCurveCommands = [
    single ? `L ${x1} ${firstVerticalEnd} Q ${x1} ${horizontalY} ${horizontalStart} ${horizontalY}` : `L ${x1} ${horizontalY}`,
    `L ${horizontalEnd} ${horizontalY}`,
    `Q ${x2} ${horizontalY} ${x2} ${secondVerticalStart}`
  ];
  const commands = [
    `M ${x1} ${y1}`,
    // Move the cursor to the starting point
    ...isBottom ? bottomCurveCommands : topCurveCommands,
    `L ${x2} ${pathEndY}`
    // Draw the final line to the end point
  ];
  return commands.join(" ");
}
function FlowConnectors({
  edges,
  nodePositions,
  nodes,
  orientation
}) {
  const connectors = [];
  for (const [fromId, toId] of edges) {
    const fromPos = nodePositions[fromId];
    const toPos = nodePositions[toId];
    const fromNode = nodes[fromId];
    const toNode = nodes[toId];
    if (!fromPos || !toPos || !fromNode || !toNode)
      continue;
    const connector = orientation === "vertical" ? {
      // bottom edge of the source node to top edge of target node.
      x1: fromPos.x + fromNode.width / 2,
      y1: fromPos.y + fromNode.height,
      x2: toPos.x + toNode.width / 2,
      y2: toPos.y
    } : {
      // right edge of the source node; Y uses anchor midpoint when available.
      x1: fromPos.x + fromNode.width,
      y1: fromPos.y + (fromNode.startAnchorOffset ?? fromNode.height / 2),
      // left edge of the target node; Y uses anchor midpoint when available.
      x2: toPos.x,
      y2: toPos.y + (toNode.endAnchorOffset ?? toNode.height / 2)
    };
    connectors.push({
      ...connector,
      disabled: fromNode.disabled || toNode.disabled,
      fromId,
      toId,
      single: true
    });
  }
  return /* @__PURE__ */ jsx52(Connectors, { connectors, orientation });
}
var Connectors = forwardRef26(
  function Connectors2({ connectors, children, ...pathProps }, svgRef) {
    const id = useId4();
    return /* @__PURE__ */ jsxs33(
      "svg",
      {
        width: "100%",
        height: "100%",
        overflow: "visible",
        "aria-hidden": "true",
        className: "overflow-visible text-zenth-placeholder",
        ref: svgRef,
        children: [
          /* @__PURE__ */ jsx52("defs", { children: /* @__PURE__ */ jsx52(
            "marker",
            {
              id,
              markerWidth: "8",
              markerHeight: "8",
              refX: "0",
              refY: "4",
              orient: "auto",
              markerUnits: "userSpaceOnUse",
              children: /* @__PURE__ */ jsx52(
                "path",
                {
                  d: "M 0,1.5 Q 0,0 1.5,0 Q 3.5,1 5.8,3.2 Q 6.5,4 5.8,4.8 Q 3.5,7 1.5,8 Q 0,8 0,6.5 Z",
                  fill: "currentColor",
                  stroke: "none"
                }
              )
            }
          ) }),
          [...connectors].sort((a, b) => {
            if (a.disabled && !b.disabled)
              return -1;
            if (!a.disabled && b.disabled)
              return 1;
            return 0;
          }).map((connector, index) => {
            const path = createRoundedPath(connector, {
              isBottom: connector.isBottom,
              single: connector.single,
              ...pathProps
            });
            const pathId = connector.fromId && connector.toId ? `${connector.fromId}-${connector.toId}` : `path-${index}`;
            return /* @__PURE__ */ jsx52(
              "g",
              {
                className: connector.disabled ? "opacity-40" : void 0,
                children: /* @__PURE__ */ jsx52(
                  "path",
                  {
                    d: path,
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    markerEnd: `url(#${id})`,
                    "data-index": index,
                    "data-testid": pathId
                  }
                )
              },
              pathId
            );
          }),
          children
        ]
      }
    );
  }
);

// src/components/flow/use-children.tsx
import {
  createContext as createContext14,
  useCallback as useCallback10,
  useContext as useContext14,
  useEffect as useEffect10,
  useId as useId5,
  useMemo as useMemo8,
  useRef as useRef11,
  useState as useState9
} from "react";
import { jsx as jsx53 } from "react/jsx-runtime";
var DescendantsContext = createContext14(null);
function useDescendants() {
  const [registeredDescendants, setRegisteredDescendants] = useState9([]);
  const descendantsRef = useRef11(
    /* @__PURE__ */ new Map()
  );
  const renderOrderCounterRef = useRef11(0);
  const renderOrderMapRef = useRef11(/* @__PURE__ */ new Map());
  renderOrderCounterRef.current = 0;
  renderOrderMapRef.current.clear();
  const claimRenderOrder = useCallback10((id) => {
    if (!renderOrderMapRef.current.has(id)) {
      renderOrderMapRef.current.set(id, renderOrderCounterRef.current++);
    }
    return renderOrderMapRef.current.get(id);
  }, []);
  const register = useCallback10(
    (id, renderOrder, props = {}) => {
      const existing = descendantsRef.current.get(id);
      const isNew = existing === void 0;
      const orderChanged = !isNew && existing.renderOrder !== renderOrder;
      const descendantInfo = {
        id,
        props,
        renderOrder
      };
      descendantsRef.current.set(id, descendantInfo);
      if (isNew || orderChanged) {
        const sorted = Array.from(descendantsRef.current.values()).sort(
          (a, b) => a.renderOrder - b.renderOrder
        );
        setRegisteredDescendants(sorted);
      }
      const unregister = () => {
        descendantsRef.current.delete(id);
        const remainingDescendants = Array.from(
          descendantsRef.current.values()
        ).sort((a, b) => a.renderOrder - b.renderOrder);
        setRegisteredDescendants(remainingDescendants);
      };
      return { unregister };
    },
    []
  );
  const contextValue = useMemo8(
    () => ({
      register,
      descendants: registeredDescendants,
      claimRenderOrder
    }),
    [register, registeredDescendants, claimRenderOrder]
  );
  return contextValue;
}
function DescendantsProvider({
  value,
  children
}) {
  return /* @__PURE__ */ jsx53(
    DescendantsContext.Provider,
    {
      value,
      children
    }
  );
}
function useDescendantsContext() {
  const context = useContext14(DescendantsContext);
  if (!context) {
    throw new Error(
      "useDescendantsContext must be used within DescendantsProvider"
    );
  }
  return context;
}
function useOptionalDescendantsContext() {
  const context = useContext14(DescendantsContext);
  return context;
}
function useDescendantIndex(props, customId) {
  const context = useDescendantsContext();
  const generatedId = useId5();
  const id = customId ?? generatedId;
  const renderOrder = context.claimRenderOrder(id);
  const registerRef = useRef11(context.register);
  registerRef.current = context.register;
  const propsRef = useRef11(props);
  propsRef.current = props;
  const renderOrderRef = useRef11(renderOrder);
  renderOrderRef.current = renderOrder;
  useEffect10(() => {
    const { unregister } = registerRef.current(
      id,
      renderOrderRef.current,
      propsRef.current
    );
    return unregister;
  }, [id]);
  useEffect10(() => {
    registerRef.current(id, renderOrder, propsRef.current);
  }, [id, renderOrder]);
  const index = useMemo8(() => {
    return context.descendants.findIndex((descendant) => descendant.id === id);
  }, [context.descendants, id]);
  return { index, id };
}

// src/components/flow/flow-layout.ts
function computeEdges(flowState) {
  const edges = [];
  collectEdges(flowState.tree, edges);
  return edges;
}
function entryIds(node) {
  if (node.kind === "node")
    return [node.id];
  if (node.kind === "parallel") {
    return node.children.flatMap((child) => entryIds(child));
  }
  if (node.children.length === 0)
    return [];
  return entryIds(node.children[0]);
}
function exitIds(node) {
  if (node.kind === "node")
    return [node.id];
  if (node.kind === "parallel") {
    return node.children.flatMap((child) => exitIds(child));
  }
  if (node.children.length === 0)
    return [];
  return exitIds(node.children[node.children.length - 1]);
}
function collectEdges(node, edges) {
  if (node.kind === "node")
    return;
  if (node.kind === "parallel") {
    for (const child of node.children) {
      collectEdges(child, edges);
    }
    return;
  }
  for (const child of node.children) {
    collectEdges(child, edges);
  }
  for (let i = 0; i < node.children.length - 1; i++) {
    const current = node.children[i];
    const next = node.children[i + 1];
    if (current.kind === "parallel" && next.kind === "parallel")
      continue;
    for (const from of exitIds(current)) {
      for (const to of entryIds(next)) {
        edges.push([from, to]);
      }
    }
  }
}
function computePositions(flowState, { columnGap = 64, rowGap = 16 } = {}) {
  const positions = {};
  const align = flowState.align;
  const orientation = flowState.orientation;
  function layout(node, originX, originY, out) {
    if (node.kind === "node") {
      const measured = flowState.nodes[node.id];
      const w = measured?.width ?? 0;
      const h = measured?.height ?? 0;
      out[node.id] = { x: originX, y: originY };
      return { width: w, height: h };
    }
    if (node.kind === "list") {
      if (orientation === "vertical") {
        if (align === "center") {
          const sizes = node.children.map((child) => layout(child, 0, 0, {}));
          const columnWidth = sizes.reduce(
            (max, s) => Math.max(max, s.width),
            0
          );
          let cursorY3 = originY;
          for (let i = 0; i < node.children.length; i++) {
            const childX = originX + (columnWidth - sizes[i].width) / 2;
            layout(node.children[i], childX, cursorY3, out);
            cursorY3 += sizes[i].height;
            if (i < node.children.length - 1)
              cursorY3 += columnGap;
          }
          return { width: columnWidth, height: cursorY3 - originY };
        }
        let cursorY2 = originY;
        let totalWidth = 0;
        for (let i = 0; i < node.children.length; i++) {
          const { width, height } = layout(
            node.children[i],
            originX,
            cursorY2,
            out
          );
          cursorY2 += height;
          if (i < node.children.length - 1)
            cursorY2 += columnGap;
          totalWidth = Math.max(totalWidth, width);
        }
        return { width: totalWidth, height: cursorY2 - originY };
      }
      if (align === "center") {
        const sizes = node.children.map((child) => layout(child, 0, 0, {}));
        const rowHeight = sizes.reduce((max, s) => Math.max(max, s.height), 0);
        let cursorX2 = originX;
        for (let i = 0; i < node.children.length; i++) {
          const childY = originY + (rowHeight - sizes[i].height) / 2;
          layout(node.children[i], cursorX2, childY, out);
          cursorX2 += sizes[i].width;
          if (i < node.children.length - 1)
            cursorX2 += columnGap;
        }
        return { width: cursorX2 - originX, height: rowHeight };
      }
      let cursorX = originX;
      let totalHeight = 0;
      for (let i = 0; i < node.children.length; i++) {
        const { width, height } = layout(
          node.children[i],
          cursorX,
          originY,
          out
        );
        cursorX += width;
        if (i < node.children.length - 1)
          cursorX += columnGap;
        totalHeight = Math.max(totalHeight, height);
      }
      return { width: cursorX - originX, height: totalHeight };
    }
    if (orientation === "vertical") {
      if (node.align === "end") {
        const sizes = node.children.map((child) => layout(child, 0, 0, {}));
        const maxHeight2 = sizes.reduce((max, s) => Math.max(max, s.height), 0);
        let cursorX2 = originX;
        for (let i = 0; i < node.children.length; i++) {
          const childY = originY + maxHeight2 - sizes[i].height;
          layout(node.children[i], cursorX2, childY, out);
          cursorX2 += sizes[i].width;
          if (i < node.children.length - 1)
            cursorX2 += rowGap;
        }
        return { width: cursorX2 - originX, height: maxHeight2 };
      }
      let cursorX = originX;
      let maxHeight = 0;
      for (let i = 0; i < node.children.length; i++) {
        const { width, height } = layout(
          node.children[i],
          cursorX,
          originY,
          out
        );
        maxHeight = Math.max(maxHeight, height);
        cursorX += width;
        if (i < node.children.length - 1)
          cursorX += rowGap;
      }
      return { width: cursorX - originX, height: maxHeight };
    }
    if (node.align === "end") {
      const sizes = node.children.map((child) => layout(child, 0, 0, {}));
      const maxWidth2 = sizes.reduce((max, s) => Math.max(max, s.width), 0);
      let cursorY2 = originY;
      for (let i = 0; i < node.children.length; i++) {
        const childX = originX + maxWidth2 - sizes[i].width;
        layout(node.children[i], childX, cursorY2, out);
        cursorY2 += sizes[i].height;
        if (i < node.children.length - 1)
          cursorY2 += rowGap;
      }
      return { width: maxWidth2, height: cursorY2 - originY };
    }
    let cursorY = originY;
    let maxWidth = 0;
    for (let i = 0; i < node.children.length; i++) {
      const { width, height } = layout(node.children[i], originX, cursorY, out);
      maxWidth = Math.max(maxWidth, width);
      cursorY += height;
      if (i < node.children.length - 1)
        cursorY += rowGap;
    }
    return { width: maxWidth, height: cursorY - originY };
  }
  layout(flowState.tree, 0, 0, positions);
  return positions;
}
function computeDiagramRect(positions, flowState) {
  let width = 0;
  let height = 0;
  for (const [id, pos] of Object.entries(positions)) {
    const node = flowState.nodes[id];
    if (!node)
      continue;
    width = Math.max(width, pos.x + node.width);
    height = Math.max(height, pos.y + node.height);
  }
  return { width, height };
}

// src/components/flow/diagram.tsx
import { jsx as jsx54, jsxs as jsxs34 } from "react/jsx-runtime";
var DEFAULT_PADDING = {
  y: 64,
  x: 16
};
function isEventFromNode(target) {
  return target instanceof Element && target.closest("[data-node-id]") !== null;
}
var MIN_SCROLLBAR_THUMB_SIZE = 10;
function FlowDiagram({
  orientation = "horizontal",
  canvas = true,
  align = "start",
  padding: requestedPadding,
  onOverflowChange,
  className,
  children
}) {
  const wrapperRef = useRef12(null);
  const contentRef = useRef12(null);
  const padding = {
    x: requestedPadding?.x ?? DEFAULT_PADDING.x,
    y: requestedPadding?.y ?? DEFAULT_PADDING.y
  };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [bounds, setBounds] = useState10(null);
  const [dimensions, setDimensions] = useState10(null);
  const [isPanning, setIsPanning] = useState10(false);
  const [canPan, setCanPan] = useState10(false);
  const [nodes, setNodes] = useState10({});
  const [rootDescendants, setRootDescendants] = useState10([]);
  const [childrenByParent, setChildrenByParent] = useState10(/* @__PURE__ */ new Map());
  const reportNode = useCallback11(
    (id, props) => {
      setNodes((prev) => {
        const existing = prev[id];
        if (existing?.width === props.width && existing?.height === props.height && existing?.disabled === props.disabled && existing?.startAnchorOffset === props.startAnchorOffset && existing?.endAnchorOffset === props.endAnchorOffset)
          return prev;
        return { ...prev, [id]: props };
      });
    },
    []
  );
  const removeNode = useCallback11((id) => {
    setNodes((prev) => {
      if (!(id in prev))
        return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);
  const reportDescendants = useCallback11(
    (id, descendants) => {
      if (id === null) {
        setRootDescendants((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(descendants))
            return prev;
          return descendants;
        });
      } else {
        setChildrenByParent((prev) => {
          const existing = prev.get(id);
          if (JSON.stringify(existing) === JSON.stringify(descendants))
            return prev;
          const next = new Map(prev);
          next.set(id, descendants);
          return next;
        });
      }
    },
    []
  );
  const tree = descendantsToTree(rootDescendants, childrenByParent);
  const flowState = { nodes, tree, align, orientation };
  const edges = computeEdges(flowState);
  const nodePositions = computePositions(flowState);
  const diagramRect = computeDiagramRect(nodePositions, flowState);
  const flowStateContextValue = useMemo9(
    () => ({
      reportNode,
      removeNode,
      reportDescendants,
      orientation,
      nodePositions,
      edges
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      reportNode,
      removeNode,
      reportDescendants,
      orientation,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(nodePositions),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      JSON.stringify(edges)
    ]
  );
  useEffect11(() => {
    if (!canvas)
      return;
    if (!wrapperRef.current || !contentRef.current)
      return;
    const measureBounds = () => {
      if (!wrapperRef.current || !contentRef.current)
        return;
      const wrapper = wrapperRef.current.getBoundingClientRect();
      const content = contentRef.current.getBoundingClientRect();
      const availableWidth = wrapper.width - padding.x * 2;
      const availableHeight = wrapper.height - padding.y * 2;
      setBounds({
        x: Math.min(0, availableWidth - content.width),
        y: Math.min(0, availableHeight - content.height)
      });
      setDimensions({
        viewportWidth: availableWidth,
        viewportHeight: availableHeight,
        contentWidth: content.width,
        contentHeight: content.height
      });
      const isXOverflow = content.width > availableWidth;
      const isYOverflow = content.height > availableHeight;
      setCanPan(isXOverflow || isYOverflow);
      onOverflowChange?.({ x: isXOverflow, y: isYOverflow });
    };
    measureBounds();
    const resizeObserver = new ResizeObserver(measureBounds);
    resizeObserver.observe(wrapperRef.current);
    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [padding.x, padding.y, canvas, onOverflowChange]);
  useEffect11(() => {
    if (!canvas)
      return;
    if (!bounds)
      return;
    if (x.get() < bounds.x) {
      x.set(bounds.x);
    }
    if (y.get() < bounds.y) {
      y.set(bounds.y);
    }
  }, [bounds, x, y, canvas]);
  useEffect11(() => {
    if (!canvas)
      return;
    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [canvas]);
  useEffect11(() => {
    if (!canvas)
      return;
    const wrapper = wrapperRef.current;
    if (!wrapper)
      return;
    const handleWheel = (e) => {
      if (!bounds)
        return;
      const canScrollX2 = bounds.x < 0;
      const canScrollY2 = bounds.y < 0;
      if (!canScrollX2 && !canScrollY2)
        return;
      e.preventDefault();
      if (canScrollY2) {
        const newY = Math.max(bounds.y, Math.min(0, y.get() - e.deltaY));
        y.set(newY);
      }
      if (canScrollX2) {
        const newX = Math.max(bounds.x, Math.min(0, x.get() - e.deltaX));
        x.set(newX);
      }
    };
    wrapper.addEventListener("wheel", handleWheel, { passive: false });
    return () => wrapper.removeEventListener("wheel", handleWheel);
  }, [canvas, bounds, x, y]);
  const handlePanStart = (e) => {
    if (isEventFromNode(e.target))
      return;
    setIsPanning(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  };
  const handlePan = (_, info) => {
    if (!bounds || !isPanning)
      return;
    x.set(Math.max(bounds.x, Math.min(0, x.get() + info.delta.x)));
    y.set(Math.max(bounds.y, Math.min(0, y.get() + info.delta.y)));
  };
  const handlePanEnd = () => {
    if (!isPanning)
      return;
    setIsPanning(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };
  const canScrollX = bounds && bounds.x < 0;
  const canScrollY = bounds && bounds.y < 0;
  const scrollThumbWidth = dimensions && dimensions.contentWidth > 0 && dimensions.viewportWidth > 0 ? Math.max(
    MIN_SCROLLBAR_THUMB_SIZE,
    dimensions.viewportWidth / dimensions.contentWidth * 100
  ) : 0;
  const scrollThumbHeight = dimensions && dimensions.contentHeight > 0 && dimensions.viewportHeight > 0 ? Math.max(
    MIN_SCROLLBAR_THUMB_SIZE,
    dimensions.viewportHeight / dimensions.contentHeight * 100
  ) : 0;
  const scrollbarXPercent = useTransform(
    x,
    [0, bounds?.x ?? 0],
    [0, 100 - scrollThumbWidth]
  );
  const scrollbarYPercent = useTransform(
    y,
    [0, bounds?.y ?? 0],
    [0, 100 - scrollThumbHeight]
  );
  const scrollTop = useMotionTemplate`${scrollbarYPercent}%`;
  const scrollLeft = useMotionTemplate`${scrollbarXPercent}%`;
  return /* @__PURE__ */ jsx54(FlowStateContext.Provider, { value: flowStateContextValue, children: /* @__PURE__ */ jsxs34(
    motion.div,
    {
      ref: wrapperRef,
      className: cn("group isolate grow overflow-hidden", className),
      style: {
        paddingTop: padding.y,
        paddingBottom: padding.y,
        paddingLeft: padding.x,
        paddingRight: padding.x,
        cursor: canPan && !isPanning ? "grab" : void 0
      },
      onPanStart: handlePanStart,
      onPan: handlePan,
      onPanEnd: handlePanEnd,
      children: [
        /* @__PURE__ */ jsxs34(
          motion.div,
          {
            "data-testid": "flow-contents",
            ref: contentRef,
            className: "relative mx-auto",
            style: {
              x,
              y,
              width: diagramRect.width || void 0,
              height: diagramRect.height || void 0
            },
            children: [
              /* @__PURE__ */ jsx54(FlowNodeList, { children }),
              /* @__PURE__ */ jsx54("div", { className: "pointer-events-none absolute inset-0", children: /* @__PURE__ */ jsx54(
                FlowConnectors,
                {
                  edges,
                  nodePositions,
                  nodes: flowState.nodes,
                  orientation
                }
              ) })
            ]
          }
        ),
        canScrollY && /* @__PURE__ */ jsx54("div", { className: "absolute top-1 right-1 bottom-1 w-1.5 rounded-full bg-zenth-hairline/50 opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx54(
          motion.div,
          {
            className: "absolute w-full rounded-full bg-zenth-fill",
            style: {
              height: `${scrollThumbHeight}%`,
              top: scrollTop
            }
          }
        ) }),
        canScrollX && /* @__PURE__ */ jsx54("div", { className: "absolute right-1 bottom-1 left-1 h-1.5 rounded-full bg-zenth-hairline/50 opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx54(
          motion.div,
          {
            className: "absolute h-full rounded-full bg-zenth-fill",
            style: {
              width: `${scrollThumbWidth}%`,
              left: scrollLeft
            }
          }
        ) })
      ]
    }
  ) });
}
var FlowStateContext = createContext15(null);
function useFlowStateContext() {
  const context = useContext15(FlowStateContext);
  if (context === null) {
    throw new Error("useFlowStateContext must be used within a FlowDiagram");
  }
  return context;
}
var useNodeGroup = () => useDescendants();
var useNode = (props, id) => useDescendantIndex(props, id);
var useOptionalNode = (props) => {
  const parentContext = useOptionalDescendantsContext();
  const id = useId6();
  const renderOrder = parentContext?.claimRenderOrder(id) ?? -1;
  const registerRef = useRef12(parentContext?.register);
  registerRef.current = parentContext?.register;
  const propsRef = useRef12(props);
  propsRef.current = props;
  const renderOrderRef = useRef12(renderOrder);
  renderOrderRef.current = renderOrder;
  useEffect11(() => {
    if (!registerRef.current)
      return;
    const { unregister } = registerRef.current(
      id,
      renderOrderRef.current,
      propsRef.current
    );
    return unregister;
  }, [id]);
  useEffect11(() => {
    if (!registerRef.current)
      return;
    registerRef.current(id, renderOrder, propsRef.current);
  }, [id, renderOrder]);
  if (!parentContext)
    return null;
  const index = parentContext.descendants.findIndex((d) => d.id === id);
  return { index, id };
};
function descendantsToTree(descendants, childrenByParent = /* @__PURE__ */ new Map()) {
  return {
    kind: "list",
    children: descendants.map((d) => descendantToTreeNode(d, childrenByParent))
  };
}
function descendantToTreeNode(d, childrenByParent) {
  if (d.props.kind === "node")
    return { kind: "node", id: d.id };
  const ownDescendants = childrenByParent.get(d.id) ?? [];
  const children = ownDescendants.map(
    (child) => descendantToTreeNode(child, childrenByParent)
  );
  if (d.props.kind === "parallel") {
    return { kind: "parallel", children, align: d.props.align };
  }
  return { kind: "list", children };
}
function FlowNodeList({ children }) {
  const descendants = useNodeGroup();
  const { reportDescendants, orientation } = useFlowStateContext();
  const structuralKey = JSON.stringify(
    descendants.descendants.map((d) => ({
      id: d.id,
      kind: d.props.kind,
      children: d.props.kind !== "node" ? d.props.children : void 0
    }))
  );
  const nodeProps = useMemo9(
    () => ({
      kind: "list",
      children: descendants.descendants.map((d) => d.id),
      disabled: false
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structuralKey]
  );
  const registration = useOptionalNode(nodeProps);
  useEffect11(() => {
    reportDescendants(registration?.id ?? null, descendants.descendants);
  }, [structuralKey, reportDescendants, registration?.id]);
  return /* @__PURE__ */ jsx54(DescendantsProvider, { value: descendants, children: /* @__PURE__ */ jsx54(
    "ul",
    {
      className: cn(
        "ml-0 list-none",
        orientation === "vertical" && "flex flex-col"
      ),
      children
    }
  ) });
}

// src/components/flow/node.tsx
import {
  cloneElement as cloneElement5,
  createContext as createContext16,
  forwardRef as forwardRef27,
  isValidElement as isValidElement9,
  useCallback as useCallback12,
  useContext as useContext16,
  useLayoutEffect as useLayoutEffect3,
  useMemo as useMemo10,
  useRef as useRef13
} from "react";
import { jsx as jsx55 } from "react/jsx-runtime";
function mergeRefs(...refs) {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}
var FlowNode = forwardRef27(
  function FlowNode2({ id: idProp, render, children, disabled = false }, ref) {
    const nodeRef = useRef13(null);
    const nodeProps = useMemo10(() => ({ kind: "node" }), []);
    const { index, id } = useNode(nodeProps, idProp);
    const { reportNode, removeNode, nodePositions } = useFlowStateContext();
    const startAnchorOffsetRef = useRef13(void 0);
    const endAnchorOffsetRef = useRef13(void 0);
    const reportSize = useCallback12(() => {
      if (!nodeRef.current)
        return;
      const { width, height } = nodeRef.current.getBoundingClientRect();
      reportNode(id, {
        width,
        height,
        disabled,
        startAnchorOffset: startAnchorOffsetRef.current,
        endAnchorOffset: endAnchorOffsetRef.current
      });
    }, [reportNode, id, disabled]);
    useLayoutEffect3(() => {
      if (!nodeRef.current)
        return;
      const observer = new ResizeObserver(reportSize);
      observer.observe(nodeRef.current);
      reportSize();
      return () => {
        observer.disconnect();
        removeNode(id);
      };
    }, [reportSize, removeNode, id]);
    const registerAnchor = useCallback12(
      (type, el) => {
        const writeOffsets = (offset) => {
          if (type === "start" || type === "both")
            startAnchorOffsetRef.current = offset;
          if (type === "end" || type === "both")
            endAnchorOffsetRef.current = offset;
        };
        if (!el) {
          writeOffsets(void 0);
          reportSize();
          return;
        }
        const measure = () => {
          if (!nodeRef.current)
            return;
          const anchorRect = el.getBoundingClientRect();
          const nodeRect = nodeRef.current.getBoundingClientRect();
          const marginTop = parseFloat(getComputedStyle(nodeRef.current).marginTop) || 0;
          writeOffsets(
            anchorRect.top - nodeRect.top + marginTop + anchorRect.height / 2
          );
          reportSize();
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        return () => observer.disconnect();
      },
      // reportSize is stable within a render cycle; it changes only when
      // id/disabled/reportNode change, which also triggers FlowNode's own
      // ResizeObserver to re-report. Safe to omit here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [id]
    );
    const anchorContext = useMemo10(() => ({ registerAnchor }), [registerAnchor]);
    const position = nodePositions[id];
    const mergedRef = mergeRefs(ref, nodeRef);
    const positionStyle = position ? { position: "absolute", top: position.y, left: position.x } : { position: "absolute", opacity: 0 };
    let element;
    if (render && isValidElement9(render)) {
      const renderProps = render.props;
      element = cloneElement5(render, {
        ref: mergedRef,
        "data-node-index": index,
        "data-node-id": id,
        "data-testid": renderProps["data-testid"] ?? id,
        "aria-hidden": position ? void 0 : true,
        style: {
          ...positionStyle,
          cursor: "default",
          ...renderProps.style
        },
        children: renderProps.children ?? children
      });
    } else {
      element = /* @__PURE__ */ jsx55(
        "li",
        {
          ref: mergedRef,
          className: "absolute cursor-default rounded-md bg-zenth-base px-3 py-2 shadow ring ring-zenth-line",
          style: positionStyle,
          "data-node-index": index,
          "data-node-id": id,
          "data-testid": id,
          "aria-hidden": position ? void 0 : "true",
          children
        }
      );
    }
    return /* @__PURE__ */ jsx55(FlowNodeAnchorContext.Provider, { value: anchorContext, children: element });
  }
);
FlowNode.displayName = "Flow.Node";
var FlowNodeAnchorContext = createContext16(
  null
);
var FlowAnchor = forwardRef27(
  function FlowAnchor2({ type, render, children }, ref) {
    const context = useContext16(FlowNodeAnchorContext);
    if (!context) {
      throw new Error("Flow.Anchor must be used within Flow.Node");
    }
    const anchorRef = useRef13(null);
    const mergedRef = mergeRefs(ref, anchorRef);
    const { registerAnchor } = context;
    const anchorType = type ?? "both";
    useLayoutEffect3(() => {
      const el = anchorRef.current;
      if (!el)
        return;
      const cleanup = registerAnchor(anchorType, el);
      return () => {
        cleanup?.();
        registerAnchor(anchorType, null);
      };
    }, [anchorType, registerAnchor]);
    if (render && isValidElement9(render)) {
      const renderProps = render.props;
      return cloneElement5(render, {
        ref: mergedRef,
        children: renderProps.children ?? children
      });
    }
    return /* @__PURE__ */ jsx55("div", { ref: mergedRef, children });
  }
);
FlowAnchor.displayName = "Flow.Anchor";

// src/components/flow/parallel.tsx
import { useEffect as useEffect12, useMemo as useMemo11 } from "react";
import { jsx as jsx56 } from "react/jsx-runtime";
function FlowParallelNode({ children, align }) {
  const descendants = useNodeGroup();
  const { reportDescendants } = useFlowStateContext();
  const structuralKey = JSON.stringify(
    descendants.descendants.map((d) => ({
      id: d.id,
      kind: d.props.kind,
      children: d.props.kind !== "node" ? d.props.children : void 0
    }))
  );
  const nodeProps = useMemo11(
    () => ({
      kind: "parallel",
      children: descendants.descendants.map((d) => d.id),
      align
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [structuralKey, align]
  );
  const { index, id } = useNode(nodeProps);
  useEffect12(() => {
    reportDescendants(id, descendants.descendants);
  }, [structuralKey, reportDescendants, id]);
  return /* @__PURE__ */ jsx56("li", { "data-node-index": index, children: /* @__PURE__ */ jsx56(DescendantsProvider, { value: descendants, children }) });
}

// src/components/flow/index.ts
var Flow = Object.assign(FlowDiagram, {
  Node: FlowNode,
  Parallel: FlowParallelNode,
  List: FlowNodeList,
  Anchor: FlowAnchor
});

// src/components/chart/TimeseriesChart.tsx
import {
  forwardRef as forwardRef29,
  useCallback as useCallback13,
  useEffect as useEffect14,
  useId as useId7,
  useMemo as useMemo12,
  useRef as useRef15,
  useState as useState11
} from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

// src/components/chart/EChart.tsx
import { forwardRef as forwardRef28, useEffect as useEffect13, useRef as useRef14 } from "react";

// src/components/chart/Color.ts
var ChartSemanticLightColors = /* @__PURE__ */ ((ChartSemanticLightColors2) => {
  ChartSemanticLightColors2["Attention"] = "#FC574A";
  ChartSemanticLightColors2["Warning"] = "#F8A054";
  ChartSemanticLightColors2["Success"] = "#00A63E";
  ChartSemanticLightColors2["Neutral"] = "#B9D6FF";
  ChartSemanticLightColors2["Disabled"] = "#CBCBCB";
  ChartSemanticLightColors2["Skeleton"] = "#DDDDDD";
  return ChartSemanticLightColors2;
})(ChartSemanticLightColors || {});
var ChartSemanticDarkColors = /* @__PURE__ */ ((ChartSemanticDarkColors2) => {
  ChartSemanticDarkColors2["Attention"] = "#FC574A";
  ChartSemanticDarkColors2["Warning"] = "#F8A054";
  ChartSemanticDarkColors2["Success"] = "#00A63E";
  ChartSemanticDarkColors2["Neutral"] = "#8EC5FF";
  ChartSemanticDarkColors2["Disabled"] = "#878787";
  ChartSemanticDarkColors2["Skeleton"] = "#5C5C5C";
  return ChartSemanticDarkColors2;
})(ChartSemanticDarkColors || {});
var sequentialLight = {
  blues: ["#E1EAF4", "#8EBCF6", "#4290F0", "#0E58B4", "#03254F"]
};
var sequentialDark = {
  blues: ["#03254F", "#0E58B4", "#4290F0", "#A6BFDD", "#E1EAF4"]
};
var mapAreaByMode = {
  light: "#E5E7EB",
  dark: "#2B2C31"
};
var mapScaleByMode = {
  light: ["#C8DEFB", "#8FBDF6", "#4290F0", "#1E60BE", "#0A3A7A"],
  dark: ["#26456C", "#2C68BE", "#4290F0", "#79AEF4", "#BBD6FA"]
};
var CHART_LIGHT_COLORS = [
  "#4290F0" /* Blue */,
  "#F5B647" /* Yellow */,
  "#E8649D" /* Pink */,
  "#8D58EE" /* Purple */,
  "#50C3B6" /* Teal */,
  "#D37536" /* Orange */
];
var CHART_DARK_COLORS = [
  "#4290F0" /* Blue */,
  "#EEB720" /* Yellow */,
  "#E8649D" /* Pink */,
  "#8D58EE" /* Purple */,
  "#50C3B6" /* Teal */,
  "#D37536" /* Orange */
];
var ChartPalette;
((ChartPalette2) => {
  function semantic(name, isDarkMode = false) {
    return isDarkMode ? ChartSemanticDarkColors[name] : ChartSemanticLightColors[name];
  }
  ChartPalette2.semantic = semantic;
  function categorical(index, isDarkMode = false) {
    return isDarkMode ? CHART_DARK_COLORS[index % CHART_DARK_COLORS.length] : CHART_LIGHT_COLORS[index % CHART_LIGHT_COLORS.length];
  }
  ChartPalette2.categorical = categorical;
  function sequential(palette, isDarkMode = false) {
    return isDarkMode ? [...sequentialDark[palette]] : [...sequentialLight[palette]];
  }
  ChartPalette2.sequential = sequential;
  function text(variant, isDarkMode = false) {
    const colors = {
      light: { primary: "#6B7280", secondary: "#9CA3AF" },
      dark: { primary: "#9CA3AF", secondary: "#6B7280" }
    };
    return isDarkMode ? colors.dark[variant] : colors.light[variant];
  }
  ChartPalette2.text = text;
  function mapColors(isDarkMode = false) {
    const mode = isDarkMode ? "dark" : "light";
    return {
      area: mapAreaByMode[mode],
      bubble: categorical(0, isDarkMode),
      scale: [...mapScaleByMode[mode]]
    };
  }
  ChartPalette2.mapColors = mapColors;
})(ChartPalette || (ChartPalette = {}));

// src/components/chart/EChart.tsx
import { jsx as jsx57 } from "react/jsx-runtime";
var transformTooltip = (tooltipObj) => {
  const { dangerousHtmlFormatter, ...restOfTooltip } = tooltipObj;
  return {
    ...restOfTooltip,
    formatter: dangerousHtmlFormatter
  };
};
var prepareChartOptions = ({
  options,
  isDarkMode
}) => {
  const withDefaults = {
    backgroundColor: "transparent",
    color: isDarkMode ? CHART_DARK_COLORS : CHART_LIGHT_COLORS,
    ...options
  };
  if (!withDefaults.tooltip)
    return withDefaults;
  return {
    ...withDefaults,
    tooltip: Array.isArray(withDefaults.tooltip) ? withDefaults.tooltip.map(transformTooltip) : transformTooltip(withDefaults.tooltip)
  };
};
var Chart = forwardRef28(function Chart2({
  echarts,
  options,
  optionUpdateBehavior,
  className,
  isDarkMode,
  height = 350,
  aspectRatio,
  onEvents
}, ref) {
  const elRef = useRef14(null);
  const chartRef = useRef14(null);
  const handlersRef = useRef14({});
  const wrappersRef = useRef14({});
  const boundEventsRef = useRef14(/* @__PURE__ */ new Set());
  useEffect13(() => {
    if (!elRef.current)
      return;
    const chart = echarts.init(elRef.current, isDarkMode ? "dark" : void 0);
    chartRef.current = chart;
    if (typeof ref === "function")
      ref(chart);
    else if (ref)
      ref.current = chart;
    return () => {
      for (const event of boundEventsRef.current) {
        const wrapper = wrappersRef.current[event];
        if (wrapper)
          chart.off(event, wrapper);
      }
      boundEventsRef.current.clear();
      if (typeof ref === "function")
        ref(null);
      else if (ref)
        ref.current = null;
      chartRef.current = null;
      chart.dispose();
    };
  }, [elRef, isDarkMode]);
  useEffect13(() => {
    const chart = chartRef.current;
    if (!chart)
      return;
    chart.setOption(prepareChartOptions({ options, isDarkMode }), {
      notMerge: false,
      lazyUpdate: true,
      ...optionUpdateBehavior
    });
  }, [isDarkMode, optionUpdateBehavior, options]);
  useEffect13(() => {
    handlersRef.current = onEvents ?? {};
  }, [onEvents]);
  useEffect13(() => {
    const chart = chartRef.current;
    if (!chart)
      return;
    const nextBound = /* @__PURE__ */ new Set();
    for (const [event, handler] of Object.entries(onEvents ?? {})) {
      if (typeof handler !== "function")
        continue;
      nextBound.add(event);
      if (!wrappersRef.current[event]) {
        wrappersRef.current[event] = (params) => {
          const current = handlersRef.current;
          current[event]?.(params);
        };
      }
      if (!boundEventsRef.current.has(event)) {
        chart.on(event, wrappersRef.current[event]);
      }
    }
    for (const event of boundEventsRef.current) {
      if (nextBound.has(event))
        continue;
      const wrapper = wrappersRef.current[event];
      if (wrapper) {
        chart.off(event, wrapper);
      }
    }
    boundEventsRef.current = nextBound;
  }, [echarts, isDarkMode, onEvents]);
  useEffect13(() => {
    const chart = chartRef.current;
    const el = elRef.current;
    if (!chart || !el)
      return;
    let isInitial = true;
    const ro = new ResizeObserver(() => {
      if (isInitial) {
        isInitial = false;
        return;
      }
      chart.resize();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return /* @__PURE__ */ jsx57(
    "div",
    {
      ref: elRef,
      className: cn("w-full", className),
      style: aspectRatio !== void 0 ? { aspectRatio: String(aspectRatio) } : { height },
      tabIndex: options.aria?.enabled ? 0 : void 0,
      role: options.aria?.enabled ? "img" : void 0
    }
  );
});
Chart.displayName = "Chart";

// src/components/chart/timeseries-markers.ts
function buildTimeseriesMarkerAnnotations(clusters, style) {
  if (clusters.length === 0)
    return void 0;
  const labelStyle = {
    backgroundColor: style.labelBackgroundColor,
    padding: [2, 4],
    borderRadius: 6,
    shadowBlur: 8,
    shadowColor: style.labelBackgroundColor
  };
  return {
    markLine: {
      symbol: "none",
      silent: false,
      animation: false,
      z: 10,
      lineStyle: {
        type: "dashed",
        color: style.color,
        width: 1
      },
      emphasis: {
        lineStyle: { width: 2 }
      },
      blur: {
        lineStyle: { opacity: 1 },
        label: { opacity: 1 }
      },
      label: {
        show: true,
        formatter: (params) => params.name ?? "",
        position: "insideEndTop",
        color: style.color,
        ...labelStyle
      },
      data: clusters.map((cluster) => ({
        name: cluster.label,
        xAxis: cluster.timestamp,
        lineStyle: {
          type: cluster.lineStyle ?? "dashed",
          color: cluster.color ?? style.color,
          width: 1
        },
        emphasis: {
          lineStyle: { width: 2 }
        },
        blur: {
          lineStyle: { opacity: 1 },
          label: { opacity: 1 }
        },
        label: {
          show: Boolean(cluster.label),
          color: cluster.color ?? style.color,
          ...labelStyle
        },
        tooltip: { marker: cluster }
      }))
    }
  };
}
function clusterTimeseriesMarkers(markers, interval) {
  if (!markers?.length)
    return [];
  const sorted = [...markers].sort((a, b) => a.timestamp - b.timestamp);
  const clusters = [];
  for (const marker of sorted) {
    const previous = clusters.at(-1);
    if (previous && marker.timestamp - previous[previous.length - 1].timestamp <= interval) {
      previous.push(marker);
    } else {
      clusters.push([marker]);
    }
  }
  return clusters.map((cluster) => {
    const first = cluster[0];
    return {
      timestamp: first.timestamp,
      label: cluster.length === 1 ? first.label : `${cluster.length} changes`,
      color: first.color,
      lineStyle: first.lineStyle,
      markers: cluster
    };
  });
}
function getApproximateMarkerClusterInterval(timestamps, tickCount) {
  let min = Infinity;
  let max = -Infinity;
  let count = 0;
  for (const timestamp of timestamps) {
    if (timestamp < min)
      min = timestamp;
    if (timestamp > max)
      max = timestamp;
    count++;
  }
  if (count < 2)
    return 0;
  return (max - min) / tickCount;
}
function getTimeseriesMarkerFromEvent(params) {
  if (params.componentType !== "markLine") {
    return void 0;
  }
  return params.data?.tooltip?.marker;
}

// src/components/chart/timeseries-tooltip.tsx
import { memo } from "react";
import { Fragment as Fragment13, jsx as jsx58, jsxs as jsxs35 } from "react/jsx-runtime";
var TooltipContent = memo(function TooltipContent2({
  state,
  formatValue,
  formatTimestamp,
  footer
}) {
  return /* @__PURE__ */ jsxs35(Fragment13, { children: [
    state.type === "marker" ? /* @__PURE__ */ jsx58(
      MarkerTooltipContent,
      {
        state,
        formatValue,
        formatTimestamp
      }
    ) : /* @__PURE__ */ jsxs35(Fragment13, { children: [
      /* @__PURE__ */ jsx58("div", { className: "mb-1 text-xs font-semibold text-zenth-default", children: formatTimestamp(state.ts) }),
      /* @__PURE__ */ jsx58(
        SeriesTooltipRows,
        {
          rows: state.rows,
          hiddenCount: state.hiddenCount,
          formatValue
        }
      )
    ] }),
    footer && /* @__PURE__ */ jsx58("div", { className: "mt-1", children: /* @__PURE__ */ jsx58(Text, { variant: "secondary", size: "xs", children: footer }) })
  ] });
});
function MarkerTooltipContent({
  state,
  formatValue,
  formatTimestamp
}) {
  return /* @__PURE__ */ jsxs35(Fragment13, { children: [
    state.markers.length === 1 && /* @__PURE__ */ jsx58("div", { className: "mb-1 text-xs font-semibold text-zenth-default", children: formatTimestamp(state.markers[0].timestamp) }),
    /* @__PURE__ */ jsx58("div", { className: "space-y-1", children: state.markers.map((marker, index) => /* @__PURE__ */ jsxs35("div", { children: [
      /* @__PURE__ */ jsxs35("div", { className: "flex items-center gap-2 text-xs text-zenth-default", children: [
        /* @__PURE__ */ jsx58(
          "span",
          {
            className: "h-3 w-3 shrink-0 rounded-full",
            style: { backgroundColor: marker.color ?? state.color }
          }
        ),
        /* @__PURE__ */ jsx58("span", { className: "font-medium", children: marker.label ?? "Reference marker" }),
        state.markers.length > 1 && /* @__PURE__ */ jsx58("span", { className: "text-zenth-subtle", children: formatTimestamp(marker.timestamp) })
      ] }),
      marker.description && /* @__PURE__ */ jsx58("div", { className: "mt-0.5 ml-5 text-xs text-zenth-default", children: marker.description })
    ] }, `${marker.timestamp}-${marker.label}-${index}`)) }),
    state.rows.length > 0 && /* @__PURE__ */ jsx58("div", { className: "mt-2 border-t border-zenth-line pt-2", children: /* @__PURE__ */ jsx58(
      SeriesTooltipRows,
      {
        rows: state.rows,
        hiddenCount: state.hiddenCount,
        formatValue
      }
    ) })
  ] });
}
function SeriesTooltipRows({
  rows,
  hiddenCount,
  formatValue
}) {
  return /* @__PURE__ */ jsxs35(Fragment13, { children: [
    rows.map((row) => /* @__PURE__ */ jsxs35(
      "div",
      {
        className: "flex items-center justify-between gap-4 py-0.5",
        children: [
          /* @__PURE__ */ jsxs35("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsx58(
              "span",
              {
                className: "h-3 w-3 shrink-0 rounded-full",
                style: { backgroundColor: row.color }
              }
            ),
            /* @__PURE__ */ jsx58(
              "span",
              {
                className: "truncate text-xs font-medium text-zenth-default",
                title: row.name,
                children: row.name
              }
            )
          ] }),
          /* @__PURE__ */ jsx58("span", { className: "shrink-0 text-xs font-semibold text-zenth-default", children: formatValue ? formatValue(row.value) : formatDefaultValue(row.value) })
        ]
      },
      row.name
    )),
    hiddenCount > 0 && /* @__PURE__ */ jsxs35("div", { className: "mt-1 text-xs text-zenth-subtle", children: [
      "+",
      hiddenCount,
      " more"
    ] })
  ] });
}
var defaultNumberFormat = new Intl.NumberFormat(void 0, {
  maximumFractionDigits: 3
});
function formatDefaultValue(value) {
  if (Number.isInteger(value))
    return String(value);
  return defaultNumberFormat.format(value);
}

// src/components/chart/timeseries-thresholds.ts
function buildTimeseriesThresholdAnnotations(thresholds) {
  if (!thresholds?.length)
    return void 0;
  return {
    markLine: {
      symbol: "none",
      silent: true,
      animation: false,
      z: 9,
      lineStyle: {
        type: "dashed",
        width: 1
      },
      blur: {
        lineStyle: { opacity: 1 },
        label: { opacity: 1 }
      },
      label: {
        show: true,
        position: "insideEndTop",
        formatter: (params) => params.name ?? ""
      },
      data: thresholds.map((threshold) => ({
        name: threshold.label,
        yAxis: threshold.value,
        lineStyle: {
          color: threshold.color,
          width: 1,
          type: "dashed"
        },
        blur: {
          lineStyle: { opacity: 1 },
          label: { opacity: 1 }
        },
        label: {
          show: Boolean(threshold.label),
          color: threshold.color
        }
      }))
    }
  };
}
function getThresholdValueExtent(thresholds) {
  if (!thresholds?.length)
    return void 0;
  const values = thresholds.map((threshold) => threshold.value);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

// src/components/chart/TimeseriesChart.tsx
import { Fragment as Fragment14, jsx as jsx59, jsxs as jsxs36 } from "react/jsx-runtime";
var DEFAULT_X_AXIS_TICK_COUNT = 5;
var TimeseriesChart = forwardRef29(function TimeseriesChart2({
  echarts,
  type = "line",
  data,
  markers,
  thresholds,
  xAxisName,
  xAxisTickCount,
  xAxisHideLabelOverlap = true,
  xAxisTickFormat,
  yAxisTickFormat,
  yAxisTickLabelFormat,
  yAxisName,
  yAxisTickCount,
  yAxisMinInterval,
  tooltipValueFormat,
  tooltipTimestampFormat,
  tooltipFooter,
  onTimeRangeChange,
  height = 350,
  incomplete,
  enableLegendSelection = false,
  isDarkMode,
  gradient,
  loading,
  ariaDescription,
  optionUpdateBehavior,
  tooltipMode = "all",
  tooltipMaxItems = 10,
  tooltipFollowCursor = "both",
  tooltipBoundary
}, ref) {
  const chartRef = useRef15(null);
  const containerRef = useRef15(null);
  const mergedRef = useCallback13(
    (instance) => {
      chartRef.current = instance;
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref]
  );
  const dataRef = useRef15(data);
  dataRef.current = data;
  const legendSelectedRef = useRef15(null);
  useEffect14(() => {
    legendSelectedRef.current = null;
  }, [enableLegendSelection, isDarkMode]);
  const markerHoverRef = useRef15(false);
  const activeMarkerKeyRef = useRef15(null);
  const tooltipModeRef = useRef15(tooltipMode);
  tooltipModeRef.current = tooltipMode;
  const tooltipMaxItemsRef = useRef15(tooltipMaxItems);
  tooltipMaxItemsRef.current = tooltipMaxItems;
  const [tooltipState, setTooltipState] = useState11(null);
  const closeTooltip = useCallback13(() => {
    activeMarkerKeyRef.current = null;
    markerHoverRef.current = false;
    setTooltipState(null);
  }, []);
  const tooltipOpen = tooltipState !== null;
  useEffect14(() => {
    if (!tooltipOpen)
      return;
    if (typeof window === "undefined")
      return;
    const closeWhenOutsideChart = (event) => {
      const container = containerRef.current;
      if (!container)
        return;
      const rect = container.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
        closeTooltip();
      }
    };
    window.addEventListener("mousemove", closeWhenOutsideChart);
    return () => window.removeEventListener("mousemove", closeWhenOutsideChart);
  }, [tooltipOpen, closeTooltip]);
  const mousePosRef = useRef15({ x: 0, y: 0 });
  useEffect14(() => {
    const container = containerRef.current;
    if (!container)
      return;
    const onMove = (e) => {
      const rect = container.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };
    container.addEventListener("mousemove", onMove);
    return () => container.removeEventListener("mousemove", onMove);
  }, []);
  const incompleteBefore = incomplete?.before;
  const incompleteAfter = incomplete?.after;
  const markerColor = ChartPalette.text("primary", isDarkMode);
  const axisTextColor = ChartPalette.text("primary", isDarkMode);
  const gridLineColor = colorWithOpacity(axisTextColor, 0.2);
  const markerLabelBackgroundColor = isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)";
  const options = useMemo12(() => {
    const transformSeries = [];
    const seriesType = type === "bar" ? { type: "bar", stack: "total" } : { type: "line", showSymbol: false };
    const thresholdAnnotations = buildTimeseriesThresholdAnnotations(thresholds);
    const thresholdExtent = getThresholdValueExtent(thresholds);
    const markerClusters = markers?.length ? clusterTimeseriesMarkers(
      markers,
      getApproximateMarkerClusterInterval(
        getTimestamps(data, markers),
        xAxisTickCount ?? DEFAULT_X_AXIS_TICK_COUNT
      )
    ) : [];
    const markerAnnotations = buildTimeseriesMarkerAnnotations(markerClusters, {
      color: markerColor,
      labelBackgroundColor: markerLabelBackgroundColor
    });
    for (const s of data) {
      const incompleteBeforePoints = incompleteBefore && type === "line" ? s.data.filter((point) => point[0] <= incompleteBefore) : [];
      const incompleteAfterPoints = incompleteAfter && type === "line" ? s.data.filter((point) => point[0] >= incompleteAfter) : [];
      const completePoints = incompleteBeforePoints.length > 0 || incompleteAfterPoints.length > 0 ? s.data.slice(
        Math.max(0, incompleteBeforePoints.length - 1),
        Math.max(0, s.data.length - incompleteAfterPoints.length + 1)
      ) : s.data;
      const areaStyle = gradient && type === "line" ? {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: colorWithOpacity(s.color, 0.4) },
          { offset: 1, color: colorWithOpacity(s.color, 0) }
        ])
      } : void 0;
      transformSeries.push({
        data: completePoints,
        color: s.color,
        name: s.name,
        emphasis: { focus: "series" },
        ...areaStyle ? { areaStyle } : {},
        ...seriesType
      });
      const incompleteSeriesConfig = {
        color: s.color,
        name: s.name,
        type: "line",
        lineStyle: { type: "dashed" },
        showSymbol: false,
        emphasis: { focus: "series" }
      };
      if (incompleteBeforePoints.length > 0) {
        transformSeries.push({
          ...incompleteSeriesConfig,
          data: incompleteBeforePoints
        });
      }
      if (incompleteAfterPoints.length > 0) {
        transformSeries.push({
          ...incompleteSeriesConfig,
          data: incompleteAfterPoints
        });
      }
    }
    if (markerAnnotations) {
      transformSeries.push({
        data: [],
        name: "Markers",
        type: type === "bar" ? "bar" : "line",
        animation: false,
        markLine: markerAnnotations.markLine
      });
    }
    if (thresholdAnnotations) {
      transformSeries.push({
        data: [],
        name: "Thresholds",
        type: type === "bar" ? "bar" : "line",
        animation: false,
        markLine: thresholdAnnotations.markLine
      });
    }
    return {
      aria: {
        enabled: true,
        ...ariaDescription && { label: { description: ariaDescription } }
      },
      brush: {
        xAxisIndex: "all",
        brushType: "lineX",
        brushMode: "single",
        outOfBrush: {
          colorAlpha: 0.3
        },
        brushStyle: {
          borderWidth: 1,
          color: "rgba(120,140,180,0.3)",
          borderColor: "rgba(120,140,180,0.8)"
        }
      },
      tooltip: {
        trigger: "axis",
        showContent: false,
        axisPointer: { type: "shadow" }
      },
      backgroundColor: "transparent",
      toolbox: { show: false },
      ...enableLegendSelection ? { legend: { show: false } } : {},
      xAxis: {
        name: xAxisName,
        nameLocation: "middle",
        nameGap: 30,
        nameTextStyle: { color: axisTextColor },
        type: "time",
        splitLine: {
          show: false
        },
        axisLine: { show: false },
        splitNumber: xAxisTickCount ?? DEFAULT_X_AXIS_TICK_COUNT,
        axisLabel: {
          color: axisTextColor,
          hideOverlap: xAxisHideLabelOverlap,
          ...xAxisTickFormat && {
            formatter: (value) => xAxisTickFormat(value)
          }
        }
      },
      yAxis: {
        name: yAxisName,
        nameLocation: "middle",
        nameGap: 40,
        nameTextStyle: { color: axisTextColor },
        type: "value",
        axisTick: { show: true },
        axisLabel: {
          margin: 15,
          color: axisTextColor,
          ...yAxisTickFormat && {
            formatter: (value) => yAxisTickFormat(value)
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            width: 1,
            color: gridLineColor
          }
        },
        splitNumber: yAxisTickCount,
        ...yAxisMinInterval !== void 0 && {
          minInterval: yAxisMinInterval
        },
        ...thresholdExtent && {
          min: (value) => Math.min(value.min, thresholdExtent.min),
          max: (value) => Math.max(value.max, thresholdExtent.max)
        }
      },
      grid: {
        left: yAxisName ? 30 : 24,
        right: 24,
        top: 24,
        bottom: xAxisName ? 30 : 24
      },
      series: transformSeries
    };
  }, [
    data,
    xAxisName,
    xAxisTickCount,
    xAxisHideLabelOverlap,
    xAxisTickFormat,
    yAxisTickFormat,
    yAxisName,
    yAxisTickCount,
    yAxisMinInterval,
    incompleteBefore,
    incompleteAfter,
    type,
    gradient,
    enableLegendSelection,
    echarts,
    ariaDescription,
    markers,
    thresholds,
    markerColor,
    markerLabelBackgroundColor,
    axisTextColor,
    gridLineColor
  ]);
  const events = useMemo12(() => {
    return {
      updateaxispointer: (params) => {
        if (markerHoverRef.current)
          return;
        const ts = params?.axesInfo?.[0]?.value;
        if (ts == null)
          return;
        const allRows = getAllTooltipRowsAtTimestamp(
          dataRef.current,
          ts,
          legendSelectedRef.current
        );
        let rows;
        let hiddenCount = 0;
        if (tooltipModeRef.current === "single") {
          const chart = chartRef.current;
          const cursorValue = chart ? chart.convertFromPixel("grid", [0, mousePosRef.current.y])?.[1] : null;
          if (cursorValue != null && allRows.length > 0) {
            const nearest = allRows.reduce(
              (best, row) => Math.abs(row.value - cursorValue) < Math.abs(best.value - cursorValue) ? row : best
            );
            rows = [nearest];
          } else {
            rows = allRows.slice(0, 1);
          }
        } else {
          ({ rows, hiddenCount } = limitTooltipRows(
            allRows,
            tooltipMaxItemsRef.current
          ));
        }
        const nextState = {
          type: "series",
          ts,
          rows,
          hiddenCount
        };
        setTooltipState((prev) => {
          if (isSameTooltipState(prev, nextState))
            return prev;
          return nextState;
        });
      },
      mouseover: (params) => {
        const marker = getTimeseriesMarkerFromEvent(params);
        if (!marker)
          return;
        const markerKey = `${marker.timestamp}-${marker.label ?? ""}`;
        if (activeMarkerKeyRef.current === markerKey)
          return;
        activeMarkerKeyRef.current = markerKey;
        markerHoverRef.current = true;
        chartRef.current?.dispatchAction({ type: "hideTip" });
        chartRef.current?.dispatchAction({
          type: "updateAxisPointer",
          currTrigger: "leave"
        });
        const { rows, hiddenCount } = getTooltipRowsAtTimestamp(
          dataRef.current,
          marker.timestamp,
          legendSelectedRef.current,
          tooltipMaxItemsRef.current
        );
        setTooltipState({
          type: "marker",
          ts: marker.timestamp,
          color: marker.color ?? markerColor,
          markers: marker.markers,
          rows,
          hiddenCount
        });
      },
      mouseout: (params) => {
        if (!getTimeseriesMarkerFromEvent(params))
          return;
        closeTooltip();
      },
      globalout: closeTooltip,
      // Keep the tooltip in sync with legend selection. Each action fires a
      // different event — `legendToggleSelect` → `legendselectchanged`,
      // `legendSelect` → `legendselected`, `legendUnSelect` → `legendunselected`
      // — and all three carry the full `selected` map, so we listen to all of
      // them (params type inferred from `ChartEvents`).
      legendselectchanged: (params) => {
        legendSelectedRef.current = params.selected;
      },
      legendselected: (params) => {
        legendSelectedRef.current = params.selected;
      },
      legendunselected: (params) => {
        legendSelectedRef.current = params.selected;
      },
      ...onTimeRangeChange && {
        brushend: (params) => {
          const range = params.areas[0].coordRange;
          onTimeRangeChange(range[0], range[1]);
          chartRef.current?.dispatchAction({ type: "brush", areas: [] });
        }
      }
    };
  }, [onTimeRangeChange, markerColor, closeTooltip]);
  const hasTimeRangeCallback = !!onTimeRangeChange;
  const brushResetKey = optionUpdateBehavior?.notMerge ? options : void 0;
  useEffect14(() => {
    const chart = chartRef.current;
    if (chart && hasTimeRangeCallback) {
      chart.dispatchAction({
        type: "takeGlobalCursor",
        key: "brush",
        brushOption: {
          brushType: "lineX",
          brushMode: "single"
        }
      });
      return () => {
        chart.dispatchAction({
          type: "takeGlobalCursor",
          key: "brush",
          brushOption: {
            brushType: false
          }
        });
      };
    }
  }, [chartRef, hasTimeRangeCallback, loading, brushResetKey]);
  const formatFn = tooltipValueFormat ?? yAxisTickLabelFormat;
  return /* @__PURE__ */ jsxs36(
    TooltipPrimitive.Root,
    {
      open: tooltipOpen,
      trackCursorAxis: tooltipFollowCursor,
      children: [
        /* @__PURE__ */ jsx59(
          TooltipPrimitive.Trigger,
          {
            render: /* @__PURE__ */ jsx59(
              "div",
              {
                ref: containerRef,
                className: "relative w-full",
                style: { height },
                "aria-busy": loading || void 0
              }
            ),
            children: loading ? /* @__PURE__ */ jsx59(
              ChartSkeletonLoader,
              {
                height,
                isDarkMode,
                type
              }
            ) : /* @__PURE__ */ jsx59(
              Chart,
              {
                echarts,
                ref: mergedRef,
                options,
                height,
                isDarkMode,
                onEvents: events,
                optionUpdateBehavior
              }
            )
          }
        ),
        tooltipOpen && /* @__PURE__ */ jsx59(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx59(
          TooltipPrimitive.Positioner,
          {
            side: "right",
            align: "start",
            sideOffset: 12,
            collisionAvoidance: { side: "flip", align: "shift" },
            collisionBoundary: tooltipBoundary,
            collisionPadding: 8,
            children: /* @__PURE__ */ jsx59(
              TooltipPrimitive.Popup,
              {
                "data-mode": isDarkMode ? "dark" : "light",
                className: "max-w-xs min-w-[150px] rounded-lg bg-zenth-base p-2 shadow-md outline-1 outline-zenth-line",
                children: /* @__PURE__ */ jsx59(
                  TooltipContent,
                  {
                    state: tooltipState,
                    formatValue: formatFn,
                    formatTimestamp: tooltipTimestampFormat ?? formatDefaultTimestamp,
                    footer: tooltipFooter
                  }
                )
              }
            )
          }
        ) })
      ]
    }
  );
});
TimeseriesChart.displayName = "TimeseriesChart";
function findNearest(data, ts) {
  if (data.length === 0)
    return null;
  let lo = 0, hi = data.length - 1;
  while (lo < hi) {
    const mid = lo + hi >> 1;
    if (data[mid][0] < ts)
      lo = mid + 1;
    else
      hi = mid;
  }
  if (lo > 0 && Math.abs(data[lo - 1][0] - ts) < Math.abs(data[lo][0] - ts))
    lo--;
  return data[lo][1];
}
function* getTimestamps(data, markers) {
  for (const series of data) {
    for (const [timestamp] of series.data)
      yield timestamp;
  }
  for (const marker of markers)
    yield marker.timestamp;
}
function getAllTooltipRowsAtTimestamp(data, ts, legendSelected) {
  const seenNames = /* @__PURE__ */ new Set();
  const rows = [];
  for (const s of data) {
    if (seenNames.has(s.name))
      continue;
    if (legendSelected && legendSelected[s.name] === false)
      continue;
    seenNames.add(s.name);
    const value = findNearest(s.data, ts);
    if (value != null)
      rows.push({ name: s.name, value, color: s.color });
  }
  return rows.sort((a, b) => b.value - a.value);
}
function limitTooltipRows(rows, max) {
  return {
    rows: rows.slice(0, max),
    hiddenCount: Math.max(0, rows.length - max)
  };
}
function getTooltipRowsAtTimestamp(data, ts, legendSelected, max) {
  return limitTooltipRows(
    getAllTooltipRowsAtTimestamp(data, ts, legendSelected),
    max
  );
}
function isSameMarkerTooltipState(a, b) {
  return a.ts === b.ts && a.color === b.color && a.hiddenCount === b.hiddenCount && a.rows.length === b.rows.length && isSameTooltipRows(a.rows, b.rows) && a.markers.length === b.markers.length && a.markers.every((marker, i) => {
    const next = b.markers[i];
    return marker.timestamp === next.timestamp && marker.label === next.label && marker.description === next.description && marker.color === next.color && marker.lineStyle === next.lineStyle;
  });
}
function isSameTooltipState(a, b) {
  if (!a || a.type !== b.type)
    return false;
  if (a.type === "marker" && b.type === "marker") {
    return isSameMarkerTooltipState(a, b);
  }
  if (a.type !== "series" || b.type !== "series")
    return false;
  if (a.ts !== b.ts || a.hiddenCount !== b.hiddenCount || a.rows.length !== b.rows.length) {
    return false;
  }
  return isSameTooltipRows(a.rows, b.rows);
}
function isSameTooltipRows(a, b) {
  return a.every((row, i) => {
    const next = b[i];
    return row.name === next.name && row.value === next.value && row.color === next.color;
  });
}
var CHART_LOADER_WIDTH = 400;
var CHART_LOADER_SAMPLES = 80;
var CHART_LOADER_BARS = 24;
var CHART_LOADER_BAR_GAP_RATIO = 0.35;
function chartLoaderWave(theta) {
  return 0.45 * Math.sin(3 * theta) + 0.3 * Math.sin(5 * theta + 0.9) + 0.25 * Math.sin(7 * theta + 2.1);
}
function ChartSkeletonLoader({
  height,
  isDarkMode,
  type = "line"
}) {
  const id = `zenth-chart-loader-${useId7().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const fillId = `${id}-fill`;
  const shineId = `${id}-shine`;
  const clipId = `${id}-clip`;
  const color = ChartPalette.semantic("Skeleton", isDarkMode);
  const strokeOpacity = isDarkMode ? 0.36 : 0.6;
  const fillOpacity = isDarkMode ? 0.07 : 0.1;
  const shineOpacity = isDarkMode ? 0.16 : 0.24;
  const barFillOpacity = isDarkMode ? 0.12 : 0.16;
  const slot = CHART_LOADER_WIDTH / CHART_LOADER_BARS;
  const barW = slot * (1 - CHART_LOADER_BAR_GAP_RATIO);
  const minBarH = height * 0.15;
  const maxBarH = height * 0.85;
  const bars = Array.from({ length: CHART_LOADER_BARS }, (_, i) => {
    const theta = (i + 0.5) / CHART_LOADER_BARS * 2 * Math.PI;
    const norm = (chartLoaderWave(theta) + 1) / 2;
    const barH = minBarH + norm * (maxBarH - minBarH);
    const x = i * slot + (slot - barW) / 2;
    return { x, y: height - barH, w: barW, h: barH };
  });
  const mid = height / 2;
  const amp = Math.min(height * 0.18, 40);
  const lineD = Array.from({ length: CHART_LOADER_SAMPLES + 1 }, (_, i) => {
    const x = i / CHART_LOADER_SAMPLES * CHART_LOADER_WIDTH;
    const theta = x / CHART_LOADER_WIDTH * 2 * Math.PI;
    const y = mid - chartLoaderWave(theta) * amp;
    return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const areaD = `${lineD} L${CHART_LOADER_WIDTH},${height} L0,${height} Z`;
  const isBar = type === "bar";
  return /* @__PURE__ */ jsx59(
    "div",
    {
      role: "status",
      "aria-label": "Loading chart",
      className: "absolute inset-0 overflow-hidden",
      style: { height },
      children: /* @__PURE__ */ jsxs36(
        "svg",
        {
          "aria-hidden": "true",
          width: "100%",
          height,
          viewBox: `0 0 ${CHART_LOADER_WIDTH} ${height}`,
          preserveAspectRatio: "none",
          className: "block w-full",
          children: [
            /* @__PURE__ */ jsxs36("defs", { children: [
              /* @__PURE__ */ jsxs36("linearGradient", { id: fillId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                /* @__PURE__ */ jsx59("stop", { offset: "0%", stopColor: color, stopOpacity: fillOpacity }),
                /* @__PURE__ */ jsx59("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
              ] }),
              /* @__PURE__ */ jsxs36("linearGradient", { id: shineId, x1: "0", y1: "0", x2: "1", y2: "0", children: [
                /* @__PURE__ */ jsx59("stop", { offset: "0%", stopColor: color, stopOpacity: "0" }),
                /* @__PURE__ */ jsx59("stop", { offset: "50%", stopColor: color, stopOpacity: shineOpacity }),
                /* @__PURE__ */ jsx59("stop", { offset: "100%", stopColor: color, stopOpacity: "0" })
              ] }),
              /* @__PURE__ */ jsx59("clipPath", { id: clipId, children: isBar ? bars.map((b, i) => /* @__PURE__ */ jsx59("rect", { x: b.x, y: b.y, width: b.w, height: b.h }, i)) : /* @__PURE__ */ jsx59("path", { d: areaD }) })
            ] }),
            isBar ? bars.map((b, i) => /* @__PURE__ */ jsx59(
              "rect",
              {
                x: b.x,
                y: b.y,
                width: b.w,
                height: b.h,
                fill: color,
                fillOpacity: barFillOpacity,
                stroke: "none"
              },
              i
            )) : /* @__PURE__ */ jsxs36(Fragment14, { children: [
              /* @__PURE__ */ jsx59("path", { d: areaD, fill: `url(#${fillId})`, stroke: "none" }),
              /* @__PURE__ */ jsx59(
                "path",
                {
                  d: lineD,
                  fill: "none",
                  stroke: color,
                  strokeOpacity,
                  strokeWidth: "1",
                  vectorEffect: "non-scaling-stroke"
                }
              )
            ] }),
            /* @__PURE__ */ jsx59("g", { clipPath: `url(#${clipId})`, children: /* @__PURE__ */ jsx59(
              "rect",
              {
                className: "zenth-chart-shimmer",
                x: "0",
                y: "0",
                width: CHART_LOADER_WIDTH,
                height,
                fill: `url(#${shineId})`
              }
            ) })
          ]
        }
      )
    }
  );
}
function colorWithOpacity(color, alpha) {
  const a = Math.max(0, Math.min(1, alpha));
  const rgbMatch = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i
  );
  if (rgbMatch) {
    return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${a})`;
  }
  let hex = color.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length === 8) {
    hex = hex.slice(0, 6);
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
var tooltipDateFormat = new Intl.DateTimeFormat(void 0, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
function formatDefaultTimestamp(timestamp) {
  return tooltipDateFormat.format(timestamp);
}

// src/components/chart/Legend.tsx
import { jsx as jsx60, jsxs as jsxs37 } from "react/jsx-runtime";
var onInteractiveKeyDown = (event) => {
  if (event.key !== "Enter" && event.key !== " ")
    return;
  event.preventDefault();
  event.currentTarget.click();
};
function LargeItem({
  color,
  value,
  name,
  unit,
  inactive,
  loading,
  onPointerEnter,
  onPointerLeave,
  onClick,
  className
}) {
  if (loading) {
    return /* @__PURE__ */ jsxs37(
      "div",
      {
        "aria-hidden": "true",
        className: cn("inline-flex min-w-42 flex-col gap-2 py-2", className),
        children: [
          /* @__PURE__ */ jsxs37("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx60("span", { className: "inline-block size-2 rounded-full bg-zenth-fill" }),
            /* @__PURE__ */ jsx60(SkeletonLine, { className: "h-3 w-[8ch]" })
          ] }),
          /* @__PURE__ */ jsx60(SkeletonLine, { className: "h-5 w-[5ch]" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs37(
    "div",
    {
      role: "button",
      tabIndex: onClick ? 0 : -1,
      className: cn(
        "inline-flex min-w-42 flex-col gap-2 py-2",
        { "cursor-pointer": !!onClick },
        className
      ),
      onPointerEnter,
      onPointerLeave,
      onClick,
      onKeyDown: onClick ? onInteractiveKeyDown : void 0,
      children: [
        /* @__PURE__ */ jsxs37("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx60(
            "span",
            {
              className: cn("inline-block size-2 rounded-full", {
                "opacity-50": inactive
              }),
              style: { backgroundColor: color }
            }
          ),
          /* @__PURE__ */ jsx60("span", { className: cn("text-xs", { "opacity-50": inactive }), children: name })
        ] }),
        /* @__PURE__ */ jsxs37("div", { className: "flex items-baseline gap-0.5", children: [
          /* @__PURE__ */ jsx60(
            "span",
            {
              className: cn("text-lg leading-none font-medium", {
                "opacity-50": inactive
              }),
              children: value
            }
          ),
          unit && /* @__PURE__ */ jsx60(
            "span",
            {
              className: cn("text-xs leading-none text-zenth-subtle", {
                "opacity-50": inactive
              }),
              children: unit
            }
          )
        ] })
      ]
    }
  );
}
function SmallItem({
  color,
  value,
  name,
  inactive,
  loading,
  onPointerEnter,
  onPointerLeave,
  onClick,
  className
}) {
  if (loading) {
    return /* @__PURE__ */ jsxs37(
      "div",
      {
        "aria-hidden": "true",
        className: cn("inline-flex h-4 items-center gap-2", className),
        children: [
          /* @__PURE__ */ jsx60("span", { className: "inline-block size-2 rounded-full bg-zenth-fill" }),
          /* @__PURE__ */ jsx60(SkeletonLine, { className: "h-3 w-[5ch]" }),
          /* @__PURE__ */ jsx60(SkeletonLine, { className: "h-3 w-[3ch]" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs37(
    "div",
    {
      role: "button",
      tabIndex: onClick ? 0 : -1,
      className: cn(
        "inline-flex h-4 items-center gap-2",
        { "cursor-pointer": !!onClick },
        className
      ),
      onPointerEnter,
      onPointerLeave,
      onClick,
      onKeyDown: onClick ? onInteractiveKeyDown : void 0,
      children: [
        /* @__PURE__ */ jsx60(
          "span",
          {
            className: cn("inline-block size-2 rounded-full", {
              "opacity-50": inactive
            }),
            style: { backgroundColor: color }
          }
        ),
        /* @__PURE__ */ jsx60("span", { className: cn("text-xs", { "opacity-50": inactive }), children: name }),
        /* @__PURE__ */ jsx60("span", { className: cn("text-xs font-medium", { "opacity-50": inactive }), children: value })
      ]
    }
  );
}
var ChartLegend = {
  SmallItem,
  LargeItem
};

// src/components/chart/SankeyChart.tsx
import { useMemo as useMemo13, useCallback as useCallback14 } from "react";

// src/components/chart/tooltip-utils.ts
var defaultValueFormat = (value) => value.toLocaleString();
var escapeHtml = (str) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// src/components/chart/SankeyChart.tsx
import { jsx as jsx61 } from "react/jsx-runtime";
function isTooltipParams(params) {
  return typeof params === "object" && params !== null;
}
var escapeRichText = (str) => str.replace(/[{}|]/g, (char) => `\\${char}`);
var sanitizeColor = (color) => {
  const fallback = "#666";
  if (!color || typeof color !== "string")
    return fallback;
  if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(color)) {
    return color;
  }
  if (/^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*[\d.]+\s*)?\)$/i.test(
    color
  )) {
    return color;
  }
  if (/^hsla?\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*(?:,\s*[\d.]+\s*)?\)$/i.test(
    color
  )) {
    return color;
  }
  if (/^[a-z]{3,20}$/i.test(color)) {
    return color;
  }
  return fallback;
};
function SankeyChart({
  echarts,
  nodes,
  links,
  height = 400,
  nodeWidth = 8,
  nodePadding = 10,
  showTooltip: enableTooltip = true,
  showNodeValues,
  nodeLabelLayout = "stacked",
  formatValue = defaultValueFormat,
  tooltipFormatter,
  defaultNodeColor,
  left,
  right,
  linkColor = "gradient",
  linkOpacity = 0.5,
  className,
  isDarkMode,
  onNodeClick,
  onLinkClick
}) {
  const hasNodeValues = nodes.some((n) => n.value !== void 0);
  const shouldShowValues = showNodeValues ?? hasNodeValues;
  const isInlineLayout = nodeLabelLayout === "inline";
  const options = useMemo13(() => {
    const labelColor = ChartPalette.text("primary", isDarkMode);
    const secondaryColor = ChartPalette.text("secondary", isDarkMode);
    const nodeColors = nodes.map(
      (node, index) => node.color ?? defaultNodeColor ?? ChartPalette.categorical(index, isDarkMode)
    );
    const nodeDataMap = new Map(
      nodes.map((n, i) => [n.name, { ...n, computedColor: nodeColors[i] }])
    );
    const echartsNodes = nodes.map((node, index) => ({
      name: node.name,
      value: node.value,
      itemStyle: {
        color: nodeColors[index]
      }
    }));
    const echartsLinks = links.map((link) => ({
      source: nodes[link.source]?.name ?? "",
      target: nodes[link.target]?.name ?? "",
      value: link.value
    }));
    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 500,
      animationDurationUpdate: 300,
      animationEasingUpdate: "cubicInOut",
      tooltip: enableTooltip ? {
        trigger: "item",
        triggerOn: "mousemove",
        dangerousHtmlFormatter: (params) => {
          if (!isTooltipParams(params))
            return "";
          if (params.dataType === "node" && params.name) {
            const nodeData = nodeDataMap.get(params.name);
            const color = sanitizeColor(
              nodeData?.computedColor ?? params.color ?? "#666"
            );
            if (tooltipFormatter) {
              return tooltipFormatter({
                type: "node",
                name: params.name,
                node: nodeData,
                color
              });
            }
            const safeName = escapeHtml(params.name);
            return `<div style="display:flex;align-items:center;gap:6px;"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color}"></span><strong>${safeName}</strong></div>`;
          }
          if (params.dataType === "edge" && params.data) {
            const { source, target, value } = params.data;
            if (tooltipFormatter) {
              return tooltipFormatter({
                type: "link",
                name: `${source} \u2192 ${target}`,
                link: {
                  source: source ?? "",
                  target: target ?? "",
                  value: value ?? 0
                }
              });
            }
            const sourceNode = nodeDataMap.get(source ?? "");
            const targetNode = nodeDataMap.get(target ?? "");
            const sourceColor = sanitizeColor(
              sourceNode?.computedColor ?? "#666"
            );
            const targetColor = sanitizeColor(
              targetNode?.computedColor ?? "#666"
            );
            const safeSource = escapeHtml(source ?? "");
            const safeTarget = escapeHtml(target ?? "");
            return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${sourceColor}"></span>
                  <strong>${safeSource}</strong>
                  <span style="color:${secondaryColor}">\u2192</span>
                  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${targetColor}"></span>
                  <strong>${safeTarget}</strong>
                </div>
                <strong>${value !== void 0 ? escapeHtml(formatValue(value)) : ""}</strong>`;
          }
          return "";
        }
      } : void 0,
      series: [
        {
          type: "sankey",
          ...left !== void 0 && { left },
          ...right !== void 0 && { right },
          data: echartsNodes,
          links: echartsLinks,
          draggable: false,
          emphasis: {
            focus: "adjacency"
          },
          nodeWidth,
          nodeGap: nodePadding,
          lineStyle: {
            color: linkColor === "gradient" ? "source" : "#d1d5db",
            opacity: linkColor === "gradient" ? linkOpacity : 0.4,
            curveness: 0.5
          },
          label: {
            show: true,
            color: labelColor,
            fontSize: 12,
            formatter: shouldShowValues ? (params) => {
              const name = params.name ?? "";
              const nodeData = nodeDataMap.get(name);
              const safeName = escapeRichText(name);
              if (nodeData?.value !== void 0) {
                const formattedValue = escapeRichText(
                  formatValue(nodeData.value)
                );
                return isInlineLayout ? `{name|${safeName}} {value|${formattedValue}}` : `{value|${formattedValue}}
{name|${safeName}}`;
              }
              return safeName;
            } : void 0,
            rich: shouldShowValues ? {
              value: {
                fontSize: 11,
                color: labelColor,
                lineHeight: isInlineLayout ? void 0 : 16
              },
              name: {
                fontSize: 12,
                color: labelColor,
                fontWeight: 700
              }
            } : void 0
          }
        }
      ]
    };
  }, [
    nodes,
    links,
    enableTooltip,
    nodeWidth,
    nodePadding,
    defaultNodeColor,
    left,
    right,
    isDarkMode,
    linkColor,
    linkOpacity,
    shouldShowValues,
    isInlineLayout,
    formatValue,
    tooltipFormatter
  ]);
  const handleClick = useCallback14(
    (params) => {
      if (params.dataType === "node" && onNodeClick && params.name) {
        const nodeIndex = nodes.findIndex((n) => n.name === params.name);
        const originalNode = nodeIndex >= 0 ? nodes[nodeIndex] : null;
        const nodeData = {
          ...originalNode,
          name: params.name
        };
        onNodeClick(nodeData);
      } else if (params.dataType === "edge" && onLinkClick && params.data) {
        const data = params.data;
        const source = typeof data === "object" && data !== null && "source" in data ? String(data.source) : "";
        const target = typeof data === "object" && data !== null && "target" in data ? String(data.target) : "";
        const sourceIndex = nodes.findIndex((n) => n.name === source);
        const targetIndex = nodes.findIndex((n) => n.name === target);
        if (sourceIndex === -1 || targetIndex === -1)
          return;
        const rawValue = params.value;
        const value = typeof rawValue === "number" ? rawValue : Array.isArray(rawValue) && typeof rawValue[0] === "number" ? rawValue[0] : 0;
        const originalLink = links.find(
          (l) => l.source === sourceIndex && l.target === targetIndex
        );
        onLinkClick({
          ...originalLink,
          source: sourceIndex,
          target: targetIndex,
          value
        });
      }
    },
    [nodes, links, onNodeClick, onLinkClick]
  );
  const onEvents = useMemo13(
    () => ({
      click: handleClick
    }),
    [handleClick]
  );
  return /* @__PURE__ */ jsx61(
    Chart,
    {
      echarts,
      options,
      className,
      isDarkMode,
      height,
      onEvents
    }
  );
}
SankeyChart.displayName = "SankeyChart";

// src/components/chart/Maps.tsx
import {
  forwardRef as forwardRef30,
  useCallback as useCallback15,
  useEffect as useEffect15,
  useLayoutEffect as useLayoutEffect4,
  useMemo as useMemo14,
  useRef as useRef16
} from "react";
import { geoMercator } from "d3-geo";
import { jsx as jsx62 } from "react/jsx-runtime";
function resolve(row, accessor) {
  return typeof accessor === "function" ? accessor(row) : row[accessor];
}
function resolveStyle(row, style) {
  return typeof style === "function" ? style(row) : style;
}
var MERCATOR_MAX_LAT = 85.0511;
var mercatorProjection = geoMercator();
var DEFAULT_PROJECTION = {
  project: (point) => {
    const lat = Math.max(
      -MERCATOR_MAX_LAT,
      Math.min(MERCATOR_MAX_LAT, point[1])
    );
    return mercatorProjection([point[0], lat]) ?? [0, 0];
  },
  unproject: (point) => mercatorProjection.invert?.(point) ?? [0, 0]
};
var DEFAULT_BOUNDING_COORDS = [
  [-180, 80],
  [180, -58]
];
function resolveProjection(projection) {
  if (projection === null)
    return void 0;
  return projection ?? DEFAULT_PROJECTION;
}
function projectedAspect(projection, [[west, north], [east, south]]) {
  const project = projection ? projection.project : (p) => p;
  const midLat = Math.min(north, Math.max(south, 0));
  const w = Math.abs(project([east, midLat])[0] - project([west, midLat])[0]);
  const h = Math.abs(project([0, north])[1] - project([0, south])[1]);
  return w > 0 && h > 0 ? w / h : 16 / 9;
}
var MAX_ZOOM_FACTOR = 8;
var geoJsonMapNames = /* @__PURE__ */ new WeakMap();
function sanitizeMapName(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "-");
}
function hashString(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = Math.imul(31, hash) + value.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}
function getMapName(geoJson, mapName) {
  if (mapName)
    return sanitizeMapName(mapName);
  const existing = geoJsonMapNames.get(geoJson);
  if (existing)
    return existing;
  const generated = `zenth-map-${hashString(JSON.stringify(geoJson))}`;
  geoJsonMapNames.set(geoJson, generated);
  return generated;
}
function buildGeo(opts) {
  return {
    map: opts.mapName,
    nameProperty: "name",
    roam: opts.roam,
    // Prevent zooming far out into empty space while still allowing users to
    // zoom back to the lesser of ECharts' base scale and the configured zoom.
    ...opts.roam ? {
      scaleLimit: {
        min: Math.min(1, opts.zoom),
        max: opts.zoom * MAX_ZOOM_FACTOR
      }
    } : {},
    center: opts.center,
    zoom: opts.zoom,
    // Crop empty poles / Antarctica so land fills the container.
    boundingCoords: DEFAULT_BOUNDING_COORDS,
    ...opts.projection ? { projection: opts.projection } : { aspectScale: 1 },
    silent: true,
    itemStyle: {
      areaColor: opts.areaColor,
      borderColor: opts.areaColor,
      borderWidth: 0.5
    },
    emphasis: { disabled: true }
  };
}
function BubbleMapRoot({
  echarts: ec,
  geoJson,
  mapName: mapNameProp,
  data,
  lng,
  lat,
  value,
  name,
  minRadius = 6,
  maxRadius = 26,
  bubbleSize,
  bubbleColor,
  bubbleBorderColor = "transparent",
  bubbleBorderWidth = 0,
  center,
  zoom = 1.25,
  roam = false,
  projection,
  showTooltip = true,
  valueFormat = defaultValueFormat,
  tooltipFormatter,
  onBubbleHover,
  onBubbleClick,
  aspectRatio,
  height,
  className,
  isDarkMode
}, ref) {
  const mapName = useMemo14(
    () => getMapName(geoJson, mapNameProp),
    [geoJson, mapNameProp]
  );
  useRegisterMap(ec, mapName, geoJson);
  const palette = useMemo14(
    () => ChartPalette.mapColors(isDarkMode),
    [isDarkMode]
  );
  const centerX = center?.[0];
  const centerY = center?.[1];
  const geo = useMemo14(
    () => buildGeo({
      mapName,
      areaColor: palette.area,
      center: centerX !== void 0 && centerY !== void 0 ? [centerX, centerY] : void 0,
      zoom,
      roam,
      projection: resolveProjection(projection)
    }),
    [mapName, geoJson, palette, centerX, centerY, zoom, roam, projection]
  );
  const resolvedAspect = useMemo14(() => {
    if (height !== void 0)
      return void 0;
    return aspectRatio ?? projectedAspect(resolveProjection(projection), DEFAULT_BOUNDING_COORDS);
  }, [aspectRatio, height, projection]);
  const appliedGeoRef = useRef16(void 0);
  const shouldIncludeGeo = appliedGeoRef.current !== geo;
  useEffect15(() => {
    appliedGeoRef.current = geo;
  }, [geo]);
  const hoverRef = useRef16(onBubbleHover);
  hoverRef.current = onBubbleHover;
  const mergedRef = useCallback15(
    (instance) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref]
  );
  const options = useMemo14(() => {
    const values = data.map((row) => resolve(row, value));
    const vmax = values.length ? Math.max(...values) : 1;
    const radiusFor = (v) => {
      if (bubbleSize)
        return bubbleSize(v);
      if (vmax <= 0)
        return minRadius;
      const t = Math.sqrt(Math.max(0, v) / vmax);
      return minRadius + t * (maxRadius - minRadius);
    };
    const points = data.map((row) => {
      const v = resolve(row, value);
      return {
        name: name ? resolve(row, name) : void 0,
        value: [resolve(row, lng), resolve(row, lat), v],
        symbolSize: radiusFor(v),
        itemStyle: {
          color: bubbleColor ? resolveStyle(row, bubbleColor) : palette.bubble,
          borderColor: resolveStyle(row, bubbleBorderColor),
          borderWidth: resolveStyle(row, bubbleBorderWidth)
        },
        datum: row
      };
    });
    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 500,
      animationDurationUpdate: 0,
      ...shouldIncludeGeo ? { geo } : {},
      tooltip: showTooltip ? {
        trigger: "item",
        triggerOn: "mousemove",
        backgroundColor: "var(--color-zenth-base)",
        borderColor: "var(--color-zenth-line)",
        borderWidth: 1,
        padding: 8,
        textStyle: {
          color: "var(--text-color-zenth-default)",
          fontSize: 13
        },
        extraCssText: "border-radius: 0.5rem;",
        dangerousHtmlFormatter: (params) => {
          const p = params;
          const row = p.data?.datum;
          if (tooltipFormatter && row !== void 0) {
            return tooltipFormatter(row);
          }
          const v = p.value?.[2];
          const nameStr = p.name ? `<strong>${escapeHtml(p.name)}</strong>` : "";
          const valueStr = v !== void 0 ? `<span style="color:var(--text-color-zenth-subtle)">${escapeHtml(valueFormat(v))}</span>` : "";
          return `<div style="display:flex;flex-direction:column;gap:2px;">${nameStr}${valueStr}</div>`;
        }
      } : void 0,
      series: [
        {
          id: "bubbles",
          type: "scatter",
          coordinateSystem: "geo",
          data: points,
          itemStyle: { opacity: 0.8 },
          emphasis: { scale: 1.2, itemStyle: { opacity: 1 } },
          z: 3
        }
      ]
    };
  }, [
    palette,
    geo,
    shouldIncludeGeo,
    data,
    lng,
    lat,
    value,
    name,
    minRadius,
    maxRadius,
    bubbleSize,
    bubbleColor,
    bubbleBorderColor,
    bubbleBorderWidth,
    showTooltip,
    tooltipFormatter,
    valueFormat
  ]);
  const handleMouseOver = useCallback15(
    (params) => {
      const datum = params.data?.datum;
      if (datum !== void 0)
        hoverRef.current?.(datum);
    },
    []
  );
  const handleMouseOut = useCallback15(() => {
    hoverRef.current?.(void 0);
  }, []);
  const handleClick = useCallback15(
    (params) => {
      const datum = params.data?.datum;
      if (datum !== void 0)
        onBubbleClick?.(datum);
    },
    [onBubbleClick]
  );
  const onEvents = useMemo14(
    () => ({
      ...onBubbleHover ? {
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        globalout: handleMouseOut
      } : {},
      ...onBubbleClick ? { click: handleClick } : {}
    }),
    [
      onBubbleHover,
      handleMouseOver,
      handleMouseOut,
      handleClick,
      onBubbleClick
    ]
  );
  return /* @__PURE__ */ jsx62(
    Chart,
    {
      echarts: ec,
      ref: mergedRef,
      options,
      className,
      isDarkMode,
      height,
      aspectRatio: resolvedAspect,
      onEvents
    }
  );
}
var BubbleMap = forwardRef30(BubbleMapRoot);
BubbleMap.displayName = "BubbleMap";
function ChoroplethMapRoot({
  echarts: ec,
  geoJson,
  mapName: mapNameProp,
  data,
  name,
  value,
  nameProperty = "name",
  colorRange,
  min,
  max,
  noDataColor,
  showLegend = false,
  showTooltip = true,
  valueFormat = defaultValueFormat,
  tooltipFormatter,
  onRegionHover,
  onRegionClick,
  center,
  zoom = 1.25,
  roam = false,
  projection,
  aspectRatio,
  height,
  className,
  isDarkMode
}, ref) {
  const mapName = useMemo14(
    () => getMapName(geoJson, mapNameProp),
    [geoJson, mapNameProp]
  );
  useRegisterMap(ec, mapName, geoJson);
  const palette = useMemo14(
    () => ChartPalette.mapColors(isDarkMode),
    [isDarkMode]
  );
  const centerX = center?.[0];
  const centerY = center?.[1];
  const view = useMemo14(
    () => ({
      roam,
      ...roam ? {
        scaleLimit: {
          min: Math.min(1, zoom),
          max: zoom * MAX_ZOOM_FACTOR
        }
      } : {},
      center: centerX !== void 0 && centerY !== void 0 ? [centerX, centerY] : void 0,
      zoom,
      // Crop empty poles / Antarctica so land fills the container.
      boundingCoords: DEFAULT_BOUNDING_COORDS,
      ...resolveProjection(projection) ? { projection: resolveProjection(projection) } : { aspectScale: 1 }
    }),
    [centerX, centerY, zoom, roam, isDarkMode, projection]
  );
  const resolvedAspect = useMemo14(() => {
    if (height !== void 0)
      return void 0;
    return aspectRatio ?? projectedAspect(resolveProjection(projection), DEFAULT_BOUNDING_COORDS);
  }, [aspectRatio, height, projection]);
  const appliedViewRef = useRef16(void 0);
  const shouldIncludeView = appliedViewRef.current !== view;
  useEffect15(() => {
    appliedViewRef.current = view;
  }, [view]);
  const hoverRef = useRef16(onRegionHover);
  hoverRef.current = onRegionHover;
  const mergedRef = useCallback15(
    (instance) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref]
  );
  const options = useMemo14(() => {
    const colors = colorRange ?? palette.scale;
    const noData = noDataColor ?? palette.area;
    const regions = data.map((row) => ({
      name: resolve(row, name),
      value: resolve(row, value),
      datum: row
    }));
    const values = regions.map((r) => r.value);
    const vmin = values.length ? Math.min(...values) : 0;
    const vmax = values.length ? Math.max(...values) : 1;
    const resolvedMin = min ?? vmin;
    const resolvedMax = max ?? (vmax > vmin ? vmax : vmin + 1);
    const visualMap = {
      type: "continuous",
      show: showLegend,
      min: resolvedMin,
      max: resolvedMax,
      calculable: false,
      hoverLink: false,
      inRange: { color: colors },
      orient: "horizontal",
      text: ["High", "Low"],
      left: 0,
      bottom: 8,
      textStyle: {
        color: ChartPalette.text("primary", isDarkMode),
        fontSize: 11
      }
    };
    return {
      backgroundColor: "transparent",
      animation: true,
      animationDuration: 500,
      animationDurationUpdate: 0,
      visualMap,
      tooltip: showTooltip ? {
        trigger: "item",
        triggerOn: "mousemove",
        backgroundColor: "var(--color-zenth-base)",
        borderColor: "var(--color-zenth-line)",
        borderWidth: 1,
        padding: 8,
        textStyle: {
          color: "var(--text-color-zenth-default)",
          fontSize: 13
        },
        extraCssText: "border-radius: 0.5rem;",
        dangerousHtmlFormatter: (params) => {
          const p = params;
          const row = p.data?.datum;
          if (row === void 0)
            return "";
          if (tooltipFormatter)
            return tooltipFormatter(row);
          const v = typeof p.value === "number" && !Number.isNaN(p.value) ? p.value : void 0;
          const nameStr = p.name ? `<strong>${escapeHtml(p.name)}</strong>` : "";
          const valueStr = v !== void 0 ? `<span style="color:var(--text-color-zenth-subtle)">${escapeHtml(valueFormat(v))}</span>` : "";
          return `<div style="display:flex;flex-direction:column;gap:2px;">${nameStr}${valueStr}</div>`;
        }
      } : void 0,
      series: [
        {
          id: "regions",
          type: "map",
          map: mapName,
          nameProperty,
          ...shouldIncludeView ? view : {},
          data: regions,
          itemStyle: {
            areaColor: noData,
            borderColor: "transparent",
            borderWidth: 0
          },
          label: { show: false },
          emphasis: {
            focus: "self",
            label: { show: false },
            itemStyle: {
              areaColor: "inherit"
            }
          },
          blur: {
            label: { show: false },
            itemStyle: { opacity: 0.45 }
          },
          select: { disabled: true },
          z: 1
        }
      ]
    };
  }, [
    isDarkMode,
    palette,
    geoJson,
    mapName,
    view,
    shouldIncludeView,
    data,
    name,
    value,
    nameProperty,
    colorRange,
    min,
    max,
    noDataColor,
    showLegend,
    showTooltip,
    tooltipFormatter,
    valueFormat
  ]);
  const handleMouseOver = useCallback15(
    (params) => {
      const datum = params.data?.datum;
      if (datum !== void 0)
        hoverRef.current?.(datum);
    },
    []
  );
  const handleMouseOut = useCallback15(() => {
    hoverRef.current?.(void 0);
  }, []);
  const handleClick = useCallback15(
    (params) => {
      const datum = params.data?.datum;
      if (datum !== void 0)
        onRegionClick?.(datum);
    },
    [onRegionClick]
  );
  const onEvents = useMemo14(
    () => ({
      ...onRegionHover ? {
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        globalout: handleMouseOut
      } : {},
      ...onRegionClick ? { click: handleClick } : {}
    }),
    [
      onRegionHover,
      handleMouseOver,
      handleMouseOut,
      handleClick,
      onRegionClick
    ]
  );
  return /* @__PURE__ */ jsx62(
    Chart,
    {
      echarts: ec,
      ref: mergedRef,
      options,
      className,
      isDarkMode,
      height,
      aspectRatio: resolvedAspect,
      onEvents
    }
  );
}
var ChoroplethMap = forwardRef30(ChoroplethMapRoot);
ChoroplethMap.displayName = "ChoroplethMap";
function useRegisterMap(ec, mapName, geoJson) {
  useLayoutEffect4(() => {
    ec.registerMap(mapName, geoJson);
  }, [ec, mapName, geoJson]);
}

// src/components/chart/GlobeMap.tsx
import {
  forwardRef as forwardRef31,
  useCallback as useCallback16,
  useEffect as useEffect16,
  useId as useId8,
  useMemo as useMemo15,
  useRef as useRef17,
  useState as useState12
} from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";

// src/components/chart/globe-land-mask.ts
var LAND_MASK_BASE64 = "////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f///////////////////////////////////////////////////////3x8AAP7///////////////////////////////////////////////////8/AAAA/P///////////////////////////////////////////////////x8AAAAA+P//////////////4f///////////////////////////////////wAAAAAA/v////////////8HAAD4////////////////////////////////HwAAAAAAAP7//////////wf8wD8AwP//////////////////////////////DwAAAAAcgP//////////fwAAAP4BwP//////////////////////////////HwAAAACH////////////PwAAAPgA/////////////////////////////////wcAAADA/////////////wEAAAAA8P///////////////////////////////wAAAAAAAPz//////////z8AAAAAAP///////////////////////////////wAAAAAAAPz///////////8HAAAAAAD+/////////////////////////////wAAAAAAAADwv/MXgP////8fAAAAAADw/////////////////////////////wMAAAAAAAAAYAYA4ON/OPh/AAAAAADw/////////////////////////////x8AAAAAAAAAAAAAAAAAAAB+AAAAAACA/////////////////////////////38AAAAAAAAAAAAAAAAAAP5+AAAAAAAA5v////////////D//////////////38AAAAAAAAAAAAAAAAAAHA/AAAAAAAAAAA8//P//////+D/////////////HwAAAAAAAAAAAAAAAAAAADAfAAAAAAAAAAAAAADw8////wP+////////////AwAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAgP///wH4//////////8DAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAPD/AADA/////////z8AAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAIAfAAAAAAAeeADADwAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAP4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAPgHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAMABAAAAAAAAAAAAAAAAAPwfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAIADAAAAAAAAAAAAAAAAAPwHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAALAAAAAAAAAAAAAAAAAPw/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAPg/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAPj/AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGgAAAA4AAAAAAAAAAAAAAAAAPz/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAIAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8DAAAEAAAAAAAAAAAAAAAAAPj/BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwP8DAAACAAAAAAAAAAAAAAAAAPD/OwAAAAAAAAAAgAEAAAAAAAAAAAAAAAcA6P8HAAAAAAAAAAAAAAAAAAAAAPD/fwAAAAAAAAAAwH8AAAAAAAAAAAAAgP8A2P8HAAAAAAAAAAAAAAAAAAAAAOD//wAAAAAAAAAAwP8BAAAAAAAAAAAAAP8D/P8PAAAAAAAAAAAAAAAAAAAAAPD//wEAAAAAAAAAwP8DAAAAAAAAAAAAAP////8fAAAAAAAAAAAAAAAAAAAAAPD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAOD//wMAAAAAAAAA4P8HAAAAAAAAAAAAgP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA8P8PAAAAAAAAAAAAgP////8/AAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//wcAAAAAAAAA+P8fAAAAAAAAAAAA4P////8fAAAAAAAAAAAAAAAAAAAAAOD//w8AAAAAAAAA+P8fAAIAAAAAAAAAwP////8fAAAAAAAAAAAAAAAAAAAAAOD//x8AAAAAAAAA+P9/AAcAAAAAAAAA4P////8PAAAAAAAAAAAAAAAAAAAAAMD//38AAAAAAAAA/P9/AA8AAAAAAAAAwP////8HAAAAAAAAAAAAAAAAAAAAAMD///8DAAAAAAAA/P//gA8AAAAAAAAAwP////8DAAAAAAAAAAAAAAAAAAAAAMD///8HAAAAAAAA/P9/gA8AAAAAAAAAgP////8BAAIAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAPz///8BAAEAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA/v9/AB8AAAAAAAAAAOD//38AAAAAAAAAAAAAAAAAAAAAAMD///8PAAAAAAAA////AB8AAAAAAAAAAMD//z8AAAAAAAAAAAAAAAAAAAAAAOD///8fAAAAAAAA////Ax8AAAAAAAAAAMD//z4AAABAAAAAAAAAAAAAAAAAAPj///8fAAAAAAAA////Dz8AAAAAAAAAAAD/Pz4AAAiAAAAAAAAAAAAAAAAAAP7///8fAAAAAAAA////DzgAAAAAAAAAAAD/DxwAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA////HzAAAAAAAAAAAADsDxwAAAAAAAAAAAAAAAAAAAAAAP////8fAAAAAAAA/v//HyAAAAAAAAAAAADADwwAAAAAAAAAAAAAAAAAAAAAgP////8/AAAAAAAA/v//HyAAAAAAAAAAAACAHwQAAAAAAAAAAAAAAAAAAAAAgP////9/AAAAAAAA/P//DwAAAAAAAAAAAAAAAQQAAAAAAAAAAAAAAAAAAAAAwP//////AAAAAAAA/v//DwAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAA4P//////AAAAAAAA/v//DwAAAAAAAAAAAAgBAIABMAAAAAAAAAAAAAAAAAAA4P//////AQAAAAAA/v//BwAAAAAAAAAAQFYEAMcAAAAAAAAAAAAAAAAAAAAA8P//////AQAAAAAA/v//BwAAAAAAAACAHwAAwH8ABAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAADAAQAAxP+AAAAAAAAAAAAAAAAAAAAA+P//////AQAAAAAA////BwAAAAAAAAAwAEAAxD8NAAAAAAAAAAAAAAAAAAAA+P////8/AAAAAACA////BwAAAAAAAAA4AEAA8B8AAAAAAAAAAAAAAAAAAAAA8P////8fAAAAAACA////DwAAAAAAAAA8wChE/gcAAAAAAAAAAAAAAAAAAAAA+P///38BAAAAAADA////HwAAAAAAAAA+/DkA8gAAAAAAAAAAAAAAAAAAAAAA+P///38AAAAAAADg////PwAAAAAAAAAO/DmAAwAAAAAAAAAAAAAAAAAAAAAA8P///wcAAAAAAADg////PwAAAAAAAAAP/gMAAQAAAAAAAAAAAAAAAAAAAAAA8P///wMAAAAAAADg////fwAAAAAAAIAH/vMQAAAAAAAAAAAAAAAAAAAAAAAA4P///wMAAAAAAADg/////wEAAAAAAIAL/gMQAAAAAAAAAAAAAAAAAAAAAAAA4P///wEAAAAAAADA/////wMAAAAAAMAM+AMAAAAAAAAAAAAAAAAAAAAAAAAAgP///wEAAAAAAADA/////wcAAAAAAGAG4AEAAAAAAAAAAAAAAAAAAAAAAAAAgP///wAAAAAAEAD8/////w8AAAAAADAGwAcAAAAAAAAAAAAAAAAAAAAAAAAAwP//fwAAAAAA/A/+/////x8AAAAAAAAHAAcAAAAAAAAAAAAAAAAAAAAAAAAAgP//AwAAAAAA/v///////x8AAAAwAAADAAMBAAAAAAAAAAAAAAAAAAAAAAAAyP//AQAAAACA/////////z8AAAAwAIAAAEAHAAAAAAAAAAAAAAAAAAAAAAAAz///AAAAAACA/////////z8AAAASAMAAAIACAAAAAAAAAAAAAAAAAAAAAAAAE+9/AAAAAADA/////////38AAAAXAEAgAAQCAAAAAAAAAAAAAAAAAAAAAADAAe9TAAAAAADg/////////34AAAAPAEBwAAgAAAAAAAAAAAAAAAAAAAAAAADAAAgAAAAAAADw////////f2AAAAAPAID4AUACAAAAAAAAAAAAAAAAAAAAAADgAQAAAAAAAAD4////////fwAAAIAPAMD8AQABAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAD4////////vwcAAIAPAMD/AcAAAAAAAAAAAAAAAAAAAAAAAAD/AQAAAAAAAAD4////////nx8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAID/AAAAAAAAAAD4////////j/8AAMAPAMD/ATAAAAAAAAAAAAAAAAAAAAAAAP4PAAAAAAAAAAD4////////h/8BAOA/APz/ADAAAAAAAAAAAAAAAAAAAAAAgP8PAAAAAAAAAADw////////x/8HAOB/APx/ADAAAAAAAAAAAAAAAAAAAAAA8J8PAPwCAAAAAADw////////4/8fAOD/APw/AgAAAAAAAAAAAAAAAQAAAAAA+A8eADgAAAAAAADw////////4f8/AOD/Afw/BgAAAAAAAAAAAAAAAAAAAAAA/AccgAEAAAAAAADw////////8f9/AOD/B/5/AAAAAAAAAAAAAAAAAAAAAAAA+AcAYAAAAAAAAAD4////////+f9/APz/B///BgAAAAAAAAAAAAAAAAAAAAAA/AMAHQAAAAAAAADw////////+P//APz/f///fxAAAAAAAAAAAAAAAAAAAAAA/gMAAAAAAAAAAADw////////+P9/AP///////xEAAAAAAAAAAAAAAAAAAAAQ/wMAAAAAAAAAAADg//////9//n8cgP///////ycAAAAAAAAAAAAAAAAAAACQ/wcACAAAAAAAAADg//////9//r+A/////////wcAAAAAAAAAAAAAAAAAAACI/wcALAAAAAAAAADA//////8//z/g/////////w8AAAAAAAAAAAAAAAAAAADu/wcADgAAAAAAAACA//////8f/x/+/////////x8AAAAAAAAAAAAAAAAAAAD0/w8ABgAAAAAAAAAA/v////+//4///////////z8AAAAAAAAAAAAAAAAAAADy/x8GBgAAAAAAAAAA/P/////v/8///////////z8AAAAAAAAAAAAAAAAAAAD5////BwAAAAAAAAAA/P//f////////////////x8AAAAAAAAAAAAAAAAAAID9////BwAAAAAAAAAA/P//D3+E/////////////z9AAAAAAAAAAAAAAAAAAID/////DwAAAAAAAAAA+P//BwaA/////////////x/AAAAAAAAAAAAAAAAAAMD/////HwAAAAAAAAAA8P9/AACA/////////////x/AAwAAAAAAAAAAAAAAAPD/////fwAAAAAAAAAA4P8/AAAA/////////////w+EGwAAAAAAAAAAAAAAAPj//////wAAAAAAAAAAQPx/AAAA/////////////w8Y/gEAAAAAAAAAAAAAAPz//////wAAAAAAAAAAQOB/AAQ2/////////////x8c8AEAAAAAAAAAAAAAAP7//////wAAAAAAAAAA+AcABob//z/8/////////zccwAEAAAAAAAAAAAAAAP7//////wEAAAAAAAAA+A8AAM7//x/8/////////wMOAAEAAAAAAAAAAAAAAP///////wMAAAAAAAAA+A8wEMf//x/+/////////0cOAAMAAAAAAAAAAAAAAP///////wMAAAAAAAAA+B8wuE/+/z/+/////////98fAAMAAAAAAAAAAAAAAP///////x8AAAAAAAAA+D8Aj//w4R/8//////////8/AAAAAAAAAAAAAAAAAP///////x8AAAAAAAAA+H+Aw/8AwA/+//////////9/AA8AAAAAAAAAAAAAAP///////z8AAAAAAAAAcPzH8/8A8I//////////////Bx4AAAAAAAAAAAAAAP////////8MAAAAAAAAAPj/+P8B/Mf/////////////DwQAAAAAAAAAAAAAAP////////9/AAAAAAAAAPj//f9j/g/+////////////HwAAAAAAAAAAAAAAAP////////+XAAAAAAAAAPz///93/D/+////////////PwwAAAAAAAAAAAAAAP3///////8HUAAAAAAAAP7/////////////////////fwQAAAAAAAAAAAAAAP7//////38HfgAAAAAAgP///////////////////////wQAAAAAAAAAAAAAYP////////8xLAAAAAAAAPz//////////////////////wwAAAAAAAAAAAAA0P//////////DAAAAAAAgOH//////////////////////w0AAAAAAAAAAAAA8P//////7///FwAAAAAAAB///////////////////////wUAAgAAAAAAAAAA8P//////4///DwAAAAAAGD///////////////////////wUAAwAAAAAAAACA+P//////4///DwAAAAAAOA74/////////////////////wUADwAAAIAAAAAA/v//////8///BwAAAAAAOAcgcP//////////////////HwAAHwAAAAAGAAAA//////8/wP//AAAAAAAAwAOwA/7/////////////////DwCAPwAAAAAwAAAA//////8PgP8/AAAAAAAAwAFwD/7/////////////////PwAAfwAAAADADgDA/////38AgP8/AAAAAAAAwANAH/T//////////////////wAAfgAAAACAAwD8/////38AwP8eAAAAAAAAgAGcH/D//////////////////wEAOAAAAAD8MwD//////x8AwH8MAAAAAAAAAAD+P2D///////////////////95cAAAAID///z//////z8AwD8AAMABAAAAAAD+P/z///////////////////9/wH8AAMD//////////z8AwA8AAPgBAAAAAAD+H/7/////////////////////Of8BAID///////////8AQ4ABAPwBAAAAAAD8P/7///////////////////////9fAAP4///////////BBPAHAP4HAAAAAADg//z///////////////////////9/QID4///////////Pw/0DAP8HAMAfAACA//F//v////////////////////8//vD///////////9fAPwYgP8PAOA/AAAA/+N/8P//////////////////////34H8////////////Afw/gP//AQAQAAAA/v8fH////+//////////////////DwD////////////vh/kPwP//BwAAAAAA/P//H/P//5//////////////////A+D///////8DB8TPB/4AAP///wAAAAAA8P//AwDjf77/////////////////AAD+///h/4//H+/Bg/8BwP7//w8AAAAAwP8fAAAAj9///////////////88/AAD4HwAAAAD4H/D4/38A4P///xMAAAAAAPAHAAAAgN//////////////DwAAAQAAAAAAAO//B3f8/wsA4P///z8AAAAAAAAAAAAPAG////////8f2f8HAAAAAAAAAAAAgN9/xzf8RwAA4P///z8AAAAAAAAAAAAPAB7g//////8fgD8AAAAAAAAAAAAAAP8Ahvc5OwAA8P///38AAAAAAAAAAAAcAADg////34cHAAcAAAAAAAAAAAAAAAAMAAB8AgAA+P////8AAAAAAAAAAABwAAAA/P//AwAAAAAAAAAAAAAAAAAAAIC/g7PfBwAA/v////8AAAAAAAAAAADgBwAAwP//PwAA4B8AAAAAAAAAAAAAADzAgPP5H8D//////38AAAAAAAAAAAAA4AEAAAD+DwAAAAAAAAAAAAAAAAAAAOAQACDwP4D///////8BAAAAPAQAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAAA4+I73//n///////8AAAAAfwAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAOD//wP8//////8BAACAfx4AAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAPAH/j/+//////8PAAAAgB0AAHgAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAD+///D/////5//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/v8/AOD//z8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADg/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
var LAND_MASK_WIDTH = 360;
var landMask = Uint8Array.from(
  atob(LAND_MASK_BASE64),
  (value) => value.charCodeAt(0)
);
function isCanonicalLand(longitude, latitude) {
  const column = Math.max(
    0,
    Math.min(LAND_MASK_WIDTH - 1, Math.floor(longitude + 180))
  );
  const row = Math.max(0, Math.min(179, Math.floor(latitude + 90)));
  const index = row * LAND_MASK_WIDTH + column;
  return (landMask[index >> 3] & 1 << (index & 7)) !== 0;
}

// src/components/chart/GlobeMap.tsx
import { jsx as jsx63, jsxs as jsxs38 } from "react/jsx-runtime";
var GLOBE_VIEWBOX_SIZE = 640;
var GLOBE_PADDING = 18;
var GLOBE_RADIUS = GLOBE_VIEWBOX_SIZE / 2 - GLOBE_PADDING;
var MARKER_EDGE_FADE_DISTANCE = 24;
var AUTO_ROTATE_INTERVAL = 1e3 / 30;
function finiteNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}
function normalizeRotation(rotation) {
  return [
    finiteNumber(rotation[0], -10),
    Math.max(-90, Math.min(90, finiteNumber(rotation[1], -20))),
    finiteNumber(rotation[2], 0)
  ];
}
function createLandHatchPath(projection, spacing) {
  if (spacing <= 0)
    return void 0;
  if (!projection.invert)
    return void 0;
  const commands = [];
  const sampleStep = 3;
  for (let offset = -GLOBE_VIEWBOX_SIZE; offset < GLOBE_VIEWBOX_SIZE * 2; offset += spacing) {
    let drawing = false;
    for (let y = 0; y <= GLOBE_VIEWBOX_SIZE; y += sampleStep) {
      const x = y + offset;
      const coordinates = x >= 0 && x <= GLOBE_VIEWBOX_SIZE ? projection.invert?.([x, y]) : null;
      const onLand = coordinates !== null && isCanonicalLand(coordinates[0], coordinates[1]);
      if (onLand && !drawing) {
        commands.push(`M${x.toFixed(1)},${y.toFixed(1)}`);
        drawing = true;
      } else if (onLand) {
        commands.push(`L${x.toFixed(1)},${y.toFixed(1)}`);
      } else {
        drawing = false;
      }
    }
  }
  return commands.join("") || void 0;
}
var GlobeMap = forwardRef31(
  function GlobeMap2({
    landColor,
    landHatchSpacing = 10,
    oceanColor = "var(--color-zenth-base)",
    markers = [],
    markerColor,
    markerRadius = 7,
    onMarkerClick,
    defaultRotation = [-10, -20, 0],
    draggable = true,
    autoRotate = false,
    autoRotateSpeed = 4,
    showGraticule = false,
    showTooltip = true,
    onUserRotationChange,
    "aria-label": ariaLabel = "Interactive globe map",
    height,
    className,
    isDarkMode
  }, ref) {
    const [rotation, setRotation] = useState12(
      () => normalizeRotation(defaultRotation)
    );
    const [tooltip, setTooltip] = useState12(null);
    const sphereClipId = useId8();
    const rotationRef = useRef17(rotation);
    const svgRef = useRef17(null);
    const dragRef = useRef17(null);
    const isFocusedRef = useRef17(false);
    const pointerMoveFrameRef = useRef17(null);
    const pendingPointerMoveRef = useRef17(null);
    const instructionsId = useId8();
    const palette = useMemo15(
      () => ChartPalette.mapColors(isDarkMode),
      [isDarkMode]
    );
    const resolvedLandColor = landColor ?? palette.area;
    const resolvedMarkerColor = markerColor ?? palette.bubble;
    const safeHatchSpacing = Math.max(3, finiteNumber(landHatchSpacing, 10));
    const safeMarkerRadius = Math.max(0, finiteNumber(markerRadius, 7));
    const safeAutoRotateSpeed = Math.max(
      -60,
      Math.min(60, finiteNumber(autoRotateSpeed, 4))
    );
    const projection = useMemo15(
      () => geoOrthographic().translate([GLOBE_VIEWBOX_SIZE / 2, GLOBE_VIEWBOX_SIZE / 2]).scale(GLOBE_RADIUS).clipAngle(90).rotate(rotation),
      [rotation]
    );
    const path = useMemo15(() => geoPath(projection), [projection]);
    const spherePath = useMemo15(
      () => path({ type: "Sphere" }) ?? void 0,
      [path]
    );
    const graticulePath = useMemo15(
      () => path(geoGraticule10()) ?? void 0,
      [path]
    );
    const landHatchPath = useMemo15(
      () => createLandHatchPath(projection, safeHatchSpacing),
      [projection, safeHatchSpacing]
    );
    const center = useMemo15(
      () => projection.invert?.([GLOBE_VIEWBOX_SIZE / 2, GLOBE_VIEWBOX_SIZE / 2]),
      [projection]
    );
    const updateRotation = useCallback16(
      (nextRotation, notify = false) => {
        rotationRef.current = nextRotation;
        setRotation(nextRotation);
        if (notify)
          onUserRotationChange?.(nextRotation);
      },
      [onUserRotationChange]
    );
    useEffect16(() => {
      if (!autoRotate)
        return;
      if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      let frame = null;
      let previousTime = null;
      const rotate = (time) => {
        if (dragRef.current || isFocusedRef.current) {
          previousTime = time;
        } else if (previousTime !== null && time - previousTime >= AUTO_ROTATE_INTERVAL) {
          const deltaSeconds = Math.min((time - previousTime) / 1e3, 0.1);
          const current = rotationRef.current;
          updateRotation([
            current[0] + safeAutoRotateSpeed * deltaSeconds,
            current[1],
            current[2]
          ]);
          previousTime = time;
        }
        if (previousTime === null)
          previousTime = time;
        frame = requestAnimationFrame(rotate);
      };
      const start = () => {
        if (frame === null)
          frame = requestAnimationFrame(rotate);
      };
      const stop = () => {
        if (frame !== null)
          cancelAnimationFrame(frame);
        frame = null;
        previousTime = null;
      };
      const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting)
          start();
        else
          stop();
      });
      if (observer && svgRef.current)
        observer.observe(svgRef.current);
      else
        start();
      return () => {
        observer?.disconnect();
        stop();
      };
    }, [autoRotate, safeAutoRotateSpeed, updateRotation]);
    const moveTooltip = useCallback16(
      (event, marker) => {
        if (!showTooltip)
          return;
        const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
        if (!bounds)
          return;
        setTooltip({
          name: marker.name,
          detail: marker.description ?? `${marker.latitude.toFixed(2)}, ${marker.longitude.toFixed(2)}`,
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top
        });
      },
      [showTooltip]
    );
    const handlePointerDown = (event) => {
      if (!draggable)
        return;
      if (event.isPrimary === false || event.button !== 0)
        return;
      if (event.target instanceof Element && event.target.closest('[data-globe-marker-interactive="true"]')) {
        return;
      }
      event.currentTarget.setPointerCapture(event.pointerId);
      dragRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        rotation: rotationRef.current
      };
      setTooltip(null);
    };
    const applyPointerMove = useCallback16(
      (pointerId, x, y) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== pointerId)
          return;
        const deltaX = x - drag.x;
        const deltaY = y - drag.y;
        updateRotation(
          [
            drag.rotation[0] + deltaX * 0.3,
            Math.max(-90, Math.min(90, drag.rotation[1] - deltaY * 0.3)),
            drag.rotation[2]
          ],
          true
        );
      },
      [updateRotation]
    );
    const handlePointerMove = (event) => {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId)
        return;
      pendingPointerMoveRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY
      };
      if (pointerMoveFrameRef.current !== null)
        return;
      pointerMoveFrameRef.current = requestAnimationFrame(() => {
        pointerMoveFrameRef.current = null;
        const pending = pendingPointerMoveRef.current;
        pendingPointerMoveRef.current = null;
        if (pending)
          applyPointerMove(pending.pointerId, pending.x, pending.y);
      });
    };
    const finishPointerDrag = (event) => {
      if (dragRef.current?.pointerId !== event.pointerId)
        return;
      if (pointerMoveFrameRef.current !== null) {
        cancelAnimationFrame(pointerMoveFrameRef.current);
        pointerMoveFrameRef.current = null;
      }
      const pending = pendingPointerMoveRef.current;
      pendingPointerMoveRef.current = null;
      if (pending)
        applyPointerMove(pending.pointerId, pending.x, pending.y);
      dragRef.current = null;
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    };
    useEffect16(
      () => () => {
        if (pointerMoveFrameRef.current !== null) {
          cancelAnimationFrame(pointerMoveFrameRef.current);
        }
      },
      []
    );
    return /* @__PURE__ */ jsxs38(
      "div",
      {
        ref,
        className: cn("relative w-full overflow-hidden", className),
        style: height === void 0 ? { aspectRatio: "1" } : { height },
        onFocusCapture: () => {
          isFocusedRef.current = true;
        },
        onBlurCapture: (event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            isFocusedRef.current = false;
          }
        },
        children: [
          draggable ? /* @__PURE__ */ jsx63("span", { id: instructionsId, className: "sr-only", children: "Use the arrow keys to rotate the globe." }) : null,
          /* @__PURE__ */ jsxs38(
            "svg",
            {
              ref: svgRef,
              role: "group",
              "aria-label": ariaLabel,
              "aria-describedby": draggable ? instructionsId : void 0,
              tabIndex: draggable ? 0 : void 0,
              viewBox: `0 0 ${GLOBE_VIEWBOX_SIZE} ${GLOBE_VIEWBOX_SIZE}`,
              className: cn(
                "block size-full touch-none select-none",
                draggable && "cursor-grab active:cursor-grabbing"
              ),
              onPointerDown: handlePointerDown,
              onPointerMove: handlePointerMove,
              onPointerUp: finishPointerDrag,
              onPointerCancel: finishPointerDrag,
              onLostPointerCapture: (event) => {
                if (dragRef.current?.pointerId === event.pointerId) {
                  dragRef.current = null;
                }
              },
              onKeyDown: (event) => {
                if (!draggable || event.target !== event.currentTarget)
                  return;
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== "ArrowUp" && event.key !== "ArrowDown") {
                  return;
                }
                event.preventDefault();
                const [longitude, latitude, roll] = rotationRef.current;
                const nextRotation = event.key === "ArrowLeft" ? [longitude - 10, latitude, roll] : event.key === "ArrowRight" ? [longitude + 10, latitude, roll] : event.key === "ArrowUp" ? [longitude, Math.min(90, latitude + 10), roll] : event.key === "ArrowDown" ? [longitude, Math.max(-90, latitude - 10), roll] : [longitude, latitude, roll];
                if (nextRotation[0] === longitude && nextRotation[1] === latitude) {
                  return;
                }
                updateRotation(nextRotation, true);
              },
              onPointerLeave: () => {
                if (!dragRef.current)
                  setTooltip(null);
              },
              children: [
                /* @__PURE__ */ jsx63("defs", { children: /* @__PURE__ */ jsx63("clipPath", { id: sphereClipId, children: /* @__PURE__ */ jsx63("path", { d: spherePath }) }) }),
                /* @__PURE__ */ jsx63(
                  "path",
                  {
                    d: spherePath,
                    fill: oceanColor,
                    className: "stroke-zenth-line",
                    strokeWidth: 1.5
                  }
                ),
                showGraticule ? /* @__PURE__ */ jsx63(
                  "path",
                  {
                    d: graticulePath,
                    fill: "none",
                    className: "stroke-zenth-line",
                    strokeWidth: 0.75
                  }
                ) : null,
                /* @__PURE__ */ jsx63(
                  "path",
                  {
                    "data-land-style": "hatched",
                    d: landHatchPath,
                    fill: "none",
                    stroke: resolvedLandColor,
                    strokeWidth: 1.25,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    clipPath: `url(#${sphereClipId})`,
                    className: "pointer-events-none"
                  }
                ),
                /* @__PURE__ */ jsx63(
                  "path",
                  {
                    "data-globe-outline": "",
                    d: spherePath,
                    fill: "none",
                    className: "pointer-events-none stroke-zenth-line",
                    strokeWidth: 2
                  }
                ),
                markers.map((marker, index) => {
                  const position = projection([marker.longitude, marker.latitude]);
                  const isVisible = center && geoDistance(center, [marker.longitude, marker.latitude]) <= Math.PI / 2;
                  const detail = marker.description ?? `${marker.latitude.toFixed(2)}, ${marker.longitude.toFixed(2)}`;
                  const activateMarker = () => {
                    onMarkerClick?.(marker);
                  };
                  if (!position || !isVisible)
                    return null;
                  const isInteractive = onMarkerClick !== void 0;
                  const distanceFromCenter = Math.hypot(
                    position[0] - GLOBE_VIEWBOX_SIZE / 2,
                    position[1] - GLOBE_VIEWBOX_SIZE / 2
                  );
                  const edgeOpacity = Math.max(
                    0,
                    Math.min(
                      1,
                      (GLOBE_RADIUS - distanceFromCenter) / MARKER_EDGE_FADE_DISTANCE
                    )
                  );
                  return /* @__PURE__ */ jsx63(
                    "circle",
                    {
                      cx: position[0],
                      cy: position[1],
                      r: Math.max(
                        0,
                        finiteNumber(
                          marker.radius ?? safeMarkerRadius,
                          safeMarkerRadius
                        )
                      ),
                      fill: marker.color ?? resolvedMarkerColor,
                      opacity: edgeOpacity,
                      className: "stroke-zenth-base transition-opacity outline-none",
                      strokeWidth: 2,
                      "data-globe-marker": "",
                      "data-globe-marker-interactive": isInteractive,
                      role: isInteractive ? "button" : void 0,
                      "aria-label": isInteractive ? `${marker.name}: ${detail}` : void 0,
                      "aria-hidden": isInteractive ? void 0 : true,
                      tabIndex: isInteractive ? 0 : void 0,
                      onPointerEnter: (event) => moveTooltip(event, marker),
                      onPointerMove: (event) => {
                        if (!dragRef.current)
                          moveTooltip(event, marker);
                      },
                      onPointerLeave: () => setTooltip(null),
                      onFocus: (event) => {
                        if (!showTooltip)
                          return;
                        const svgBounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
                        if (!svgBounds)
                          return;
                        const markerBounds = event.currentTarget.getBoundingClientRect();
                        setTooltip({
                          name: marker.name,
                          detail,
                          x: markerBounds.left + markerBounds.width / 2 - svgBounds.left,
                          y: markerBounds.top - svgBounds.top
                        });
                      },
                      onBlur: () => setTooltip(null),
                      onClick: isInteractive ? activateMarker : void 0,
                      onKeyDown: isInteractive ? (event) => {
                        if (event.key !== "Enter" && event.key !== " ")
                          return;
                        event.preventDefault();
                        activateMarker();
                      } : void 0
                    },
                    `${marker.name}-${index}`
                  );
                })
              ]
            }
          ),
          onMarkerClick === void 0 && markers.length > 0 ? /* @__PURE__ */ jsx63("ul", { className: "sr-only", "aria-label": `${ariaLabel} locations`, children: markers.map((marker, index) => /* @__PURE__ */ jsxs38("li", { children: [
            marker.name,
            ":",
            " ",
            marker.description ?? `${marker.latitude.toFixed(2)}, ${marker.longitude.toFixed(2)}`
          ] }, `${marker.name}-${index}`)) }) : null,
          tooltip ? /* @__PURE__ */ jsxs38(
            "div",
            {
              role: "tooltip",
              className: "pointer-events-none absolute z-10 flex -translate-x-1/2 -translate-y-full flex-col gap-0.5 rounded-lg border border-zenth-line bg-zenth-base px-2 py-1.5 text-xs text-zenth-default shadow-lg",
              style: { left: tooltip.x, top: tooltip.y - 8 },
              children: [
                /* @__PURE__ */ jsx63("strong", { children: tooltip.name }),
                /* @__PURE__ */ jsx63("span", { className: "text-zenth-subtle", children: tooltip.detail })
              ]
            }
          ) : null
        ]
      }
    );
  }
);
GlobeMap.displayName = "GlobeMap";

// src/components/autocomplete/autocomplete.tsx
import { Autocomplete as AutocompleteBase } from "@base-ui/react/autocomplete";
import { CheckIcon as CheckIcon10 } from "@phosphor-icons/react";
import { createContext as createContext17, useContext as useContext17 } from "react";
import { jsx as jsx64, jsxs as jsxs39 } from "react/jsx-runtime";
var AutocompleteContext = createContext17({
  hasError: false
});
var KUMO_AUTOCOMPLETE_VARIANTS = {
  size: KUMO_INPUT_VARIANTS.size
};
var KUMO_AUTOCOMPLETE_DEFAULT_VARIANTS = {
  size: "base"
};
function autocompleteVariants({
  size = KUMO_AUTOCOMPLETE_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    resolveVariant(
      KUMO_INPUT_VARIANTS.size,
      size,
      KUMO_AUTOCOMPLETE_DEFAULT_VARIANTS.size
    ).classes
  );
}
function Root5({
  label,
  required,
  labelTooltip,
  description,
  error,
  children,
  ...props
}) {
  const rootProps = props;
  const control = /* @__PURE__ */ jsx64(AutocompleteContext.Provider, { value: { hasError: Boolean(error) }, children: /* @__PURE__ */ jsx64(AutocompleteBase.Root, { ...rootProps, children }) });
  if (label) {
    return /* @__PURE__ */ jsx64(
      Field,
      {
        label,
        required,
        labelTooltip,
        description,
        error: error ? typeof error === "string" ? { message: error, match: true } : error : void 0,
        children: control
      }
    );
  }
  return control;
}
function InputGroup2({
  className,
  size = KUMO_AUTOCOMPLETE_DEFAULT_VARIANTS.size,
  placeholder
}) {
  const { hasError } = useContext17(AutocompleteContext);
  return /* @__PURE__ */ jsx64(
    AutocompleteBase.Input,
    {
      className: cn(
        inputVariants({
          size,
          variant: hasError ? "error" : "default",
          focusIndicator: true
        }),
        "w-full",
        className
      ),
      placeholder
    }
  );
}
function Content2({
  children,
  className,
  align = "start",
  sideOffset = 4,
  alignOffset,
  side
}) {
  return /* @__PURE__ */ jsx64(AutocompleteBase.Portal, { children: /* @__PURE__ */ jsx64(
    AutocompleteBase.Positioner,
    {
      className: "outline-none",
      align,
      sideOffset,
      alignOffset,
      side,
      children: /* @__PURE__ */ jsx64(
        AutocompleteBase.Popup,
        {
          className: (state) => cn(
            "flex flex-col",
            "max-h-[min(var(--available-height),24rem)] max-w-(--available-width) min-w-(--anchor-width) py-1.5",
            "bg-zenth-control text-zenth-default",
            "rounded-lg shadow-lg ring ring-zenth-line",
            state.empty && "hidden",
            className
          ),
          children
        }
      )
    }
  ) });
}
function List4({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx64(
    AutocompleteBase.List,
    {
      ...props,
      className: cn(
        "min-h-0 flex-1 scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain",
        className
      )
    }
  );
}
function Item3({
  children,
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs39(
    AutocompleteBase.Item,
    {
      "data-zenth-component": "Autocomplete",
      "data-zenth-part": "item",
      ...props,
      className: cn(
        "group mx-1.5 grid cursor-pointer grid-cols-[1fr_16px] gap-2 rounded px-2 py-1.5 text-base",
        "data-highlighted:bg-zenth-tint data-selected:font-medium",
        className
      ),
      children: [
        /* @__PURE__ */ jsx64("div", { className: "col-start-1", children }),
        /* @__PURE__ */ jsx64("span", { className: "col-start-2 hidden items-center group-data-selected:flex", children: /* @__PURE__ */ jsx64(CheckIcon10, { size: 14 }) })
      ]
    }
  );
}
function GroupLabel4(props) {
  return /* @__PURE__ */ jsx64(
    AutocompleteBase.GroupLabel,
    {
      ...props,
      className: cn(
        "mx-1.5 px-2 py-1.5 text-sm text-zenth-strong",
        props.className
      )
    }
  );
}
function Group4(props) {
  return /* @__PURE__ */ jsx64(
    AutocompleteBase.Group,
    {
      ...props,
      className: "mt-2 border-t border-zenth-line pt-2 first:mt-0 first:border-t-0 first:pt-0"
    }
  );
}
function Separator3(props) {
  return /* @__PURE__ */ jsx64(
    AutocompleteBase.Separator,
    {
      ...props,
      className: cn("mx-0 my-1 h-px bg-zenth-line", props.className)
    }
  );
}
Root5.displayName = "Autocomplete.Root";
InputGroup2.displayName = "Autocomplete.InputGroup";
Content2.displayName = "Autocomplete.Content";
Item3.displayName = "Autocomplete.Item";
GroupLabel4.displayName = "Autocomplete.GroupLabel";
Group4.displayName = "Autocomplete.Group";
Separator3.displayName = "Autocomplete.Separator";
var Autocomplete2 = Object.assign(Root5, {
  // Styled compound sub-components
  InputGroup: InputGroup2,
  Content: Content2,
  Item: Item3,
  GroupLabel: GroupLabel4,
  Group: Group4,
  Separator: Separator3,
  List: List4,
  // Pass-through Base UI sub-components
  Empty: AutocompleteBase.Empty,
  Collection: AutocompleteBase.Collection,
  // Filtering
  useFilter: AutocompleteBase.useFilter
});

// src/components/sidebar/sidebar.tsx
import React12, {
  createContext as createContext18,
  forwardRef as forwardRef32,
  useCallback as useCallback17,
  useContext as useContext18,
  useEffect as useEffect17,
  useMemo as useMemo16,
  useId as useId9,
  useRef as useRef18,
  useState as useState13,
  useSyncExternalStore
} from "react";
import { ScrollArea as ScrollAreaBase } from "@base-ui/react/scroll-area";
import { CaretRightIcon as CaretRightIcon5, XIcon as XIcon4 } from "@phosphor-icons/react";
import { Fragment as Fragment15, jsx as jsx65, jsxs as jsxs40 } from "react/jsx-runtime";
var KUMO_SIDEBAR_VARIANTS = {
  variant: {
    sidebar: {
      classes: "",
      description: "Standard sidebar with border separator"
    },
    floating: {
      classes: "",
      description: "Floating sidebar with shadow and rounded corners"
    },
    inset: {
      classes: "",
      description: "Inset sidebar within the content area"
    }
  },
  collapsible: {
    icon: {
      classes: "",
      description: "Collapses to show icons only"
    },
    offcanvas: {
      classes: "",
      description: "Slides off screen when collapsed"
    },
    none: {
      classes: "",
      description: "Cannot be collapsed"
    }
  },
  side: {
    left: {
      classes: "",
      description: "Left-aligned sidebar"
    },
    right: {
      classes: "",
      description: "Right-aligned sidebar"
    }
  }
};
var KUMO_SIDEBAR_DEFAULT_VARIANTS = {
  variant: "sidebar",
  collapsible: "icon",
  side: "left"
};
var KUMO_SIDEBAR_STYLING = {
  width: {
    expanded: "16.25rem",
    icon: "57px"
  },
  mobile: {
    breakpoint: 768
  }
};
var SIDEBAR_WIDTH = "16.25rem";
var SIDEBAR_WIDTH_ICON = "57px";
var SIDEBAR_EASING = "cubic-bezier(0.77, 0, 0.175, 1)";
var SIDEBAR_ANIMATION_DURATION_MS = 250;
var TRANSITION_FALLBACK_GRACE_MS = 50;
var MOBILE_BREAKPOINT = 768;
var FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
function useOpenChangeComplete(open, duration, onComplete, active = true) {
  const enabled = active && onComplete !== void 0;
  const callbackRef = useRef18(onComplete);
  const durationRef = useRef18(duration);
  const previousOpenRef = useRef18(open);
  const previousActiveRef = useRef18(active);
  const pendingOpenRef = useRef18(void 0);
  const timeoutRef = useRef18(
    void 0
  );
  callbackRef.current = onComplete;
  durationRef.current = duration;
  const complete = useCallback17(() => {
    const pendingOpen = pendingOpenRef.current;
    if (pendingOpen === void 0)
      return;
    pendingOpenRef.current = void 0;
    clearTimeout(timeoutRef.current);
    callbackRef.current?.(pendingOpen);
  }, []);
  useEffect17(() => {
    const openChanged = previousOpenRef.current !== open;
    const wasActive = previousActiveRef.current;
    previousOpenRef.current = open;
    previousActiveRef.current = active;
    if (!enabled) {
      pendingOpenRef.current = void 0;
      clearTimeout(timeoutRef.current);
      return;
    }
    if (!wasActive || !openChanged)
      return;
    pendingOpenRef.current = open;
    if (durationRef.current === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete();
      return;
    }
    timeoutRef.current = setTimeout(
      complete,
      durationRef.current + TRANSITION_FALLBACK_GRACE_MS
    );
    return () => clearTimeout(timeoutRef.current);
  }, [active, complete, enabled, open]);
  return complete;
}
function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const subscribe = useCallback17(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  const getSnapshot = useCallback17(
    () => window.matchMedia(query).matches,
    [query]
  );
  const getServerSnapshot = useCallback17(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
var SidebarContext = createContext18(null);
function useSidebar() {
  const context = useContext18(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar.Provider");
  }
  return context;
}
var DEFAULT_WIDTH_PX = 256;
var MIN_WIDTH_PX = 200;
var MAX_WIDTH_PX = 480;
function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  onOpenChangeComplete,
  variant = KUMO_SIDEBAR_DEFAULT_VARIANTS.variant,
  side = KUMO_SIDEBAR_DEFAULT_VARIANTS.side,
  collapsible = KUMO_SIDEBAR_DEFAULT_VARIANTS.collapsible,
  resizable = false,
  defaultWidth = DEFAULT_WIDTH_PX,
  minWidth = MIN_WIDTH_PX,
  maxWidth = MAX_WIDTH_PX,
  onWidthChange,
  contained = false,
  peekable = false,
  animationDuration = SIDEBAR_ANIMATION_DURATION_MS,
  mobileBreakpoint,
  children,
  className,
  style
}) {
  const isMobile = useIsMobile(mobileBreakpoint);
  const [_openMobile, _setOpenMobile] = useState13(false);
  const [width, setWidthState] = useState13(defaultWidth);
  const [isResizing, setIsResizing] = useState13(false);
  const [isPeeking, setIsPeeking] = useState13(false);
  const openMobile = isMobile && openProp !== void 0 ? openProp : _openMobile;
  const setOpenMobile = useCallback17(
    (next) => {
      _setOpenMobile(next);
      if (isMobile && openProp !== void 0) {
        setOpenProp?.(next);
      }
    },
    [isMobile, openProp, setOpenProp]
  );
  const setWidth = useCallback17(
    (newWidth) => {
      const clamped = Math.min(maxWidth, Math.max(minWidth, newWidth));
      setWidthState(clamped);
      onWidthChange?.(clamped);
    },
    [minWidth, maxWidth, onWidthChange]
  );
  const [_open, _setOpen] = useState13(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback17(
    (value) => {
      const next = typeof value === "function" ? value(open) : value;
      setOpenProp?.(next);
      _setOpen(next);
    },
    [setOpenProp, open]
  );
  const toggleSidebar = useCallback17(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setIsPeeking(false);
      setOpen((prev) => !prev);
    }
  }, [isMobile, openMobile, setOpenMobile, setOpen]);
  const startPeek = useCallback17(() => {
    if (peekable && !open && !isMobile) {
      setIsPeeking(true);
    }
  }, [peekable, open, isMobile]);
  const stopPeek = useCallback17(() => {
    setIsPeeking(false);
  }, []);
  const state = isPeeking ? "peeking" : open ? "expanded" : "collapsed";
  const sidebarWidthValue = resizable ? `${width}px` : SIDEBAR_WIDTH;
  const itemsRef = useRef18(/* @__PURE__ */ new Map());
  const registerItem = useCallback17((id, node) => {
    const items = itemsRef.current;
    if (node) {
      items.set(id, node);
    } else {
      items.delete(id);
    }
  }, []);
  const scrollToItem = useCallback17(
    (id, options = {}) => {
      const { align = "auto", behavior = "auto" } = options;
      const target = itemsRef.current.get(id);
      if (!target)
        return;
      const viewport = target.closest('[data-sidebar="viewport"]');
      if (!viewport)
        return;
      const targetRect = target.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      const viewportScaleY = viewport.offsetHeight > 0 && viewportRect.height > 0 ? viewportRect.height / viewport.offsetHeight : 1;
      const itemScrollOffset = (targetRect.top - viewportRect.top) / viewportScaleY + viewport.scrollTop;
      let desired;
      if (align === "center") {
        desired = itemScrollOffset - (viewport.clientHeight - target.offsetHeight) / 2;
      } else if (align === "end") {
        desired = itemScrollOffset - (viewport.clientHeight - target.offsetHeight);
      } else if (align === "auto") {
        const itemBottom = itemScrollOffset + target.offsetHeight;
        const viewBottom = viewport.scrollTop + viewport.clientHeight;
        if (itemScrollOffset < viewport.scrollTop) {
          desired = itemScrollOffset;
        } else if (itemBottom > viewBottom) {
          desired = itemBottom - viewport.clientHeight;
        } else {
          return;
        }
      } else {
        desired = itemScrollOffset;
      }
      const clamped = Math.max(
        0,
        Math.min(desired, viewport.scrollHeight - viewport.clientHeight)
      );
      const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      viewport.scrollTo({
        top: clamped,
        behavior: reducedMotion ? "auto" : behavior
      });
    },
    []
  );
  const scrollItemIntoView = useCallback17(
    (id, options = {}) => {
      const target = itemsRef.current.get(id);
      if (!target)
        return;
      const viewport = target.closest('[data-sidebar="viewport"]');
      if (!viewport)
        return;
      const targetRect = target.getBoundingClientRect();
      const viewportRect = viewport.getBoundingClientRect();
      if (targetRect.top >= viewportRect.top && targetRect.bottom <= viewportRect.bottom) {
        return;
      }
      scrollToItem(id, options);
    },
    [scrollToItem]
  );
  const contextValue = useMemo16(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      variant,
      side,
      collapsible,
      width,
      resizable,
      minWidth,
      maxWidth,
      isResizing,
      setIsResizing,
      setWidth,
      isPeeking,
      peekable,
      startPeek,
      stopPeek,
      contained,
      animationDuration,
      registerItem,
      scrollToItem,
      scrollItemIntoView
    }),
    [state, open, openMobile, isMobile, width, isResizing, isPeeking]
  );
  const completeDesktopOpenChange = useOpenChangeComplete(
    open,
    animationDuration,
    onOpenChangeComplete,
    !isMobile
  );
  const completeMobileOpenChange = useOpenChangeComplete(
    openMobile,
    animationDuration,
    onOpenChangeComplete,
    isMobile
  );
  const completeOpenChange = isMobile ? completeMobileOpenChange : completeDesktopOpenChange;
  const transitionProperty = isMobile ? "transform" : "width";
  const handleOpenTransitionEnd = useCallback17(
    (event) => {
      const target = event.target;
      if (target.closest("[data-sidebar-wrapper]") === event.currentTarget && target.dataset.sidebar === "sidebar" && event.propertyName === transitionProperty) {
        completeOpenChange();
      }
    },
    [completeOpenChange, transitionProperty]
  );
  return /* @__PURE__ */ jsx65(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx65(
    "div",
    {
      "data-sidebar-wrapper": "",
      "data-state": state,
      "data-side": side,
      onTransitionEnd: handleOpenTransitionEnd,
      style: {
        "--sidebar-width": sidebarWidthValue,
        "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
        "--sidebar-animation-duration": `${animationDuration}ms`,
        "--sidebar-easing": SIDEBAR_EASING,
        ...style
      },
      className: cn(
        "group/sidebar-wrapper relative isolate flex w-full [--sidebar-active-bg:var(--color-zenth-tint)] [--sidebar-bg:var(--color-zenth-base)]",
        !contained && !isMobile && "min-h-svh",
        "has-data-[variant=inset]:bg-zenth-recessed",
        isResizing && "select-none",
        className
      ),
      children
    }
  ) });
}
SidebarProvider.displayName = "Sidebar.Provider";
var SidebarRoot = forwardRef32(
  ({
    className,
    contentClassName,
    children,
    fullScreenOnMobile = false,
    ...props
  }, ref) => {
    const {
      state,
      open,
      isMobile,
      openMobile,
      setOpenMobile,
      side,
      variant,
      collapsible,
      isResizing,
      resizable,
      width,
      isPeeking,
      startPeek,
      stopPeek,
      contained
    } = useSidebar();
    const mobileAsideRef = useCallback17(
      (node) => {
        if (node) {
          if (!openMobile) {
            node.setAttribute("inert", "");
          } else {
            node.removeAttribute("inert");
          }
        }
      },
      [openMobile]
    );
    const mergedMobileRef = useCallback17(
      (node) => {
        mobileAsideRef(node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, mobileAsideRef]
    );
    const triggerRef = useRef18(null);
    const mobileNodeRef = useRef18(null);
    const shouldRestoreFocusRef = useRef18(false);
    const isPointerInPeekZoneRef = useRef18(false);
    useEffect17(() => {
      if (!isMobile || !openMobile)
        return;
      const handleKeyDown = (e) => {
        if (e.key === "Escape") {
          shouldRestoreFocusRef.current = true;
          setOpenMobile(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isMobile, openMobile, setOpenMobile]);
    useEffect17(() => {
      if (!isMobile)
        return;
      if (openMobile) {
        triggerRef.current = document.activeElement;
        shouldRestoreFocusRef.current = false;
        requestAnimationFrame(() => {
          const firstFocusable = mobileNodeRef.current?.querySelector(
            FOCUSABLE_SELECTOR
          );
          (firstFocusable ?? mobileNodeRef.current)?.focus();
        });
      } else if (shouldRestoreFocusRef.current && triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
        shouldRestoreFocusRef.current = false;
        triggerRef.current = null;
      }
    }, [isMobile, openMobile]);
    const handlePeekBlur = useCallback17(
      (e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && !isPointerInPeekZoneRef.current) {
          stopPeek();
        }
      },
      [stopPeek]
    );
    const handlePeekMouseEnter = useCallback17(() => {
      isPointerInPeekZoneRef.current = true;
      startPeek();
    }, [startPeek]);
    const handlePeekMouseLeave = useCallback17(() => {
      isPointerInPeekZoneRef.current = false;
      stopPeek();
    }, [stopPeek]);
    if (collapsible === "none") {
      return /* @__PURE__ */ jsx65(
        "aside",
        {
          ref,
          "data-state": "expanded",
          "data-side": side,
          "data-variant": variant,
          "data-sidebar": "sidebar",
          style: {
            width: "var(--sidebar-width)",
            minWidth: "var(--sidebar-width)",
            maxWidth: "var(--sidebar-width)"
          },
          className: cn(
            "relative flex h-full shrink-0 grow-0 flex-col overflow-hidden bg-(--sidebar-bg) text-zenth-default",
            variant === "sidebar" && (side === "left" ? "border-r border-zenth-line" : "border-l border-zenth-line"),
            variant === "floating" && "m-2 rounded-lg border border-zenth-line shadow-lg",
            className
          ),
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsxs40(Fragment15, { children: [
        /* @__PURE__ */ jsx65(
          "div",
          {
            "data-sidebar-backdrop": "",
            className: cn(
              contained ? "absolute inset-0 z-40 bg-zenth-recessed" : "fixed inset-0 z-40 bg-zenth-recessed",
              "transition-opacity duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
              "motion-reduce:transition-none",
              openMobile && !fullScreenOnMobile ? "opacity-80" : "pointer-events-none opacity-0"
            ),
            onClick: () => {
              shouldRestoreFocusRef.current = true;
              setOpenMobile(false);
            },
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx65(
          "nav",
          {
            ref: (node) => {
              mergedMobileRef(node);
              mobileNodeRef.current = node;
            },
            tabIndex: -1,
            "aria-label": "Navigation",
            "aria-hidden": !openMobile,
            "data-state": openMobile ? "expanded" : "collapsed",
            "data-side": side,
            "data-variant": variant,
            "data-collapsible": collapsible,
            "data-sidebar": "sidebar",
            "data-mobile": "true",
            className: cn(
              "group/sidebar inset-y-0 z-50 flex flex-col overflow-hidden",
              contained ? "absolute" : "fixed",
              fullScreenOnMobile ? "w-full" : "w-(--sidebar-width)",
              "bg-(--sidebar-bg) text-zenth-default",
              // No border when full-screen — there is no adjacent content to divide.
              !fullScreenOnMobile && "border-r border-zenth-line",
              "transition-transform duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
              "motion-reduce:transition-none",
              side === "left" && "left-0",
              side === "right" && "right-0",
              side === "left" && (openMobile ? "translate-x-0" : "-translate-x-full"),
              side === "right" && (openMobile ? "translate-x-0" : "translate-x-full"),
              className
            ),
            ...props,
            children
          }
        )
      ] });
    }
    const collapsedWidth = collapsible === "icon" ? "var(--sidebar-width-icon)" : "0px";
    const expandedWidth = resizable ? `${width}px` : "var(--sidebar-width)";
    const railWidth = open ? expandedWidth : collapsedWidth;
    const contentExpanded = open || isPeeking;
    const contentWidth = contentExpanded ? expandedWidth : collapsedWidth;
    const borderClasses = variant === "sidebar" ? side === "left" ? "border-r border-zenth-line" : "border-l border-zenth-line" : variant === "floating" ? "border border-zenth-line" : "";
    return /* @__PURE__ */ jsx65(
      "aside",
      {
        ref,
        "data-state": state,
        "data-side": side,
        "data-variant": variant,
        "data-collapsible": collapsible,
        "data-sidebar": "sidebar",
        style: { width: railWidth },
        className: cn(
          "group/sidebar relative h-full shrink-0 grow-0",
          "overflow-visible",
          // allow content container to overlay when peeking
          "transition-[width] duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
          "motion-reduce:transition-none",
          isResizing && "transition-none!",
          variant === "floating" && "m-2 rounded-lg shadow-lg",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx65(TooltipProvider, { children: (() => {
          const childArray = React12.Children.toArray(children);
          const footerChildren = childArray.filter(
            (child) => React12.isValidElement(child) && child.type?.displayName === "Sidebar.Footer"
          );
          const nonFooterChildren = childArray.filter(
            (child) => !React12.isValidElement(child) || child.type?.displayName !== "Sidebar.Footer"
          );
          return /* @__PURE__ */ jsxs40(
            "div",
            {
              "data-sidebar": "content-container",
              style: { width: contentWidth },
              className: cn(
                "flex h-full flex-col",
                "min-w-0 overflow-hidden whitespace-nowrap",
                "bg-(--sidebar-bg) text-zenth-default",
                borderClasses,
                "transition-[width] duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
                "motion-reduce:transition-none",
                isResizing && "transition-none!",
                !open && cn(
                  contained ? "absolute" : "fixed",
                  "inset-y-0 z-40",
                  side === "left" && "left-0",
                  side === "right" && "right-0"
                ),
                open && "relative",
                contentClassName
              ),
              children: [
                /* @__PURE__ */ jsx65(
                  "div",
                  {
                    "data-sidebar": "peek-zone",
                    className: "flex min-h-0 flex-1 flex-col",
                    onMouseEnter: handlePeekMouseEnter,
                    onMouseLeave: handlePeekMouseLeave,
                    onFocus: startPeek,
                    onBlur: handlePeekBlur,
                    children: nonFooterChildren
                  }
                ),
                footerChildren
              ]
            }
          );
        })() })
      }
    );
  }
);
SidebarRoot.displayName = "Sidebar";
var SidebarHeader = forwardRef32(({ className, ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "header",
    className: cn(
      "flex h-[58px] shrink-0 items-center gap-1 border-b border-zenth-line",
      "overflow-hidden px-3",
      className
    ),
    ...props
  }
));
SidebarHeader.displayName = "Sidebar.Header";
var SidebarContent = forwardRef32(({ className, children, ...props }, ref) => {
  return /* @__PURE__ */ jsxs40(
    ScrollAreaBase.Root,
    {
      ref,
      "data-sidebar": "content",
      className: cn("relative min-w-0 flex-1 overflow-hidden", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx65(
          ScrollAreaBase.Viewport,
          {
            tabIndex: -1,
            "data-sidebar": "viewport",
            className: cn(
              "h-full px-[11px] py-3 group-not-data-[state=collapsed]/sidebar:px-3.5",
              "transition-[padding] duration-(--sidebar-animation-duration)",
              "overflow-x-hidden!",
              // Hide the native scrollbar with Kumo's CSS rather than relying on
              // the <style> Base UI adds to <head>, which head-swapping client
              // routers and strict CSPs can drop.
              "zenth-no-scrollbar",
              // Scroll fade via CSS mask driven by Base UI overflow CSS variables
              "[mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,24px)),black_calc(100%-min(24px,var(--scroll-area-overflow-y-end,24px))),transparent_100%)]"
            ),
            children: /* @__PURE__ */ jsx65(ScrollAreaBase.Content, { className: "flex min-w-0! flex-col", children })
          }
        ),
        /* @__PURE__ */ jsx65(
          ScrollAreaBase.Scrollbar,
          {
            orientation: "vertical",
            className: cn(
              "flex w-1.5 touch-none p-px select-none",
              "opacity-0 transition-opacity duration-150",
              "data-[hovering]:opacity-100 data-[scrolling]:opacity-100",
              "group-data-[state=collapsed]/sidebar:hidden"
            ),
            children: /* @__PURE__ */ jsx65(ScrollAreaBase.Thumb, { className: "flex-1 rounded-full bg-zenth-line" })
          }
        )
      ]
    }
  );
});
SidebarContent.displayName = "Sidebar.Content";
var SidebarFooter = forwardRef32(({ className, ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "footer",
    className: cn(
      "flex h-12 shrink-0 items-center gap-4 overflow-hidden border-t border-zenth-line whitespace-nowrap",
      "px-[11px] group-not-data-[state=collapsed]/sidebar:px-4",
      "bg-(--sidebar-bg)",
      "w-(--sidebar-width)",
      "transition-[width,padding] duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
      "motion-reduce:transition-none",
      "sticky bottom-0",
      "bg-clip-padding group-data-[state=collapsed]/sidebar:w-(--sidebar-width-icon)",
      "group-data-[state=collapsed]/sidebar:border-r group-data-[state=collapsed]/sidebar:border-zenth-line",
      className
    ),
    ...props
  }
));
SidebarFooter.displayName = "Sidebar.Footer";
var SIDEBAR_LOADING_GROUPS = [
  ["w-28", "w-40", "w-24"],
  ["w-24", "w-36", "w-32"]
];
var SidebarLoading = forwardRef32(({ className, label = "Loading", ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "loading",
    role: "status",
    "aria-label": label,
    className: cn(
      "flex min-h-0 w-full flex-1 flex-col gap-4 px-2 py-3",
      className
    ),
    ...props,
    children: SIDEBAR_LOADING_GROUPS.map((widths, groupIndex) => /* @__PURE__ */ jsxs40("div", { className: "flex flex-col gap-0.5", children: [
      /* @__PURE__ */ jsx65(SkeletonLine, { className: "mb-1 ml-2 h-2 w-16 rounded-full group-data-[state=collapsed]/sidebar:hidden" }),
      widths.map((width, itemIndex) => /* @__PURE__ */ jsxs40(
        "div",
        {
          className: "flex min-h-8.5 items-center gap-3 rounded-lg px-3 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0",
          children: [
            /* @__PURE__ */ jsx65(SkeletonLine, { className: "size-4.5 shrink-0 rounded-md" }),
            /* @__PURE__ */ jsx65(
              SkeletonLine,
              {
                className: cn(
                  "h-2.5 rounded-full group-data-[state=collapsed]/sidebar:hidden",
                  width
                )
              }
            )
          ]
        },
        itemIndex
      ))
    ] }, groupIndex))
  }
));
SidebarLoading.displayName = "Sidebar.Loading";
var SidebarGroup = forwardRef32(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "group",
    className: cn("flex min-w-0 flex-col gap-y-px", className),
    ...props,
    children
  }
));
SidebarGroup.displayName = "Sidebar.Group";
var SidebarGroupLabel = forwardRef32(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "group-label",
    className: cn(
      // Grid-rows for smooth collapse animation
      "grid overflow-hidden",
      "transition-[grid-template-rows,margin,border-color] duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
      // Mobile: no collapse animation — sidebar is always expanded
      "group-data-[mobile=true]/sidebar:transition-none",
      // Collapsed: spacer with divider line between icon groups
      "my-3 grid-rows-[0fr] border-b border-zenth-line",
      // First group: no spacer or divider needed
      "[[data-sidebar=group]:first-child_&]:my-0 [[data-sidebar=group]:first-child_&]:border-transparent",
      // Expanded: reveal the label text
      "group-not-data-[state=collapsed]/sidebar:my-0 group-not-data-[state=collapsed]/sidebar:grid-rows-[1fr] group-not-data-[state=collapsed]/sidebar:border-transparent",
      // Mobile: always show labels (sidebar content is always expanded on mobile)
      "group-data-[mobile=true]/sidebar:my-0 group-data-[mobile=true]/sidebar:grid-rows-[1fr] group-data-[mobile=true]/sidebar:border-transparent",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx65("div", { className: "min-h-0 min-w-0", children: /* @__PURE__ */ jsx65(
      "div",
      {
        className: cn(
          "mt-4 mb-2 truncate px-3 text-sm font-medium text-zenth-subtle",
          // First group: less top margin
          "[[data-sidebar=group]:first-child_&]:mt-2"
        ),
        children
      }
    ) })
  }
));
SidebarGroupLabel.displayName = "Sidebar.GroupLabel";
var MenuItemContext = createContext18(false);
var MenuSubItemContext = createContext18(false);
var SidebarMenu = forwardRef32(({ className, ...props }, ref) => /* @__PURE__ */ jsx65(
  "ul",
  {
    ref,
    "data-sidebar": "menu",
    className: cn(
      "m-0 flex min-w-0 list-none flex-col items-stretch gap-y-px p-0",
      className
    ),
    ...props
  }
));
SidebarMenu.displayName = "Sidebar.Menu";
var SidebarMenuItem = forwardRef32(
  ({ className, children, itemId, ...props }, ref) => {
    const { registerItem } = useSidebar();
    const setRef = useCallback17(
      (node) => {
        if (itemId)
          registerItem(itemId, node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [itemId, ref, registerItem]
    );
    return /* @__PURE__ */ jsx65(MenuItemContext.Provider, { value: true, children: /* @__PURE__ */ jsx65(
      "li",
      {
        ref: setRef,
        "data-sidebar": "menu-item",
        "data-sidebar-item-id": itemId,
        className: cn(
          "relative group-data-[state=collapsed]/sidebar:overflow-hidden",
          className
        ),
        ...props,
        children
      }
    ) });
  }
);
SidebarMenuItem.displayName = "Sidebar.MenuItem";
var SidebarMenuButton = forwardRef32(
  ({
    className,
    icon: IconProp,
    active = false,
    size = "base",
    href,
    target,
    tooltip,
    itemId,
    children,
    ...props
  }, ref) => {
    const { state, peekable, registerItem } = useSidebar();
    const LinkComponent = useLinkComponent();
    const isInsideMenuItem = useContext18(MenuItemContext);
    const registerAutoWrap = useCallback17(
      (node) => {
        if (itemId && !isInsideMenuItem)
          registerItem(itemId, node);
      },
      [itemId, isInsideMenuItem, registerItem]
    );
    const registerInteractive = useCallback17(
      (node) => {
        if (itemId && isInsideMenuItem)
          registerItem(itemId, node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [itemId, isInsideMenuItem, ref, registerItem]
    );
    const iconNode = (() => {
      const icon = unwrapLazyElement(IconProp);
      if (!icon)
        return null;
      if (React12.isValidElement(icon))
        return icon;
      const Comp = icon;
      return /* @__PURE__ */ jsx65(
        Comp,
        {
          className: cn(
            "shrink-0 opacity-40",
            size === "base" ? "size-4" : "size-3.5"
          )
        }
      );
    })();
    const content = /* @__PURE__ */ jsxs40(
      "div",
      {
        className: cn(
          "flex min-w-0 flex-1 items-center gap-3",
          "translate-x-[-3px] group-not-data-[state=collapsed]/sidebar:translate-x-0",
          "transition-transform duration-(--sidebar-animation-duration)"
        ),
        children: [
          iconNode,
          /* @__PURE__ */ jsx65(
            "span",
            {
              className: cn(
                "flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left"
              ),
              children: React12.Children.map(
                children,
                (child) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ jsx65("span", { className: "truncate", children: child }) : child
              )
            }
          )
        ]
      }
    );
    const buttonClasses = cn(
      // Layout
      "group/menu-button relative flex w-full min-w-0 cursor-pointer items-center gap-2.5 rounded-lg outline-none",
      "before:absolute before:inset-x-0 before:-inset-y-px",
      // Sizing
      size === "base" && "min-h-8.5 px-3 py-0 text-sm font-medium",
      size === "sm" && "min-h-7 px-2 py-0 text-sm",
      "text-zenth-default",
      "transition-[color,box-shadow,outline] duration-(--sidebar-animation-duration)",
      !active && "hover:bg-(--sidebar-active-bg)",
      // Active state
      active && "bg-(--sidebar-active-bg)",
      // When a child sub-button is active, don't show active styling on the parent trigger
      "has-[[data-active]]:bg-transparent has-[[data-active]]:hover:bg-(--sidebar-active-bg)",
      // Focus
      "focus:outline-hidden focus-visible:bg-(--sidebar-active-bg) focus-visible:text-zenth-strong",
      className
    );
    let button;
    const itemIdOnButton = isInsideMenuItem ? itemId : void 0;
    if (href) {
      button = /* @__PURE__ */ jsx65(
        LinkComponent,
        {
          ref: registerInteractive,
          ...props,
          className: cn(buttonClasses, "no-underline!"),
          href,
          to: href,
          target,
          "data-active": active || void 0,
          "data-sidebar": "menu-button",
          "data-sidebar-item-id": itemIdOnButton,
          "data-zenth-component": "Sidebar",
          "data-zenth-part": "menu-button-link",
          "data-size": size,
          children: content
        }
      );
    } else {
      button = /* @__PURE__ */ jsx65(
        "button",
        {
          ref: registerInteractive,
          type: "button",
          className: buttonClasses,
          "data-active": active || void 0,
          "data-sidebar": "menu-button",
          "data-sidebar-item-id": itemIdOnButton,
          "data-zenth-component": "Sidebar",
          "data-zenth-part": "menu-button",
          "data-size": size,
          ...props,
          children: content
        }
      );
    }
    const showTooltip = state === "collapsed" && !peekable;
    if (tooltip) {
      button = /* @__PURE__ */ jsx65(
        Tooltip,
        {
          content: tooltip,
          disabled: !showTooltip,
          side: "right",
          render: button
        }
      );
    }
    if (!isInsideMenuItem) {
      return /* @__PURE__ */ jsx65(
        "li",
        {
          ref: registerAutoWrap,
          "data-sidebar": "menu-item",
          "data-sidebar-item-id": itemId,
          className: "relative group-data-[state=collapsed]/sidebar:overflow-hidden",
          children: button
        }
      );
    }
    return button;
  }
);
SidebarMenuButton.displayName = "Sidebar.MenuButton";
var SidebarMenuBadge = forwardRef32(({ className, ...props }, ref) => /* @__PURE__ */ jsx65(
  "span",
  {
    ref,
    "data-sidebar": "menu-badge",
    className: cn(
      "inline-flex shrink-0 items-center rounded-full border border-dashed border-zenth-line",
      "px-1.5 py-0.5 text-[11px]/none font-medium text-zenth-strong select-none",
      // Hidden when collapsed
      "group-data-[state=collapsed]/sidebar:hidden",
      className
    ),
    ...props
  }
));
SidebarMenuBadge.displayName = "Sidebar.MenuBadge";
var SidebarMenuSub = forwardRef32(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs40(
  "ul",
  {
    ref,
    "data-sidebar": "menu-sub",
    className: cn(
      "relative m-0 flex min-w-0 list-none flex-col gap-y-px overflow-hidden p-0 pr-0 pl-7",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsx65(
        "li",
        {
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-px left-[19px] z-10 block w-px bg-zenth-line"
        }
      ),
      children
    ]
  }
));
SidebarMenuSub.displayName = "Sidebar.MenuSub";
var SidebarMenuSubItem = forwardRef32(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx65(MenuSubItemContext.Provider, { value: true, children: /* @__PURE__ */ jsx65(
  "li",
  {
    ref,
    "data-sidebar": "menu-sub-item",
    className: cn("relative", className),
    ...props,
    children
  }
) }));
SidebarMenuSubItem.displayName = "Sidebar.MenuSubItem";
var SidebarMenuSubButton = forwardRef32(({ className, active = false, href, target, children, ...props }, ref) => {
  const LinkComponent = useLinkComponent();
  const isInsideMenuSubItem = useContext18(MenuSubItemContext);
  const buttonClasses = cn(
    "group/menu-button relative flex min-h-8.5 w-full min-w-0 cursor-pointer items-center gap-2 rounded-lg px-3 py-0 text-sm font-medium outline-none",
    "before:absolute before:inset-x-0 before:-inset-y-px",
    "text-zenth-default transition-[color] duration-150",
    !active && "hover:bg-(--sidebar-active-bg)",
    active && "bg-(--sidebar-active-bg)",
    "focus:outline-hidden focus-visible:bg-(--sidebar-active-bg) focus-visible:text-zenth-strong",
    className
  );
  const content = /* @__PURE__ */ jsx65("span", { className: "flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-left", children: React12.Children.map(
    children,
    (child) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ jsx65("span", { className: "truncate", children: child }) : child
  ) });
  let button;
  if (href) {
    button = /* @__PURE__ */ jsx65(
      LinkComponent,
      {
        ref,
        ...props,
        className: cn(buttonClasses, "no-underline!"),
        href,
        to: href,
        target,
        "data-active": active || void 0,
        "data-sidebar": "menu-sub-button",
        "data-zenth-component": "Sidebar",
        "data-zenth-part": "menu-sub-button-link",
        children: content
      }
    );
  } else {
    button = /* @__PURE__ */ jsx65(
      "button",
      {
        ref,
        type: "button",
        className: buttonClasses,
        "data-active": active || void 0,
        "data-sidebar": "menu-sub-button",
        "data-zenth-component": "Sidebar",
        "data-zenth-part": "menu-sub-button",
        ...props,
        children: content
      }
    );
  }
  if (!isInsideMenuSubItem) {
    return /* @__PURE__ */ jsx65("li", { "data-sidebar": "menu-sub-item", className: "relative", children: button });
  }
  return button;
});
SidebarMenuSubButton.displayName = "Sidebar.MenuSubButton";
var SidebarSeparator = forwardRef32(({ className, ...props }, ref) => /* @__PURE__ */ jsx65(
  "div",
  {
    ref,
    "data-sidebar": "separator",
    className: cn("my-3 px-2", className),
    ...props,
    children: /* @__PURE__ */ jsx65("div", { className: "border-b border-zenth-line" })
  }
));
SidebarSeparator.displayName = "Sidebar.Separator";
function SidebarPanelIcon({ className }) {
  const { open } = useSidebar();
  return /* @__PURE__ */ jsxs40(
    "svg",
    {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      "aria-hidden": "true",
      focusable: "false",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      className: cn("shrink-0", className),
      children: [
        /* @__PURE__ */ jsx65("path", { d: "M21.25 6.72v10.56a2.97 2.97 0 0 1-2.97 2.97H5.72a2.97 2.97 0 0 1-2.97-2.97V6.72a2.97 2.97 0 0 1 2.97-2.97h12.56a2.97 2.97 0 0 1 2.97 2.97" }),
        /* @__PURE__ */ jsx65(
          "path",
          {
            d: "M6.25 7.25v9.5",
            className: cn(
              "transition-transform duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
              open ? "translate-x-px" : "translate-x-[10.5px]"
            )
          }
        )
      ]
    }
  );
}
SidebarPanelIcon.displayName = "Sidebar.PanelIcon";
var SidebarTrigger = forwardRef32(({ className, children, onClick, ...props }, ref) => {
  const { open, toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx65(
    "button",
    {
      ref,
      type: "button",
      "data-sidebar": "trigger",
      "data-zenth-component": "Sidebar",
      "data-zenth-part": "trigger",
      "aria-expanded": open,
      "aria-label": open ? "Collapse sidebar" : "Expand sidebar",
      className: cn(
        "flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg",
        "text-zenth-subtle hover:bg-(--sidebar-active-bg) hover:text-zenth-default",
        "focus:outline-hidden focus-visible:ring-2 focus-visible:ring-zenth-brand focus-visible:ring-inset",
        className
      ),
      onClick: (e) => {
        onClick?.(e);
        toggleSidebar();
      },
      ...props,
      children: children ?? /* @__PURE__ */ jsx65(SidebarPanelIcon, {})
    }
  );
});
SidebarTrigger.displayName = "Sidebar.Trigger";
var SidebarClose = forwardRef32(({ className, onClick, ...props }, ref) => {
  const { setOpenMobile } = useSidebar();
  return /* @__PURE__ */ jsx65(
    Button,
    {
      ref,
      variant: "ghost",
      shape: "square",
      size: "sm",
      "data-sidebar": "close",
      "data-zenth-component": "Sidebar",
      "data-zenth-part": "close",
      "aria-label": "Close navigation",
      className: cn("shrink-0", className),
      onClick: (e) => {
        onClick?.(e);
        setOpenMobile(false);
      },
      ...props,
      children: /* @__PURE__ */ jsx65(XIcon4, { size: 18 })
    }
  );
});
SidebarClose.displayName = "Sidebar.Close";
var SidebarRail = forwardRef32(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsx65(
    "button",
    {
      ref,
      type: "button",
      "data-sidebar": "rail",
      "data-zenth-component": "Sidebar",
      "data-zenth-part": "rail",
      "aria-label": "Toggle sidebar",
      tabIndex: -1,
      className: cn(
        "absolute inset-y-0 z-1 hidden w-4 -translate-x-1/2 cursor-pointer transition-all",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5",
        "hover:after:bg-zenth-brand/20",
        "group-data-[side=left]/sidebar-wrapper:right-0",
        "group-data-[side=right]/sidebar-wrapper:left-0",
        "sm:flex",
        className
      ),
      onClick: toggleSidebar,
      ...props
    }
  );
});
SidebarRail.displayName = "Sidebar.Rail";
var SidebarResizeHandle = forwardRef32(({ className, ...props }, ref) => {
  const {
    side,
    resizable,
    setIsResizing,
    setWidth,
    setOpen,
    open,
    minWidth,
    width: currentWidth,
    maxWidth
  } = useSidebar();
  const startX = useRef18(0);
  const startWidth = useRef18(0);
  const wasCollapsed = useRef18(false);
  if (!resizable)
    return null;
  const KEYBOARD_STEP = 10;
  const handlePointerDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
    startX.current = e.clientX;
    wasCollapsed.current = !open;
    const wrapper = e.currentTarget.closest(
      "[data-sidebar-wrapper]"
    );
    const sidebar = wrapper?.querySelector("[data-sidebar='sidebar']");
    startWidth.current = sidebar?.getBoundingClientRect().width ?? 0;
    const cleanup = () => {
      setIsResizing(false);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
    const handlePointerMove = (moveEvent) => {
      const delta = side === "left" ? moveEvent.clientX - startX.current : startX.current - moveEvent.clientX;
      const rawWidth = startWidth.current + delta;
      if (wasCollapsed.current) {
        if (rawWidth >= minWidth) {
          wasCollapsed.current = false;
          setOpen(true);
          setWidth(rawWidth);
        }
        return;
      }
      if (rawWidth < minWidth) {
        setOpen(false);
        wasCollapsed.current = true;
        return;
      }
      setWidth(rawWidth);
    };
    const handlePointerUp = () => {
      cleanup();
    };
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };
  const handleKeyDown = (e) => {
    const grow = side === "left" ? "ArrowRight" : "ArrowLeft";
    const shrink = side === "left" ? "ArrowLeft" : "ArrowRight";
    if (e.key === grow) {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        setWidth(minWidth);
      } else {
        setWidth(Math.min(currentWidth + KEYBOARD_STEP, maxWidth));
      }
    } else if (e.key === shrink) {
      e.preventDefault();
      const next = currentWidth - KEYBOARD_STEP;
      if (next < minWidth) {
        setOpen(false);
      } else {
        setWidth(next);
      }
    } else if (e.key === "Home") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "End") {
      e.preventDefault();
      setOpen(true);
      setWidth(maxWidth);
    }
  };
  return /* @__PURE__ */ jsx65(
    "button",
    {
      ref,
      type: "button",
      "aria-label": "Resize sidebar",
      tabIndex: 0,
      "data-sidebar": "resize-handle",
      className: cn(
        // Hit area inside the sidebar edge; thin visual line pinned to the edge via ::after
        "absolute inset-y-0 z-2 hidden w-3 cursor-col-resize sm:block",
        "after:absolute after:inset-y-0 after:w-0.5",
        "after:bg-transparent after:transition-colors",
        "hover:after:bg-zenth-hairline focus-visible:after:bg-zenth-hairline active:after:bg-zenth-hairline",
        "focus:outline-hidden",
        side === "left" && "right-0 after:right-0",
        side === "right" && "left-0 after:left-0",
        className
      ),
      onPointerDown: handlePointerDown,
      onKeyDown: handleKeyDown,
      ...props
    }
  );
});
SidebarResizeHandle.displayName = "Sidebar.ResizeHandle";
var isCollapsibleContentShown = (isOpen, { isMobile, openMobile, state }) => isOpen && (isMobile ? openMobile : state !== "collapsed");
var SidebarCollapseContext = createContext18({
  contentId: "",
  isOpen: true,
  isCollapsible: false,
  autoScrollOnOpen: false,
  toggle: () => {
  },
  completeOpenChange: () => {
  }
});
var SidebarCollapsible = forwardRef32(
  ({
    defaultOpen = false,
    open: openProp,
    onOpenChange,
    onOpenChangeComplete,
    autoScrollOnOpen = false,
    className,
    children,
    ...props
  }, ref) => {
    const sidebar = useSidebar();
    const { animationDuration } = sidebar;
    const [internalOpen, setInternalOpen] = useState13(defaultOpen);
    const isOpen = openProp ?? internalOpen;
    const isContentShown = isCollapsibleContentShown(isOpen, sidebar);
    const contentId = useId9();
    const keyboardExpandedRef = useRef18(false);
    const toggle = useCallback17(() => {
      const next = !isOpen;
      setInternalOpen(next);
      onOpenChange?.(next);
      keyboardExpandedRef.current = false;
    }, [isOpen, onOpenChange]);
    const completeOpenChange = useOpenChangeComplete(
      isContentShown,
      animationDuration,
      onOpenChangeComplete
    );
    const contextValue = useMemo16(
      () => ({
        contentId,
        isOpen,
        isCollapsible: true,
        autoScrollOnOpen,
        toggle,
        completeOpenChange
      }),
      [contentId, isOpen, autoScrollOnOpen, toggle, completeOpenChange]
    );
    const handleFocusIn = useCallback17(
      (e) => {
        if (!isOpen && e.target.matches(":focus-visible")) {
          keyboardExpandedRef.current = true;
          setInternalOpen(true);
          onOpenChange?.(true);
        }
      },
      [isOpen, onOpenChange]
    );
    const handleFocusOut = useCallback17(
      (e) => {
        if (keyboardExpandedRef.current && !e.currentTarget.contains(e.relatedTarget) && !e.currentTarget.querySelector("[data-active]")) {
          keyboardExpandedRef.current = false;
          setInternalOpen(false);
          onOpenChange?.(false);
        }
      },
      [onOpenChange]
    );
    return /* @__PURE__ */ jsx65(SidebarCollapseContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsx65(
      "div",
      {
        ref,
        "data-open": isOpen || void 0,
        className: cn("min-w-0", className),
        onFocus: handleFocusIn,
        onBlur: handleFocusOut,
        ...props,
        children
      }
    ) });
  }
);
SidebarCollapsible.displayName = "Sidebar.Collapsible";
function SidebarCollapsibleTrigger({ render }) {
  const { contentId, isOpen, toggle } = useContext18(SidebarCollapseContext);
  return React12.cloneElement(render, {
    "aria-expanded": isOpen,
    "aria-controls": contentId,
    "data-open": isOpen || void 0,
    onClick: (e) => {
      const existingOnClick = render.props.onClick;
      existingOnClick?.(e);
      toggle();
    }
  });
}
SidebarCollapsibleTrigger.displayName = "Sidebar.CollapsibleTrigger";
var SidebarCollapsibleContent = forwardRef32(({ className, children, onTransitionEnd, ...props }, ref) => {
  const {
    contentId,
    isOpen: isCollapsibleOpen,
    autoScrollOnOpen,
    completeOpenChange
  } = useContext18(SidebarCollapseContext);
  const sidebar = useSidebar();
  const { animationDuration } = sidebar;
  const contentRef = useRef18(null);
  const isContentShown = isCollapsibleContentShown(isCollapsibleOpen, sidebar);
  useEffect17(() => {
    if (!isContentShown || !autoScrollOnOpen)
      return;
    const timeout = window.setTimeout(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      contentRef.current?.scrollIntoView({
        block: "nearest",
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
    }, animationDuration);
    return () => window.clearTimeout(timeout);
  }, [isContentShown, autoScrollOnOpen, animationDuration]);
  const inertRef = useCallback17(
    (node) => {
      if (node) {
        if (!isContentShown) {
          node.setAttribute("inert", "");
        } else {
          node.removeAttribute("inert");
        }
      }
    },
    [isContentShown]
  );
  const mergedRef = useCallback17(
    (node) => {
      contentRef.current = node;
      inertRef(node);
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref, inertRef]
  );
  const handleOpenTransitionEnd = useCallback17(
    (event) => {
      onTransitionEnd?.(event);
      if (event.target === event.currentTarget && event.propertyName === "grid-template-rows") {
        completeOpenChange();
      }
    },
    [completeOpenChange, onTransitionEnd]
  );
  return /* @__PURE__ */ jsx65(
    "div",
    {
      ref: mergedRef,
      id: contentId,
      role: "region",
      "aria-hidden": !isContentShown,
      onTransitionEnd: handleOpenTransitionEnd,
      className: cn(
        "grid",
        "transition-[grid-template-rows] duration-(--sidebar-animation-duration) ease-(--sidebar-easing)",
        "motion-reduce:transition-none",
        isContentShown ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx65("div", { className: "overflow-hidden", children })
    }
  );
});
SidebarCollapsibleContent.displayName = "Sidebar.CollapsibleContent";
function SidebarMenuChevron({ className }) {
  const { isOpen, isCollapsible } = useContext18(SidebarCollapseContext);
  return /* @__PURE__ */ jsx65(
    CaretRightIcon5,
    {
      size: 12,
      weight: "bold",
      className: cn(
        "ml-auto shrink-0 opacity-40 transition-[transform,rotate,opacity] duration-200 group-hover/menu-button:opacity-100",
        isCollapsible && isOpen && "rotate-90",
        // Hidden when sidebar is collapsed
        "group-data-[state=collapsed]/sidebar:hidden",
        className
      )
    }
  );
}
SidebarMenuChevron.displayName = "Sidebar.MenuChevron";
var SlidingViewActiveContext = createContext18("");
var SidebarSlidingViews = forwardRef32(
  ({
    activeKey,
    direction: _direction = "left",
    className,
    children,
    ...props
  }, ref) => {
    const childArray = React12.Children.toArray(children);
    const activeIndex = childArray.findIndex(
      (child) => React12.isValidElement(child) && child.props.value === activeKey
    );
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const translateX = activeIndex > 0 ? `-${activeIndex * 100}%` : "0%";
    return /* @__PURE__ */ jsx65(SlidingViewActiveContext.Provider, { value: activeKey, children: /* @__PURE__ */ jsx65(
      "div",
      {
        ref,
        "data-sidebar": "sliding-views",
        className: cn(
          "flex min-h-0 max-w-(--sidebar-width) flex-1 overflow-hidden",
          className
        ),
        ...props,
        children: /* @__PURE__ */ jsx65(
          "div",
          {
            className: "flex min-h-0 w-full shrink-0",
            style: {
              transform: `translateX(${translateX})`,
              transition: prefersReducedMotion ? "none" : `transform var(--sidebar-animation-duration) var(--sidebar-easing)`
            },
            children
          }
        )
      }
    ) });
  }
);
SidebarSlidingViews.displayName = "Sidebar.SlidingViews";
var SidebarSlidingView = forwardRef32(
  ({ value, className, children, ...props }, ref) => {
    const activeKey = useContext18(SlidingViewActiveContext);
    const isActive = activeKey === value;
    const inertRef = useCallback17(
      (node) => {
        if (node) {
          if (!isActive) {
            node.setAttribute("inert", "");
          } else {
            node.removeAttribute("inert");
          }
        }
      },
      [isActive]
    );
    const mergedRef = useCallback17(
      (node) => {
        inertRef(node);
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref, inertRef]
    );
    return /* @__PURE__ */ jsx65(
      "div",
      {
        ref: mergedRef,
        "data-sidebar": "sliding-view",
        "data-value": value,
        "aria-hidden": !isActive,
        className: cn(
          "flex min-h-0 w-full shrink-0 flex-col",
          !isActive && "pointer-events-none",
          className
        ),
        ...props,
        children
      }
    );
  }
);
SidebarSlidingView.displayName = "Sidebar.SlidingView";
var Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Loading: SidebarLoading,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuBadge: SidebarMenuBadge,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
  Close: SidebarClose,
  Rail: SidebarRail,
  ResizeHandle: SidebarResizeHandle,
  MenuChevron: SidebarMenuChevron,
  Collapsible: SidebarCollapsible,
  CollapsibleTrigger: SidebarCollapsibleTrigger,
  CollapsibleContent: SidebarCollapsibleContent,
  SlidingViews: SidebarSlidingViews,
  SlidingView: SidebarSlidingView
});

// src/components/table-of-contents/table-of-contents.tsx
import { cloneElement as cloneElement6, forwardRef as forwardRef33, isValidElement as isValidElement10 } from "react";
import { jsx as jsx66, jsxs as jsxs41 } from "react/jsx-runtime";
var KUMO_TABLE_OF_CONTENTS_VARIANTS = {
  state: {
    default: {
      classes: "text-zenth-subtle hover:border-zenth-line hover:text-zenth-default hover:font-medium",
      description: "Inactive section link"
    },
    active: {
      classes: "border-zenth-brand font-medium text-zenth-default",
      description: "Currently visible / active section"
    }
  }
};
var KUMO_TABLE_OF_CONTENTS_DEFAULT_VARIANTS = {
  state: "default"
};
var ITEM_BASE = "block w-full truncate border-l-2 border-transparent py-0.5 pl-4 text-sm text-left no-underline";
var TableOfContentsRoot = forwardRef33(
  ({ className, "aria-label": ariaLabel = "Table of contents", ...props }, ref) => /* @__PURE__ */ jsx66("nav", { ref, "aria-label": ariaLabel, className, ...props })
);
var TableOfContentsTitle = forwardRef33(({ className, ...props }, ref) => /* @__PURE__ */ jsx66(
  "p",
  {
    ref,
    className: cn(
      "mb-3 text-xs font-semibold tracking-wide text-zenth-subtle uppercase",
      className
    ),
    ...props
  }
));
var TableOfContentsList = forwardRef33(({ className, ...props }, ref) => /* @__PURE__ */ jsx66(
  "ul",
  {
    ref,
    className: cn(
      "flex flex-col gap-2 border-l-2 border-zenth-hairline",
      className
    ),
    ...props
  }
));
var TableOfContentsItem = forwardRef33(({ active = false, className, children, render, ...props }, ref) => {
  const stateClasses = active ? KUMO_TABLE_OF_CONTENTS_VARIANTS.state.active.classes : KUMO_TABLE_OF_CONTENTS_VARIANTS.state.default.classes;
  const combinedClassName = cn(ITEM_BASE, stateClasses, className);
  const innerContent = /* @__PURE__ */ jsx66("span", { className: "block min-w-0 leading-5", children });
  const sharedProps = {
    ref,
    "aria-current": active ? "true" : void 0,
    "data-zenth-component": "TableOfContents",
    "data-zenth-part": "item",
    className: combinedClassName,
    children: innerContent,
    ...props
  };
  if (render && isValidElement10(render)) {
    return /* @__PURE__ */ jsx66("li", { className: "-ml-0.5", children: cloneElement6(render, sharedProps) });
  }
  return /* @__PURE__ */ jsx66("li", { className: "-ml-0.5", children: /* @__PURE__ */ jsx66("a", { ...sharedProps }) });
});
var NESTED_UL_CLASSES = "flex flex-col gap-2 border-l-2 border-zenth-hairline [&>li>a]:pl-7 [&>li>button]:pl-7";
var TableOfContentsGroup = forwardRef33(
  ({ label, href, active = false, className, children, onClick, ...props }, ref) => {
    if (href) {
      const stateClasses = active ? KUMO_TABLE_OF_CONTENTS_VARIANTS.state.active.classes : KUMO_TABLE_OF_CONTENTS_VARIANTS.state.default.classes;
      return /* @__PURE__ */ jsxs41(
        "li",
        {
          ref,
          className: cn("-ml-0.5 flex flex-col gap-2", className),
          ...props,
          children: [
            /* @__PURE__ */ jsx66(
              "a",
              {
                href,
                onClick,
                "aria-current": active ? "true" : void 0,
                "data-zenth-component": "TableOfContents",
                "data-zenth-part": "group-link",
                className: cn(ITEM_BASE, stateClasses),
                children: /* @__PURE__ */ jsx66("span", { className: "block min-w-0 leading-5", children: label })
              }
            ),
            /* @__PURE__ */ jsx66("ul", { className: cn(NESTED_UL_CLASSES), children })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs41(
      "li",
      {
        ref,
        className: cn("-ml-0.5 flex flex-col gap-2", className),
        ...props,
        children: [
          /* @__PURE__ */ jsx66("p", { className: "py-0.5 pl-4 text-sm leading-5 font-medium text-zenth-subtle", children: label }),
          /* @__PURE__ */ jsx66("ul", { className: cn(NESTED_UL_CLASSES), children })
        ]
      }
    );
  }
);
TableOfContentsRoot.displayName = "TableOfContents";
TableOfContentsTitle.displayName = "TableOfContents.Title";
TableOfContentsList.displayName = "TableOfContents.List";
TableOfContentsItem.displayName = "TableOfContents.Item";
TableOfContentsGroup.displayName = "TableOfContents.Group";
var TableOfContents = Object.assign(TableOfContentsRoot, {
  Title: TableOfContentsTitle,
  List: TableOfContentsList,
  Item: TableOfContentsItem,
  Group: TableOfContentsGroup
});

// src/components/table-of-contents/use-table-of-contents-active-id.ts
import { useCallback as useCallback18, useEffect as useEffect18, useRef as useRef19, useState as useState14 } from "react";
var SCROLL_SETTLE_MS = 150;
function useTableOfContentsActiveId({
  ids,
  offset = 0,
  root = null,
  trackHash = true
}) {
  const [activeId, setActiveId] = useState14(null);
  const pinned = useRef19(false);
  const idsKey = ids.join("\0");
  useEffect18(() => {
    const elements = idsKey.split("\0").map((id) => document.getElementById(id)).filter((el) => el !== null);
    if (elements.length === 0)
      return;
    const intersecting = /* @__PURE__ */ new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }
        const first = elements.find((el) => intersecting.has(el));
        if (first && !pinned.current) {
          setActiveId(first.id);
        }
      },
      { root, rootMargin: `-${offset}px 0px 0px 0px` }
    );
    for (const el of elements)
      observer.observe(el);
    return () => observer.disconnect();
  }, [idsKey, offset, root]);
  const settleTimer = useRef19(void 0);
  const cancelPendingUnpin = useRef19(null);
  const selectSection = useCallback18(
    (id) => {
      cancelPendingUnpin.current?.();
      pinned.current = true;
      setActiveId(id);
      const scrollTarget = root ?? window;
      const armSettleTimer = () => {
        window.clearTimeout(settleTimer.current);
        settleTimer.current = window.setTimeout(() => {
          cancelPendingUnpin.current?.();
          pinned.current = false;
        }, SCROLL_SETTLE_MS);
      };
      scrollTarget.addEventListener("scroll", armSettleTimer, {
        passive: true
      });
      cancelPendingUnpin.current = () => {
        window.clearTimeout(settleTimer.current);
        scrollTarget.removeEventListener("scroll", armSettleTimer);
        cancelPendingUnpin.current = null;
      };
      armSettleTimer();
    },
    [root]
  );
  useEffect18(() => () => cancelPendingUnpin.current?.(), []);
  useEffect18(() => {
    if (!trackHash)
      return;
    const knownIds = new Set(idsKey.split("\0"));
    const syncFromHash = () => {
      let id = window.location.hash.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
      }
      if (id && knownIds.has(id))
        selectSection(id);
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [trackHash, idsKey, selectSection]);
  return { activeId, selectSection };
}

// src/components/button-group/button-group.tsx
import { forwardRef as forwardRef34 } from "react";
import { jsx as jsx67 } from "react/jsx-runtime";
var KUMO_BUTTON_GROUP_VARIANTS = {};
var KUMO_BUTTON_GROUP_DEFAULT_VARIANTS = {};
var KUMO_BUTTON_GROUP_STYLING = {
  baseClasses: cn(
    // `isolate` keeps child z-index changes contained; `w-max` shrinks the
    // group to its content so it doesn't stretch across its container.
    "relative isolate inline-flex w-max flex-row",
    // Give every child a stacking context so keyboard-focused controls can
    // lift above the adjacent seam, including tooltip-wrapped buttons.
    "[&>*]:relative [&>*:focus-visible]:z-10 [&>*:has(:focus-visible)]:z-10",
    // Each kumo Button carries its own `shadow-xs`. Inside a group those
    // shadows overlap at the seams and make the middle button look elevated /
    // boxed. Drop the per-button shadows so the group reads as one flat,
    // uniform control (the shared rings provide all the definition needed).
    "[&>*>:is(button,a)]:shadow-none [&>:is(button,a)]:shadow-none",
    // Join controls by child position rather than element type so mixed Button
    // and LinkButton groups retain the correct outer corners. The one-level
    // descendant selectors support Button's tooltip wrapper.
    "[&>*:not(:first-child):is(button,a)]:rounded-s-none",
    "[&>*:is(button,a):has(~_:is(button,a))]:rounded-e-none",
    "[&>*:not(:first-child)>:is(button,a)]:rounded-s-none",
    "[&>*:not(:last-child)>:is(button,a)]:rounded-e-none",
    // Overlap borders/rings by 1px so adjacent buttons share a single seam
    // instead of doubling up to a 2px line. Logical utilities support RTL.
    "[&>*:not(:first-child)]:-ms-px"
  )
};
var ButtonGroup = forwardRef34(
  ({ className, children, ...props }, ref) => {
    return /* @__PURE__ */ jsx67(
      "div",
      {
        ...props,
        ref,
        role: "group",
        "data-zenth-component": "ButtonGroup",
        className: cn(KUMO_BUTTON_GROUP_STYLING.baseClasses, className),
        children
      }
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

// src/components/tag-input/tag-input.tsx
import { XIcon as XIcon5 } from "@phosphor-icons/react";
import { Field as FieldBase4 } from "@base-ui/react/field";
import {
  forwardRef as forwardRef35,
  useId as useId10,
  useState as useState15
} from "react";
import { jsx as jsx68, jsxs as jsxs42 } from "react/jsx-runtime";
var DEFAULT_LABELS3 = {
  input: "Add tag",
  removeValue: (value) => `Remove ${value}`,
  invalidValue: (value) => `"${value}" is not valid.`,
  maxValuesReached: (maxValues) => `Limit of ${maxValues} tags reached.`
};
function splitValues(value) {
  return value.split(/[\n,]+/).map((item) => item.trim()).filter(Boolean);
}
var TagInput = forwardRef35(
  ({
    value,
    defaultValue = [],
    onValueChange,
    validateValue,
    maxValues,
    labels,
    label,
    labelTooltip,
    description,
    error,
    variant,
    disabled,
    readOnly,
    name,
    form,
    required,
    className,
    placeholder,
    id,
    autoComplete = "off",
    onBlur,
    onChange,
    onKeyDown: onKeyDownProp,
    onPaste: onPasteProp,
    ...inputProps
  }, forwardedRef) => {
    const [uncontrolledValue, setUncontrolledValue] = useState15(defaultValue);
    const [inputValue, setInputValue] = useState15("");
    const [message, setMessage] = useState15();
    const inputId = useId10();
    const values = value ?? uncontrolledValue;
    const setValues = (nextValue) => {
      if (value === void 0)
        setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    };
    const commit = (rawValue) => {
      const entries = splitValues(rawValue);
      const nextValues = [...values];
      for (let index = 0; index < entries.length; index += 1) {
        const entry = entries[index];
        if (nextValues.includes(entry))
          continue;
        if (maxValues !== void 0 && nextValues.length >= maxValues) {
          setInputValue(entries.slice(index).join(", "));
          setMessage(
            (labels?.maxValuesReached ?? DEFAULT_LABELS3.maxValuesReached)(
              maxValues
            )
          );
          setValues(nextValues);
          return false;
        }
        if (validateValue && !validateValue(entry, nextValues)) {
          setInputValue(entries.slice(index).join(", "));
          setMessage(
            (labels?.invalidValue ?? DEFAULT_LABELS3.invalidValue)(entry)
          );
          setValues(nextValues);
          return false;
        }
        nextValues.push(entry);
      }
      setValues(nextValues);
      setInputValue("");
      setMessage(void 0);
      return true;
    };
    const handleKeyDown = (event) => {
      onKeyDownProp?.(event);
      if (event.defaultPrevented || readOnly)
        return;
      if (event.nativeEvent.isComposing || event.keyCode === 229)
        return;
      if (!inputValue && event.key === "Backspace") {
        setValues(values.slice(0, -1));
        return;
      }
      if (!inputValue || !["Enter", ",", "Tab"].includes(event.key))
        return;
      const didCommit = commit(inputValue);
      if (event.key !== "Tab" || didCommit)
        event.preventDefault();
    };
    const handlePaste = (event) => {
      onPasteProp?.(event);
      if (event.defaultPrevented || readOnly)
        return;
      const text = event.clipboardData.getData("text");
      if (!/[\n,]/.test(text))
        return;
      event.preventDefault();
      const { selectionStart, selectionEnd } = event.currentTarget;
      const start = selectionStart ?? inputValue.length;
      const end = selectionEnd ?? start;
      commit(inputValue.slice(0, start) + text + inputValue.slice(end));
    };
    const fieldError = normalizeFieldError(error) ?? normalizeFieldError(message);
    const inputVariant = variant ?? (fieldError ? "error" : "default");
    const chipClassName = cn(
      "flex w-fit max-w-full shrink-0 items-center gap-2.5 rounded-sm bg-zenth-overlay ring-1 ring-zenth-hairline",
      "h-6 py-0 pr-[3px] pl-2 text-sm"
    );
    const input = (controlProps) => /* @__PURE__ */ jsx68(
      "input",
      {
        ...controlProps,
        ...inputProps,
        ref: forwardedRef,
        "aria-invalid": Boolean(fieldError),
        "aria-label": inputProps["aria-label"] ?? (typeof label === "string" ? label : labels?.input ?? DEFAULT_LABELS3.input),
        className: cn(
          "min-w-32 flex-1 border-0 bg-transparent outline-none",
          "px-1 py-0.5"
        ),
        disabled,
        readOnly,
        form,
        required: required && values.length === 0,
        autoComplete,
        id: controlProps?.id ?? id ?? inputId,
        placeholder,
        value: inputValue,
        onBlur: (event) => {
          onBlur?.(event);
          if (!event.defaultPrevented && !readOnly)
            commit(inputValue);
        },
        onChange: (event) => {
          setInputValue(event.target.value);
          setMessage(void 0);
          onChange?.(event);
        },
        onKeyDown: handleKeyDown,
        onPaste: handlePaste
      }
    );
    const hasField = Boolean(label || description || fieldError);
    const control = /* @__PURE__ */ jsxs42(
      "div",
      {
        className: cn(
          inputVariants({
            variant: inputVariant,
            parentFocusIndicator: true
          }),
          "flex h-auto min-h-9 flex-wrap items-center gap-x-2 gap-y-1.5 px-2 py-1.5",
          className
        ),
        children: [
          values.map((item) => /* @__PURE__ */ jsxs42("span", { className: cn(chipClassName, "text-zenth-default"), children: [
            /* @__PURE__ */ jsx68("span", { className: "truncate", children: item }),
            /* @__PURE__ */ jsx68(
              Button,
              {
                "aria-label": (labels?.removeValue ?? DEFAULT_LABELS3.removeValue)(
                  item
                ),
                icon: /* @__PURE__ */ jsx68(XIcon5, { size: 10 }),
                shape: "square",
                size: "xs",
                variant: "ghost",
                disabled: disabled || readOnly,
                onMouseDown: (event) => event.preventDefault(),
                onClick: () => setValues(values.filter((value2) => value2 !== item))
              }
            ),
            name ? /* @__PURE__ */ jsx68(
              "input",
              {
                type: "hidden",
                name,
                form,
                disabled,
                value: item
              }
            ) : null
          ] }, item)),
          hasField ? /* @__PURE__ */ jsx68(FieldBase4.Control, { render: (controlProps) => input(controlProps) }) : input()
        ]
      }
    );
    if (hasField) {
      return /* @__PURE__ */ jsx68(
        Field,
        {
          label,
          labelTooltip,
          description,
          error: fieldError,
          children: control
        }
      );
    }
    return control;
  }
);
TagInput.displayName = "TagInput";

// src/components/layer-dialog/layer-dialog.tsx
import {
  Children as Children7,
  createContext as createContext19,
  forwardRef as forwardRef36,
  isValidElement as isValidElement11,
  useContext as useContext19,
  useRef as useRef20,
  useState as useState16
} from "react";
import { Drawer as DrawerBase } from "@base-ui/react/drawer";
import { ScrollArea as ScrollAreaBase2 } from "@base-ui/react/scroll-area";
import { useMediaQuery } from "@base-ui/react/unstable-use-media-query";
import { CaretDownIcon as CaretDownIcon3, X } from "@phosphor-icons/react";
import { jsx as jsx69, jsxs as jsxs43 } from "react/jsx-runtime";
var KUMO_LAYER_DIALOG_VARIANTS = {
  size: {
    sm: {
      classes: "sm:max-w-md",
      description: "Compact desktop dialog width (448px)"
    },
    base: {
      classes: "sm:max-w-xl",
      description: "Default desktop dialog width (576px)"
    },
    lg: {
      classes: "sm:max-w-2xl",
      description: "Large desktop dialog width (672px)"
    },
    xl: {
      classes: "sm:max-w-3xl",
      description: "Extra large desktop dialog width (768px)"
    }
  },
  verticalAlign: {
    top: {
      classes: "sm:items-start sm:pt-16 sm:pb-6",
      description: "Align the desktop dialog near the top of the viewport"
    },
    center: {
      classes: "sm:items-center sm:py-6",
      description: "Center the desktop dialog vertically"
    }
  }
};
var KUMO_LAYER_DIALOG_DEFAULT_VARIANTS = {
  size: "base",
  verticalAlign: "center"
};
var DesktopContext = createContext19(false);
var DismissDisabledContext = createContext19(false);
var AlertContext = createContext19(false);
var LayerDialogPortalContainerContext = createContext19(void 0);
var BodySlotsContext = createContext19({
  title: null,
  description: null,
  actions: null,
  showCloseButton: false,
  closeLabel: ""
});
var USER_DISMISSAL_REASONS = /* @__PURE__ */ new Set([
  "close-press",
  "close-watcher",
  "escape-key",
  "outside-press",
  "swipe",
  "trigger-press"
]);
function LayerDialogRootImpl({
  alert,
  children,
  dismissDisabled = false,
  onOpenChange,
  disablePointerDismissal,
  modal,
  ...props
}) {
  const isDesktop = useMediaQuery("(min-width: 640px)", {
    defaultMatches: false
  });
  const handleOpenChange = (open, eventDetails) => {
    if (!open && dismissDisabled && USER_DISMISSAL_REASONS.has(eventDetails.reason)) {
      eventDetails.cancel();
      return;
    }
    onOpenChange?.(open, eventDetails);
  };
  const rootProps = {
    ...props,
    disablePointerDismissal: alert || dismissDisabled || disablePointerDismissal,
    modal: alert ? true : modal,
    onOpenChange: handleOpenChange
  };
  return /* @__PURE__ */ jsx69(AlertContext.Provider, { value: alert, children: /* @__PURE__ */ jsx69(DesktopContext.Provider, { value: isDesktop, children: /* @__PURE__ */ jsx69(DismissDisabledContext.Provider, { value: dismissDisabled, children: /* @__PURE__ */ jsx69(DrawerBase.Root, { ...rootProps, children }) }) }) });
}
function LayerDialogRoot(props) {
  return /* @__PURE__ */ jsx69(LayerDialogRootImpl, { ...props, alert: false });
}
LayerDialogRoot.displayName = "LayerDialog.Root";
function LayerDialogAlert(props) {
  return /* @__PURE__ */ jsx69(LayerDialogRootImpl, { ...props, alert: true });
}
LayerDialogAlert.displayName = "LayerDialog.Alert";
function LayerDialogTrigger(props) {
  return /* @__PURE__ */ jsx69(DrawerBase.Trigger, { ...props });
}
LayerDialogTrigger.displayName = "LayerDialog.Trigger";
function collectSlot(children, type) {
  const matches = children.filter(
    (child) => isValidElement11(child) && child.type === type
  );
  return { element: matches[0], count: matches.length };
}
function LayerDialogContent({
  children,
  closeLabel,
  container: containerProp,
  size = KUMO_LAYER_DIALOG_DEFAULT_VARIANTS.size,
  verticalAlign = KUMO_LAYER_DIALOG_DEFAULT_VARIANTS.verticalAlign
}) {
  const { layerDialog } = useKumoLocale();
  const contextContainer = usePortalContainer();
  const container = containerProp ?? contextContainer ?? void 0;
  const isDesktop = useContext19(DesktopContext);
  const dismissDisabled = useContext19(DismissDisabledContext);
  const isAlert = useContext19(AlertContext);
  const childArray = Children7.toArray(children);
  const title = collectSlot(childArray, LayerDialogTitle);
  const description = collectSlot(childArray, LayerDialogDescription);
  const body = collectSlot(childArray, LayerDialogBody);
  const actions = collectSlot(childArray, LayerDialogActions);
  const hasInvalidChildren = childArray.some(
    (child) => !isValidElement11(child) || child.type !== LayerDialogTitle && child.type !== LayerDialogDescription && child.type !== LayerDialogBody && child.type !== LayerDialogActions
  );
  if (hasInvalidChildren || title.count !== 1 || body.count !== 1 || description.count > 1 || actions.count > 1 || isAlert && actions.count !== 1) {
    throw new Error(
      isAlert ? "LayerDialog.Alert requires exactly one direct LayerDialog.Title, LayerDialog.Body, and LayerDialog.Actions, with an optional direct LayerDialog.Description." : "LayerDialog.Content requires exactly one direct LayerDialog.Title and LayerDialog.Body, with an optional direct LayerDialog.Description and LayerDialog.Actions."
    );
  }
  const sizeConfig = resolveVariant(
    KUMO_LAYER_DIALOG_VARIANTS.size,
    size,
    KUMO_LAYER_DIALOG_DEFAULT_VARIANTS.size
  );
  const verticalAlignConfig = resolveVariant(
    KUMO_LAYER_DIALOG_VARIANTS.verticalAlign,
    verticalAlign,
    KUMO_LAYER_DIALOG_DEFAULT_VARIANTS.verticalAlign
  );
  const bodySlots = {
    title: title.element,
    description: description.element ?? null,
    actions: actions.element ?? null,
    showCloseButton: actions.count === 0,
    closeLabel: closeLabel ?? layerDialog.close
  };
  return /* @__PURE__ */ jsx69(LayerDialogPortalContainerContext.Provider, { value: container, children: /* @__PURE__ */ jsxs43(DrawerBase.Portal, { container, children: [
    /* @__PURE__ */ jsx69(
      DrawerBase.Backdrop,
      {
        forceRender: true,
        "data-layer-dialog-backdrop": true,
        className: "fixed inset-0 bg-zenth-recessed opacity-80 transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:opacity-0 data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:opacity-0 data-[swiping]:duration-0 motion-reduce:transition-none sm:duration-200 sm:data-[ending-style]:duration-200"
      }
    ),
    /* @__PURE__ */ jsx69(
      DrawerBase.Viewport,
      {
        className: cn(
          "fixed inset-0 flex items-end justify-center sm:px-4",
          verticalAlignConfig.classes
        ),
        "data-base-ui-swipe-ignore": isDesktop || dismissDisabled || isAlert ? "" : void 0,
        children: /* @__PURE__ */ jsx69(
          DrawerBase.Popup,
          {
            render: isAlert ? /* @__PURE__ */ jsx69("div", { role: "alertdialog" }) : /* @__PURE__ */ jsx69("div", {}),
            className: cn(
              "fixed inset-x-0 bottom-0 flex max-h-[85dvh] min-h-0 w-full max-w-none [transform:translate3d(0,var(--drawer-swipe-movement-y,0px),0)] transform-gpu overflow-visible transition-[transform,opacity] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform outline-none data-[ending-style]:[transform:translate3d(0,100%,0)] data-[ending-style]:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-[starting-style]:[transform:translate3d(0,100%,0)] data-[swiping]:duration-0 data-[swiping]:select-none motion-reduce:transition-none sm:static sm:max-h-full sm:[transform:translate3d(0,0,0)] sm:duration-200 sm:data-[ending-style]:[transform:translate3d(0,8px,0)] sm:data-[ending-style]:opacity-0 sm:data-[ending-style]:duration-200 sm:data-[starting-style]:[transform:translate3d(0,8px,0)] sm:data-[starting-style]:opacity-0",
              sizeConfig.classes
            ),
            children: /* @__PURE__ */ jsxs43(LayerCard2, { className: "flex max-h-[85dvh] min-h-0 w-full flex-col overflow-hidden rounded-none bg-zenth-elevated p-1.5 shadow-[0_20px_25px_-5px_rgb(0_0_0/0.03),0_8px_10px_-6px_rgb(0_0_0/0.03)] max-sm:border-t max-sm:border-zenth-hairline max-sm:shadow-xs max-sm:ring-0 sm:max-h-full sm:rounded-xl", children: [
              !isDesktop && !isAlert && /* @__PURE__ */ jsx69("div", { "aria-hidden": true, className: "flex justify-center pt-1.5 pb-3", children: /* @__PURE__ */ jsx69("div", { className: "h-1 w-10 rounded-full bg-zenth-fill" }) }),
              /* @__PURE__ */ jsxs43(DrawerBase.Content, { className: "flex min-h-0 flex-col overflow-visible", children: [
                /* @__PURE__ */ jsx69(BodySlotsContext.Provider, { value: bodySlots, children: body.element }),
                isDesktop && actions.element
              ] })
            ] })
          }
        )
      }
    )
  ] }) });
}
LayerDialogContent.displayName = "LayerDialog.Content";
function LayerDialogTitle({ children }) {
  const title = (props) => /* @__PURE__ */ jsx69(
    Text,
    {
      ...props,
      as: "h2",
      variant: "heading",
      DANGEROUS_className: "font-medium",
      children
    }
  );
  return /* @__PURE__ */ jsx69(DrawerBase.Title, { render: title });
}
LayerDialogTitle.displayName = "LayerDialog.Title";
function LayerDialogDescription({ children }) {
  const description = (props) => /* @__PURE__ */ jsx69(Text, { ...props, as: "p", variant: "secondary", children });
  return /* @__PURE__ */ jsx69(DrawerBase.Description, { render: description });
}
LayerDialogDescription.displayName = "LayerDialog.Description";
var SCROLL_THRESHOLD = 8;
var CONDENSE_MIN_OVERFLOW = 16;
function LayerDialogBody({ children }) {
  const [condensed, setCondensed] = useState16(false);
  const descriptionClipRef = useRef20(null);
  const dismissDisabled = useContext19(DismissDisabledContext);
  const { title, description, actions, showCloseButton, closeLabel } = useContext19(BodySlotsContext);
  const isDesktop = useContext19(DesktopContext);
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrolled = scrollTop > SCROLL_THRESHOLD;
    if (!scrolled) {
      setCondensed(false);
      return;
    }
    if (condensed)
      return;
    const descriptionHeight = descriptionClipRef.current?.offsetHeight ?? 0;
    const overflowAfterCollapse = scrollHeight - clientHeight - descriptionHeight;
    if (overflowAfterCollapse > CONDENSE_MIN_OVERFLOW)
      setCondensed(true);
  };
  const content = description ? children : /* @__PURE__ */ jsx69(DrawerBase.Description, { render: /* @__PURE__ */ jsx69("div", {}), children });
  return /* @__PURE__ */ jsxs43(LayerCard2.Primary, { className: "min-h-0 flex-1 gap-0 p-0", children: [
    /* @__PURE__ */ jsxs43("div", { className: "z-10 flex shrink-0 items-start justify-between gap-4 rounded-t-lg bg-zenth-base px-4 py-4 sm:px-4.5", children: [
      /* @__PURE__ */ jsxs43("div", { className: "flex min-w-0 flex-col", children: [
        title,
        description && // grid-template-rows 1fr -> 0fr animates an auto-height row, which
        // plain height cannot. The description stays in the DOM so
        // aria-describedby keeps working while it is clipped.
        /* @__PURE__ */ jsx69(
          "div",
          {
            className: cn(
              "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
              condensed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
            ),
            "data-condensed": condensed || void 0,
            children: /* @__PURE__ */ jsx69("div", { ref: descriptionClipRef, className: "min-h-0 overflow-hidden", children: /* @__PURE__ */ jsx69("div", { className: "pt-1", children: description }) })
          }
        )
      ] }),
      showCloseButton && /* @__PURE__ */ jsx69(LayerDialogIconClose, { disabled: dismissDisabled, label: closeLabel })
    ] }),
    /* @__PURE__ */ jsxs43(ScrollAreaBase2.Root, { className: "relative flex min-h-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsx69(
        ScrollAreaBase2.Viewport,
        {
          className: "zenth-no-scrollbar min-h-0 flex-1 overscroll-none [mask-image:linear-gradient(to_bottom,transparent_0,black_min(24px,var(--scroll-area-overflow-y-start,0px)),black_calc(100%-min(24px,var(--scroll-area-overflow-y-end,24px))),transparent_100%)]",
          onScroll: handleScroll,
          children: isDesktop ? /* @__PURE__ */ jsx69(ScrollAreaBase2.Content, { className: "px-4.5 pt-0.5 pb-4.5", children: content }) : /* @__PURE__ */ jsx69(ScrollAreaBase2.Content, { className: "px-4 pt-0.5 pb-4", children: content })
        }
      ),
      /* @__PURE__ */ jsx69(
        ScrollAreaBase2.Scrollbar,
        {
          keepMounted: true,
          orientation: "vertical",
          className: "my-1.5 mr-0.5 hidden w-2 p-px opacity-0 transition-opacity data-[has-overflow-y]:block data-[hovering]:opacity-100 data-[scrolling]:opacity-100",
          children: /* @__PURE__ */ jsx69(ScrollAreaBase2.Thumb, { className: "w-full rounded-full bg-zenth-contrast opacity-10 transition-opacity hover:opacity-20 active:opacity-30" })
        }
      )
    ] }),
    !isDesktop && actions && /* @__PURE__ */ jsx69("div", { className: "shrink-0 border-t border-zenth-hairline p-4", children: actions })
  ] });
}
LayerDialogBody.displayName = "LayerDialog.Body";
var LayerDialogSeparator = forwardRef36(({ className, ...props }, ref) => /* @__PURE__ */ jsx69(
  "hr",
  {
    ref,
    className: cn(
      "-mx-4 my-4 h-px border-0 bg-zenth-hairline sm:-mx-4.5",
      className
    ),
    ...props
  }
));
LayerDialogSeparator.displayName = "LayerDialog.Separator";
function LayerDialogIconClose({
  disabled,
  label
}) {
  const close = (closeProps) => /* @__PURE__ */ jsx69(
    Button,
    {
      ...closeProps,
      "aria-label": label,
      className: "-mt-1.5 -mr-1.5 rounded-lg",
      disabled,
      icon: /* @__PURE__ */ jsx69(X, { size: 15 }),
      shape: "square",
      size: "sm",
      variant: "ghost"
    }
  );
  return /* @__PURE__ */ jsx69(DrawerBase.Close, { render: close });
}
function LayerDialogAction({
  children,
  loading,
  menu,
  menuLabel = "More actions",
  variant = "primary",
  ...props
}) {
  const container = useContext19(LayerDialogPortalContainerContext);
  const button = /* @__PURE__ */ jsx69(Button, { ...props, loading, variant, children });
  if (!menu?.length)
    return button;
  return /* @__PURE__ */ jsxs43(ButtonGroup, { "aria-label": menuLabel, children: [
    button,
    /* @__PURE__ */ jsxs43(DropdownMenu, { children: [
      /* @__PURE__ */ jsx69(
        DropdownMenu.Trigger,
        {
          render: /* @__PURE__ */ jsx69(
            Button,
            {
              "aria-label": menuLabel,
              icon: /* @__PURE__ */ jsx69(CaretDownIcon3, {}),
              shape: "square",
              variant
            }
          )
        }
      ),
      /* @__PURE__ */ jsx69(DropdownMenu.Content, { container, children: menu })
    ] })
  ] });
}
LayerDialogAction.displayName = "LayerDialog.Action";
var LayerDialogActions = Object.assign(
  function LayerDialogActions2({
    children,
    dismissLabel
  }) {
    const dismissDisabled = useContext19(DismissDisabledContext);
    const isAlert = useContext19(AlertContext);
    const isDesktop = useContext19(DesktopContext);
    const { layerDialog } = useKumoLocale();
    const label = dismissLabel ?? (isAlert ? layerDialog.cancel : layerDialog.close);
    const actionChildren = Children7.toArray(children);
    const action = actionChildren.filter(
      (child) => isValidElement11(child) && child.type === LayerDialogAction
    );
    if (action.length !== 1 || actionChildren.length !== action.length) {
      throw new Error(
        "LayerDialog.Actions requires exactly one direct LayerDialog.Action."
      );
    }
    const primaryAction = action[0];
    return /* @__PURE__ */ jsxs43(
      "div",
      {
        className: cn(
          "flex w-full items-center justify-between gap-2",
          isDesktop && "shrink-0 pt-1.75"
        ),
        children: [
          /* @__PURE__ */ jsx69(LayerDialogDismiss, { disabled: dismissDisabled, label }),
          primaryAction
        ]
      }
    );
  },
  {
    /** @deprecated Use `LayerDialog.Action` instead. */
    Primary: LayerDialogAction,
    displayName: "LayerDialog.Actions"
  }
);
function LayerDialogDismiss({
  disabled,
  label
}) {
  const isDesktop = useContext19(DesktopContext);
  const close = (closeProps) => /* @__PURE__ */ jsx69(
    Button,
    {
      ...closeProps,
      className: "hover:bg-zenth-fill/50",
      disabled,
      variant: isDesktop ? "ghost" : "secondary",
      children: label
    }
  );
  return /* @__PURE__ */ jsx69(DrawerBase.Close, { render: close });
}
var LayerDialog = Object.assign(LayerDialogRoot, {
  Root: LayerDialogRoot,
  Alert: LayerDialogAlert,
  Trigger: LayerDialogTrigger,
  Content: LayerDialogContent,
  Title: LayerDialogTitle,
  Description: LayerDialogDescription,
  Body: LayerDialogBody,
  Separator: LayerDialogSeparator,
  Action: LayerDialogAction,
  Actions: LayerDialogActions
});

// src/components/slider/slider.tsx
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { jsx as jsx70, jsxs as jsxs44 } from "react/jsx-runtime";
var KUMO_SLIDER_VARIANTS = {
  size: {
    sm: {
      classes: "h-6 rounded-md",
      description: "Compact slider for dense layouts"
    },
    base: {
      classes: "h-8 rounded-lg",
      description: "Default slider size"
    }
  }
};
var KUMO_SLIDER_DEFAULT_VARIANTS = {
  size: "base"
};
function sliderVariants({
  size = KUMO_SLIDER_DEFAULT_VARIANTS.size
} = {}) {
  return cn(
    "bg-zenth-recessed p-[3px] ring ring-zenth-line",
    KUMO_SLIDER_VARIANTS.size[size].classes
  );
}
function countThumbs(value) {
  return Array.isArray(value) ? value.length : 1;
}
function Slider({
  label,
  size = KUMO_SLIDER_DEFAULT_VARIANTS.size,
  getAriaLabel,
  // Keeps the thumbs, and the grips inside them, within the track at either
  // end of the range.
  thumbAlignment = "edge",
  className,
  min = 0,
  max = 100,
  format,
  locale,
  value,
  defaultValue,
  ...props
}) {
  const thumbCount = countThumbs(value ?? defaultValue);
  const isRange = thumbCount > 1;
  const formatter = new Intl.NumberFormat(locale, format);
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const innerRadius = size === "sm" ? "rounded" : "rounded-md";
  return /* @__PURE__ */ jsxs44(
    BaseSlider.Root,
    {
      ...props,
      value,
      defaultValue,
      min,
      max,
      format,
      locale,
      thumbAlignment,
      orientation: "horizontal",
      className: cn(
        "flex w-full flex-col gap-2 data-disabled:opacity-50",
        className
      ),
      children: [
        label ? /* @__PURE__ */ jsx70(
          BaseSlider.Label,
          {
            className: cn("font-medium text-zenth-default", textSize),
            children: label
          }
        ) : null,
        /* @__PURE__ */ jsx70("div", { className: sliderVariants({ size }), children: /* @__PURE__ */ jsx70(BaseSlider.Control, { className: "h-full", children: /* @__PURE__ */ jsxs44(BaseSlider.Track, { className: "relative h-full", children: [
          /* @__PURE__ */ jsx70(
            BaseSlider.Indicator,
            {
              className: cn(
                // Base UI ends the indicator at the thumb's center. Padding
                // stretches it over the whole thumb, so it fills the track at
                // either end of the range. `box-content` is forced because global
                // `* { box-sizing: border-box }` resets would otherwise win.
                "box-content! bg-zenth-overlay pr-2 shadow-sm ring ring-zenth-line",
                isRange && "-ml-2 pl-2",
                innerRadius
              )
            }
          ),
          Array.from({ length: thumbCount }, (_, index) => /* @__PURE__ */ jsxs44(
            BaseSlider.Thumb,
            {
              index: isRange ? index : void 0,
              getAriaLabel,
              className: cn(
                "group h-full w-4 cursor-grab outline-none has-focus-visible:ring-2 has-focus-visible:ring-zenth-focus has-focus-visible:outline-hidden data-disabled:cursor-not-allowed data-dragging:cursor-grabbing",
                innerRadius
              ),
              children: [
                /* @__PURE__ */ jsx70(
                  "span",
                  {
                    "aria-hidden": true,
                    className: "absolute top-1/2 left-1/2 h-1/2 w-0.5 -translate-1/2 rounded-full bg-zenth-contrast/25"
                  }
                ),
                /* @__PURE__ */ jsx70(
                  "span",
                  {
                    "aria-hidden": true,
                    className: cn(
                      // The 8px gap plus the control's 3px padding, so the badge lines up
                      // with the min and max labels below the control.
                      "absolute top-full left-1/2 mt-[11px] -translate-x-1/2 rounded bg-zenth-contrast px-1.5 font-medium whitespace-nowrap text-zenth-inverse tabular-nums group-data-disabled:bg-zenth-fill group-data-disabled:text-zenth-default",
                      textSize
                    ),
                    children: /* @__PURE__ */ jsx70(BaseSlider.Value, { children: (formattedValues) => formattedValues[index] })
                  }
                )
              ]
            },
            index
          ))
        ] }) }) }),
        /* @__PURE__ */ jsxs44(
          "div",
          {
            "aria-hidden": true,
            className: cn(
              "flex justify-between text-zenth-subtle tabular-nums",
              textSize
            ),
            children: [
              /* @__PURE__ */ jsx70("span", { children: formatter.format(min) }),
              /* @__PURE__ */ jsx70("span", { children: formatter.format(max) })
            ]
          }
        )
      ]
    }
  );
}
Slider.displayName = "Slider";
export {
  Autocomplete2 as Autocomplete,
  Badge,
  Banner,
  BannerVariant,
  Breadcrumb as Breadcrumbs,
  BubbleMap,
  Button,
  ButtonGroup,
  Chart,
  ChartLegend,
  ChartPalette,
  Checkbox,
  ChoroplethMap,
  ClipboardText,
  Code,
  CodeBlock,
  Collapsible,
  Combobox,
  CommandPalette,
  DatePicker,
  date_range_picker_default as DateRangePicker,
  DeleteResource,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  Empty3 as Empty,
  Field,
  Flow,
  GlobeMap,
  Grid,
  GridItem,
  InlineCopyText,
  Input,
  InputArea,
  InputGroup,
  KUMO_AUTOCOMPLETE_DEFAULT_VARIANTS,
  KUMO_AUTOCOMPLETE_VARIANTS,
  KUMO_BUTTON_GROUP_DEFAULT_VARIANTS,
  KUMO_BUTTON_GROUP_STYLING,
  KUMO_BUTTON_GROUP_VARIANTS,
  KUMO_COMMAND_PALETTE_DEFAULT_VARIANTS,
  KUMO_COMMAND_PALETTE_VARIANTS,
  KUMO_DELETE_RESOURCE_DEFAULT_VARIANTS,
  KUMO_DELETE_RESOURCE_VARIANTS,
  KUMO_FIELD_DEFAULT_VARIANTS,
  KUMO_FIELD_VARIANTS,
  KUMO_GRID_DEFAULT_VARIANTS,
  KUMO_GRID_VARIANTS,
  KUMO_INLINE_COPY_TEXT_DEFAULT_VARIANTS,
  KUMO_INLINE_COPY_TEXT_STYLING,
  KUMO_INLINE_COPY_TEXT_VARIANTS,
  KUMO_LABEL_DEFAULT_VARIANTS,
  KUMO_LABEL_VARIANTS,
  KUMO_LINK_DEFAULT_VARIANTS,
  KUMO_LINK_VARIANTS,
  KUMO_POPOVER_DEFAULT_VARIANTS,
  KUMO_POPOVER_VARIANTS,
  KUMO_RADIO_DEFAULT_VARIANTS,
  KUMO_RADIO_VARIANTS,
  KUMO_SENSITIVE_INPUT_DEFAULT_VARIANTS,
  KUMO_SENSITIVE_INPUT_VARIANTS,
  KUMO_SIDEBAR_DEFAULT_VARIANTS,
  KUMO_SIDEBAR_STYLING,
  KUMO_SIDEBAR_VARIANTS,
  KUMO_SLIDER_DEFAULT_VARIANTS,
  KUMO_SLIDER_VARIANTS,
  KUMO_TABLE_OF_CONTENTS_DEFAULT_VARIANTS,
  KUMO_TABLE_OF_CONTENTS_VARIANTS,
  KUMO_TOOLBAR_DEFAULT_VARIANTS,
  KUMO_TOOLBAR_VARIANTS,
  KUMO_ZENTHCLOUD_LOGO_DEFAULT_VARIANTS,
  KUMO_ZENTHCLOUD_LOGO_VARIANTS,
  KumoLocaleProvider,
  KumoPortalProvider,
  Label,
  LayerCard2 as LayerCard,
  LayerDialog,
  Link2 as Link,
  LinkButton,
  LinkProvider,
  Loader,
  MenuBar,
  Meter,
  Pagination,
  Popover,
  PoweredByZenthcloud,
  Radio,
  RadioGroup,
  RefreshButton,
  SankeyChart,
  Select,
  SensitiveInput,
  Sidebar,
  SidebarCollapsible,
  SidebarCollapsibleContent,
  SidebarCollapsibleTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarLoading,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuChevron,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarResizeHandle,
  SidebarRoot,
  SidebarSeparator,
  SidebarSlidingView,
  SidebarSlidingViews,
  SidebarTrigger,
  SkeletonLine,
  Slider,
  Surface,
  Switch,
  Table,
  TableOfContents,
  Tabs,
  TagInput,
  Text,
  Textarea,
  TimeseriesChart,
  Toast3 as Toast,
  ToastProvider,
  Toasty,
  Toolbar,
  Tooltip,
  TooltipProvider,
  ZenthcloudLogo,
  autocompleteVariants,
  buttonVariants,
  cn,
  createKumoToastManager,
  fieldVariants,
  generateZenthcloudLogoSvg,
  gridItemVariants,
  gridVariants,
  inputVariants,
  labelContentVariants,
  labelVariants,
  linkVariants,
  radioVariants,
  safeRandomId,
  sliderVariants,
  useKumoToastManager,
  useLinkComponent,
  useMenuNavigation,
  useSidebar,
  useTableOfContentsActiveId
};
