/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: App
// ====================================================

export interface App_appUser {
  __typename: "AppUser";
  color: string;
  id: number;
  name: string | null;
  surname: string | null;
  username: string;
}

export interface App {
  pageTitle: string;
  selectedPage: string;
  appUser: App_appUser | null;
}
