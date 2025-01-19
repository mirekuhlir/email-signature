import { Column, Row, Section } from "@react-email/components";
import { Fragment } from "react";

export const EmailTemplateView = (props: any) => {
  const { rows } = props;

  const renderColumn = (column: any, path: string) => {
    return (
      <Column style={column.style} id={path}>
        {column.content?.text}
        {column.rows && renderRows(column.rows, `${path}`)}
      </Column>
    );
  };

  const renderRows = (rows: any, basePath: string = "") => {
    return rows.map((row: any, index: number) => {
      const currentPath = basePath ? `${basePath}.${index}` : `${index}`;
      return (
        <Row key={index} style={row.style}>
          {row.columns.map((column: any, colIndex: number) => (
            <Fragment key={colIndex}>
              {renderColumn(column, `${currentPath}.${colIndex}`)}
            </Fragment>
          ))}
        </Row>
      );
    });
  };

  return <Section>{renderRows(rows)}</Section>;
};
