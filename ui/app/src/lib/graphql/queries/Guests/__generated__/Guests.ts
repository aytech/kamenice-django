/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Guests
// ====================================================

export interface Guests_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Guests {
  guests: (Guests_guests | null)[] | null;
}
