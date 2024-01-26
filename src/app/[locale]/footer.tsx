import { getScopedI18n, getCurrentLocale } from "@locales/server";
import { ExternalLinkIcon } from "@ui/icons";
import Link from "next/link";

export const Footer: React.FC = async () => {
  const t = await getScopedI18n("@components.Footer");
  const locale = getCurrentLocale();
  const linkToData =
    locale === "ja"
      ? "https://github.com/core-curriculum/data"
      : "https://github.com/core-curriculum/data/tree/main/2022/en";
  return (
    <footer className="text-base-content/80 px-5 py-4 text-center text-sm">
      <div
        className="border-t-base-content/80 grid grid-cols-1 
      justify-items-center gap-3 border-t-[1px] px-5 py-2"
      >
        <p className="text-xs">{t("description")}</p>
        <p className="flex flex-row gap-2">
          <Link href="https://github.com/core-curriculum/web" className="link" target="_blank">
            Github Repository
            <ExternalLinkIcon />
          </Link>
          <Link href={linkToData} className="link" target="_blank">
            {t("linkForData")}
            <ExternalLinkIcon />
          </Link>
        </p>
      </div>
    </footer>
  );
};
