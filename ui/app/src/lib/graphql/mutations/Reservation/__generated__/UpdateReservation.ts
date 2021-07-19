/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateReservation
// ====================================================

export interface UpdateReservation_updateReservation_reservation {
  __typename: "Reservation";
  id: string;
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
