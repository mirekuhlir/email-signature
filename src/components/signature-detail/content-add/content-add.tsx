import { useEffect, useRef } from 'react';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { useContentEditStore } from '@/src/store/content-edit-add-path-store';
import { Button } from '@/src/components/ui/button';
import { Typography } from '../../ui/typography';
import { CONTENT_TYPES } from './const';
import { ContentType } from '@/src/const/content';
import { TableRow, Column, Row } from '@/src/types/signature';
import { useState } from 'react';
import { MAX_IMAGES } from '@/supabase/functions/_shared/const';
import { Hr } from '../../ui/hr';

const countOriginalSrc = (tableRows: TableRow[]): number => {
  let count = 0;
  tableRows.forEach((tableRow: TableRow) => {
    tableRow.columns.forEach((column: Column) => {
      column.rows.forEach((row: Row) => {
        if (row.content?.type === ContentType.IMAGE) {
          count++;
        }
      });
    });
  });
  // each image has originalSrc and cropImagePreview
  return count * 2;
};

interface ContentAddProps {
  path: string;
  onClose: () => void;
}

export const ContentAdd = (props: ContentAddProps) => {
  const { path, onClose } = props;

  const { addRow, addRowTable, rows } = useSignatureStore();
  const { contentEdit, setContentEdit } = useContentEditStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [totalOriginalSrc, setTotalOriginalSrc] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (rows.length > 0) {
      const totalOriginalSrc = countOriginalSrc(rows);
      setTotalOriginalSrc(totalOriginalSrc);
    }
  }, [rows]);

  const onAdd = (type: ContentType) => {
    if (contentEdit.addPath === 'table-root' && contentEdit.position) {
      addRowTable(contentEdit.position, type);
      setContentEdit({
        editPath: contentEdit.nextEditPath,
        addPath: null,
      });
      return;
    }

    // Extract insert index from nextEditPath if available
    let insertIndex: number | undefined;
    if (contentEdit.nextEditPath) {
      // Extract the last index from the path (e.g., "[1]" -> 1, or "rows[2]" -> 2)
      const matches = contentEdit.nextEditPath.match(/\[(\d+)\](?!.*\[)/);
      if (matches && matches[1]) {
        insertIndex = parseInt(matches[1], 10);
      }
    }

    addRow(path, type, insertIndex);
    setContentEdit({
      editPath: contentEdit.nextEditPath,
      addPath: null,
    });
  };

  return (
    <div className="pt-1 sm:max-w-1/2 mx-auto">
      {CONTENT_TYPES.map((typeItem, index) => {
        if (
          typeItem.type === ContentType.IMAGE &&
          totalOriginalSrc >= MAX_IMAGES
        ) {
          return null;
        }

        return (
          <div key={index}>
            <div className="flex flex-col mt-4">
              <Typography variant="large">{typeItem.name}</Typography>
              <Typography variant="body">{typeItem.description}</Typography>
            </div>

            <div className="flex justify-end mt-4 mb-4">
              <Button onClick={() => onAdd(typeItem.type)}>{'Add'}</Button>
            </div>
            <Hr />
          </div>
        );
      })}
      <div className="flex justify-end mb-6 mt-6" ref={wrapperRef}>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
