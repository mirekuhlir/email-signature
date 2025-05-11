/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { getContentView } from './content-view';

const getWidthHeightStyle = (component: any) => {
  let width = 0;
  let height = 0;
  if (component) {
    width =
      typeof component.width === 'number'
        ? component.width
        : parseInt((component.width || '0').toString().replace('px', ''), 10) ||
          0;
    height =
      typeof component.height === 'number'
        ? component.height
        : parseInt(
            (component.height || '0').toString().replace('px', ''),
            10,
          ) || 0;
  }
  return {
    width: width === 0 ? '100%' : `${width}px`,
    height: height === 0 ? 0 : `${height}px`,
  };
};

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    return (
      <td style={column.style}>
        <table
          key={column.id}
          border={0}
          cellPadding="0"
          cellSpacing="0"
          role="presentation"
          width="100%"
          style={{ borderCollapse: 'separate' }}
        >
          <tbody>{column.rows && renderRows(column.rows)}</tbody>
        </table>
      </td>
    );
  };

  const renderRows = (rows: any, isFirstRow?: boolean) => {
    return rows?.map((row: any) => {
      if (!row?.id) {
        return null;
      }

      if (isFirstRow) {
        return (
          <table
            key={`table-${row.id}`}
            border={0}
            cellPadding="0"
            cellSpacing="0"
            role="presentation"
            style={{ borderCollapse: 'separate' }}
          >
            <tbody>
              <tr key={`tr-${row.id}`} style={row.style}>
                {row.columns?.map((column: any) => (
                  <Fragment key={column.id}>{renderColumn(column)}</Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }

      const content = getContentView(row?.content);
      const padding = row.content.components[0].padding;
      const backgroundColor = row.content.components[0].backgroundColor;
      const borderRadius = row.content.components[0].borderRadius;

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
          <tr key={`tr-${row.id}`}>
            <td
              style={{
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                padding: padding,
                lineHeight: 1,
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
                width: width,
                height: height,
                ...row.style,
              }}
            >
              {content}
            </td>
          </tr>
        );
      }

      return (
        <tr key={`tr-${row.id}`} style={row?.style}>
          {row.columns?.map((column: any) => (
            <Fragment key={`td-${column?.id}`}>{renderColumn(column)}</Fragment>
          ))}
        </tr>
      );
    });
  };

  return (
    <table border={0} cellPadding="0" cellSpacing="0" role="presentation">
      <tbody>
        <tr>
          <td>{renderRows(rows, true)}</td>
        </tr>
      </tbody>
    </table>
  );
};
