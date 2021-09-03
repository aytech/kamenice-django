/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Suites
// ====================================================

export interface Suites_suites {
  __typename: "Suite";
  id: string;
  number: number | null;
  priceBase: any;
  priceChild: any;
  priceExtra: any;
  priceInfant: any;
  title: string;
}

export interface Suites {
  suites: (Suites_suites | null)[] | null;
}
