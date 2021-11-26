/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Statements
// ====================================================

export interface Statements_guestsReportFiles {
  __typename: "DriveFile";
  created: any;
  driveId: string;
  id: string;
  name: string;
  pathDocx: string | null;
  pathPdf: string | null;
}

export interface Statements {
  guestsReportFiles: (Statements_guestsReportFiles | null)[] | null;
}
