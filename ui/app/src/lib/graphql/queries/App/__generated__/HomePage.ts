/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: HomePage
// ====================================================

export interface HomePage_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface HomePage_whoami {
  __typename: "UserType";
  /**
   * Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.
   */
  username: string;
}

export interface HomePage {
  guests: (HomePage_guests | null)[] | null;
  whoami: HomePage_whoami | null;
}
