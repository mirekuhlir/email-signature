import { Fragment } from "react";
import { getContent } from "./utils";

// TODO - add row table
// TODO - add row in column

export const EmailTemplateEdit = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    const content = getContent(column.content);
    if (content) {
      return (
        <div
          style={{
            ...column.style,
            display: "table-cell",
          }}
        >
          {content}
        </div>
      );
    }

    return (
      <div
        style={{
          ...column.style,
          display: "table-cell",
        }}
      >
        <div
          style={{
            display: "table",
          }}
        >
          {column.rows && renderRows(column.rows)}
        </div>
      </div>
    );
  };

  const renderRows = (rows: any) => {
    return rows.map((row: any) => {
      const isFirstRow = !row.path.includes(".");

      if (isFirstRow) {
        return (
          <div
            key={`table-${row.path}`}
            style={{
              display: "table",
            }}
          >
            <div
              style={{
                display: "table-row",
                ...row.style,
              }}
            >
              {row.columns?.map((column: any) => (
                <Fragment key={column.path}>{renderColumn(column)}</Fragment>
              ))}
            </div>
          </div>
        );
      }

      const content = getContent(row.content);

      if (row.content?.text) {
        return (
          <div
            key={`tr-${row.path}`}
            style={{
              ...row.style,
              display: "table-row",
            }}
          >
            <div
              style={{
                display: "table-cell",
              }}
            >
              {content}
            </div>
          </div>
        );
      }

      return (
        <div
          key={`tr-${row.path}`}
          style={{
            ...row.style,
            display: "table-row",
          }}
        >
          {row.columns?.map((column: any) => (
            <Fragment key={`td-${column.path}`}>
              {renderColumn(column)}
            </Fragment>
          ))}
        </div>
      );
    });
  };

  return <>{renderRows(rows)}</>;
};
