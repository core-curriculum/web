import { dropColumnsByNames, HeaderedTable, toObjectList } from "@libs/tableUtils";
import { TableAttrInfo, TableInfo } from "@services/tables";
import { ItemContextMenu } from "./ItemContextMenu";
import { StyledText } from "./StyledText";

const Table = ({
  table,
  tableInfo,
  attrInfo,
}: {
  table: HeaderedTable<string>;
  tableInfo: TableInfo;
  attrInfo: TableAttrInfo;
}) => {
  const [header] = dropColumnsByNames(table, ["id", "index"]);
  const rowList = toObjectList(table) as Record<string, string>[];
  return (
    <table className="table">
      <thead>
        <tr className="sticky top-0 bg-base-100">
          {header.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rowList.map((row, i) => (
          <tr key={i}>
            {header.map(key => (
              <td className="max-w-sm overflow-visible whitespace-normal" key={row.id}>
                {row.id in attrInfo && key in attrInfo[row.id] ? (
                  <StyledText text={row[key]} map={attrInfo[row.id][key]} />
                ) : (
                  row[key]
                )}
              </td>
            ))}
            <td>
              <ItemContextMenu id={row.id} index={row.index} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
