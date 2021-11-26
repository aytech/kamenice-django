/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GenerateStatement
// ====================================================

export interface GenerateStatement_guestsReport {
  __typename: "Report";
  message: string | null;
  status: boolean | null;
}

export interface GenerateStatement {
  guestsReport: GenerateStatement_guestsReport | null;
}

export interface GenerateStatementVariables {
  fromDate: string;
  toDate: string;
}
