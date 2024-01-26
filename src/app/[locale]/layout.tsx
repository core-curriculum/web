import { I18nProviderClient } from "@locales/client";
import { ReactElement } from "react";
import "./globals.css";
import { Metadata, ResolvingMetadata } from "next";
import { getScopedI18n } from "@locales/server";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const t = await getScopedI18n("$common");

  return {
    title: t("siteTitle"),
  };
}

export default function RootLayout({
  params: { locale },
  children,
}: {
  params: { locale: string };
  children: ReactElement;
}) {
  return (
    <html lang="en">
      <body>
        <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
      </body>
    </html>
  );
}
