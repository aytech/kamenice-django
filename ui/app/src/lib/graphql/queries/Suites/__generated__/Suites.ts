/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Suites
// ====================================================

export interface Suites_suites_discountSet {
  __typename: "Discount";
  type: DiscountType;
  value: number;
}

export interface Suites_suites {
  __typename: "Suite";
  discountSet: Suites_suites_discountSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
  title: string;
}

export interface Suites_discountTypes {
  __typename: "DiscountOption";
  name: string;
  value: string;
}

export interface Suites {
  suites: (Suites_suites | null)[] | null;
  discountTypes: (Suites_discountTypes | null)[] | null;
}
