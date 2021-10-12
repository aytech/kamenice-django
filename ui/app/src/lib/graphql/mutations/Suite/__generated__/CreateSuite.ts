/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SuiteInput, DiscountType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateSuite
// ====================================================

export interface CreateSuite_createSuite_suite_discountSet {
  __typename: "Discount";
  type: DiscountType;
  value: number;
}

export interface CreateSuite_createSuite_suite {
  __typename: "Suite";
  discountSet: CreateSuite_createSuite_suite_discountSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
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
