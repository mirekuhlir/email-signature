/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ContentType } from "@/src/const/content";
import { cloneDeep, get as lGet, set as lSet } from "lodash";
import {
  getContentAdd,
  getRowTable,
} from "@/src/components/signature-detail/content-add/utils";
import { createClient } from "../utils/supabase/client";
import { base64ToFile } from "../utils/base64ToFile";

const supabase = createClient();

export interface StoreState {
  rows: any[];
  initRows: (rows: any) => void;
  addRow: (path: string, type: ContentType) => void;
  addRowTable: (position: "start" | "end", type: ContentType) => void;
  removeRow: (path: string, onRemoveRow?: (rows: any) => void) => void;
  setContent: (path: string, content: any) => void;
  saveSignatureContentRow: (
    signatureId: string,
    contentPathToEdit: string,
  ) => Promise<void>;
}

// barvy - rgba nebo hex?

export const useSignatureStore = create<StoreState>((set, get) => ({
  rows: [],
  initRows: (rows: any) => {
    set({ rows });
  },

  addRow: (path: string, type: ContentType) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);

      lSet(cloneRows, path, [
        ...lGet(cloneRows, path),
        getContentAdd(type),
      ]);

      return { rows: cloneRows };
    }),

  addRowTable: (position: "start" | "end" = "end", type: ContentType) =>
    set((state) => {
      let clonesRows = cloneDeep(state.rows);

      if (position === "start") {
        clonesRows = [
          getRowTable(type),
          ...clonesRows,
        ];

        return { rows: clonesRows };
      }

      clonesRows = [
        ...clonesRows,
        getRowTable(type),
      ];

      return { rows: clonesRows };
    }),

  removeRow: (path: string, onRemoveRow?: (rows: any) => void) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));

      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);

      const columnsLength = cloneRows[tableIndex].columns.length;
      const rowsLength = cloneRows[tableIndex].columns[columnIndex].rows.length;

      if (columnsLength === 1 && rowsLength === 1) {
        // Remove entire table object
        cloneRows.splice(tableIndex, 1);
      } else {
        // Remove just the specific row
        const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);
        const rows = cloneRows[tableIndex].columns[columnIndex].rows;
        cloneRows[tableIndex].columns[columnIndex].rows = rows.filter((
          _: any,
          index: number,
        ) => index !== rowIndex);
      }

      onRemoveRow?.(cloneRows);

      return { rows: cloneRows };
    }),

  setContent: (path: string, content: any) =>
    set((state) => {
      const cloneRows = cloneDeep(state.rows);
      const currentContent = lGet(cloneRows, path);

      if (content instanceof File) {
        lSet(cloneRows, path, content);
        return { rows: cloneRows };
      } else if (typeof content === "string") {
        lSet(cloneRows, path, content);
      } else if (typeof content === "object") {
        lSet(cloneRows, path, {
          ...currentContent,
          ...content,
        });
      } else {
        lSet(cloneRows, path, content);
      }
      return { rows: cloneRows };
    }),

  saveSignatureContentRow: async (
    signatureId: string,
    contentPathToEdit: string,
  ) => {
    const { rows, setContent } = get();

    const path = `${contentPathToEdit}.content`;
    const content = lGet(rows, path);

    // TODO -  je to tady potřeba?
    /*     if (
      content.type == ContentType.IMAGE &&
      !content.components[0].cropImagePreview
    ) {
      return;
    } */

    if (
      content.type == ContentType.IMAGE &&
      content.components[0].cropImagePreview
    ) {
      const cropImagePreviewBase64 = content.components[0].cropImagePreview;

      const componentId = content.components[0].id;

      const time = new Date().getTime();
      const imagePreviewFile = base64ToFile(
        cropImagePreviewBase64,
        `${time}-${componentId}.png`,
      );

      const formData = new FormData();
      formData.append("imagePreviewFile", imagePreviewFile);
      formData.append("signatureId", signatureId);

      if (!content.components[0].originalSrc) {
        const originalImageFile = content.components[0].originalImageFile;
        formData.append("originalImageFile", originalImageFile);
      }

      const { data: imageData } = await supabase.functions.invoke(
        "post-image",
        {
          method: "POST",
          body: formData,
        },
      );

      if (imageData?.imagePreviewPublicUrl) {
        const deepCopyRows = cloneDeep(rows);

        // remove all unnecessary data because we wont to save them into database
        const pathToImageSrc = `${contentPathToEdit}.content.components[0].src`;
        lSet(deepCopyRows, pathToImageSrc, imageData.imagePreviewPublicUrl);
        setContent(pathToImageSrc, imageData.imagePreviewPublicUrl);

        const pathOriginalImagePreview =
          `${contentPathToEdit}.content.components[0].originalImagePreview`;
        lSet(deepCopyRows, pathOriginalImagePreview, undefined);
        setContent(pathOriginalImagePreview, undefined);

        const pathToCropImagePreview =
          `${contentPathToEdit}.content.components[0].cropImagePreview`;
        lSet(deepCopyRows, pathToCropImagePreview, undefined);
        setContent(pathToCropImagePreview, undefined);

        if (imageData?.originalImagePublicUrl) {
          const pathToImageOriginalSrc =
            `${contentPathToEdit}.content.components[0].originalSrc`;

          lSet(
            deepCopyRows,
            pathToImageOriginalSrc,
            imageData.originalImagePublicUrl,
          );
          setContent(pathToImageOriginalSrc, imageData.originalImagePublicUrl);

          const pathToOriginalImageFile =
            `${contentPathToEdit}.content.components[0].originalImageFile`;
          setContent(pathToOriginalImageFile, undefined);
          lSet(deepCopyRows, pathToOriginalImageFile, undefined);
        }

        await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: { rows: deepCopyRows },
          },
        });
      }

      return;
    } else {
      await supabase.functions.invoke("patch-signature", {
        method: "PATCH",
        body: {
          signatureId,
          signatureContent: { rows },
        },
      });
    }
  },
}));
