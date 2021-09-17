/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ReservationRoommateInput, RoommateAge, RoommateGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: CreateReservationRoommate
// ====================================================

export interface CreateReservationRoommate_createReservationRoommate_roommate {
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

export interface CreateReservationRoommate_createReservationRoommate {
  __typename: "CreateReservationRoommate";
  roommate: CreateReservationRoommate_createReservationRoommate_roommate | null;
}

export interface CreateReservationRoommate {
  createReservationRoommate: CreateReservationRoommate_createReservationRoommate | null;
}

export interface CreateReservationRoommateVariables {
  data: ReservationRoommateInput;
}
