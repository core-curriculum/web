import Link from "next/link";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdDownload, MdOutlinePictureAsPdf } from "react-icons/md";

import { useLocale, useLocaleText } from "@services/i18n/i18n";

type PProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {} & PProps;

const mextUrl = "https://www.mext.go.jp/a_menu/koutou/iryou/mext_00005.html";

const GeneralGuidance: React.FC<Props> = props => {
  const { t } = useLocaleText("@components/GeneralGuidance");
  const { locale } = useLocale();
  return (
    <div {...props}>
      <p className="mb-4">{t("discription1")}</p>
      <p>{t("discription2")}</p>
      <div className="mt-8 flex flex-col gap-2">
        <Link className="link-hover link-info link" target="_blank" href={mextUrl}>
          {t("linkMextText")}
          <FiExternalLink className="ml-1 inline-block" />
        </Link>
        <Link target="_blank" className="link-hover link-info link" href={t("pdfLink")}>
          <MdDownload className="mr-1 inline-block" />
          {t("pdfLinkText")}
          <MdOutlinePictureAsPdf className="ml-1 inline-block" />
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
            <FiExternalLink className="ml-1 inline-block" />
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
              <FiExternalLink className="ml-1 inline-block" />
            </Link>
            <Link
              className="link-hover link-info link"
              target="_blank"
              href="https://books.rakuten.co.jp/rk/8a96930706b430c08543c4ece15862f1/"
            >
              楽天Kobo
              <FiExternalLink className="ml-1 inline-block" />
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
