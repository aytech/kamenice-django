/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL query operation: Reservations
// ====================================================

export interface Reservations_reservations_extraSuites {
  __typename: "Suite";
  id: string;
}

export interface Reservations_reservations_guest {
  __typename: "Guest";
  email: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations_payingGuest {
  __typename: "Guest";
  id: string;
}

export interface Reservations_reservations_priceSet_suite {
  __typename: "Suite";
  id: string;
  priceBase: any;
}

export interface Reservations_reservations_priceSet {
  __typename: "Price";
  accommodation: any;
  meal: any;
  municipality: any;
  suite: Reservations_reservations_priceSet_suite;
  total: any;
}

export interface Reservations_reservations_roommateSet_entity {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface Reservations_reservations_roommateSet {
  __typename: "Roommate";
  entity: Reservations_reservations_roommateSet_entity;
  fromDate: any;
}

export interface Reservations_reservations_suite {
  __typename: "Suite";
  id: string;
  numberBeds: number;
  numberBedsExtra: number;
  priceBase: any;
}

export interface Reservations_reservations {
  __typename: "Reservation";
  expired: any | null;
  extraSuites: Reservations_reservations_extraSuites[];
  fromDate: any;
  guest: Reservations_reservations_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  payingGuest: Reservations_reservations_payingGuest | null;
  priceSet: Reservations_reservations_priceSet[];
  purpose: string | null;
  roommateSet: Reservations_reservations_roommateSet[];
  suite: Reservations_reservations_suite;
  toDate: any;
  type: ReservationType;
}

export interface Reservations {
  reservations: (Reservations_reservations | null)[] | null;
}

export interface ReservationsVariables {
  startDate: string;
  endDate: string;
}
