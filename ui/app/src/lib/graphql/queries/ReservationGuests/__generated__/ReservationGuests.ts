/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GuestAge, GuestGender, RoommateAge, RoommateGender } from "./../../../globalTypes";

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
  email: string;
  gender: GuestGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface ReservationGuests_reservationGuests_roommates {
  __typename: "Roommate";
  age: RoommateAge | null;
  gender: RoommateGender | null;
  identity: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface ReservationGuests_reservationGuests {
  __typename: "ReservationGuests";
  guest: ReservationGuests_reservationGuests_guest | null;
  roommates: (ReservationGuests_reservationGuests_roommates | null)[] | null;
}

export interface ReservationGuests {
  reservationGuests: ReservationGuests_reservationGuests | null;
}

export interface ReservationGuestsVariables {
  reservationHash: string;
}
