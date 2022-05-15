/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { DiscountSuiteType, ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: SuitesWithReservations
// ====================================================

export interface SuitesWithReservations_guests {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_suites_discountSuiteSet {
  __typename: "DiscountSuite";
  type: DiscountSuiteType;
  value: number;
}

export interface SuitesWithReservations_suites {
  __typename: "Suite";
  discountSuiteSet: SuitesWithReservations_suites_discountSuiteSet[];
  id: string;
  number: number | null;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
  title: string;
}

export interface SuitesWithReservations_reservations_extraSuites {
  __typename: "Suite";
  id: string;
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

export interface SuitesWithReservations_reservations_priceSet_suite {
  __typename: "Suite";
  id: string;
  priceBase: any;
}

export interface SuitesWithReservations_reservations_priceSet {
  __typename: "Price";
  accommodation: any;
  meal: any;
  municipality: any;
  suite: SuitesWithReservations_reservations_priceSet_suite;
  total: any;
}

export interface SuitesWithReservations_reservations_roommateSet_entity {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface SuitesWithReservations_reservations_roommateSet {
  __typename: "Roommate";
  entity: SuitesWithReservations_reservations_roommateSet_entity;
  fromDate: any;
}

export interface SuitesWithReservations_reservations_suite {
  __typename: "Suite";
  id: string;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
}

export interface SuitesWithReservations_reservations {
  __typename: "Reservation";
  expired: any | null;
  extraSuites: SuitesWithReservations_reservations_extraSuites[];
  fromDate: any;
  guest: SuitesWithReservations_reservations_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  payingGuest: SuitesWithReservations_reservations_payingGuest | null;
  priceSet: SuitesWithReservations_reservations_priceSet[];
  purpose: string | null;
  roommateSet: SuitesWithReservations_reservations_roommateSet[];
  suite: SuitesWithReservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface SuitesWithReservations_reservationMeals {
  __typename: "ReservationTypeOption";
  label: string;
  value: string;
}

export interface SuitesWithReservations_reservationTypes {
  __typename: "ReservationTypeOption";
  label: string;
  value: string;
}

export interface SuitesWithReservations {
  guests: (SuitesWithReservations_guests | null)[] | null;
  suites: (SuitesWithReservations_suites | null)[] | null;
  reservations: (SuitesWithReservations_reservations | null)[] | null;
  reservationMeals: (SuitesWithReservations_reservationMeals | null)[] | null;
  reservationTypes: (SuitesWithReservations_reservationTypes | null)[] | null;
}

export interface SuitesWithReservationsVariables {
  startDate: string;
  endDate: string;
}
