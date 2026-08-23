import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LocaleProvider } from "@/context/locale-context";
import { Locale } from "@/lib/locale";
import { Header } from "@/components/public/Header";
import { TopBar } from "@/components/public/TopBar";
import { Footer } from "@/components/public/Footer";
import { BackToTopButton } from "@/components/common/back-to-top-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZenthCloud — Cloud infrastructure built for what comes next.",
  description:
    "Deploy, scale and operate your infrastructure with ZenthCloud — from cloud compute to dedicated servers, private cloud and connectivity.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    return null;
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <LocaleProvider initialLocale={locale as Locale}>
        <div className="min-h-screen flex flex-col">
          <TopBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <BackToTopButton />
        </div>
      </LocaleProvider>
    </NextIntlClientProvider>
  );
}
