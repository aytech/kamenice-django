/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteStatement
// ====================================================

export interface DeleteStatement_deleteDriveFile_file {
  __typename: "RemovedDriveFile";
  name: string | null;
}

export interface DeleteStatement_deleteDriveFile {
  __typename: "DeleteDriveFile";
  file: DeleteStatement_deleteDriveFile_file | null;
}

export interface DeleteStatement {
  deleteDriveFile: DeleteStatement_deleteDriveFile | null;
}

export interface DeleteStatementVariables {
  fileId: string;
}
