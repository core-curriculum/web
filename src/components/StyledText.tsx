import Link from "next/link";
import { applyMappedInfo, MappedInfo } from "@libs/textMapper";
import { AttrInfo } from "@services/attrInfo";

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
                className="link-hover link-info link"
              >
                {text}
              </Link>
            );
          case "sub":
            return (
              <span key={key} className="align-super text-[20%]">
                {text}
              </span>
            );
          case "italic":
            return (
              <span key={key} className="italic">
                {text}
              </span>
            );
        }
        return <span key={key}>{"unknown:" + text + ":" + attr.type}</span>;
      })}
    </>
  );
};

export { StyledText };
