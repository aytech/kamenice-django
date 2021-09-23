/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationMeal, ReservationType } from "./../../../globalTypes";

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
  email: string;
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
  expired: any | null;
  fromDate: any;
  guest: SuitesWithReservations_reservations_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  priceAccommodation: any;
  priceExtra: any;
  priceMeal: any;
  priceMunicipality: any;
  priceTotal: any;
  purpose: string | null;
  suite: SuitesWithReservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface SuitesWithReservations {
  guests: (SuitesWithReservations_guests | null)[] | null;
  suites: (SuitesWithReservations_suites | null)[] | null;
  reservations: (SuitesWithReservations_reservations | null)[] | null;
}
