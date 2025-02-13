import React, { Fragment } from "react";
import { getContentView } from "./content-view/content-view";
import { Button } from "@/components/ui/button";
import { ContentEdit } from "@/components/signature-detail/content-edit/content-edit";
import { ContentAdd } from "@/components/signature-detail/content-add/content-add";
import { useContentEditStore } from "./store/content-edit-add-path-store";

export const EmailTemplateEditStacked: React.FC<{ rows: any[] }> = ({
  rows,
}) => {
  const { setContentEdit, contentEdit } = useContentEditStore();

  const renderRows = (rows: any[], path: string = "") => {
    return rows.map((row: any, index: number) => {
      const currentPath = path ? `${path}[${index}]` : `${index}`;

      if (!row?.id) {
        return null;
      }

      const content = getContentView(row?.content);

      return (
        <div key={row.id} style={{ marginBottom: "1rem", ...row.style }}>
          {content && (
            <div>
              {contentEdit.editPath !== currentPath && (
                <>
                  {content}
                  <div style={{ marginTop: "0.5rem" }}>
                    <Button
                      size="sm"
                      variant="blue"
                      onClick={() => {
                        setContentEdit({
                          editPath: currentPath,
                          addPath: null,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </>
              )}

              {contentEdit.editPath === currentPath && (
                <ContentEdit
                  contentPathToEdit={contentEdit.editPath}
                  key={`edit-${contentEdit.editPath}`}
                />
              )}
            </div>
          )}

          {row.columns &&
            Array.isArray(row.columns) &&
            row.columns.map((column: any, colIndex: number) => {
              const rowPath = `${currentPath}.columns[${colIndex}].rows`;
              return (
                <React.Fragment key={`col-${column.id}-${colIndex}`}>
                  <div
                    key={`column-${column.id}`}
                    style={{
                      /*      marginTop: "1rem",
                      paddingLeft: "1rem", */
                      ...column.style,
                    }}
                  >
                    {column.rows && renderRows(column.rows, rowPath)}
                    {contentEdit.addPath !== rowPath && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <Button
                          size="sm"
                          variant="orange"
                          onClick={() => {
                            const numberOfRows = column.rows
                              ? column.rows.length
                              : 0;
                            const nextEditRowPath = `${rowPath}[${numberOfRows}]`;
                            setContentEdit({
                              editPath: null,
                              addPath: rowPath,
                              nextEditPath: nextEditRowPath,
                            });
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    )}
                  </div>
                  <div key={`end-${column.id}`}>end</div>
                </React.Fragment>
              );
            })}
        </div>
      );
    });
  };

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        {!contentEdit.editPath && !contentEdit.addPath && (
          <Button
            onClick={() => {
              setContentEdit({
                position: "start",
                addPath: "stacked-root",
                nextEditPath: "[0]",
              });
            }}
            variant="gray"
          >
            Add
          </Button>
        )}
      </div>
      <div>{renderRows(rows)}</div>
      {contentEdit.addPath && (
        <ContentAdd
          path={contentEdit.addPath}
          onClose={() => {
            setContentEdit({ addPath: null });
          }}
        />
      )}

      {!contentEdit.editPath && !contentEdit.addPath && (
        <div className="mt-5">
          <Button
            onClick={() => {
              setContentEdit({
                position: "end",
                addPath: "table-root",
                nextEditPath: `[${rows.length}].columns[0].rows[0]`,
              });
            }}
            variant="gray"
          >
            Add
          </Button>
        </div>
      )}
    </>
  );
};

export default EmailTemplateEditStacked;
