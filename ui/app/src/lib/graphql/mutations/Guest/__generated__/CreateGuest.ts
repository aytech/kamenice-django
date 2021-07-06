/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGuest
// ====================================================

export interface CreateGuest_createGuest_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface CreateGuest_createGuest {
  __typename: "CreateGuest";
  guest: CreateGuest_createGuest_guest | null;
}

export interface CreateGuest {
  createGuest: CreateGuest_createGuest | null;
}

export interface CreateGuestVariables {
  data: GuestInput;
}
