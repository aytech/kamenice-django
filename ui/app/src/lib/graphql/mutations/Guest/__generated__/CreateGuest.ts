/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestInput, GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateGuest
// ====================================================

export interface CreateGuest_createGuest_guest {
  __typename: "Guest";
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  age: GuestAge | null;
  citizenship: string | null;
  email: string | null;
  gender: GuestGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
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
