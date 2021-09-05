/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationMeal, GuestAge, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: SuitesWithReservations
// ====================================================

export interface SuitesWithReservations_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_suites {
  __typename: "Suite";
  id: string;
  number: number | null;
  numberBeds: number;
  priceBase: any;
  priceChild: any;
  priceExtra: any;
  priceInfant: any;
  title: string;
}

export interface SuitesWithReservations_reservations_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_reservations_roommates {
  __typename: "Guest";
  age: GuestAge | null;
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_reservations_suite {
  __typename: "Suite";
  id: string;
}

export interface SuitesWithReservations_reservations {
  __typename: "Reservation";
  fromDate: any;
  id: string;
  guest: SuitesWithReservations_reservations_guest;
  meal: ReservationMeal;
  notes: string | null;
  purpose: string | null;
  roommates: SuitesWithReservations_reservations_roommates[];
  suite: SuitesWithReservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface SuitesWithReservations {
  guests: (SuitesWithReservations_guests | null)[] | null;
  suites: (SuitesWithReservations_suites | null)[] | null;
  reservations: (SuitesWithReservations_reservations | null)[] | null;
}
