import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { useLocaleText } from "@services/i18n/i18n";

type BackButtonProps = {
  href?: string;
};

const BackButton = ({ href }: BackButtonProps) => {
  const { t } = useLocaleText("@components/buttons/BackButton");
  href = href || "/";
  return (
    <Link href={href}>
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
