import { dropColumnsByNames, HeaderedTable, toObjectList } from "@libs/tableUtils";
import { TableInfo } from "@services/tables";
import { ItemContextMenu } from "./ItemContextMenu";

const Table = ({ table, tableInfo }: { table: HeaderedTable<string>; tableInfo: TableInfo }) => {
  const [header] = dropColumnsByNames(table, ["id", "index"]);
  const rowList = toObjectList(table) as Record<string, string>[];
  return (
    <table className="table">
      <thead>
        <tr className="sticky top-0">
          {header.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rowList.map((row, i) => (
          <tr key={i}>
            {header.map((key) => (
              <td className="max-w-sm overflow-visible whitespace-normal" key={row.id}>
                {row[key]}
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
