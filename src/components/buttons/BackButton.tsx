import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { useLocaleText } from "@services/i18n/i18n";

const BackButton = () => {
  const { t } = useLocaleText("@components/buttons/BackButton");
  return (
    <Link href="/">
      <MdArrowBack
        size="2rem"
        title={t("target")}
        color="hsl(var(--in))"
        className="cursor-pointer rounded-md 
    p-1 hover:bg-info/30"
      />
    </Link>
  );
};

export { BackButton };
