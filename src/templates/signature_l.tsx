import { generateRandomId } from '../utils/generateRandomId';
import { content } from './constants';

const getLocalizedContent = () => {
  return {
    [content.name]: 'Sophia Gulian ',
    [content.title]: ' | Veterinarian',
  };
};

export const signature_l = () => {
  const localizedContent = getLocalizedContent();
  return {
    info: {
      templateSlug: 'signature-l',
      version: '0.1',
      name: 'Signature L',
    },
    colors: ['rgb(191, 90, 8)', 'rgb(0, 0, 0)'],
    dimensions: {
      spaces: [],
      borders: [],
      corners: ['10'],
      lengths: [],
    },
    rows: [
      {
        id: generateRandomId(),
        columns: [
          {
            id: generateRandomId(),
            rows: [
              {
                id: generateRandomId(),
                content: {
                  type: 'image',
                  components: [
                    {
                      id: generateRandomId(),
                      src: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_l_preview.png`,
                      width: '0px',
                      height: '0px',
                      margin: '0 auto 0 0',
                      padding: '0px 0px 0px 0px',
                      originalSrc: `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/examples/signature_l_original.jpg`,
                      borderRadius: '0px 0px 0px 0px',
                      imageSettings: {
                        crop: {
                          x: 32.90503120422363,
                          y: 0,
                          unit: '%',
                          width: 57.3119239807129,
                          height: 85.96998484765254,
                        },
                        aspect: 1,
                        isCircular: false,
                        borderRadius: {
                          topLeft: 10,
                          topRight: 10,
                          bottomLeft: 10,
                          bottomRight: 10,
                        },
                      },
                      borderTopColor: 'rgb(0, 0, 0)',
                      borderTopStyle: 'none',
                      borderTopWidth: '0px',
                      borderLeftColor: 'rgb(0, 0, 0)',
                      borderLeftStyle: 'none',
                      borderLeftWidth: '0px',
                      borderRightColor: 'rgb(0, 0, 0)',
                      borderRightStyle: 'none',
                      borderRightWidth: '0px',
                      borderBottomColor: 'rgb(0, 0, 0)',
                      borderBottomStyle: 'none',
                      borderBottomWidth: '0px',
                    },
                  ],
                },
              },
              {
                id: generateRandomId(),
                content: {
                  type: 'twoPartText',
                  components: [
                    {
                      id: generateRandomId(),
                      text: localizedContent[content.name],
                      type: 'twoPartText',
                      color: 'rgb(191, 90, 8)',
                      width: '0px',
                      height: '0px',
                      padding: '16px 0px 5px 0px',
                      fontSize: '19px',
                      fontStyle: 'normal',
                      textAlign: 'left',
                      fontFamily: 'Arial',
                      fontWeight: 'normal',
                      lineHeight: '1',
                      whiteSpace: 'nowrap',
                      borderRadius: '0px 0px 0px 0px',
                      letterSpacing: '0px',
                      borderTopColor: 'rgb(0, 0, 0)',
                      borderTopStyle: 'none',
                      borderTopWidth: '0px',
                      textDecoration: 'none',
                      borderLeftColor: 'rgb(0, 0, 0)',
                      borderLeftStyle: 'none',
                      borderLeftWidth: '0px',
                      borderRightColor: 'rgb(0, 0, 0)',
                      borderRightStyle: 'none',
                      borderRightWidth: '0px',
                      borderBottomColor: 'rgb(0, 0, 0)',
                      borderBottomStyle: 'none',
                      borderBottomWidth: '0px',
                    },
                    {
                      id: generateRandomId(),
                      text: localizedContent[content.title],
                      type: 'twoPartText',
                      color: 'rgb(0, 0, 0)',
                      fontSize: '20px',
                      fontStyle: 'normal',
                      textAlign: 'left',
                      fontFamily: 'Arial',
                      fontWeight: 'normal',
                      lineHeight: '1',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0px',
                      textDecoration: 'none',
                    },
                  ],
                },
              },
            ],
            style: {
              verticalAlign: 'middle',
            },
          },
        ],
      },
    ],
  };
};
