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
import {
  MAX_COLORS,
  MAX_DIMENSION_VALUES,
} from "@/supabase/functions/_shared/const";
import { UserStatus } from "@/src/utils/userState";
import { saveTempSignature } from "../components/signature-detail/content-edit/utils";
import { generateRandomId } from "../utils/generateRandomId";

const supabase = createClient();

// Helper function to regenerate IDs in a duplicated row
const regenerateRowIds = (row: any): any => {
  const newRow = cloneDeep(row);

  // Regenerate row ID
  newRow.id = generateRandomId();

  // Regenerate component IDs if they exist
  if (newRow.content && newRow.content.components) {
    newRow.content.components = newRow.content.components.map((
      component: any,
    ) => ({
      ...component,
      id: generateRandomId(),
    }));
  }

  return newRow;
};

// Helper function to move rows with wrapping
const moveRowWithWrapping = async (
  path: string,
  signatureId: string,
  direction: "up" | "down",
  state: StoreState,
  set: (partial: Partial<StoreState>) => void,
  userStatus: UserStatus,
  templateSlug: string,
  tempSignatureCreatedAt?: string,
) => {
  const { addToast } = useToastStore.getState();
  const cloneRows = cloneDeep(state.rows);
  const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));
  const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);
  const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);

  const rows = cloneRows[tableIndex].columns[columnIndex].rows;
  const totalRows = rows.length;

  if (totalRows <= 1) {
    return; // No need to move if there's only one or no rows
  }

  let newIndex: number;
  let targetIndex: number;

  if (direction === "up") {
    // If at the beginning, wrap to the end
    if (rowIndex === 0) {
      newIndex = totalRows - 1;
      targetIndex = totalRows - 1;
    } else {
      newIndex = rowIndex - 1;
      targetIndex = rowIndex - 1;
    }
  } else {
    // If at the end, wrap to the beginning
    if (rowIndex === totalRows - 1) {
      newIndex = 0;
      targetIndex = 0;
    } else {
      newIndex = rowIndex + 1;
      targetIndex = rowIndex + 1;
    }
  }

  // Move the item
  const temp = rows[rowIndex];
  rows.splice(rowIndex, 1);
  rows.splice(newIndex, 0, temp);

  set({ rows: cloneRows });

  // Save changes to the database

  // Calculate the target path (where the item will be after moving)
  const targetPath = path.replace(
    /rows\[(\d+)\]/,
    `rows[${targetIndex}]`,
  );
  set({ isSavingOrder: true, savingOrderPath: targetPath });

  if (userStatus !== UserStatus.NOT_LOGGED_IN) {
    const { error } = await supabase.functions.invoke("patch-signature", {
      method: "PATCH",
      body: {
        signatureId,
        signatureContent: {
          rows: cloneRows,
          colors: state.colors,
          dimensions: state.dimensions,
        },
      },
    });

    if (error) {
      addToast({
        title: "Error",
        description: `Failed to move row ${direction}. Please try again.`,
        variant: "error",
      });
    }
  } else {
    saveTempSignature({
      templateSlug: templateSlug,
      updatedAt: new Date().toISOString(),
      createdAt: tempSignatureCreatedAt || "",
      rows: cloneRows,
      colors: state.colors,
      dimensions: state.dimensions,
    });
  }

  set({ isSavingOrder: false, savingOrderPath: null });
};

export interface StoreState {
  rows: any[];
  colors: string[];
  dimensions: {
    spaces: string[];
    corners: string[];
    borders: string[];
    lengths: string[];
  };
  isDarkMode: boolean;
  isSavingOrder: boolean;
  savingOrderPath: string | null;
  isMobilePreview: boolean;
  setIsMobilePreview: (value: boolean) => void;
  initSignature: (signature: {
    rows: any;
    colors?: string[];
    dimensions?: {
      spaces: string[];
      corners: string[];
      borders: string[];
      lengths: string[];
    };
  }) => void;
  addRow: (path: string, type: ContentType, insertIndex?: number) => void;
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
  addSpace: (space: string) => void;
  addCorner: (corner: string) => void;
  addBorder: (border: string) => void;
  addLength: (length: string) => void;
  moveRowUp: (
    path: string,
    signatureId: string,
    userStatus: UserStatus,
    templateSlug: string,
    tempSignatureCreatedAt?: string,
  ) => Promise<void>;
  moveRowDown: (
    path: string,
    signatureId: string,
    userStatus: UserStatus,
    templateSlug: string,
    tempSignatureCreatedAt?: string,
  ) => Promise<void>;
  duplicateRow: (
    path: string,
    signatureId: string,
    userStatus: UserStatus,
    templateSlug: string,
    tempSignatureCreatedAt?: string,
  ) => Promise<void>;
  toggleDarkMode: () => void;
}

