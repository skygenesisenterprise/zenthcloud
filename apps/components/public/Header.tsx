"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { MegaMenu } from "@/components/public/MegaMenu";
import { MobileMenu } from "@/components/public/MobileMenu";
import { mainNav, utilityNav, type NavGroup, type NavItem, type NavGroupFooter } from "@/lib/navigation";

function localizeHref(href: string | undefined, locale: string): string | undefined {
  if (!href) return href;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#")) return href;
  if (href === `/${locale}` || href.startsWith(`/${locale}/`)) return href;
  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

function translateItem(item: NavItem, locale: string, t: (key: string) => string): NavItem {
  return {
    ...item,
    label: item.labelKey ? t(item.labelKey) : item.label,
    description: item.descriptionKey ? t(item.descriptionKey) : item.description,
    href: localizeHref(item.href, locale),
  };
}

function translateFooter(footer: NavGroupFooter | undefined, locale: string, t: (key: string) => string): NavGroupFooter | undefined {
  if (!footer) return undefined;
  return {
    ...footer,
    title: footer.titleKey ? t(footer.titleKey) : footer.title,
    description: footer.descriptionKey ? t(footer.descriptionKey) : footer.description,
    href: localizeHref(footer.href, locale) ?? footer.href,
  };
}

function translateGroup(group: NavGroup, locale: string, t: (key: string) => string): NavGroup {
  return {
    ...group,
    label: group.labelKey ? t(group.labelKey) : group.label,
    headline: group.headlineKey ? t(group.headlineKey) : group.headline,
    items: group.items.map((item) => translateItem(item, locale, t)),
    footer: translateFooter(group.footer, locale, t),
    footerLinks: group.footerLinks?.map((item) => translateItem(item, locale, t)),
    href: localizeHref(group.href, locale),
  };
}

export function Header() {
  const tHeader = useTranslations("Public.header");
  const tNav = useTranslations("Public.navigation");
  const locale = useLocale();

  const translatedMainNav = React.useMemo(
    () => mainNav.map((group) => translateGroup(group, locale, tNav)),
    [tNav, locale]
  );

  const translatedUtilityNav = React.useMemo(
    () =>
      utilityNav.map((item) => ({
        ...translateItem(item, locale, tHeader),
      })),
    [tHeader, locale]
  );

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function closeAll() {
    setOpenIndex(null);
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-11 z-40 w-full border-b bg-background transition-shadow duration-200 select-none",
          scrolled ? "shadow-md" : ""
        )}
      >
        <div className="flex h-14 items-center justify-center gap-4 px-4 sm:px-6 lg:px-8">
          <nav className="hidden lg:flex flex-1 items-center justify-center h-14 max-w-7xl">
            {translatedMainNav.map((group, index) => (
              <React.Fragment key={group.label ?? group.labelKey ?? index}>
                {index > 0 && (
                  <span className="mx-3 h-5 w-px bg-border" aria-hidden="true" />
                )}
                <div className="h-full flex items-center px-1">
                  <MegaMenu
                    group={group}
                    isOpen={openIndex === index}
                    onOpen={() => setOpenIndex(index)}
                    onClose={closeAll}
                  />
                </div>
              </React.Fragment>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent lg:hidden"
            aria-label={tHeader("openMenu")}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileMenu
        navGroups={translatedMainNav}
        utilityNav={translatedUtilityNav}
        ctaLabel={tHeader("getStarted")}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  );
}
