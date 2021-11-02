/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: ReservationGuests
// ====================================================

export interface ReservationGuests_reservationGuests_guest {
  __typename: "Guest";
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  age: GuestAge | null;
  citizenship: string | null;
  color: string | null;
  email: string | null;
  gender: GuestGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface ReservationGuests_reservationGuests_roommates {
  __typename: "Guest";
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  age: GuestAge | null;
  citizenship: string | null;
  color: string | null;
  email: string | null;
  gender: GuestGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface ReservationGuests_reservationGuests_suite {
  __typename: "Suite";
  numberBeds: number;
}

export interface ReservationGuests_reservationGuests {
  __typename: "ReservationGuests";
  guest: ReservationGuests_reservationGuests_guest | null;
  roommates: (ReservationGuests_reservationGuests_roommates | null)[] | null;
  suite: ReservationGuests_reservationGuests_suite | null;
}

export interface ReservationGuests_selectedGuest {
  __typename: "SelectedGuest";
  addressMunicipality: string | null;
  addressPsc: string | null;
  addressStreet: string | null;
  age: string | null;
  citizenship: string | null;
  color: string | null;
  email: string | null;
  gender: string | null;
  identity: string | null;
  id: number | null;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface ReservationGuests_selectedSuite {
  __typename: "SelectedSuite";
  numberBeds: number;
}

export interface ReservationGuests {
  reservationGuests: ReservationGuests_reservationGuests | null;
  selectedGuest: ReservationGuests_selectedGuest | null;
  selectedSuite: ReservationGuests_selectedSuite | null;
}

export interface ReservationGuestsVariables {
  reservationHash: string;
}
