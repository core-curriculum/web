import Link from "next/link";
import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { MdDownload, MdOutlinePictureAsPdf } from "react-icons/md";

import { useLocaleText } from "@services/i18n/i18n";

type PProps = React.HTMLAttributes<HTMLDivElement>;
type Props = {} & PProps;

const GeneralGuidance: React.FC<Props> = props => {
  const { t } = useLocaleText("@components/GeneralGuidance");
  return (
    <div {...props}>
      <p className="mb-4">{t("discription1")}</p>
      <p>{t("discription2")}</p>
      <div className="mt-4 flex flex-col gap-2">
        <Link
          className="link-hover link-info link"
          target="_blank"
          href="https://www.mext.go.jp/b_menu/shingi/chousa/koutou/116/toushin/mext_01280.html"
        >
          {t("linkMextText")}
          <FiExternalLink className="ml-1 inline-block" />
        </Link>
        <Link target="_blank" className="link-hover link-info link" href={t("pdfLink")}>
          <MdDownload className="mr-1 inline-block" />
          {t("pdfLinkText")}
          <MdOutlinePictureAsPdf className="ml-1 inline-block" />
        </Link>
        <Link className="link-hover link-info link my-2" href="/movies">
          {t("movies")}
        </Link>
        <Link className="link-hover link-info link my-2" href="/qanda">
          {t("qAndA")}
        </Link>
      </div>
    </div>
  );
};

export { GeneralGuidance };
