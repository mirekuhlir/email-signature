/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, useEffect, useRef } from 'react';
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
import { MAX_ROWS } from '@/supabase/functions/_shared/const';
import { useMediaQuery } from '@/src/hooks/useMediaQuery';
import { MEDIA_QUERIES } from '@/src/constants/mediaQueries';
import { getWidthHeightStyle } from './content-view/utils';
import { DeleteConfirmationModal } from '@/src/components/ui/delete-confirmation-modal';
import Modal from '../ui/modal';
import { Container } from '../ui/container';

// Helper function to determine if a color is dark
function isColorDark(colorString: string): boolean {
  if (!colorString) return false;

  // Handle RGB(A) format
  const rgbMatch = colorString.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d*\.?\d+)?\)/,
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    // Calculate luminance (simple average for this case)
    const luminance = r * 0.299 + g * 0.587 + b * 0.114;
    return luminance < 140; // Threshold for darkness (adjust as needed)
  }

  // Add handling for other formats (hex, named colors) if necessary
  // For simplicity, assume non-rgb backgrounds are light
  return false;
}

export const EmailTemplateEdit = (props: any) => {
  const { rows, isSignedIn, templateSlug, userStatus } = props;
  const { setContentEdit, contentEdit } = useContentEditStore();
  const { moveRowUp, moveRowDown, isSavingOrder, savingOrderPath, deleteRow } =
    useSignatureStore();
  const { id: signatureId } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery(MEDIA_QUERIES.MOBILE);

  const [isBackgroundDark, setIsBackgroundDark] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRow = async () => {
    if (rowToDelete) {
      setIsDeleting(true);
      try {
        await deleteRow(rowToDelete, signatureId as string, isSignedIn);
      } finally {
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setRowToDelete(null);
      }
    }
  };

  useEffect(() => {
    let bgColor = 'transparent'; // Default to transparent or a known light color
    if (containerRef.current) {
      const computedStyle = getComputedStyle(containerRef.current);
      bgColor = computedStyle.backgroundColor;
    }
    const isDark = isColorDark(bgColor);
    setIsBackgroundDark(isDark); // Keep updating this state if needed elsewhere
  }, [contentEdit]);

  const hrColor = isBackgroundDark ? 'border-gray-400' : 'border-gray-700';

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
          <div className="flex flex-col items-end mb-2 mr-1">
            {column.rows.length < MAX_ROWS && (
              <div className="mb-2">
                <Button
                  size="sm"
                  variant="gray"
                  disabled={isSavingOrder}
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
            <div>
              <Button
                variant="blue"
                size="sm"
                disabled={isSavingOrder}
                onClick={() => {
                  setContentEdit({
                    columnPath: path,
                    editPath: null,
                    addPath: null,
                  });
                }}
              >
                Edit column
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
      const showContextMenu = totalRowsInColumn > 0;

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

      const padding = row?.content?.components[0]?.padding;
      const backgroundColor = row?.content?.components[0]?.backgroundColor;
      const borderRadius = row?.content?.components[0]?.borderRadius;

      const borderBottomWidth = row?.content?.components[0]?.borderBottomWidth;
      const borderBottomColor = row?.content?.components[0]?.borderBottomColor;
      const borderBottomStyle = row?.content?.components[0]?.borderBottomStyle;
      const borderLeftWidth = row?.content?.components[0]?.borderLeftWidth;
      const borderLeftColor = row?.content?.components[0]?.borderLeftColor;
      const borderLeftStyle = row?.content?.components[0]?.borderLeftStyle;
      const borderRightWidth = row?.content?.components[0]?.borderRightWidth;
      const borderRightColor = row?.content?.components[0]?.borderRightColor;
      const borderRightStyle = row?.content?.components[0]?.borderRightStyle;
      const borderTopWidth = row?.content?.components[0]?.borderTopWidth;
      const borderTopColor = row?.content?.components[0]?.borderTopColor;
      const borderTopStyle = row?.content?.components[0]?.borderTopStyle;

      const { width, height } = getWidthHeightStyle(
        row?.content?.components[0],
      );

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
                  display: 'table-cell',
                  lineHeight: 1,
                  backgroundColor: backgroundColor,
                  borderRadius: borderRadius,
                  borderBottomWidth: borderBottomWidth,
                  borderBottomColor: borderBottomColor,
                  borderBottomStyle: borderBottomStyle,
                  borderLeftWidth: borderLeftWidth,
                  borderLeftColor: borderLeftColor,
                  borderLeftStyle: borderLeftStyle,
                  borderRightWidth: borderRightWidth,
                  borderRightColor: borderRightColor,
                  borderRightStyle: borderRightStyle,
                  borderTopWidth: borderTopWidth,
                  borderTopColor: borderTopColor,
                  borderTopStyle: borderTopStyle,

                  verticalAlign: 'middle',
                  ...row.style,
                }}
              >
                <div
                  style={{
                    width: width,
                    height: height,
                    padding: padding,
                  }}
                >
                  {content}
                </div>
              </div>
            </div>

            {contentEdit.editPath !== currentPath &&
              contentEdit.columnPath === null && (
                <>
                  <div className="flex justify-end items-center gap-2 mb-2 mt-1 mr-1">
                    <Button
                      size="sm"
                      variant="blue"
                      disabled={isSavingOrder}
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
                        placement={isMobile ? 'left' : 'right'}
                        isDisabled={isSavingOrder}
                        isLoading={
                          isSavingOrder && savingOrderPath === currentPath
                        }
                      >
                        <div className="pt-2 pb-2 px-2 flex flex-col gap-1 whitespace-nowrap items-start">
                          <Button
                            variant="ghost"
                            disabled={isSavingOrder}
                            onClick={() => {
                              const nextIndex = index + 1;
                              const nextEditRowPath = path
                                ? `${path}[${nextIndex}]`
                                : `[${nextIndex}]`;

                              setContentEdit({
                                editPath: null,
                                addPath: path || '',
                                nextEditPath: nextEditRowPath,
                              });
                            }}
                          >
                            Add
                          </Button>
                          {totalRowsInColumn > 1 && (
                            <>
                              <Hr className="my-2" />
                              <Button
                                variant="ghost"
                                disabled={isSavingOrder}
                                onClick={() => {
                                  moveRowUp(
                                    currentPath,
                                    signatureId as string,
                                    userStatus,
                                    templateSlug,
                                  );
                                }}
                              >
                                Move up
                              </Button>
                              <Button
                                variant="ghost"
                                disabled={isSavingOrder}
                                onClick={() => {
                                  moveRowDown(
                                    currentPath,
                                    signatureId as string,
                                    userStatus,
                                    templateSlug,
                                  );
                                }}
                              >
                                Move down
                              </Button>
                            </>
                          )}
                          <Hr className="my-2" />
                          <Button
                            variant="ghost"
                            disabled={isSavingOrder}
                            onClick={() => {
                              setRowToDelete(currentPath);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </ContextMenu>
                    )}
                  </div>
                  <Hr className={`mb-2 ${hrColor} border-dotted`} />
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
      <div ref={containerRef}>
        {!contentEdit.editPath &&
          !contentEdit.addPath &&
          !contentEdit.columnPath &&
          rows.length < MAX_ROWS && (
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
                disabled={isSavingOrder}
              >
                Add
              </Button>
              <Hr className={`my-4 ${hrColor} border-dotted`} />
            </div>
          )}
        <>
          {!contentEdit.addPath &&
            !contentEdit.editPath &&
            !contentEdit.columnPath &&
            renderRows(rows, true, '')}
        </>
        {!contentEdit.editPath &&
          !contentEdit.addPath &&
          !contentEdit.columnPath &&
          rows.length < MAX_ROWS && (
            <div className="mt-5 mb-5">
              <Hr className={`my-4 ${hrColor} border-dotted`} />
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
                disabled={isSavingOrder}
              >
                Add
              </Button>
            </div>
          )}
      </div>

      {contentEdit.addPath && (
        <Modal
          isOpen={Boolean(contentEdit.addPath)}
          size="fullscreen"
          onClose={() => {
            setContentEdit({
              addPath: null,
            });
          }}
        >
          <Container isZeroPadding={true}>
            <ContentAdd path={contentEdit.addPath} />
          </Container>
        </Modal>
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

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRowToDelete(null);
        }}
        onConfirm={handleDeleteRow}
        title="Delete row"
        message="Are you sure you want to delete this row?"
        isLoading={isDeleting}
      />
    </>
  );
};
