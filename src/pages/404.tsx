import { useTranslation } from "@services/i18n/i18n";
import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  const { t } = useTranslation("@pages/404");
  return (
    <div className="h-dvh">
      <Head>
        <title>{t("title")}</title>
      </Head>
      <div className="grid h-full scroll-pt-14 place-items-center gap-4 p-4 pt-14">
        <div className="grid gap-10">
          <h1 className="text-2xl">{t("title")}</h1>
          <p>{t("notFound")}</p>
          <Link href="/" className="link link-info">
            {t("notFoundToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
