/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: GuestsFull
// ====================================================

export interface GuestsFull_guests {
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

export interface GuestsFull {
  guests: (GuestsFull_guests | null)[] | null;
}
