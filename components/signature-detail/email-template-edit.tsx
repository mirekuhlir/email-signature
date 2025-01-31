import { Fragment } from "react";
import { getContentView } from "./content-view";
import { Button } from "@/components/ui/button";
import { useSignatureStore } from "@/components/signature-detail/signature-store";
import { ContentEdit } from "@/components/content-edit/content-edit";
import { useContentEditStore } from "../content-edit/content-edit-store";
import { ContentAdd } from "@/components/content-edit/content-add";

export const EmailTemplateEdit = (props: any) => {
  const { rows } = props;
  const { setCurrentEdit, currentEdit } = useContentEditStore();

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

        {currentEdit.addPath !== rowPath && (
          <div className="mt-5">
            <Button
              size="sm"
              variant="orange"
              onClick={() => {
                const numberOfRows = column.rows.length;
                const nextEditRowPath = `${rowPath}[${numberOfRows}]`;

                setCurrentEdit({
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

      const content = getContentView(row?.content);
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
                  backgroundColor: row?.content.backgroundColor,
                }}
              >
                {content}
              </div>
            </div>

            {currentEdit.editPath !== currentPath && (
              <Button
                size="sm"
                variant="blue"
                onClick={() => {
                  setCurrentEdit({
                    editPath: currentPath,
                    addPath: null,
                  });
                }}
              >
                Edit
              </Button>
            )}
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

  //TODO - kam dát upravu barvy celého sloupce? nebo řádku? do editu?

  return (
    <>
      <div className="table mx-auto">{renderRows(rows, true, "")}</div>
      <Button
        onClick={() => {
          setCurrentEdit({
            position: "end",
            addPath: "table-root",
            nextEditPath: `[${rows.length}].columns[0].rows[0]`,
          });
        }}
      >
        Add
      </Button>

      <div>
        {currentEdit.editPath && (
          <div>
            <ContentEdit
              contentPathToEdit={currentEdit.editPath}
              key={`edit-${currentEdit.editPath}`}
            />
            <div></div>
          </div>
        )}
      </div>

      <div>
        {currentEdit.addPath && (
          <div>
            <ContentAdd
              path={currentEdit.addPath}
              onClose={() => {
                setCurrentEdit({
                  addPath: null,
                });
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};
