/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Guests
// ====================================================

export interface Guests_guests {
  __typename: "Guest";
  age: GuestAge | null;
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  citizenship: string | null;
  email: string;
  gender: GuestGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface Guests {
  guests: (Guests_guests | null)[] | null;
}
