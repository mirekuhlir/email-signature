import { Button } from './button';
import { Hr } from './hr';
import Slider, { SliderProps } from './slider';
import { Typography } from './typography';
import { useSignatureStore } from '@/src/store/content-edit-add-store';
import { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

export enum EEditType {
  SPACE = 'space',
  CORNER = 'corner',
  BORDER = 'border',
}

interface SliderDimensionsProps extends SliderProps {
  editType: EEditType;
}

interface ModalContentProps {
  editType?: EEditType;
  onSetValue?: (value: number) => void;
}

const ModalContent = ({ editType, onSetValue }: ModalContentProps) => {
  const { dimensions } = useSignatureStore();

  return (
    <>
      <div>
        {editType === EEditType.SPACE &&
          dimensions.spaces &&
          dimensions.spaces.length > 0 && (
            <>
              <Typography variant="labelBase">Select space</Typography>
              <div className="flex flex-wrap gap-2">
                {dimensions.spaces
                  ?.slice()
                  .reverse()
                  .map((space, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      onClick={() => {
                        const numValue = Number(space);
                        if (!isNaN(numValue)) {
                          onSetValue?.(numValue);
                        }
                      }}
                    >
                      {`${space} px`}
                    </Button>
                  ))}
              </div>
            </>
          )}

        {editType === EEditType.CORNER &&
          dimensions.corners &&
          dimensions.corners.length > 0 && (
            <>
              <Typography variant="labelBase">Select corner</Typography>
              <div className="flex flex-wrap gap-2">
                {dimensions.corners
                  ?.slice()
                  .reverse()
                  .map((corner, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      onClick={() => {
                        const numValue = Number(corner);
                        if (!isNaN(numValue)) {
                          onSetValue?.(numValue);
                        }
                      }}
                    >
                      {`${corner} px`}
                    </Button>
                  ))}
              </div>
            </>
          )}

        {editType === EEditType.BORDER &&
          dimensions.borders &&
          dimensions.borders.length > 0 && (
            <>
              <Typography variant="labelBase">Select border</Typography>
              <div className="flex flex-wrap gap-2">
                {dimensions.borders
                  .slice()
                  .reverse()
                  .map((border, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      onClick={() => {
                        const numValue = Number(border);
                        if (!isNaN(numValue)) {
                          onSetValue?.(numValue);
                        }
                      }}
                    >
                      {`${border} px`}
                    </Button>
                  ))}
              </div>
            </>
          )}
      </div>
      <Hr />
    </>
  );
};

export const SliderDimensions = (props: SliderDimensionsProps) => {
  const { editType, ...sliderProps } = props;

  const { addBorder, addCorner, addSpace } = useSignatureStore();

  const handleOnSubmit = useCallback(
    (value: number) => {
      if (editType === EEditType.SPACE) {
        addSpace(value.toString());
      } else if (editType === EEditType.CORNER) {
        addCorner(value.toString());
      } else if (editType === EEditType.BORDER) {
        addBorder(value.toString());
      }
    },
    [editType, addSpace, addCorner, addBorder],
  );

  const onSubmitDebounce = useMemo(
    () =>
      debounce((value: number) => {
        handleOnSubmit(value);
      }, 350),
    [handleOnSubmit],
  );

  const modalContent = <ModalContent editType={editType} />;

  return (
    <Slider
      {...sliderProps}
      modalContent={modalContent}
      onSubmit={onSubmitDebounce}
    />
  );
};
