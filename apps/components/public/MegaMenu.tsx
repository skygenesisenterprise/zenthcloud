"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/lib/navigation";

interface MegaMenuProps {
  group: NavGroup;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MegaMenu({ group, isOpen, onOpen, onClose }: MegaMenuProps) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const groupKey = group.label ?? group.labelKey ?? "";

  if (!group.items || group.items.length === 0) {
    return (
      <Link
        href={group.href || "#"}
        className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors"
      >
        {groupKey}
      </Link>
    );
  }

  const columns = React.useMemo(() => {
    const count = group.items.length;
    const maxColumns = 3;
    const perColumn = Math.ceil(count / maxColumns);
    const cols: typeof group.items[] = [];
    for (let i = 0; i < count; i += perColumn) {
      cols.push(group.items.slice(i, i + perColumn));
    }
    return cols;
  }, [group.items]);

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        onClick={isOpen ? onClose : onOpen}
        aria-expanded={isOpen}
        className="flex items-center gap-1 text-sm font-medium text-foreground/90 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1 py-1"
      >
        {groupKey}
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[42rem] max-w-[calc(100vw-2rem)] z-50">
          <div className="rounded-xl border border-border bg-white shadow-xl overflow-hidden">
            {group.headline && (
              <div className="border-b border-border bg-background px-6 py-4">
                <p className="text-base font-semibold text-foreground">
                  {group.headline}
                </p>
              </div>
            )}

            <div className="flex px-8 py-8">
              {columns.map((column, colIndex) => (
                <React.Fragment key={colIndex}>
                  {colIndex > 0 && (
                    <div className="mx-6 w-px bg-border shrink-0" aria-hidden="true" />
                  )}
                  <div className="flex-1 min-w-0 space-y-5">
                    {column.map((item) => {
                      const itemKey = item.label ?? item.labelKey ?? "";
                      const content = (
                        <>
                          <p className="text-sm font-semibold text-primary group-hover:text-primary/80 transition-colors">
                            {itemKey}
                          </p>
                          {item.description && (
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </>
                      );

                      return item.external ? (
                        <a
                          key={itemKey}
                          href={item.href || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="group block"
                          onClick={onClose}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          key={itemKey}
                          href={item.href || "#"}
                          className="group block"
                          onClick={onClose}
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {(group.footerLinks || group.footer) && (
              <div className="border-t border-border bg-background px-6 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {group.footerLinks && (
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      {group.footerLinks.map((link) => {
                        const linkKey = link.label ?? link.labelKey ?? "";
                        return link.external ? (
                          <a
                            key={linkKey}
                            href={link.href || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            onClick={onClose}
                          >
                            {linkKey}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <Link
                            key={linkKey}
                            href={link.href || "#"}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                            onClick={onClose}
                          >
                            {linkKey}
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {group.footer && (
                    <Link
                      href={group.footer.href}
                      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={onClose}
                    >
                      <span className="font-medium text-foreground">{group.footer.title}</span>
                      <span className="hidden sm:inline">— {group.footer.description}</span>
                      <ChevronDown className="h-3.5 w-3.5 -rotate-90 transition-colors" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
