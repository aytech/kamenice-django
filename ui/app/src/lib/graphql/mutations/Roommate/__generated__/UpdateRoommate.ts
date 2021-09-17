/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RoommateInput, RoommateAge, RoommateGender } from "./../../../globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateRoommate
// ====================================================

export interface UpdateRoommate_updateRoommate_roommate {
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

export interface UpdateRoommate_updateRoommate {
  __typename: "UpdateRoommate";
  roommate: UpdateRoommate_updateRoommate_roommate | null;
}

export interface UpdateRoommate {
  updateRoommate: UpdateRoommate_updateRoommate | null;
}

export interface UpdateRoommateVariables {
  data: RoommateInput;
}
