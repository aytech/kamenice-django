/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationRoommateInput, RoommateAge, RoommateGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateReservationRoommate
// ====================================================

export interface UpdateReservationRoommate_updateReservationRoommate_roommate {
  __typename: "Roommate";
  addressMunicipality: string | null;
  addressPsc: number | null;
  addressStreet: string | null;
  age: RoommateAge | null;
  citizenship: string | null;
  email: string | null;
  gender: RoommateGender | null;
  identity: string | null;
  id: string;
  name: string;
  phoneNumber: string | null;
  surname: string;
  visaNumber: string | null;
}

export interface UpdateReservationRoommate_updateReservationRoommate {
  __typename: "UpdateReservationRoommate";
  roommate: UpdateReservationRoommate_updateReservationRoommate_roommate | null;
}

export interface UpdateReservationRoommate {
  updateReservationRoommate: UpdateReservationRoommate_updateReservationRoommate | null;
}

export interface UpdateReservationRoommateVariables {
  data: ReservationRoommateInput;
}
