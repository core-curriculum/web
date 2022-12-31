import { dropColumnsByNames, HeaderedTable } from "@libs/tableUtils";
import { TableInfo } from "@services/tables";

const Table = ({ table, tableInfo }: { table: HeaderedTable<string>; tableInfo: TableInfo }) => {
  const [header, ...body] = dropColumnsByNames(table, ["id", "index", "H28ID"]);
  return (
    <table className="table">
      <thead>
        <tr className="sticky top-0">
          {header.map((cell, i) => (
            <th key={i}>{cell}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {body.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td className="max-w-sm overflow-visible whitespace-normal" key={j}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export { Table };
