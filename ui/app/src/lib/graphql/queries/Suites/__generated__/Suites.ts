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
  title: string;
  number: number | null;
}

export interface Suites {
  suites: (Suites_suites | null)[] | null;
}
