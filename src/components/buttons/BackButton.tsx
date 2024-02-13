import Link from "next/link";
import { useRouter } from "next/router";
import { MdArrowBack } from "react-icons/md";
import { useLocaleText } from "@services/i18n/i18n";

type BackButtonProps = {
  href?: string;
};

const BackButton = ({ href }: BackButtonProps) => {
  const { t } = useLocaleText("@components/buttons/BackButton");
  const router = useRouter();
  href = href || (router.query.referer as string) || "/";
  return (
    <Link href={href}>
      <MdArrowBack
        size="2rem"
        title={t("target")}
        color="oklch(var(--in))"
        className="hover:bg-info/30 cursor-pointer 
    rounded-md p-1"
      />
    </Link>
  );
};

export { BackButton };
