/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGuestBasic
// ====================================================

export interface CreateGuestBasic_createGuest_guest {
  __typename: "Guest";
  email: string;
  name: string;
  surname: string;
}

export interface CreateGuestBasic_createGuest {
  __typename: "CreateGuest";
  guest: CreateGuestBasic_createGuest_guest | null;
}

export interface CreateGuestBasic {
  createGuest: CreateGuestBasic_createGuest | null;
}

export interface CreateGuestBasicVariables {
  data: GuestInput;
}
