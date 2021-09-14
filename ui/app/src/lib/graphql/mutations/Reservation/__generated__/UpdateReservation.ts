/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput, ReservationMeal, ReservationType } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateReservation
// ====================================================

export interface UpdateReservation_updateReservation_reservation_guest {
  __typename: "Guest";
  id: string;
  name: string;
  surname: string;
}

export interface UpdateReservation_updateReservation_reservation_suite {
  __typename: "Suite";
  id: string;
  number: number | null;
  title: string;
}

export interface UpdateReservation_updateReservation_reservation {
  __typename: "Reservation";
  fromDate: any;
  id: string;
  guest: UpdateReservation_updateReservation_reservation_guest;
  meal: ReservationMeal;
  notes: string | null;
  priceAccommodation: any;
  priceExtra: any;
  priceMeal: any;
  priceMunicipality: any;
  priceTotal: any;
  purpose: string | null;
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
