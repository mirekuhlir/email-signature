/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import { getContentView } from './content-view';
import { getWidthHeightStyle } from './utils';
export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any) => {
    return (
      <td
        style={{
          backgroundColor: column.style?.backgroundColor,
          padding: column.style?.padding,
          verticalAlign: column.style?.verticalAlign,
          width: column.style?.width,
          height: column.style?.height,
          borderTopWidth: column.style?.borderTopWidth,
          borderTopColor: column.style?.borderTopColor,
          borderTopStyle: column.style?.borderTopStyle,
          borderRightWidth: column.style?.borderRightWidth,
          borderRightColor: column.style?.borderRightColor,
          borderRightStyle: column.style?.borderRightStyle,
          borderBottomWidth: column.style?.borderBottomWidth,
          borderBottomColor: column.style?.borderBottomColor,
          borderBottomStyle: column.style?.borderBottomStyle,
          borderLeftWidth: column.style?.borderLeftWidth,
          borderLeftColor: column.style?.borderLeftColor,
          borderLeftStyle: column.style?.borderLeftStyle,
          borderRadius: column.style?.borderRadius,
        }}
      >
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
                padding: padding,
                backgroundColor: backgroundColor,
                borderRadius: borderRadius,
                lineHeight: 0,
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
              }}
            >
              <table
                border={0}
                cellPadding="0"
                cellSpacing="0"
                role="presentation"
                style={{
                  width: width,
                  height: height,
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        width: width,
                        height: height,
                        padding: '0',
                        margin: '0',
                        border: 'none',
                        verticalAlign: 'top',
                      }}
                    >
                      {content}
                    </td>
                  </tr>
                </tbody>
              </table>
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
