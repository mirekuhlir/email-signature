import { Column, Row, Section } from "@react-email/components";
import { Fragment } from "react";

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  // donefinovat path a key
  // border a presentation

  const renderColumn = (column: any, path: string) => {
    // TODO - nebude jen text, rozeznávat type
    if (column.content?.text) {
      return (
        <td style={column.style} key={path}>
          {column.content?.text}
        </td>
      );
    }

    return (
      <td style={column.style} id={path}>
        <table key={path} width={"100%"}>
          <tbody>{column.rows && renderRows(column.rows, `${path}`)}</tbody>
        </table>
      </td>
    );
  };

  // pryč path

  const renderRows = (rows: any, basePath: string = "") => {
    return rows.map((row: any, index: number) => {
      const isFirstRow = !row.path.includes(".");

      if (isFirstRow) {
        return (
          <table key={`table${index}`} width={"100%"}>
            <tbody>
              <tr key={index} style={row.style}>
                {row.columns?.map((column: any, colIndex: number) => (
                  <Fragment key={colIndex}>
                    {renderColumn(column, row.path)}
                  </Fragment>
                ))}
              </tr>
            </tbody>
          </table>
        );
      }

      // TODO - nebude jen text, rozeznávat type
      if (row.content?.text) {
        return (
          <tr key={`row-${index}`} style={row.style}>
            <td key={row.path}>{row.content.text}</td>
          </tr>
        );
      }

      return (
        <tr key={`row-${index}`} style={row.style}>
          {row.columns?.map((column: any, colIndex: number) => (
            <Fragment key={colIndex}>{renderColumn(column, row.path)}</Fragment>
          ))}
        </tr>
      );
    });
  };

  return <>{renderRows(rows)}</>;
};
