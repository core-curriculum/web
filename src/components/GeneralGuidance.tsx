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
      <p className="link-hover link-info link my-4">
        <Link
          target="_blank"
          href="https://www.mext.go.jp/b_menu/shingi/chousa/koutou/116/toushin/mext_01280.html"
        >
          {t("linkMextText")}
          <FiExternalLink className="ml-1 inline-block" />
        </Link>
      </p>
      <p className="link-hover link-info link my-4">
        <Link target="_blank" href={t("pdfLink")}>
          <MdDownload className="mr-1 inline-block" />
          {t("pdfLinkText")}
          <MdOutlinePictureAsPdf className="ml-1 inline-block" />
        </Link>
      </p>
    </div>
  );
};

export { GeneralGuidance };
