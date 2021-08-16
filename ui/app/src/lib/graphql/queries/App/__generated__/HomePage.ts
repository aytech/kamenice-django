/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: HomePage
// ====================================================

export interface HomePage_guests {
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
