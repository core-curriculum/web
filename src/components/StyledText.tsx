import Link from "next/link";
import { applyMappedInfo, MappedInfo } from "@libs/textMapper";
import { AttrInfo } from "@services/replaceMap";

const StyledText = ({ text, map }: { text: string; map: MappedInfo<AttrInfo>[] }) => {
  if (map.length === 0) return <>{text}</>;
  return (
    <>
      {applyMappedInfo(text, map, (text, attr, key) => {
        switch (attr.type) {
          case "tableLink":
            return (
              <Link
                href={attr.url}
                key={attr.id}
                title={attr.title}
                className="cursor-pointer text-sky-500 hover:underline"
              >
                {text}
              </Link>
            );
          case "sub":
            return <span className="align-super text-[20%]">{text}</span>;
          case "italic":
            return <span className="italic">{text}</span>;
        }
        return <>{"unknown:" + text + ":" + attr.type}</>;
      })}
    </>
  );
};

export { StyledText };
