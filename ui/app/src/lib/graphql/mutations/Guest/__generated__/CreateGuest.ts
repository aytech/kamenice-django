/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestInput, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGuest
// ====================================================

export interface CreateGuest_createGuest_guest {
  __typename: "Guest";
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  citizenship: string | null;
  email: string;
  gender: GuestGender | null;
  identity: string;
  id: string;
  name: string;
  phoneNumber: string;
  surname: string;
  visaNumber: string | null;
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
