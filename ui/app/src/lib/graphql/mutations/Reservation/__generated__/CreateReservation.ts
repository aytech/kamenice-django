/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservation
// ====================================================

export interface CreateReservation_createReservation_reservation {
  __typename: "Reservation";
  id: string;
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
