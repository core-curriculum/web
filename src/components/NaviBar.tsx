import Image from "next/image";
import Link from "next/link";
import { MdSearch } from "react-icons/md";
import { useLocaleText } from "@services/i18n/i18n";
import { LinkToItemListWithContent } from "./LinkToItemList";
import { LocaleSwitchButton } from "./buttons/LocaleSwitchButton";

const ToggleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    className="inline-block h-6 w-6 stroke-current"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    ></path>
  </svg>
);

const SearchLink = () => {
  const { t } = useLocaleText("@components/NaviBar");
  return (
    <Link href="/search" className="flex items-center rounded-md p-2 hover:bg-info/30">
      <div className="mr-1 text-sm text-info max-lg:hidden">{t("search")}</div>
      <MdSearch title={t("search")} className="" size="2rem" color="rgb(125 211 252)" />
    </Link>
  );
};

const LocaleSwithLink = () => {
  return <LocaleSwitchButton />;
};

const NaviBar = () => {
  const { t } = useLocaleText("@components/NaviBar");
  return (
    <div className="flex h-full items-center">
      <div className="flex-none px-2 lg:hidden">
        <label htmlFor="mobileDrawHiddenCheckBox" className="cursor-pointer">
          <ToggleIcon />
        </label>
      </div>
      <div className="flex flex-1 px-2 text-lg font-extrabold text-info max-md:text-base">
        <Link
          href="/"
          className="flex flex-none items-center gap-2 rounded-md pr-2 hover:bg-info/30"
          passHref
        >
          <Image className="ml-2 max-lg:hidden" src="/logo.svg" width="50" height="50" alt="" />
          {t("title")}
        </Link>
      </div>
      <div className="mr-2 flex flex-none items-center">
        <LocaleSwithLink />
        <LinkToItemListWithContent />
        <SearchLink />
      </div>
    </div>
  );
};

export { NaviBar };
