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

export const EmailTemplateEdit = (props: any) => {
  const { rows, isSignedIn, templateSlug } = props;
  const { setContentEdit, contentEdit } = useContentEditStore();
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
          <div className="flex flex-col items-end">
            <div className="mb-2">
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
            <div>
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
                  <div className="flex justify-start mb-2 mt-1">
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
            <div className="mb-5">
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
