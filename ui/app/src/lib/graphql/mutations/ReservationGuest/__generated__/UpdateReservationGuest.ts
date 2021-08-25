/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationGuestInput, GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateReservationGuest
// ====================================================

export interface UpdateReservationGuest_updateReservationGuest_guest {
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

export interface UpdateReservationGuest_updateReservationGuest {
  __typename: "UpdateReservationGuest";
  guest: UpdateReservationGuest_updateReservationGuest_guest | null;
}

export interface UpdateReservationGuest {
  updateReservationGuest: UpdateReservationGuest_updateReservationGuest | null;
}

export interface UpdateReservationGuestVariables {
  data: ReservationGuestInput;
}