export const useSignatureStore = create<StoreState>((set, get) => {
  return {
    rows: [],
    colors: [],
    dimensions: {
      spaces: [],
      corners: [],
      borders: [],
      lengths: [],
    },
    isDarkMode: false,
    isSavingOrder: false,
    savingOrderPath: null,
    isMobilePreview: false,
    setIsMobilePreview: (value: boolean) => set({ isMobilePreview: value }),
    initSignature: (signature: {
      rows: any;
      colors?: string[];
      dimensions?: {
        spaces: string[];
        corners: string[];
        borders: string[];
        lengths: string[];
      };
    }) => {
      const {
        rows,
        colors = [],
        dimensions = {
          spaces: [],
          corners: [],
          borders: [],
          lengths: [],
        },
      } = signature;
      set({
        rows,
        colors,
        dimensions: dimensions || {
          spaces: [],
          corners: [],
          borders: [],
          lengths: [],
        },
      });
    },

    addRow: (path: string, type: ContentType, insertIndex?: number) =>
      set((state) => {
        const cloneRows = cloneDeep(state.rows);
        const currentRowsInColumn = lGet(cloneRows, path, []);

        const newRowContent = getContentAdd(type);

        const applyToTypesMoreComponents = [
          ContentType.EMAIL,
          ContentType.PHONE,
          ContentType.WEBSITE,
          ContentType.TWO_PART_TEXT,
        ];

        const applyToTypes = [
          ContentType.TEXT,
          ...applyToTypesMoreComponents,
        ];

        if (
          applyToTypes.includes(type) &&
          currentRowsInColumn.length > 0
        ) {
          const previousRow = currentRowsInColumn[
            typeof insertIndex === "number"
              ? insertIndex - 1
              : currentRowsInColumn.length - 1
          ];
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
                const fontWeight = lGet(previousComponent, "fontWeight");
                const lineHeight = lGet(previousComponent, "lineHeight");
                const letterSpacing = lGet(previousComponent, "letterSpacing");
                const textDecoration = lGet(
                  previousComponent,
                  "textDecoration",
                );
                const textAlign = lGet(previousComponent, "textAlign");
                const padding = lGet(previousComponent, "padding");

                const fontFamilyPath = `content.components[${i}].fontFamily`;
                const colorPath = `content.components[${i}].color`;
                const fontSizePath = `content.components[${i}].fontSize`;
                const fontWeightPath = `content.components[${i}].fontWeight`;
                const lineHeightPath = `content.components[${i}].lineHeight`;
                const letterSpacingPath =
                  `content.components[${i}].letterSpacing`;
                const textDecorationPath =
                  `content.components[${i}].textDecoration`;
                const textAlignPath = `content.components[${i}].textAlign`;
                const paddingPath = `content.components[${i}].padding`;

                if (fontFamily) {
                  lSet(newRowContent, fontFamilyPath, fontFamily);
                }
                if (color) {
                  lSet(newRowContent, colorPath, color);
                }
                if (fontSize) {
                  lSet(newRowContent, fontSizePath, fontSize);
                }
                if (fontWeight) {
                  lSet(newRowContent, fontWeightPath, fontWeight);
                }
                if (lineHeight) {
                  lSet(newRowContent, lineHeightPath, lineHeight);
                }
                if (letterSpacing) {
                  lSet(newRowContent, letterSpacingPath, letterSpacing);
                }
                if (textDecoration) {
                  lSet(newRowContent, textDecorationPath, textDecoration);
                }
                if (textAlign) {
                  lSet(newRowContent, textAlignPath, textAlign);
                }
                if (padding) {
                  lSet(newRowContent, paddingPath, padding);
                }
              }
            }
          }
        }

        // Insert at specific index if provided, otherwise append to end
        let updatedRows;
        if (
          insertIndex !== undefined && insertIndex >= 0 &&
          insertIndex <= currentRowsInColumn.length
        ) {
          updatedRows = [
            ...currentRowsInColumn.slice(0, insertIndex),
            newRowContent,
            ...currentRowsInColumn.slice(insertIndex),
          ];
        } else {
          updatedRows = [...currentRowsInColumn, newRowContent];
        }

        lSet(cloneRows, path, updatedRows);

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
      const { colors, dimensions } = get();
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));

      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);

      // Remove just the specific row
      const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);
      const rows = cloneRows[tableIndex].columns[columnIndex].rows;
      cloneRows[tableIndex].columns[columnIndex].rows = rows.filter((
        _: any,
        index: number,
      ) => index !== rowIndex);

      if (isSignedIn) {
        const { error } = await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: {
              rows: cloneRows,
              colors,
              dimensions,
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

    moveRowUp: async (
      path: string,
      signatureId: string,
      userStatus: UserStatus,
      templateSlug: string,
      tempSignatureCreatedAt?: string,
    ) => {
      await moveRowWithWrapping(
        path,
        signatureId,
        "up",
        get(),
        set,
        userStatus,
        templateSlug,
        tempSignatureCreatedAt,
      );
    },

    moveRowDown: async (
      path: string,
      signatureId: string,
      userStatus: UserStatus,
      templateSlug: string,
      tempSignatureCreatedAt?: string,
    ) => {
      await moveRowWithWrapping(
        path,
        signatureId,
        "down",
        get(),
        set,
        userStatus,
        templateSlug,
        tempSignatureCreatedAt,
      );
    },

    duplicateRow: async (
      path: string,
      signatureId: string,
      userStatus: UserStatus,
      templateSlug: string,
      tempSignatureCreatedAt?: string,
    ) => {
      const { addToast } = useToastStore.getState();
      const state = get();
      const cloneRows = cloneDeep(state.rows);

      // Parse the path to get indices
      const tableIndex = parseInt(path.split(".")[0].replace(/[[\]]/g, ""));
      const columnIndex = parseInt(path.split("columns[")[1].split("]")[0]);
      const rowIndex = parseInt(path.split("rows[")[1].split("]")[0]);

      const rows = cloneRows[tableIndex].columns[columnIndex].rows;
      const rowToDuplicate = rows[rowIndex];

      if (!rowToDuplicate) {
        addToast({
          title: "Error",
          description: "Row to duplicate not found.",
          variant: "error",
        });
        return;
      }

      // Create a deep copy of the row to duplicate with new IDs
      const duplicatedRow = regenerateRowIds(rowToDuplicate);

      // Insert the duplicated row right after the original row
      const insertIndex = rowIndex + 1;
      rows.splice(insertIndex, 0, duplicatedRow);

      set({ rows: cloneRows });

      // Calculate the target path for the new duplicated row
      const targetPath = path.replace(
        /rows\[(\d+)\]/,
        `rows[${insertIndex}]`,
      );
      set({ isSavingOrder: true, savingOrderPath: targetPath });

      if (userStatus !== UserStatus.NOT_LOGGED_IN) {
        const { error } = await supabase.functions.invoke("patch-signature", {
          method: "PATCH",
          body: {
            signatureId,
            signatureContent: {
              rows: cloneRows,
              colors: state.colors,
              dimensions: state.dimensions,
            },
          },
        });

        if (error) {
          addToast({
            title: "Error",
            description: "Failed to duplicate row. Please try again.",
            variant: "error",
          });
        }
      } else {
        saveTempSignature({
          templateSlug: templateSlug,
          updatedAt: new Date().toISOString(),
          createdAt: tempSignatureCreatedAt || "",
          rows: cloneRows,
          colors: state.colors,
          dimensions: state.dimensions,
        });
      }

      set({ isSavingOrder: false, savingOrderPath: null });
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
        const newColors = [color, ...state.colors];
        if (newColors.length > MAX_COLORS) {
          return { colors: newColors.slice(-MAX_COLORS) };
        }
        return { colors: newColors };
      }),

    addSpace: (space: string) =>
      set((state) => {
        if (state.dimensions.spaces.includes(space)) return state;
        const newSpaces = [...state.dimensions.spaces, space];
        if (newSpaces.length > MAX_DIMENSION_VALUES) {
          return {
            dimensions: {
              ...state.dimensions,
              spaces: newSpaces.slice(-MAX_DIMENSION_VALUES),
            },
          };
        }
        return ({
          dimensions: {
            ...state.dimensions,
            spaces: newSpaces,
          },
        });
      }),

    addCorner: (corner: string) =>
      set((state) => {
        if (state.dimensions.corners.includes(corner)) return state;
        const newCorners = [...state.dimensions.corners, corner];
        if (newCorners.length > MAX_DIMENSION_VALUES) {
          return {
            dimensions: {
              ...state.dimensions,
              corners: newCorners.slice(-MAX_DIMENSION_VALUES),
            },
          };
        }
        return ({
          dimensions: {
            ...state.dimensions,
            corners: newCorners,
          },
        });
      }),

    addBorder: (border: string) =>
      set((state) => {
        if (state.dimensions.borders.includes(border)) return state;
        const newBorders = [...state.dimensions.borders, border];
        if (newBorders.length > MAX_DIMENSION_VALUES) {
          return {
            dimensions: {
              ...state.dimensions,
              borders: newBorders.slice(-MAX_DIMENSION_VALUES),
            },
          };
        }
        return ({
          dimensions: {
            ...state.dimensions,
            borders: newBorders,
          },
        });
      }),

    addLength: (length: string) =>
      set((state) => {
        if (state.dimensions.lengths.includes(length)) return state;
        const newLengths = [...state.dimensions.lengths, length];
        if (newLengths.length > MAX_DIMENSION_VALUES) {
          return {
            dimensions: {
              ...state.dimensions,
              lengths: newLengths.slice(-MAX_DIMENSION_VALUES),
            },
          };
        }
        return ({
          dimensions: {
            ...state.dimensions,
            lengths: newLengths,
          },
        });
      }),

    saveSignatureContentRow: async (
      signatureId: string,
      contentPathToEdit: string,
    ) => {
      const { rows, colors, dimensions, setContent } = get();

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
                  dimensions,
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
                dimensions,
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
