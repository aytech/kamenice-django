/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteReservation
// ====================================================

export interface DeleteReservation_deleteReservation_reservation {
  __typename: "Reservation";
  id: string;
}

export interface DeleteReservation_deleteReservation {
  __typename: "DeleteReservation";
  reservation: DeleteReservation_deleteReservation_reservation | null;
}

export interface DeleteReservation {
  deleteReservation: DeleteReservation_deleteReservation | null;
}

export interface DeleteReservationVariables {
  reservationId: string;
}
