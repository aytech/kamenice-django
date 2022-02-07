/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput, ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateReservation
// ====================================================

export interface UpdateReservation_updateReservation_reservation_extraSuites {
  __typename: "Suite";
  id: string;
}

export interface UpdateReservation_updateReservation_reservation_guest {
  __typename: "Guest";
  email: string | null;
  id: string;
  name: string;
  surname: string;
}

export interface UpdateReservation_updateReservation_reservation_payingGuest {
  __typename: "Guest";
  id: string;
}

export interface UpdateReservation_updateReservation_reservation_priceSet_suite {
  __typename: "Suite";
  id: string;
  priceBase: any;
}

export interface UpdateReservation_updateReservation_reservation_priceSet {
  __typename: "Price";
  accommodation: any;
  meal: any;
  municipality: any;
  suite: UpdateReservation_updateReservation_reservation_priceSet_suite;
  total: any;
}

export interface UpdateReservation_updateReservation_reservation_roommateSet_entity {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface UpdateReservation_updateReservation_reservation_roommateSet {
  __typename: "Roommate";
  entity: UpdateReservation_updateReservation_reservation_roommateSet_entity;
  fromDate: any;
}

export interface UpdateReservation_updateReservation_reservation_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  title: string;
}

export interface UpdateReservation_updateReservation_reservation {
  __typename: "Reservation";
  expired: any | null;
  extraSuites: UpdateReservation_updateReservation_reservation_extraSuites[];
  fromDate: any;
  guest: UpdateReservation_updateReservation_reservation_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  payingGuest: UpdateReservation_updateReservation_reservation_payingGuest | null;
  priceSet: UpdateReservation_updateReservation_reservation_priceSet[];
  purpose: string | null;
  roommateSet: UpdateReservation_updateReservation_reservation_roommateSet[];
  suite: UpdateReservation_updateReservation_reservation_suite;
  toDate: any;
  type: ReservationType;
}

export interface UpdateReservation_updateReservation {
  __typename: "UpdateReservation";
  reservation: UpdateReservation_updateReservation_reservation | null;
}

export interface UpdateReservation {
  updateReservation: UpdateReservation_updateReservation | null;
}

export interface UpdateReservationVariables {
  data: ReservationInput;
}
