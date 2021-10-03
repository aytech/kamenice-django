/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: User
// ====================================================

export interface User_user {
  __typename: "User";
  color: string;
  id: string;
  name: string | null;
  surname: string | null;
  username: string;
}

export interface User {
  user: User_user | null;
}
