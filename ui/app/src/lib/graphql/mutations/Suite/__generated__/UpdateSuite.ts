/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SuiteInput, DiscountSuiteType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSuite
// ====================================================

export interface UpdateSuite_updateSuite_suite_discountSuiteSet {
  __typename: "DiscountSuite";
  type: DiscountSuiteType;
  value: number;
}

export interface UpdateSuite_updateSuite_suite {
  __typename: "Suite";
  discountSuiteSet: UpdateSuite_updateSuite_suite_discountSuiteSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
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
