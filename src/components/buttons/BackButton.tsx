import Link from "next/link";
import { MdArrowBack } from "react-icons/md";

const BackButton = () => {
  return (
    <Link href="/">
      <MdArrowBack
        size="2rem"
        title="学修目標一覧へ"
        color="rgb(125 211 252"
        className="cursor-pointer rounded-md 
    p-1 hover:bg-sky-100"
      />
    </Link>
  );
};

export { BackButton };
