import { Fragment } from "react";
import { getContentView } from "./content-view";

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    return (
      <td style={column.style}>
        <table
          key={column.id}
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
            width="100%"
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

      const content = getContentView(row?.content);

      if (content) {
        return (
          <tr key={`tr-${row.id}`}>
            <td
              style={{
                backgroundColor: row?.content.backgroundColor,
                lineHeight: 1,
                ...row.style,
              }}
            >
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

  return (
    <table border={0} cellPadding="0" cellSpacing="0" role="presentation">
      <tbody>
        <tr>
          <td>{renderRows(rows, true)}</td>
        </tr>
      </tbody>
    </table>
  );
};
