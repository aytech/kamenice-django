/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationGuestInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteReservationGuest
// ====================================================

export interface DeleteReservationGuest_deleteReservationGuest_guest {
  __typename: "Guest";
  name: string;
  surname: string;
}

export interface DeleteReservationGuest_deleteReservationGuest {
  __typename: "DeleteReservationGuest";
  guest: DeleteReservationGuest_deleteReservationGuest_guest | null;
}

export interface DeleteReservationGuest {
  deleteReservationGuest: DeleteReservationGuest_deleteReservationGuest | null;
}

export interface DeleteReservationGuestVariables {
  data: ReservationGuestInput;
}
