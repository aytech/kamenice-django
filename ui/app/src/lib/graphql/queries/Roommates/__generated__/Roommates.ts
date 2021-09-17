/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoommateAge, RoommateGender } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Roommates
// ====================================================

export interface Roommates_roommates {
  __typename: "Roommate";
  age: RoommateAge | null;
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  citizenship: string | null;
  email: string | null;
  gender: RoommateGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface Roommates {
  roommates: (Roommates_roommates | null)[] | null;
}

export interface RoommatesVariables {
  guestId: string;
}
