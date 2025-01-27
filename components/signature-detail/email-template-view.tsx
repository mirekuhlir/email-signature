import { Fragment } from "react";
import { getContent } from "./content";

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    return (
      <td style={column.style}>
        <table
          key={column}
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          width="100%"
        >
          <tbody>{column.rows && renderRows(column.rows)}</tbody>
        </table>
      </td>
    );
  };

  const renderRows = (rows: any, isFirstRow?: boolean) => {
    return rows.map((row: any) => {
      if (!row?.id) {
        return null;
      }

      if (isFirstRow) {
        return (
          <table
            key={`table-${row.id}`}
            border={0}
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
          >
            <tbody>
              <tr key={`tr-${row.id}`} style={row.style}>
                {row.columns?.map((column: any) => (
                  <Fragment key={column.id}>{renderColumn(column)}</Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }

      const content = getContent(row?.content);

      if (content) {
        return (
          <tr key={`tr-${row.id}`}>
            <td style={row.style} key={row.id}>
              {content}
            </td>
          </tr>
        );
      }

      return (
        <tr key={`tr-${row.id}`} style={row?.style}>
          {row.columns.map((column: any) => (
            <Fragment key={`td-${column?.id}`}>{renderColumn(column)}</Fragment>
          ))}
        </tr>
      );
    });
  };

  return <>{renderRows(rows, true)}</>;
};
