"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NavGroup, NavItem } from "@/lib/navigation";

interface MobileMenuProps {
  navGroups: NavGroup[];
  utilityNav: NavItem[];
  ctaLabel: string;
  isOpen: boolean;
  onClose: () => void;
}

function MobileAccordion({
  group,
  onNavigate,
}: {
  group: NavGroup;
  onNavigate: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const hasChildren = group.items && group.items.length > 0;

  const groupKey = group.label ?? group.labelKey ?? "";

  if (!hasChildren) {
    return (
      <Link
        href={group.href || "#"}
        onClick={onNavigate}
        className="block py-3 text-base font-medium text-foreground border-b border-border"
      >
        {groupKey}
      </Link>
    );
  }

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-3 text-base font-medium text-foreground"
      >
        {groupKey}
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="pb-3 space-y-1">
          {group.items.map((item) => {
            const Icon = item.icon;
            const itemKey = item.label ?? item.labelKey ?? "";
            return (
              <Link
                key={itemKey}
                href={item.href || "#"}
                onClick={onNavigate}
                className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-accent"
              >
                {Icon && (
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground/70">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {itemKey}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MobileMenu({
  navGroups,
  utilityNav,
  ctaLabel,
  isOpen,
  onClose,
}: MobileMenuProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-background border-l border-border shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-base font-semibold tracking-tight">
            ZenthCloud
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-0">
            {navGroups.map((group) => (
              <MobileAccordion
                key={group.label}
                group={group}
                onNavigate={onClose}
              />
            ))}
          </div>
        </nav>

        <div className="border-t border-border p-5 space-y-3">
          {utilityNav.map((item) =>
            item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="block w-full rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium hover:bg-accent"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href || "#"}
                onClick={onClose}
                className="block w-full rounded-md border border-border px-4 py-2.5 text-center text-sm font-medium hover:bg-accent"
              >
                {item.label}
              </Link>
            )
          )}
          <Button asChild className="w-full">
            <Link href="https://manager.zenthcloud.com/signup" target="_blank" rel="noreferrer">
              {ctaLabel}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
