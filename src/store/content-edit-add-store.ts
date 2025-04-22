/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { ContentType } from "@/src/const/content";

import { cloneDeep, get as lGet, set as lSet, unset as lUnset } from "lodash";
import {
  getContentAdd,
  getRowTable,
} from "@/src/components/signature-detail/content-add/utils";
import { createClient } from "../utils/supabase/client";
import { base64ToFile } from "../utils/base64ToFile";
import { useToastStore } from "../components/ui/toast";
import { MAX_COLORS } from "@/supabase/functions/_shared/const";

const supabase = createClient();

export interface StoreState {
  rows: any[];
  colors: string[];
  isDarkMode: boolean;
  isSavingOrder: boolean;
  initSignature: (signature: {
    rows: any;
    colors?: string[];
  }) => void;
  addRow: (path: string, type: ContentType) => void;
  addRowTable: (position: "start" | "end", type: ContentType) => void;
  deleteRow: (
    path: string,
    signatureId: string,
    isSignedIn: boolean,
  ) => Promise<void>;
  setContent: (path: string, content: any) => void;
  saveSignatureContentRow: (
    signatureId: string,
    contentPathToEdit: string,
  ) => Promise<void>;
  addColor: (color: string) => void;
  getColors: () => string[];
  moveRowUp: (path: string, signatureId: string) => Promise<void>;
  moveRowDown: (path: string, signatureId: string) => Promise<void>;
  toggleDarkMode: () => void;
}

