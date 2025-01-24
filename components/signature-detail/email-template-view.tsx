import { Fragment } from "react";
import { getContent } from "./utils";

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    const content = getContent(column.content);

    if (content) {
      return <td style={column.style}>{content}</td>;
    }

    return (
      <td style={column.style}>
        <table
          key={column}
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
        >
          <tbody>{column.rows && renderRows(column.rows)}</tbody>
        </table>
      </td>
    );
  };

  const renderRows = (rows: any) => {
    return rows.map((row: any) => {
      const isFirstRow = !row.path.includes(".");

      if (isFirstRow) {
        return (
          <table
            key={`table-${row.path}`}
            border={0}
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
          >
            <tbody>
              <tr key={`tr-${row.path}`} style={row.style}>
                {row.columns?.map((column: any) => (
                  <Fragment key={column.path}>{renderColumn(column)}</Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }

      const content = getContent(row.content);

      if (row.content?.text) {
        return (
          <tr key={`tr-${row.path}`} style={row.style}>
            <td key={row.path}>{content}</td>
          </tr>
        );
      }

      return (
        <tr key={`tr-${row.path}`} style={row.style}>
          {row.columns?.map((column: any) => (
            <Fragment key={`td-${column.path}`}>
              {renderColumn(column)}
            </Fragment>
          ))}
        </tr>
      );
    });
  };

  return <>{renderRows(rows)}</>;
};
