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
  LENGTH = 'length',
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
              <div className="flex flex-wrap gap-4">
                {dimensions.spaces
                  ?.slice()
                  .reverse()
                  .map((space, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      buttonClassName="min-w-20"
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
              <div className="flex flex-wrap gap-4">
                {dimensions.corners
                  ?.slice()
                  .reverse()
                  .map((corner, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      buttonClassName="min-w-20"
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
              <div className="flex flex-wrap gap-4">
                {dimensions.borders
                  .slice()
                  .reverse()
                  .map((border, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      buttonClassName="min-w-20"
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

        {editType === EEditType.LENGTH &&
          dimensions.lengths &&
          dimensions.lengths.length > 0 && (
            <>
              <Typography variant="labelBase">Select length</Typography>
              <div className="flex flex-wrap gap-4">
                {dimensions.lengths
                  .slice()
                  .reverse()
                  .map((length, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="md"
                      type="button"
                      buttonClassName="min-w-20"
                      onClick={() => {
                        const numValue = Number(length);
                        if (!isNaN(numValue)) {
                          onSetValue?.(numValue);
                        }
                      }}
                    >
                      {`${length} px`}
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

  const { addBorder, addCorner, addSpace, addLength } = useSignatureStore();

  const handleOnSubmit = useCallback(
    (value: number) => {
      if (editType === EEditType.SPACE) {
        addSpace(value.toString());
      } else if (editType === EEditType.CORNER) {
        addCorner(value.toString());
      } else if (editType === EEditType.BORDER) {
        addBorder(value.toString());
      } else if (editType === EEditType.LENGTH) {
        addLength(value.toString());
      }
    },
    [editType, addSpace, addCorner, addBorder, addLength],
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
