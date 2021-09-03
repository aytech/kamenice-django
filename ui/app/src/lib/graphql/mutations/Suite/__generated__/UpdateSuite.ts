/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SuiteInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSuite
// ====================================================

export interface UpdateSuite_updateSuite_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  priceBase: any;
  priceChild: any;
  priceExtra: any;
  priceInfant: any;
  title: string;
}

export interface UpdateSuite_updateSuite {
  __typename: "UpdateSuite";
  suite: UpdateSuite_updateSuite_suite | null;
}

export interface UpdateSuite {
  updateSuite: UpdateSuite_updateSuite | null;
}

export interface UpdateSuiteVariables {
  data: SuiteInput;
}
