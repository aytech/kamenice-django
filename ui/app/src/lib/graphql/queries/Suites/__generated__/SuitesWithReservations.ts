/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountType, ReservationMeal, GuestAge, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: SuitesWithReservations
// ====================================================

export interface SuitesWithReservations_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_suites_discountSet {
  __typename: "Discount";
  type: DiscountType;
  value: number;
}

export interface SuitesWithReservations_suites {
  __typename: "Suite";
  discountSet: SuitesWithReservations_suites_discountSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
  title: string;
}

export interface SuitesWithReservations_reservations_guest {
  __typename: "Guest";
  email: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_reservations_payingGuest {
  __typename: "Guest";
  id: string;
}

export interface SuitesWithReservations_reservations_roommates {
  __typename: "Guest";
  age: GuestAge | null;
  id: string;
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
  payingGuest: SuitesWithReservations_reservations_payingGuest | null;
  priceAccommodation: any;
  priceExtra: any;
  priceMeal: any;
  priceMunicipality: any;
  priceTotal: any;
  purpose: string | null;
  roommates: SuitesWithReservations_reservations_roommates[];
  suite: SuitesWithReservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface SuitesWithReservations_timelineGroups {
  __typename: "TimelimeGroup";
  number: string;
  title: string;
}

export interface SuitesWithReservations {
  guests: (SuitesWithReservations_guests | null)[] | null;
  suites: (SuitesWithReservations_suites | null)[] | null;
  reservations: (SuitesWithReservations_reservations | null)[] | null;
  timelineGroups: SuitesWithReservations_timelineGroups | null;
}
