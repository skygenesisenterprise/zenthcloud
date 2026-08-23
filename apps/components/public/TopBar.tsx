"use client";

import * as React from "react";
import Link from "next/link";
import { Search, Phone, HelpCircle, Globe, User } from "lucide-react";
import { useTranslations } from "next-intl";

export function TopBar() {
  const t = useTranslations("Public.topBar");

  return (
    <div className="hidden lg:block sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-11 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center font-bold tracking-tight hover:text-primary-foreground/80 transition-colors"
        >
          <span className="text-lg">ZenthCloud</span>
        </Link>

        <div className="flex items-center gap-5 text-xs">
          <a
            href="https://webmail.zenthcloud.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            {t("webmail")}
          </a>
          <a
            href="https://manager.zenthcloud.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            {t("myAccount")}
          </a>
          <Link
            href="/contact"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            {t("contactSales")}
          </Link>
          <a
            href="https://support.zenthcloud.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-primary-foreground/80 transition-colors"
          >
            {t("support")}
          </a>
        </div>
      </div>
    </div>
  );
}