export const useSignatureStore = create<StoreState>((set, get) => {
  return {
    rows: [],
    colors: [],
    isDarkMode: false,
    isSavingOrder: false,
    initSignature: (signature: {
      rows: any;
      colors?: string[];
    }) => {
      const {
        rows,
        colors = [],
      } = signature;
      set({ rows, colors });
    },

    addRow: (path: string, type: ContentType) =>
      set((state) => {
        const cloneRows = cloneDeep(state.rows);
        const currentRowsInColumn = lGet(cloneRows, path, []);

        const newRowContent = getContentAdd(type);

        const applyToTypesMoreComponents = [
          ContentType.EMAIL,
          ContentType.PHONE,
          ContentType.WEBSITE,
          ContentType.CUSTOM_VALUE,
        ];

        const applyToTypes = [
          ContentType.TEXT,
          ...applyToTypesMoreComponents,
        ];

        if (
          applyToTypes.includes(type) &&
          currentRowsInColumn.length > 0
        ) {
          const previousRow =
            currentRowsInColumn[currentRowsInColumn.length - 1];
          const previousContentType = lGet(previousRow, "content.type");

          if (applyToTypes.includes(previousContentType)) {
            const previousComponents = lGet(
              previousRow,
              "content.components",
              [],
            );
            const newComponents = lGet(newRowContent, "content.components", []);
            const maxComponents = Math.min(
              previousComponents.length,
              newComponents?.length ?? 0,
            );

            for (let i = 0; i < maxComponents; i++) {
              const previousComponent = previousComponents[i];
              if (previousComponent && typeof previousComponent === "object") {
                const fontFamily = lGet(previousComponent, "fontFamily");
                const color = lGet(previousComponent, "color");
                const fontSize = lGet(previousComponent, "fontSize");

                const fontFamilyPath = `content.components[${i}].fontFamily`;
                const colorPath = `content.components[${i}].color`;
                const fontSizePath = `content.components[${i}].fontSize`;

                if (fontFamily) {
                  lSet(newRowContent, fontFamilyPath, fontFamily);
                }
                if (color) {
                  lSet(newRowContent, colorPath, color);
                }
                if (fontSize) {
                  lSet(newRowContent, fontSizePath, fontSize);
                }
              }
            }
          }
        }

        lSet(cloneRows, path, [...currentRowsInColumn, newRowContent]);

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

    deleteRow: async (
      path: string,
      signatureId: string,
      isSignedIn: boolean,
    ) => {
      const { addToast } = useToastStore.getState();
      const cloneRows = cloneDeep(get().rows);
      const { colors } = get();
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
      if (isSignedIn) {
        const { error } = await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: {
              rows: cloneRows,
              colors,
            },
          },
        });

        if (error) {
          addToast({
            title: "Error",
            description: "Failed to delete row. Please try again.",
            variant: "error",
          });
        }
      }

      set({ rows: cloneRows });
    },

    moveRowUp: async (path: string, signatureId: string) => {
      const { addToast } = useToastStore.getState();
      const state = get();
      const cloneRows = cloneDeep(state.rows);
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));
      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);
      const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);

      if (rowIndex === 0) {
        return;
      }

      const rows = cloneRows[tableIndex].columns[columnIndex].rows;
      const temp = rows[rowIndex];
      rows[rowIndex] = rows[rowIndex - 1];
      rows[rowIndex - 1] = temp;

      set({ rows: cloneRows });

      // Save changes to the database

      if (signatureId) {
        set({ isSavingOrder: true }); // Set loading true

        const { error } = await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: {
              rows: cloneRows,
              colors: state.colors,
            },
          },
        });
        if (error) {
          addToast({
            title: "Error",
            description: "Failed to move row up. Please try again.",
            variant: "error",
          });
        }

        set({ isSavingOrder: false });
      }
    },

    moveRowDown: async (path: string, signatureId: string) => {
      const { addToast } = useToastStore.getState();
      const state = get();
      const cloneRows = cloneDeep(state.rows);
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));
      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);
      const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);

      const rows = cloneRows[tableIndex].columns[columnIndex].rows;
      if (rowIndex === rows.length - 1) {
        return;
      }

      const temp = rows[rowIndex];
      rows[rowIndex] = rows[rowIndex + 1];
      rows[rowIndex + 1] = temp;

      set({ rows: cloneRows });

      // Save changes to the database
      if (signatureId) {
        set({ isSavingOrder: true });

        const { error } = await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: {
              rows: cloneRows,
              colors: state.colors,
            },
          },
        });

        if (error) {
          addToast({
            title: "Error",
            description: "Failed to move row down. Please try again.",
            variant: "error",
          });
        }

        set({ isSavingOrder: false });
      }
    },

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
          // remove color properties if they are transparent or undefined
          const cleanedContent = cloneDeep(content);
          const colorProperties = [
            "backgroundColor",
            "textColor",
            "color",
            "borderColor",
            "leftBorderColor",
            "rightBorderColor",
            "topBorderColor",
            "bottomBorderColor",
          ];

          for (const prop of colorProperties) {
            if (
              cleanedContent[prop] === "transparent" ||
              cleanedContent[prop] === undefined
            ) {
              lUnset(cleanedContent, prop);

              if (currentContent && currentContent[prop]) {
                lUnset(cloneRows, `${path}.${prop}`);
              }
            }
          }

          lSet(cloneRows, path, {
            ...currentContent,
            ...cleanedContent,
          });
        } else {
          lSet(cloneRows, path, content);
        }
        return { rows: cloneRows };
      }),

    addColor: (color: string) =>
      set((state) => {
        if (!color || color === "transparent") return state;
        if (state.colors.includes(color)) return state;
        const newColors = [...state.colors, color];
        if (newColors.length > MAX_COLORS) {
          return { colors: newColors.slice(-MAX_COLORS) };
        }
        return { colors: newColors };
      }),

    getColors: () => get().colors,

    saveSignatureContentRow: async (
      signatureId: string,
      contentPathToEdit: string,
    ) => {
      const { rows, colors, setContent } = get();

      const content = lGet(rows, contentPathToEdit);

      // Save image content
      if (
        content.type == ContentType.IMAGE &&
        content.components[0].cropImagePreview
      ) {
        const cropImagePreviewBase64 = content.components[0].cropImagePreview;
        const componentId = content.components[0].id;

        const imagePreviewFile = base64ToFile(
          cropImagePreviewBase64,
          `${componentId}.png`,
        );

        const formData = new FormData();
        formData.append("imagePreviewFile", imagePreviewFile);
        formData.append("signatureId", signatureId);

        if (!content.components[0].originalSrc) {
          const originalImageFile = content.components[0].originalImageFile;
          formData.append("originalImageFile", originalImageFile);
        }

        const { data: imageData, error: imageError } = await supabase.functions
          .invoke(
            "post-image",
            {
              method: "POST",
              body: formData,
            },
          );

        if (imageError) {
          throw imageError;
        }

        if (imageData?.imagePreviewPublicUrl) {
          const deepCopyRows = cloneDeep(rows);

          const componentPath = `${contentPathToEdit}.components[0]`;

          // remove all unnecessary data because we wont to save them into database
          const pathToImageSrc = `${componentPath}.src`;
          lSet(deepCopyRows, pathToImageSrc, imageData.imagePreviewPublicUrl);
          setContent(pathToImageSrc, imageData.imagePreviewPublicUrl);

          const pathToCropImagePreview = `${componentPath}.cropImagePreview`;
          lSet(deepCopyRows, pathToCropImagePreview, undefined);
          setContent(pathToCropImagePreview, undefined);

          if (imageData?.originalImagePublicUrl) {
            const pathToImageOriginalSrc = `${componentPath}.originalSrc`;

            lSet(
              deepCopyRows,
              pathToImageOriginalSrc,
              imageData.originalImagePublicUrl,
            );
            setContent(
              pathToImageOriginalSrc,
              imageData.originalImagePublicUrl,
            );

            const pathToOriginalImageFile =
              `${componentPath}.originalImageFile`;
            setContent(pathToOriginalImageFile, undefined);
            lSet(deepCopyRows, pathToOriginalImageFile, undefined);
          }

          const { error: patchError } = await supabase.functions.invoke(
            "patch-signature",
            {
              method: "PATCH",
              body: {
                signatureId,
                signatureContent: {
                  rows: deepCopyRows,
                  colors,
                },
              },
            },
          );

          if (patchError) {
            throw patchError;
          }
        }
      } else {
        const { error: patchError } = await supabase.functions.invoke(
          "patch-signature",
          {
            method: "PATCH",
            body: {
              signatureId,
              signatureContent: {
                rows,
                colors,
              },
            },
          },
        );

        if (patchError) {
          throw patchError;
        }
      }
    },

    toggleDarkMode: () =>
      set((state) => ({
        isDarkMode: !state.isDarkMode,
      })),
  };
});
