/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Guest
// ====================================================

export interface Guest_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Guest {
  guest: Guest_guest | null;
}

export interface GuestVariables {
  id: number;
}
