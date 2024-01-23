import Link from "next/link";
import { MdLanguage } from "react-icons/md";
import { useSwitchTargetLocale } from "@services/i18n/i18n";

const LocaleSwitchButton = () => {
  const switchTargetLocale = useSwitchTargetLocale();
  const title = switchTargetLocale === "en" ? "English" : "日本語";
  return (
    <Link
      href="/"
      locale={switchTargetLocale}
      className="hover:bg-info/30 flex items-center justify-center gap-x-1 rounded-md p-2"
    >
      <span className="text-info max-lg:hidden  max-md:text-sm">{title}</span>
      <MdLanguage
        size="2rem"
        title={title}
        color="rgb(125 211 252"
        className="hover:bg-info/30 cursor-pointer 
    rounded-md p-1"
      />
    </Link>
  );
};

export { LocaleSwitchButton };
