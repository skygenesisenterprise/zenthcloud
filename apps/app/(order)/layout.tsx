import * as React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Finaliser votre commande | ZenthCloud",
  robots: { index: false, follow: false },
};

export default async function OrderLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const messages = await getMessages({ locale: routing.defaultLocale });

  return (
    <NextIntlClientProvider locale={routing.defaultLocale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
