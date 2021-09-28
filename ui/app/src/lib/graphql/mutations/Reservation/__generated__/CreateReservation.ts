/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput, ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservation
// ====================================================

export interface CreateReservation_createReservation_reservation_guest {
  __typename: "Guest";
  email: string | null;
  id: string;
  name: string;
  surname: string;
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
  fromDate: any;
  guest: CreateReservation_createReservation_reservation_guest;
  id: string;
  meal: ReservationMeal;
  notes: string | null;
  priceAccommodation: any;
  priceExtra: any;
  priceMeal: any;
  priceMunicipality: any;
  priceTotal: any;
  purpose: string | null;
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
