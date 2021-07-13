/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteSuite
// ====================================================

export interface DeleteSuite_deleteSuite_suite {
  __typename: "Suite";
  id: string;
}

export interface DeleteSuite_deleteSuite {
  __typename: "DeleteSuite";
  suite: DeleteSuite_deleteSuite_suite | null;
}

export interface DeleteSuite {
  deleteSuite: DeleteSuite_deleteSuite | null;
}

export interface DeleteSuiteVariables {
  suiteId: string;
}
