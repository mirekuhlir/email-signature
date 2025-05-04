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

    addRow(path, type);
    setContentEdit({
      editPath: contentEdit.nextEditPath,
      addPath: null,
    });
  };

  useEffect(() => {
    wrapperRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-6 sm:max-w-1/2 mx-auto">
      {CONTENT_TYPES.map((typeItem, index) => {
        if (
          typeItem.type === ContentType.IMAGE &&
          totalOriginalSrc >= MAX_IMAGES
        ) {
          return null;
        }

        return (
          <div
            key={index}
            className="flex gap-4 mb-4 border-b border-gray-300 items-end pb-4 justify-between "
          >
            <Typography variant="large">{typeItem.content}</Typography>
            <Button
              onClick={() => onAdd(typeItem.type)}
            >{`Add ${typeItem.name}`}</Button>
          </div>
        );
      })}
      <div className="flex justify-end mb-6" ref={wrapperRef}>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
