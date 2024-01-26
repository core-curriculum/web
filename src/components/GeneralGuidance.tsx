import { getScopedI18n, getCurrentLocale } from "@locales/server";
import { ExternalLinkIcon, PdfIcon, DownloadIcon } from "@ui/icons";
import Link from "next/link";
import React from "react";

type PProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {} & PProps;

const GeneralGuidance: React.FC<Props> = async props => {
  const t = await getScopedI18n("@components.GeneralGuidance");
  const locale = getCurrentLocale();
  return (
    <div {...props}>
      <p className="mb-4">{t("discription1")}</p>
      <p>{t("discription2")}</p>
      <div className="mt-8 flex flex-col gap-2">
        <Link
          className="link-hover link-info link"
          target="_blank"
          href="https://www.mext.go.jp/b_menu/shingi/chousa/koutou/116/toushin/mext_01280.html"
        >
          {t("linkMextText")}
          <ExternalLinkIcon />
        </Link>
        <Link target="_blank" className="link-hover link-info link" href={t("pdfLink")}>
          <DownloadIcon />
          {t("pdfLinkText")}
          <PdfIcon />
        </Link>
        <Link className="link-hover link-info link" href="/movies">
          {t("movies")}
        </Link>
        {locale === "ja" && (
          <Link
            className="link-hover link-info link"
            target="_blank"
            href="https://docs.google.com/spreadsheets/d/1oQ66Y76bfQB7s71JpdRRUTaBD0Ia5VIo/edit#gid=82940009"
          >
            医学教育関連論文
            <ExternalLinkIcon />
          </Link>
        )}
        {locale === "ja" && (
          <span className="flex flex-row gap-3">
            電子書籍:{" "}
            <Link
              className="link-hover link-info link"
              target="_blank"
              href="https://www.amazon.co.jp/dp/B0CQHLQQW2"
            >
              Kindle
              <ExternalLinkIcon />
            </Link>
            <Link
              className="link-hover link-info link"
              target="_blank"
              href="https://books.rakuten.co.jp/rk/8a96930706b430c08543c4ece15862f1/"
            >
              楽天Kobo
              <ExternalLinkIcon />
            </Link>
          </span>
        )}
        <Link className="link-hover link-info link" href="/qanda">
          {t("qAndA")}
        </Link>
      </div>
    </div>
  );
};

export { GeneralGuidance };
