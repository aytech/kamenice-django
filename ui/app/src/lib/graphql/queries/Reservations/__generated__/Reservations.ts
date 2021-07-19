/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Reservations
// ====================================================

export interface Reservations_reservations_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations_roommates {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations_suite {
  __typename: "Suite";
  id: string;
  title: string;
  number: number | null;
}

export interface Reservations_reservations {
  __typename: "Reservation";
  fromDate: any;
  guest: Reservations_reservations_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  purpose: string | null;
  roommates: Reservations_reservations_roommates[];
  suite: Reservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface Reservations {
  reservations: (Reservations_reservations | null)[] | null;
}
