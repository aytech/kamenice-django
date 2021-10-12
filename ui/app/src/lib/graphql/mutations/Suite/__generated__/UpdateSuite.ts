/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SuiteInput, DiscountType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateSuite
// ====================================================

export interface UpdateSuite_updateSuite_suite_discountSet {
  __typename: "Discount";
  type: DiscountType;
  value: number;
}

export interface UpdateSuite_updateSuite_suite {
  __typename: "Suite";
  discountSet: UpdateSuite_updateSuite_suite_discountSet[];
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
