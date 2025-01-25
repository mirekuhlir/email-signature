import { Fragment } from "react";
import { getContent } from "./utils";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/signature-detail/store";

// TODO - add row table
// TODO - add row in column

export const EmailTemplateEdit = (props: any) => {
  const { rows } = props;

  const { addRow } = useStore();

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
          <Button onClick={() => addRow(column.id)}>Add row</Button>
        </div>
      </div>
    );
  };

  const renderRows = (rows: any, isFirstRow?: boolean) => {
    return rows.map((row: any) => {
      if (isFirstRow) {
        return (
          <div
            key={`table-${row.id}`}
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
                <Fragment key={column.id}>{renderColumn(column)}</Fragment>
              ))}
            </div>
          </div>
        );
      }

      const content = getContent(row.content);

      if (row.content?.text) {
        return (
          <div
            key={`tr-${row.id}`}
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
          key={`tr-${row.id}`}
          style={{
            ...row.style,
            display: "table-row",
          }}
        >
          {row.columns?.map((column: any) => (
            <Fragment key={`td-${column.id}`}>{renderColumn(column)}</Fragment>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      {renderRows(rows, true)}
      <Button onClick={() => addRow(undefined, "end")}>Add row</Button>
    </>
  );
};
