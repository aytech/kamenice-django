/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestAge, GuestGender, ReservationMeal, ReservationType } from "./../../../globalTypes";

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

export interface HomePage_reservations_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface HomePage_reservations_roommates {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface HomePage_reservations_suite {
  __typename: "Suite";
  id: string;
}

export interface HomePage_reservations {
  __typename: "Reservation";
  fromDate: any;
  id: string;
  guest: HomePage_reservations_guest;
  meal: ReservationMeal;
  notes: string | null;
  purpose: string | null;
  roommates: HomePage_reservations_roommates[];
  suite: HomePage_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface HomePage_suites {
  __typename: "Suite";
  id: string;
  number: number | null;
  title: string;
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
  reservations: (HomePage_reservations | null)[] | null;
  suites: (HomePage_suites | null)[] | null;
  whoami: HomePage_whoami | null;
}
