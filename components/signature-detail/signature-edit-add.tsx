/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import { getContentView } from "./content-view/content-view";
import { Button } from "@/components/ui/button";
import { ContentEdit } from "@/components/signature-detail/content-edit/content-edit";
import { useContentEditStore } from "./store/content-edit-add-path-store";
import { ContentAdd } from "@/components/signature-detail/content-add/content-add";
import { useParams } from "next/navigation";

export const EmailTemplateEdit = (props: any) => {
  const { rows } = props;
  const { setContentEdit, contentEdit } = useContentEditStore();
  const { id: signatureId } = useParams();

  const renderColumn = (column: any, path: string) => {
    const rowPath = `${path}.rows`;

    return (
      <div
        style={{
          ...column.style,
          display: "table-cell",
          verticalAlign: "middle",
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

        {contentEdit.addPath !== rowPath && (
          <div className="flex justify-between mt-2">
            <Button variant="blue" size="sm">
              Settings
            </Button>
            <Button
              size="sm"
              variant="orange"
              onClick={() => {
                const numberOfRows = column.rows.length;
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
    );
  };

  const renderRows = (rows: any, isFirstRow?: boolean, path?: string) => {
    return rows.map((row: any, index: number) => {
      const currentPath = path ? `${path}[${index}]` : `[${index}]`;

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
                  lineHeight: 1,
                  display: "table-cell",
                  backgroundColor: row?.content.backgroundColor,
                  ...row.style,
                }}
              >
                {content}
              </div>
            </div>

            {contentEdit.editPath !== currentPath && (
              <>
                <div className="mt-1 mb-4 flex justify-end">
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
  // TODO - table mx-auto je ěnkdy navíc

  return (
    <>
      <div className="table mx-auto">
        {!contentEdit.editPath && !contentEdit.addPath && (
          <div className="mb-5">
            <Button
              onClick={() => {
                setContentEdit({
                  editPath: null,
                  position: "start",
                  addPath: "table-root",
                  nextEditPath: "[0].columns[0].rows[0]",
                });
              }}
              variant="gray"
            >
              Add
            </Button>
          </div>
        )}
        <>
          {!contentEdit.addPath &&
            !contentEdit.editPath &&
            renderRows(rows, true, "")}
        </>
        {!contentEdit.editPath && !contentEdit.addPath && (
          <div className="mt-5 mb-5">
            <Button
              onClick={() => {
                setContentEdit({
                  editPath: null,
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
      </div>

      {contentEdit.addPath && (
        <ContentAdd
          path={contentEdit.addPath}
          onClose={() => {
            setContentEdit({
              addPath: null,
            });
          }}
        />
      )}

      {contentEdit.editPath && (
        <ContentEdit
          contentPathToEdit={contentEdit.editPath}
          key={`edit-${contentEdit.editPath}`}
          signatureId={signatureId}
        />
      )}
    </>
  );
};
