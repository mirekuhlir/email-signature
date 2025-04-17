/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { getContentView } from './content-view/content-view';
import { Button } from '@/src/components/ui/button';
import { ContentEdit } from '@/src/components/signature-detail/content-edit/content-edit';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { ContentAdd } from '@/src/components/signature-detail/content-add/content-add';
import { ColumnSettings } from '@/src/components/signature-detail/column-settings/column-settings';
import { useParams } from 'next/navigation';
import { Hr } from '../ui/hr';
import { ContextMenu } from '../ui/context-menu';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { get } from 'lodash';
import { ContentType } from '@/src/const/content';

export const EmailTemplateEdit = (props: any) => {
  const { rows, isSignedIn, templateSlug } = props;
  const { setContentEdit, contentEdit } = useContentEditStore();
  const { moveRowUp, moveRowDown, isSavingOrder } = useSignatureStore();
  const { id: signatureId } = useParams();

  const renderColumn = (column: any, path: string) => {
    const rowPath = `${path}.rows`;

    return (
      <div
        style={{
          ...column.style,
          display: 'table-cell',
          verticalAlign: column.style?.verticalAlign || 'top',
        }}
      >
        <div
          style={{
            display: 'table',
            width: '100%',
          }}
        >
          {column.rows && renderRows(column.rows, false, `${rowPath}`)}
        </div>

        {contentEdit.addPath !== rowPath && contentEdit.columnPath === null && (
          <div className="flex flex-col items-end mb-2">
            <div className="mb-2">
              <Button
                size="sm"
                variant="gray"
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
            <div>
              <Button
                variant="blue"
                size="sm"
                onClick={() => {
                  setContentEdit({
                    columnPath: path,
                    editPath: null,
                    addPath: null,
                  });
                }}
              >
                Settings
              </Button>
            </div>
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

      // Parse path to get tableIndex and columnIndex
      let tableIndex = -1;
      let columnIndex = -1;

      if (path) {
        const pathParts = path.split('.');
        if (pathParts[0]) {
          tableIndex = parseInt(pathParts[0].replace(/[[\]]/g, ''));
        }
        if (pathParts[1]) {
          const colMatch = pathParts[1].match(/columns\[(\d+)\]/);
          if (colMatch && colMatch[1]) {
            columnIndex = parseInt(colMatch[1]);
          }
        }
      }

      // Check if table and column indices are valid
      const isValid = tableIndex >= 0 && columnIndex >= 0;
      // Get total rows in this column if indices are valid
      const totalRowsInColumn = isValid && rows ? rows.length : 0;
      // Show context menu only if there's more than one row in the column
      const showContextMenu = totalRowsInColumn > 1;

      if (isFirstRow) {
        return (
          <div
            key={`table-${row.id}`}
            style={{
              display: 'table',
            }}
          >
            <div
              style={{
                display: 'table-row',
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
                display: 'table-row',
              }}
            >
              <div
                style={{
                  lineHeight: 1,
                  display: 'table-cell',
                  backgroundColor: row?.content.backgroundColor,
                  ...row.style,
                }}
              >
                {content}
              </div>
            </div>

            {contentEdit.editPath !== currentPath &&
              contentEdit.columnPath === null && (
                <>
                  <div className="flex justify-start items-center gap-2 mb-2 mt-1">
                    <Button
                      size="sm"
                      variant="blue"
                      onClick={() => {
                        setContentEdit({
                          editPath: currentPath,
                          addPath: null,
                        });

                        const rowContent = get(rows, `${currentPath}.content`);
                        if (rowContent?.type !== ContentType.IMAGE) {
                          window.scrollTo(0, 0);
                        }
                      }}
                    >
                      Edit
                    </Button>
                    {showContextMenu && (
                      <ContextMenu
                        size="sm"
                        placement="right"
                        isLoading={isSavingOrder}
                      >
                        <div className="pt-2 pb-2 px-2 flex flex-col gap-1 whitespace-nowrap items-start">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              moveRowUp(currentPath, signatureId as string);
                            }}
                          >
                            Move up
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              moveRowDown(currentPath, signatureId as string);
                            }}
                          >
                            Move down
                          </Button>
                        </div>
                      </ContextMenu>
                    )}
                  </div>
                  <Hr className="mb-2" />
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
            display: 'table-row',
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
      <div>
        {!contentEdit.editPath &&
          !contentEdit.addPath &&
          !contentEdit.columnPath && (
            <div className="mb-4">
              <Button
                onClick={() => {
                  setContentEdit({
                    editPath: null,
                    position: 'start',
                    addPath: 'table-root',
                    nextEditPath: '[0].columns[0].rows[0]',
                  });
                }}
                variant="gray"
              >
                Add
              </Button>
              <Hr className="my-4" />
            </div>
          )}
        <>
          {!contentEdit.addPath &&
            !contentEdit.editPath &&
            renderRows(rows, true, '')}
        </>
        {!contentEdit.editPath &&
          !contentEdit.addPath &&
          !contentEdit.columnPath && (
            <div className="mt-5 mb-5">
              <Hr className="my-4" />
              <Button
                onClick={() => {
                  setContentEdit({
                    editPath: null,
                    position: 'end',
                    addPath: 'table-root',
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
          isSignedIn={isSignedIn}
          templateSlug={templateSlug}
          contentPathToEdit={contentEdit.editPath}
          key={`edit-${contentEdit.editPath}`}
          signatureId={signatureId}
        />
      )}

      {contentEdit.columnPath && (
        <ColumnSettings
          isSignedIn={isSignedIn}
          templateSlug={templateSlug}
          columnPathToEdit={contentEdit.columnPath}
          key={`settings-${contentEdit.columnPath}`}
          signatureId={signatureId}
        />
      )}
    </>
  );
};
