import { toast } from "react-hot-toast";
import { MdContentCopy } from "react-icons/md";
import { copyToClip } from "@libs/utils";

const CopyButton = ({ content, className }: { content: string; className?: string }) => {
  const onClick = async () => {
    await copyToClip(content);
    toast("クリップボードにコピーしました");
  };
  return (
    <button title="クリップボードにコピー" {...{ onClick, className }}>
      <MdContentCopy />
    </button>
  );
};

export { CopyButton };
