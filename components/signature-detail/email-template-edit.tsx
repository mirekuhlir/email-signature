import { Fragment, useState } from "react";
import { getContent } from "./content";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/signature-detail/store";
import { ContentEdit } from "@/components/content-edit/content-edit";

export const EmailTemplateEdit = (props: any) => {
  const { rows } = props;
  const { addRow, addRowTable, removeRow } = useStore();

  const [contentPathToEdit, setContentPathToEdit] = useState<string | null>();

  const renderColumn = (column: any, path: string) => {
    const rowPath = `${path}.rows`;

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
            width: "100%",
          }}
        >
          {column.rows && renderRows(column.rows, false, `${rowPath}`)}
        </div>
        <Button onClick={() => addRow(column.id, rowPath)}>Add</Button>
      </div>
    );
  };

  const renderRows = (rows: any, isFirstRow?: boolean, path?: string) => {
    return rows.map((row: any, index: number) => {
      const currentPath = path ? `${path}[${index}]` : `${index}`;

      if (!row?.id) {
        return null;
      }

      if (isFirstRow) {
        return (
          <div
            key={`table-${row.id}`}
            style={{
              display: "table",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "table-row",
                ...row.style,
              }}
            >
              {row.columns?.map((column: any, colIndex: number) => (
                <Fragment key={column.id}>
                  {renderColumn(column, `${currentPath}.columns[${colIndex}]`)}
                </Fragment>
              ))}
            </div>
          </div>
        );
      }

      const content = getContent(row?.content);
      if (content) {
        return (
          <Fragment key={`tr-${row.id}`}>
            <div
              style={{
                display: "table-row",
              }}
            >
              <div
                style={{
                  ...row.style,
                  display: "table-cell",
                }}
              >
                {content}
              </div>
            </div>
            <Button onClick={() => removeRow(currentPath)}>Remove</Button>
            <Button
              onClick={() => {
                setContentPathToEdit(currentPath);
              }}
            >
              Edit
            </Button>
          </Fragment>
        );
      }

      return (
        <div
          key={`tr-${row?.id}`}
          style={{
            ...row.style,
            display: "table-row",
          }}
        >
          {row.columns?.map((column: any, colIndex: number) => (
            <Fragment key={`td-${column.id}`}>
              {renderColumn(column, `${currentPath}.columns[${colIndex}]`)}
            </Fragment>
          ))}
        </div>
      );
    });
  };

  return (
    <>
      {renderRows(rows, true, "")}
      <Button onClick={() => addRowTable("end")}>Add</Button>

      {contentPathToEdit && (
        <div>
          <ContentEdit
            contentPathToEdit={contentPathToEdit}
            key={contentPathToEdit}
          />
          <div>
            <Button onClick={() => setContentPathToEdit(null)}>Close</Button>
          </div>
        </div>
      )}
    </>
  );
};
