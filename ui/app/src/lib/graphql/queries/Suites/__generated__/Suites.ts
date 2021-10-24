/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountSuiteType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Suites
// ====================================================

export interface Suites_suites_discountSuiteSet {
  __typename: "DiscountSuite";
  type: DiscountSuiteType;
  value: number;
}

export interface Suites_suites {
  __typename: "Suite";
  discountSuiteSet: Suites_suites_discountSuiteSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
  title: string;
}

export interface Suites_discountSuiteTypes {
  __typename: "DiscountSuiteOption";
  name: string;
  value: string;
}

export interface Suites {
  suites: (Suites_suites | null)[] | null;
  discountSuiteTypes: (Suites_discountSuiteTypes | null)[] | null;
}
