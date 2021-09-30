/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationGuestInput, GuestAge, GuestGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservationGuest
// ====================================================

export interface CreateReservationGuest_createReservationGuest_guest {
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

export interface CreateReservationGuest_createReservationGuest {
  __typename: "CreateReservationGuest";
  guest: CreateReservationGuest_createReservationGuest_guest | null;
}

export interface CreateReservationGuest {
  createReservationGuest: CreateReservationGuest_createReservationGuest | null;
}

export interface CreateReservationGuestVariables {
  data: ReservationGuestInput;
}
