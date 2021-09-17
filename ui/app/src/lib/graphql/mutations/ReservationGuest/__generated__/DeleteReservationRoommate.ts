/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationRoommateInput } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: DeleteReservationRoommate
// ====================================================

export interface DeleteReservationRoommate_deleteReservationRoommate_roommate {
  __typename: "Roommate";
  id: string;
  name: string;
  surname: string;
}

export interface DeleteReservationRoommate_deleteReservationRoommate {
  __typename: "DeleteReservationRoommate";
  roommate: DeleteReservationRoommate_deleteReservationRoommate_roommate | null;
}

export interface DeleteReservationRoommate {
  deleteReservationRoommate: DeleteReservationRoommate_deleteReservationRoommate | null;
}

export interface DeleteReservationRoommateVariables {
  data: ReservationRoommateInput;
}
