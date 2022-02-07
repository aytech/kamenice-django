/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput, ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservation
// ====================================================

export interface CreateReservation_createReservation_reservation_extraSuites {
  __typename: "Suite";
  id: string;
}

export interface CreateReservation_createReservation_reservation_guest {
  __typename: "Guest";
  email: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface CreateReservation_createReservation_reservation_payingGuest {
  __typename: "Guest";
  id: string;
}

export interface CreateReservation_createReservation_reservation_priceSet_suite {
  __typename: "Suite";
  id: string;
  priceBase: any;
}

export interface CreateReservation_createReservation_reservation_priceSet {
  __typename: "Price";
  accommodation: any;
  meal: any;
  municipality: any;
  suite: CreateReservation_createReservation_reservation_priceSet_suite;
  total: any;
}

export interface CreateReservation_createReservation_reservation_roommateSet_entity {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface CreateReservation_createReservation_reservation_roommateSet {
  __typename: "Roommate";
  entity: CreateReservation_createReservation_reservation_roommateSet_entity;
  fromDate: any;
}

export interface CreateReservation_createReservation_reservation_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  title: string;
}

export interface CreateReservation_createReservation_reservation {
  __typename: "Reservation";
  expired: any | null;
  extraSuites: CreateReservation_createReservation_reservation_extraSuites[];
  fromDate: any;
  guest: CreateReservation_createReservation_reservation_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  payingGuest: CreateReservation_createReservation_reservation_payingGuest | null;
  priceSet: CreateReservation_createReservation_reservation_priceSet[];
  purpose: string | null;
  roommateSet: CreateReservation_createReservation_reservation_roommateSet[];
  suite: CreateReservation_createReservation_reservation_suite;
  toDate: any;
  type: ReservationType;
}

export interface CreateReservation_createReservation {
  __typename: "CreateReservation";
  reservation: CreateReservation_createReservation_reservation | null;
}

export interface CreateReservation {
  createReservation: CreateReservation_createReservation | null;
}

export interface CreateReservationVariables {
  data: ReservationInput;
}
