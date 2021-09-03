/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SuiteInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSuite
// ====================================================

export interface CreateSuite_createSuite_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  priceBase: any;
  priceChild: any;
  priceExtra: any;
  priceInfant: any;
  title: string;
}

export interface CreateSuite_createSuite {
  __typename: "CreateSuite";
  suite: CreateSuite_createSuite_suite | null;
}

export interface CreateSuite {
  createSuite: CreateSuite_createSuite | null;
}

export interface CreateSuiteVariables {
  data: SuiteInput;
}
