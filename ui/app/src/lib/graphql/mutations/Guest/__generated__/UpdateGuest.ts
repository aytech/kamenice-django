/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestInput, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateGuest
// ====================================================

export interface UpdateGuest_updateGuest_guest {
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

export interface UpdateGuest_updateGuest {
  __typename: "UpdateGuest";
  guest: UpdateGuest_updateGuest_guest | null;
}

export interface UpdateGuest {
  updateGuest: UpdateGuest_updateGuest | null;
}

export interface UpdateGuestVariables {
  data: GuestInput;
}
